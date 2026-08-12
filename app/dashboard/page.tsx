'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import { SUPPORTED_TOKENS, getTokenAddress } from '@/lib/contractConfig';
import WalletModal from '@/components/wallet/WalletModal';
import { Zap, X } from 'lucide-react';

interface Order {
  id: number;
  type: 'Buy' | 'Sell';
  tokenIn: string;
  tokenOut: string;
  tokenInSymbol: string;
  tokenOutSymbol: string;
  amount: number;
  startPrice: number;
  currentPrice: number;
  slope: number;
  minPrice: number;
  maxPrice: number;
  expiry: number;
  createdAt: number;
  active: boolean;
  maker: string;
  onChain: boolean;
}

export default function DashboardPage() {
  const { isConnected, setWalletModalOpen, fullAddress, chainId, network } = useWallet();
  const { contractAddress, writeContract, readContract, readERC20, approveERC20, isReady } = useContract();

  // ── Form State ────────────────────────────────────────────────────
  const [orderType, setOrderType] = useState<'Buy' | 'Sell'>('Buy');
  const nextIdRef = useRef(3000);
  const [tokenIn, setTokenIn] = useState('WETH');
  const [tokenOut, setTokenOut] = useState('USDC');
  const [amount, setAmount] = useState<number>(1);
  const [startPrice, setStartPrice] = useState<number>(3000);
  const [slope, setSlope] = useState<number>(-0.2);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [expiry, setExpiry] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // ── Orders State ──────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const activeOrders = useMemo(() => orders.filter((o) => o.active), [orders]);

  const [settledHistory, setSettledHistory] = useState<Array<{ id: number; pair: string; amount: string; price: string; age: string; txHash: string }>>([]);

  // ── Stats ─────────────────────────────────────────────────────────
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // ── Available tokens for current chain ────────────────────────────
  const availableTokens = useMemo(() => {
    if (!chainId) return SUPPORTED_TOKENS;
    return SUPPORTED_TOKENS.filter((t) => t.addresses[chainId]);
  }, [chainId]);

  // ── Fetch on-chain data ───────────────────────────────────────────
  const { fetchEvents } = useContract();

  useEffect(() => {
    if (!isReady) return;

    const fetchData = async () => {
      const [totalResult, pausedResult, matchedLogs] = await Promise.all([
        readContract('totalOrders'),
        readContract('paused'),
        fetchEvents('OrderMatched'),
      ]);
      if (totalResult.data !== null) setTotalOrders(Number(totalResult.data));
      if (pausedResult.data !== null) setIsPaused(Boolean(pausedResult.data));
      if (matchedLogs.data && Array.isArray(matchedLogs.data)) {
        const parsed = matchedLogs.data.map((log: unknown) => {
          const l = log as { args?: { buyOrderId?: bigint; executedQuantity?: bigint; settlementPrice?: bigint }; transactionHash?: string };
          return {
            id: Number(l.args?.buyOrderId || 0),
            pair: 'On-Chain Match',
            amount: (Number(l.args?.executedQuantity || 0) / 1e18).toFixed(2),
            price: `$${(Number(l.args?.settlementPrice || 0) / 1e18).toFixed(2)}`,
            age: 'Settled',
            txHash: l.transactionHash || '',
          };
        });
        setSettledHistory(parsed.reverse());
      }
    };

    fetchData();
  }, [isReady, readContract, fetchEvents]);

  // ── Dynamic price calculation loop for deployed orders ────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((ord) => {
          if (!ord.active) return ord;
          const deltaT = (Date.now() - ord.createdAt) / 1000;
          let calculated = ord.startPrice + ord.slope * deltaT;
          // Clamp to min/max bounds
          if (ord.minPrice > 0) calculated = Math.max(ord.minPrice, calculated);
          if (ord.maxPrice > 0) calculated = Math.min(ord.maxPrice, calculated);
          const currentPrice = Math.max(0.01, Number(calculated.toFixed(2)));
          return { ...ord, currentPrice };
        })
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // ── Create Order Handler ──────────────────────────────────────────
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTxStatus(null);

    // Try on-chain if contract is configured
    if (isReady && chainId) {
      const tokenInAddr = getTokenAddress(tokenIn, chainId);
      const tokenOutAddr = getTokenAddress(tokenOut, chainId);

      if (tokenInAddr && tokenOutAddr) {
        try {
          // Get token decimals
          const tokenMeta = SUPPORTED_TOKENS.find((t) => t.symbol === tokenIn);
          const decimals = tokenMeta?.decimals || 18;
          const amountWei = BigInt(Math.floor(amount * 10 ** decimals)).toString();

          // Price in RAY (1e27)
          const priceRay = BigInt(Math.floor(startPrice * 1e18)).toString() + '000000000';
          const slopeRay = (slope >= 0 ? '' : '-') + BigInt(Math.floor(Math.abs(slope) * 1e18)).toString() + '000000000';
          const minPriceRay = minPrice > 0 ? BigInt(Math.floor(minPrice * 1e18)).toString() + '000000000' : '0';
          const maxPriceRay = maxPrice > 0 ? BigInt(Math.floor(maxPrice * 1e18)).toString() + '000000000' : '0';
          const expiryTs = expiry ? Math.floor(new Date(expiry).getTime() / 1000).toString() : '0';

          // Check and request ERC-20 approval
          setTxStatus('Checking token approval...');
          const allowanceResult = await readERC20(tokenInAddr, 'allowance', [fullAddress, contractAddress]);
          const currentAllowance = allowanceResult.data ? BigInt(allowanceResult.data as string) : BigInt(0);

          if (currentAllowance < BigInt(amountWei)) {
            setTxStatus('Requesting token approval...');
            const maxApproval = '0x' + 'f'.repeat(64);
            const approveResult = await approveERC20(tokenInAddr, contractAddress!, maxApproval);
            if (approveResult.error) {
              setTxStatus(`Approval failed: ${approveResult.error}`);
              setIsSubmitting(false);
              return;
            }
            setTxStatus('Approval submitted. Waiting for confirmation...');
            // Brief wait for approval confirmation
            await new Promise((r) => setTimeout(r, 3000));
          }

          setTxStatus('Submitting order transaction...');
          const { txHash, error } = await writeContract('createOrder', [
            tokenInAddr,
            tokenOutAddr,
            amountWei,
            priceRay,
            slopeRay,
            minPriceRay,
            maxPriceRay,
            expiryTs,
            orderType === 'Buy',
          ]);

          if (error) {
            setTxStatus(`Transaction failed: ${error}`);
            setIsSubmitting(false);
            return;
          }

          setTxStatus(`Order submitted! Tx: ${txHash?.slice(0, 10)}...`);

          // Add to local state
          const newOrder: Order = {
            id: nextIdRef.current++,
            type: orderType,
            tokenIn: tokenInAddr,
            tokenOut: tokenOutAddr,
            tokenInSymbol: tokenIn,
            tokenOutSymbol: tokenOut,
            amount,
            startPrice,
            currentPrice: startPrice,
            slope,
            minPrice,
            maxPrice,
            expiry: expiry ? Math.floor(new Date(expiry).getTime() / 1000) : 0,
            createdAt: Date.now(),
            active: true,
            maker: fullAddress || '',
            onChain: true,
          };
          setOrders((prev) => [newOrder, ...prev]);
          setIsSubmitting(false);
          setAmount(1);
          setTimeout(() => setTxStatus(null), 5000);
          return;
        } catch (err) {
          console.error('On-chain order creation failed:', err);
          setTxStatus(`On-chain transaction failed: ${(err as Error).message}`);
          setIsSubmitting(false);
          return;
        }
      }
    }

    setTxStatus('Smart contract address or provider not connected on this chain. Please connect wallet to active EVM network.');
    setIsSubmitting(false);
  };

  // ── Cancel Order Handler ──────────────────────────────────────────
  const handleCancelOrder = useCallback(
    async (orderId: number) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      if (order.onChain && isReady) {
        const { error } = await writeContract('cancelOrder', [orderId]);
        if (error) {
          setTxStatus(`Cancel failed: ${error}`);
          return;
        }
        setTxStatus(`Order #${orderId} cancelled on-chain`);
      }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, active: false } : o)));
      setTimeout(() => setTxStatus(null), 3000);
    },
    [orders, isReady, writeContract]
  );

  // ── Simulate Sweep Handler ────────────────────────────────────────
  const handleSimulateSweep = (orderId: number) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) return { ...ord, active: false };
        return ord;
      })
    );

    const matched = orders.find((o) => o.id === orderId);
    if (matched) {
      setSettledHistory((prev) => [
        {
          id: matched.id,
          pair: `${matched.tokenInSymbol}/${matched.tokenOutSymbol}`,
          amount: matched.amount.toString(),
          price: `$${matched.currentPrice.toLocaleString()}`,
          age: 'Just now',
          txHash: '',
        },
        ...prev,
      ]);
    }
  };

  // ── Price curve SVG renderer ──────────────────────────────────────
  const renderPriceCurve = (order: Order) => {
    const points: string[] = [];
    const width = 120;
    const height = 40;
    const steps = 20;
    const timeSpanSec = 300; // 5 minutes of curve

    let minP = Infinity,
      maxP = -Infinity;
    const prices: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * timeSpanSec;
      let p = order.startPrice + order.slope * t;
      if (order.minPrice > 0) p = Math.max(order.minPrice, p);
      if (order.maxPrice > 0) p = Math.min(order.maxPrice, p);
      prices.push(p);
      if (p < minP) minP = p;
      if (p > maxP) maxP = p;
    }

    const range = maxP - minP || 1;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = height - ((prices[i] - minP) / range) * (height - 4) - 2;
      points.push(`${x},${y}`);
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10" preserveAspectRatio="none">
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke={order.type === 'Buy' ? '#000' : '#737373'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <main className="w-full min-h-screen bg-white text-black pt-24">
      <WalletModal />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">EVM Order Matcher</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-black mt-1">Exchange Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {/* Contract status badges */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-500 font-semibold">
              <span className={`h-1.5 w-1.5 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-400'}`} />
              {isReady ? 'Contract Connected' : 'Demo Mode'}
            </span>
            {chainId && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-500 font-semibold">
                {network}
              </span>
            )}
            {totalOrders !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-neutral-500 font-semibold">
                {totalOrders} orders
              </span>
            )}
            {isPaused && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 font-bold">
                ⚠ Exchange Paused
              </span>
            )}
          </div>
        </div>

        {/* Transaction status bar */}
        {txStatus && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 text-xs font-semibold text-neutral-700 flex items-center gap-2 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
            {txStatus}
          </div>
        )}

        {!isConnected && (
          <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/50 p-6 text-center flex flex-col items-center gap-3">
            <span className="text-2xl">🔌</span>
            <h2 className="text-base font-bold text-black">Wallet Connection Required</h2>
            <p className="text-xs text-neutral-500 max-w-sm">
              Connect your wallet to start deploying dynamic order curves on-chain.
            </p>
            <button
              onClick={() => setWalletModalOpen(true)}
              className="mt-2 rounded-full bg-black px-6 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
            >
              Connect Wallet
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Create Order Form */}
          <div
            className={`lg:col-span-1 border border-neutral-100 rounded-3xl p-6 bg-white shadow-sm transition-opacity duration-300 ${
              !isConnected ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <h2 className="text-lg font-bold text-black mb-4">Deploy Curve Order</h2>
            <form
              onSubmit={handleCreateOrder}
              className="flex flex-col gap-4 text-xs font-semibold uppercase tracking-wider text-neutral-600"
            >
              {/* Buy/Sell Selector */}
              <div className="flex gap-2 bg-neutral-50 p-1 rounded-full border border-neutral-100">
                <button
                  type="button"
                  onClick={() => setOrderType('Buy')}
                  className={`flex-1 py-2 text-center rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    orderType === 'Buy' ? 'bg-black text-white' : 'text-neutral-500'
                  }`}
                >
                  Buy Order
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('Sell')}
                  className={`flex-1 py-2 text-center rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    orderType === 'Sell' ? 'bg-black text-white' : 'text-neutral-500'
                  }`}
                >
                  Sell Order
                </button>
              </div>

              {/* Tokens In/Out */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="token-in-select" className="text-[9px] text-neutral-400">
                    Token In
                  </label>
                  <select
                    id="token-in-select"
                    value={tokenIn}
                    onChange={(e) => setTokenIn(e.target.value)}
                    className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                  >
                    {availableTokens.map((t) => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.logoEmoji} {t.symbol}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="token-out-select" className="text-[9px] text-neutral-400">
                    Token Out
                  </label>
                  <select
                    id="token-out-select"
                    value={tokenOut}
                    onChange={(e) => setTokenOut(e.target.value)}
                    className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                  >
                    {availableTokens.map((t) => (
                      <option key={t.symbol} value={t.symbol}>
                        {t.logoEmoji} {t.symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1">
                <label htmlFor="amount-input" className="text-[9px] text-neutral-400">
                  Amount
                </label>
                <input
                  id="amount-input"
                  type="number"
                  step="0.000001"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                  placeholder="1.0"
                />
              </div>

              {/* Starting Price */}
              <div className="flex flex-col gap-1">
                <label htmlFor="start-price-input" className="text-[9px] text-neutral-400">
                  Start Price (RAY-scaled internally)
                </label>
                <input
                  id="start-price-input"
                  type="number"
                  step="0.01"
                  required
                  value={startPrice}
                  onChange={(e) => setStartPrice(Number(e.target.value))}
                  className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                  placeholder="3000"
                />
              </div>

              {/* Price Slope */}
              <div className="flex flex-col gap-1">
                <label htmlFor="slope-input" className="text-[9px] text-neutral-400">
                  Slope (per second)
                </label>
                <input
                  id="slope-input"
                  type="number"
                  step="0.001"
                  required
                  value={slope}
                  onChange={(e) => setSlope(Number(e.target.value))}
                  className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                  placeholder="-0.2"
                />
                <span className="text-[9px] text-neutral-400 font-normal normal-case mt-0.5">
                  Negative for Buys (decreasing), positive for Sells (increasing).
                </span>
              </div>

              {/* Min / Max Price */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="min-price-input" className="text-[9px] text-neutral-400">
                    Min Price (0 = none)
                  </label>
                  <input
                    id="min-price-input"
                    type="number"
                    step="0.01"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                    placeholder="0"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="max-price-input" className="text-[9px] text-neutral-400">
                    Max Price (0 = none)
                  </label>
                  <input
                    id="max-price-input"
                    type="number"
                    step="0.01"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Expiry */}
              <div className="flex flex-col gap-1">
                <label htmlFor="expiry-input" className="text-[9px] text-neutral-400">
                  Expiry (optional)
                </label>
                <input
                  id="expiry-input"
                  type="datetime-local"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="border border-neutral-200 bg-white p-2.5 rounded-xl text-black font-normal"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isPaused}
                className="mt-2 w-full rounded-full bg-black py-3 text-center text-xs font-bold text-white uppercase hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Deploying...' : isPaused ? 'Exchange Paused' : 'Deploy Order'}
              </button>
            </form>
          </div>

          {/* Right Column: Active Orders & History */}
          <div className="lg:col-span-2 flex flex-col gap-8 w-full">
            {/* Active Orders Section */}
            <div className="border border-neutral-100 rounded-3xl p-6 bg-white shadow-sm w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-black">Your Dynamic Orders</h2>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  {activeOrders.length} Active
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {activeOrders.length === 0 ? (
                  <p className="text-neutral-400 text-xs py-6 text-center">No active dynamic orders deployed.</p>
                ) : (
                  activeOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-neutral-100 bg-neutral-50/30 rounded-2xl p-4 flex flex-col gap-4"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[9px] font-mono text-neutral-400">#{order.id}</span>
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                order.type === 'Buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {order.type}
                            </span>
                            {order.onChain && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                                On-Chain
                              </span>
                            )}
                            <span className="text-xs font-bold text-neutral-800">
                              {order.amount} {order.tokenInSymbol || order.tokenIn} ➔ {order.tokenOutSymbol || order.tokenOut}
                            </span>
                          </div>
                          <div className="flex flex-col gap-0.5 text-xs text-neutral-500 mt-1">
                            <div className="flex items-center gap-4">
                              <span>
                                Start: <span className="font-semibold text-black">${order.startPrice}</span>
                              </span>
                              <span>
                                Slope:{' '}
                                <span className="font-semibold text-black">
                                  {order.slope > 0 ? `+${order.slope}` : order.slope} /s
                                </span>
                              </span>
                            </div>
                            {(order.minPrice > 0 || order.maxPrice > 0) && (
                              <div className="flex items-center gap-4">
                                {order.minPrice > 0 && <span>Min: ${order.minPrice}</span>}
                                {order.maxPrice > 0 && <span>Max: ${order.maxPrice}</span>}
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 mt-1 font-semibold text-black">
                              Current Price:
                              <span className="text-black font-mono font-bold animate-pulse text-sm">
                                ${order.currentPrice}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={!isConnected}
                            className="rounded-full border border-red-200 bg-white px-4 py-2 text-[10px] font-bold text-red-600 hover:border-red-400 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                          >
                            Cancel <X className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleSimulateSweep(order.id)}
                            disabled={!isConnected}
                            className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-bold text-black hover:border-black transition-colors shrink-0 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                          >
                            Simulate Match <Zap className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* Price curve mini-chart */}
                      <div className="border-t border-neutral-100 pt-3">
                        <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider mb-1 block">
                          Price Curve (5min projection)
                        </span>
                        {renderPriceCurve(order)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Settled History */}
            <div className="border border-neutral-100 rounded-3xl p-6 bg-white shadow-sm w-full">
              <h2 className="text-lg font-bold text-black mb-4">Settled Matches Log</h2>
              <div className="flex flex-col gap-3 font-mono text-[11px] text-neutral-500">
                {settledHistory.length === 0 ? (
                  <p className="text-neutral-400 text-xs py-4 text-center font-sans">No settled matches recorded on-chain yet.</p>
                ) : (
                  settledHistory.map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="flex justify-between items-center border-b border-neutral-100 pb-2.5 last:border-none last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[9px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 uppercase font-semibold">
                          Matched
                        </span>
                        <span className="text-black font-bold font-sans">{item.pair}</span>
                        <span>Qty: {item.amount}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-black font-bold">{item.price}</span>
                        <span className="text-neutral-400 text-[10px]">{item.age}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
