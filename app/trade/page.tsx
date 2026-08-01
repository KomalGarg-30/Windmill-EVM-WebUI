'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useContract } from '@/hooks/useContract';
import { SUPPORTED_TOKENS, getTokenAddress, getExplorerTxUrl } from '@/lib/contractConfig';
import WalletModal from '@/components/wallet/WalletModal';
import { 
  Zap, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  History, 
  Activity, 
  Layers,
  ArrowRight,
  Info,
  DollarSign,
  AlertTriangle,
  Play,
  RotateCw,
  Coins
} from 'lucide-react';

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

export default function TradePage() {
  const { isConnected, setWalletModalOpen, fullAddress, chainId, network } = useWallet();
  const { contractAddress, writeContract, readContract, readERC20, approveERC20, isReady } = useContract();

  // ── Selected Pair ─────────────────────────────────────────────────
  const [selectedPair, setSelectedPair] = useState<'WETH/USDC' | 'WBTC/USDC'>('WETH/USDC');
  const baseAsset = selectedPair.split('/')[0];
  const quoteAsset = selectedPair.split('/')[1];

  // ── Form State ────────────────────────────────────────────────────
  const [orderType, setOrderType] = useState<'Buy' | 'Sell'>('Buy');
  const [amount, setAmount] = useState<number>(1);
  const [priceType, setPriceType] = useState<'limit' | 'dynamic'>('limit');
  const [startPrice, setStartPrice] = useState<number>(3150);
  const [slope, setSlope] = useState<number>(-0.5);
  const [hasStopLoss, setHasStopLoss] = useState(false);
  const [stopLoss, setStopLoss] = useState<number>(3000);
  const [hasTakeProfit, setHasTakeProfit] = useState(false);
  const [takeProfit, setTakeProfit] = useState<number>(3300);
  const [expiry, setExpiry] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txStatus, setTxStatus] = useState<string | null>(null);

  // ── Chart References ──────────────────────────────────────────────
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);

  // ── Mock Orderbook & Live Trades ──────────────────────────────────
  const [bids, setBids] = useState<{ price: number; amount: number; total: number }[]>([]);
  const [asks, setAsks] = useState<{ price: number; amount: number; total: number }[]>([]);
  const [recentTrades, setRecentTrades] = useState<{ price: number; amount: number; time: string; type: 'Buy' | 'Sell' }[]>([]);

  // ── Orders State ──────────────────────────────────────────────────
  const [orders, setOrders] = useState<Order[]>([]);
  const activeOrders = useMemo(() => orders.filter((o) => o.active), [orders]);

  const [settledHistory, setSettledHistory] = useState([
    { id: 214, pair: 'WETH/USDC', amount: '1.20', price: '$3,145.20', age: '2 mins ago', txHash: '' },
    { id: 198, pair: 'WETH/USDC', amount: '0.50', price: '$3,148.50', age: '8 mins ago', txHash: '' },
  ]);

  // Adjust default price when switching pairs
  useEffect(() => {
    if (selectedPair === 'WETH/USDC') {
      setStartPrice(3150);
      setStopLoss(3000);
      setTakeProfit(3300);
    } else {
      setStartPrice(94500);
      setStopLoss(92000);
      setTakeProfit(97000);
    }
  }, [selectedPair]);

  // ── Generate Orderbook Depths ────────────────────────────────────
  useEffect(() => {
    const centerPrice = selectedPair === 'WETH/USDC' ? 3150 : 94500;
    const spread = centerPrice * 0.0008;
    
    // Generate asks (red, higher prices)
    const newAsks = [];
    let askTotal = 0;
    for (let i = 1; i <= 8; i++) {
      const price = centerPrice + spread + (i * spread * 0.5) + (Math.random() - 0.5) * (spread * 0.1);
      const amount = Math.random() * (selectedPair === 'WETH/USDC' ? 5 : 0.1) + 0.1;
      askTotal += amount;
      newAsks.push({ price: Number(price.toFixed(2)), amount, total: askTotal });
    }
    setAsks(newAsks.reverse());

    // Generate bids (green, lower prices)
    const newBids = [];
    let bidTotal = 0;
    for (let i = 1; i <= 8; i++) {
      const price = centerPrice - spread - (i * spread * 0.5) + (Math.random() - 0.5) * (spread * 0.1);
      const amount = Math.random() * (selectedPair === 'WETH/USDC' ? 5 : 0.1) + 0.1;
      bidTotal += amount;
      newBids.push({ price: Number(price.toFixed(2)), amount, total: bidTotal });
    }
    setBids(newBids);

    // Initial trades
    setRecentTrades([
      { price: centerPrice - spread * 0.2, amount: 0.45, time: 'Just now', type: 'Buy' },
      { price: centerPrice + spread * 0.4, amount: 1.25, time: '1 min ago', type: 'Sell' },
      { price: centerPrice - spread * 0.1, amount: 0.15, time: '3 mins ago', type: 'Buy' },
    ]);
  }, [selectedPair]);

  // ── Initialize TradingView Candlestick Chart ──────────────────────
  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart: any;
    let candleSeries: any;

    import('lightweight-charts').then(({ createChart }) => {
      if (!chartContainerRef.current) return;
      chartContainerRef.current.innerHTML = '';

      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { color: '#0d0d0d' },
          textColor: '#8e8e8e',
        },
        grid: {
          vertLines: { color: '#181818' },
          horzLines: { color: '#181818' },
        },
        width: chartContainerRef.current.clientWidth || 550,
        height: 320,
      });

      candleSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });

      // Historical candles
      const initialData = [];
      const baseTime = Math.floor(Date.now() / 1000) - 3600 * 24;
      let lastPrice = selectedPair === 'WETH/USDC' ? 3140 : 94200;
      for (let i = 0; i < 80; i++) {
        const open = lastPrice + (Math.random() - 0.5) * (lastPrice * 0.004);
        const close = open + (Math.random() - 0.5) * (lastPrice * 0.004);
        const high = Math.max(open, close) + Math.random() * (lastPrice * 0.002);
        const low = Math.min(open, close) - Math.random() * (lastPrice * 0.002);
        initialData.push({
          time: (baseTime + i * 900) as any,
          open,
          high,
          low,
          close,
        });
        lastPrice = close;
      }

      candleSeries.setData(initialData);
      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;
    });

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart) chart.remove();
    };
  }, [selectedPair]);

  // ── Dynamic price decay tick cycle ───────────────────────────────
  useEffect(() => {
    // Generate initial live orders for styling
    const startVal = selectedPair === 'WETH/USDC' ? 3150 : 94500;
    setOrders([
      {
        id: 2884,
        type: 'Buy',
        tokenIn: baseAsset,
        tokenOut: quoteAsset,
        tokenInSymbol: baseAsset,
        tokenOutSymbol: quoteAsset,
        amount: selectedPair === 'WETH/USDC' ? 2.5 : 0.05,
        startPrice: startVal * 1.01,
        currentPrice: startVal * 1.01,
        slope: -(startVal * 0.0001),
        minPrice: startVal * 0.95,
        maxPrice: 0,
        expiry: 0,
        createdAt: Date.now() - 45000,
        active: true,
        maker: fullAddress || '0x0000',
        onChain: false,
      },
      {
        id: 1940,
        type: 'Sell',
        tokenIn: quoteAsset,
        tokenOut: baseAsset,
        tokenInSymbol: quoteAsset,
        tokenOutSymbol: baseAsset,
        amount: selectedPair === 'WETH/USDC' ? 3500 : 5000,
        startPrice: startVal * 0.99,
        currentPrice: startVal * 0.99,
        slope: startVal * 0.00008,
        minPrice: 0,
        maxPrice: startVal * 1.05,
        expiry: 0,
        createdAt: Date.now() - 90000,
        active: true,
        maker: fullAddress || '0x0000',
        onChain: false,
      },
    ]);

    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (!ord.active) return ord;
          const deltaT = (Date.now() - ord.createdAt) / 1000;
          let calculated = ord.startPrice + ord.slope * deltaT;
          if (ord.minPrice > 0) calculated = Math.max(ord.minPrice, calculated);
          if (ord.maxPrice > 0) calculated = Math.min(ord.maxPrice, calculated);
          return { ...ord, currentPrice: Number(calculated.toFixed(2)) };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedPair, baseAsset, quoteAsset, fullAddress]);

  // ── Create Order Handler ──────────────────────────────────────────
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setWalletModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTxStatus(null);

    const actualSlope = priceType === 'limit' ? 0 : slope;
    const actualMinPrice = hasStopLoss ? stopLoss : 0;
    const actualMaxPrice = hasTakeProfit ? takeProfit : 0;

    // Check if on-chain configuration is ready
    if (isReady && chainId) {
      const tokenInSymbol = orderType === 'Buy' ? quoteAsset : baseAsset;
      const tokenOutSymbol = orderType === 'Buy' ? baseAsset : quoteAsset;
      
      const tokenInAddr = getTokenAddress(tokenInSymbol, chainId);
      const tokenOutAddr = getTokenAddress(tokenOutSymbol, chainId);

      if (tokenInAddr && tokenOutAddr) {
        try {
          const tokenMeta = SUPPORTED_TOKENS.find((t) => t.symbol === tokenInSymbol);
          const decimals = tokenMeta?.decimals || 18;
          const amountWei = BigInt(Math.floor(amount * 10 ** decimals)).toString();

          // Price and parameters in RAY (1e27)
          const priceRay = BigInt(Math.floor(startPrice * 1e18)).toString() + '000000000';
          const slopeRay = (actualSlope >= 0 ? '' : '-') + BigInt(Math.floor(Math.abs(actualSlope) * 1e18)).toString() + '000000000';
          const minPriceRay = actualMinPrice > 0 ? BigInt(Math.floor(actualMinPrice * 1e18)).toString() + '000000000' : '0';
          const maxPriceRay = actualMaxPrice > 0 ? BigInt(Math.floor(actualMaxPrice * 1e18)).toString() + '000000000' : '0';
          const expiryTs = expiry ? Math.floor(new Date(expiry).getTime() / 1000).toString() : '0';

          // Approval check
          setTxStatus('Verifying token approvals...');
          const allowanceResult = await readERC20(tokenInAddr, 'allowance', [fullAddress, contractAddress]);
          const currentAllowance = allowanceResult.data ? BigInt(allowanceResult.data as string) : BigInt(0);

          if (currentAllowance < BigInt(amountWei)) {
            setTxStatus('Requesting token authorization...');
            const approveResult = await approveERC20(tokenInAddr, contractAddress!, '0x' + 'f'.repeat(64));
            if (approveResult.error) {
              setTxStatus(`Authorization failed: ${approveResult.error}`);
              setIsSubmitting(false);
              return;
            }
            setTxStatus('Approval confirmed! Waiting for contract tx...');
            await new Promise((r) => setTimeout(r, 2000));
          }

          setTxStatus('Broadcasting createOrder transaction...');
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
          } else {
            setTxStatus(`Order created! Transaction: ${txHash?.substring(0, 14)}...`);
            // Add on-chain order placeholder to state
            setOrders((prev) => [
              {
                id: Math.floor(Math.random() * 2000) + 1000,
                type: orderType,
                tokenIn: tokenInSymbol,
                tokenOut: tokenOutSymbol,
                tokenInSymbol,
                tokenOutSymbol,
                amount,
                startPrice,
                currentPrice: startPrice,
                slope: actualSlope,
                minPrice: actualMinPrice,
                maxPrice: actualMaxPrice,
                expiry: expiryTs ? Number(expiryTs) : 0,
                createdAt: Date.now(),
                active: true,
                maker: fullAddress!,
                onChain: true,
              },
              ...prev,
            ]);
          }
        } catch (err: any) {
          setTxStatus(`Error: ${err.message || err}`);
        } finally {
          setIsSubmitting(false);
        }
        return;
      }
    }

    // Fallback: Local simulation mode
    setTxStatus('Simulating order execution (Local Mode)...');
    setTimeout(() => {
      setOrders((prev) => [
        {
          id: Math.floor(Math.random() * 2000) + 1000,
          type: orderType,
          tokenIn: orderType === 'Buy' ? quoteAsset : baseAsset,
          tokenOut: orderType === 'Buy' ? baseAsset : quoteAsset,
          tokenInSymbol: orderType === 'Buy' ? quoteAsset : baseAsset,
          tokenOutSymbol: orderType === 'Buy' ? baseAsset : quoteAsset,
          amount,
          startPrice,
          currentPrice: startPrice,
          slope: actualSlope,
          minPrice: actualMinPrice,
          maxPrice: actualMaxPrice,
          expiry: expiry ? Math.floor(new Date(expiry).getTime() / 1000) : 0,
          createdAt: Date.now(),
          active: true,
          maker: fullAddress || '0xSimulatedMakerAddress',
          onChain: false,
        },
        ...prev,
      ]);
      setTxStatus('Local order placed successfully!');
      setIsSubmitting(false);
    }, 1200);
  };

  // ── Cancel Order Handler ──────────────────────────────────────────
  const handleCancelOrder = async (orderId: number) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.onChain && isReady) {
      try {
        const { error } = await writeContract('cancelOrder', [orderId]);
        if (error) {
          alert(`Cancellation error: ${error}`);
          return;
        }
      } catch (err: any) {
        alert(err.message || err);
        return;
      }
    }

    // Deactivate order
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, active: false } : o))
    );
  };

  // ── Simulate Match/Sweep Cycle ───────────────────────────────────
  const handleSimulateSweep = (orderId: number) => {
    const activeOrd = orders.find((o) => o.id === orderId);
    if (!activeOrd) return;

    // Simulate match on-chain or locally
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, active: false } : o))
    );

    // Update charts and trade list
    const tradePrice = activeOrd.currentPrice;
    const tradeTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setRecentTrades((prev) => [
      { price: tradePrice, amount: activeOrd.amount, time: 'Just now', type: activeOrd.type === 'Buy' ? 'Sell' : 'Buy' },
      ...prev.slice(0, 10),
    ]);

    setSettledHistory((prev) => [
      {
        id: activeOrd.id,
        pair: selectedPair,
        amount: activeOrd.amount.toFixed(2),
        price: `$${tradePrice.toLocaleString()}`,
        age: 'Just now',
        txHash: '0xSimulatedMatchHash',
      },
      ...prev,
    ]);

    // Push new close price to lightweight-chart series
    if (candleSeriesRef.current) {
      const nextTime = Math.floor(Date.now() / 1000);
      candleSeriesRef.current.update({
        time: nextTime as any,
        open: tradePrice * 0.999,
        high: tradePrice * 1.002,
        low: tradePrice * 0.998,
        close: tradePrice,
      });
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#060606] text-white pt-24 pb-12 font-sans selection:bg-[#ffc517] selection:text-black">
      <WalletModal />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        
        {/* Ticker / Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0d0d] border border-neutral-900 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#ffc517] text-black flex items-center justify-center font-bold text-sm shrink-0">
                W
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Windmill Terminal
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-mono font-bold">Live</span>
                </h1>
                <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider font-semibold">Autonomous EVM Matcher</p>
              </div>
            </div>

            <div className="h-6 w-[1px] bg-neutral-900 hidden md:block" />

            {/* Pair Selector */}
            <div className="flex gap-1.5 bg-black p-1 rounded-xl border border-neutral-900">
              <button
                onClick={() => setSelectedPair('WETH/USDC')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  selectedPair === 'WETH/USDC' ? 'bg-[#ffc517] text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                WETH/USDC
              </button>
              <button
                onClick={() => setSelectedPair('WBTC/USDC')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  selectedPair === 'WBTC/USDC' ? 'bg-[#ffc517] text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                WBTC/USDC
              </button>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-sans font-semibold">Asset Price</span>
              <span className="text-white font-bold flex items-center gap-1">
                ${selectedPair === 'WETH/USDC' ? '3,148.50' : '94,520.00'}
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-sans font-semibold">24H Change</span>
              <span className="text-emerald-400 font-bold font-sans">+1.24%</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-sans font-semibold">Connected Chain</span>
              <span className="text-neutral-400 font-bold uppercase tracking-wider font-sans">{isConnected ? network : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Orderbook Depth & Recent Trades (Col span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Orderbook Card */}
            <div className="border border-neutral-900 rounded-3xl bg-[#0d0d0d] p-5 shadow-md flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Orderbook</h3>
                <p className="text-[9px] text-neutral-500 font-sans mt-0.5">Real-time matching depths</p>
              </div>

              {/* Orderbook lists */}
              <div className="flex flex-col gap-2 font-mono text-[10px]">
                {/* Column Headers */}
                <div className="flex justify-between text-[9px] text-neutral-600 font-bold uppercase">
                  <span>Price ({quoteAsset})</span>
                  <span>Amount ({baseAsset})</span>
                  <span>Total</span>
                </div>

                {/* Asks (Sell, Red) */}
                <div className="flex flex-col gap-1">
                  {asks.map((ask, idx) => (
                    <div key={`ask-${idx}`} className="flex justify-between items-center text-red-400 relative py-0.5">
                      <div className="absolute right-0 top-0 bottom-0 bg-red-950/15" style={{ width: `${(ask.total / asks[0].total) * 100}%` }} />
                      <span className="z-10">{ask.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-neutral-400 z-10">{ask.amount.toFixed(3)}</span>
                      <span className="text-neutral-500 z-10">{ask.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Mid Market Price */}
                <div className="border-y border-neutral-900 py-2 my-1 text-center font-bold text-xs flex justify-center items-center gap-1.5">
                  <span className="text-white">${selectedPair === 'WETH/USDC' ? '3,148.50' : '94,520.00'}</span>
                  <span className="text-[8px] px-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold rounded">SPREAD 0.08%</span>
                </div>

                {/* Bids (Buy, Green) */}
                <div className="flex flex-col gap-1">
                  {bids.map((bid, idx) => (
                    <div key={`bid-${idx}`} className="flex justify-between items-center text-emerald-400 relative py-0.5">
                      <div className="absolute right-0 top-0 bottom-0 bg-emerald-950/15" style={{ width: `${(bid.total / bids[bids.length - 1].total) * 100}%` }} />
                      <span className="z-10">{bid.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      <span className="text-neutral-400 z-10">{bid.amount.toFixed(3)}</span>
                      <span className="text-neutral-500 z-10">{bid.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Trades Card */}
            <div className="border border-neutral-900 rounded-3xl bg-[#0d0d0d] p-5 shadow-md flex flex-col gap-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Recent Trades</h3>
                <p className="text-[9px] text-neutral-500 font-sans mt-0.5">Executed matching cycle feed</p>
              </div>

              <div className="flex flex-col gap-2 font-mono text-[10px]">
                {recentTrades.map((trade, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-neutral-900 last:border-none last:pb-0">
                    <span className={trade.type === 'Buy' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                      ${trade.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-neutral-400">{trade.amount.toFixed(3)}</span>
                    <span className="text-neutral-500">{trade.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Lightweight-Charts interactive panel (Col span 6) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Chart Card */}
            <div className="border border-neutral-900 rounded-3xl bg-[#0d0d0d] p-5 shadow-md flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">{selectedPair} Candlestick</h3>
                  <p className="text-[9px] text-neutral-500 font-sans mt-0.5">Price feeds powered by Lightweight-Charts</p>
                </div>
                <div className="flex gap-1 bg-black p-0.5 rounded-lg border border-neutral-900">
                  <span className="px-2 py-1 text-[8px] font-bold text-neutral-400">15m</span>
                  <span className="px-2 py-1 text-[8px] font-bold bg-[#ffc517] text-black rounded-md">1H</span>
                  <span className="px-2 py-1 text-[8px] font-bold text-neutral-400">1D</span>
                </div>
              </div>
              <div ref={chartContainerRef} className="w-full bg-[#0d0d0d] rounded-2xl overflow-hidden min-h-[320px] flex items-center justify-center border border-neutral-900/50" />
            </div>

            {/* Simulated Banner / Info */}
            <div className="border border-neutral-950 bg-neutral-950/20 rounded-3xl p-5 flex items-start gap-4">
              <Info className="w-5 h-5 text-[#ffc517] shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Dynamic Curve Convergence Logic</h4>
                <p className="text-[11px] text-neutral-400 leading-relaxed mt-1 font-sans">
                  The Windmill Exchange uses configurable time-sloped pricing curves to match orders. Buyers decrease bids, sellers increase asks. The gap narrows automatically, and autonomous keeper nodes call match functions once price margins overlap.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Advanced Order Form (Col span 3) */}
          <div className="lg:col-span-3">
            <div className="border border-neutral-900 rounded-3xl bg-[#0d0d0d] p-5 shadow-md flex flex-col gap-5">
              
              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 p-1 bg-black border border-neutral-900 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setOrderType('Buy')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center uppercase tracking-wider ${
                    orderType === 'Buy' ? 'bg-emerald-600 text-white shadow-sm' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('Sell')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center uppercase tracking-wider ${
                    orderType === 'Sell' ? 'bg-red-600 text-white shadow-sm' : 'text-neutral-500 hover:text-white'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Order Placement Form */}
              <form onSubmit={handleCreateOrder} className="flex flex-col gap-4">
                
                {/* Price Type Selector */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPriceType('limit')}
                    className={`flex-1 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      priceType === 'limit' ? 'border-[#ffc517] bg-[#ffc517]/5 text-[#ffc517]' : 'border-neutral-900 text-neutral-500 hover:text-white'
                    }`}
                  >
                    Limit Order
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceType('dynamic')}
                    className={`flex-1 py-1.5 rounded-xl border text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      priceType === 'dynamic' ? 'border-[#ffc517] bg-[#ffc517]/5 text-[#ffc517]' : 'border-neutral-900 text-neutral-500 hover:text-white'
                    }`}
                  >
                    Dynamic Curve
                  </button>
                </div>

                {/* Amount Input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order-amount" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                    Amount ({baseAsset})
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="order-amount"
                      type="number"
                      step="any"
                      required
                      min="0.0001"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-black border border-neutral-900 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-neutral-700"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 text-[9px] font-bold text-neutral-600 font-mono uppercase">{baseAsset}</span>
                  </div>
                </div>

                {/* Start Price Input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="order-price" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                    Start Price (USD)
                  </label>
                  <div className="relative flex items-center">
                    <input
                      id="order-price"
                      type="number"
                      step="any"
                      required
                      min="0.01"
                      value={startPrice}
                      onChange={(e) => setStartPrice(Number(e.target.value))}
                      className="w-full bg-black border border-neutral-900 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-neutral-700"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 text-[9px] font-bold text-neutral-600 font-mono">USD</span>
                  </div>
                </div>

                {/* Decay Slope (Only shown if dynamic curve selected) */}
                {priceType === 'dynamic' && (
                  <div className="flex flex-col gap-1.5 border border-dashed border-neutral-900 rounded-2xl p-3 bg-neutral-950/20">
                    <div className="flex justify-between items-center">
                      <label htmlFor="order-slope" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                        Decay Rate (Slope)
                      </label>
                      <span className="text-[8px] text-neutral-400 normal-case">Change in price per second</span>
                    </div>
                    <div className="relative flex items-center mt-1">
                      <input
                        id="order-slope"
                        type="number"
                        step="any"
                        required
                        value={slope}
                        onChange={(e) => setSlope(Number(e.target.value))}
                        className="w-full bg-black border border-neutral-900 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-neutral-700"
                        placeholder="0.00"
                      />
                      <span className="absolute right-4 text-[9px] font-bold text-neutral-600 font-mono">USD/s</span>
                    </div>
                  </div>
                )}

                {/* STOP LOSS & TAKE PROFIT (Configurable Boundaries) */}
                <div className="flex flex-col gap-2.5 border-t border-neutral-900 pt-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">Advanced Boundaries</span>
                  
                  {/* Stop Loss Toggle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-semibold text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasStopLoss}
                        onChange={(e) => setHasStopLoss(e.target.checked)}
                        className="accent-[#ffc517] h-3.5 w-3.5 rounded border-neutral-900 bg-black focus:ring-0"
                      />
                      Enable Stop Loss (Limit price boundary)
                    </label>
                    {hasStopLoss && (
                      <div className="relative flex items-center mt-1">
                        <input
                          type="number"
                          step="any"
                          value={stopLoss}
                          onChange={(e) => setStopLoss(Number(e.target.value))}
                          className="w-full bg-black border border-neutral-900 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-neutral-700"
                        />
                        <span className="absolute right-4 text-[9px] font-bold text-neutral-600 font-mono">USD</span>
                      </div>
                    )}
                  </div>

                  {/* Take Profit Toggle */}
                  <div className="flex flex-col gap-1.5">
                    <label className="flex items-center gap-2 text-[10px] font-semibold text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasTakeProfit}
                        onChange={(e) => setHasTakeProfit(e.target.checked)}
                        className="accent-[#ffc517] h-3.5 w-3.5 rounded border-neutral-900 bg-black focus:ring-0"
                      />
                      Enable Take Profit (Target price boundary)
                    </label>
                    {hasTakeProfit && (
                      <div className="relative flex items-center mt-1">
                        <input
                          type="number"
                          step="any"
                          value={takeProfit}
                          onChange={(e) => setTakeProfit(Number(e.target.value))}
                          className="w-full bg-black border border-neutral-900 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-neutral-700"
                        />
                        <span className="absolute right-4 text-[9px] font-bold text-neutral-600 font-mono">USD</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expiry Input */}
                <div className="flex flex-col gap-1.5 border-t border-neutral-900 pt-3">
                  <label htmlFor="order-expiry" className="text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                    Expiry Time (Optional)
                  </label>
                  <input
                    id="order-expiry"
                    type="datetime-local"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full bg-black border border-neutral-900 rounded-xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-neutral-700"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 mt-2 cursor-pointer shadow-md ${
                    isSubmitting 
                      ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                      : orderType === 'Buy'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 active:scale-[0.98]'
                      : 'bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? 'Confirming...' : `Submit ${orderType} Order`}
                </button>

                {/* Status Logs */}
                {txStatus && (
                  <div className="mt-2 text-center p-3 rounded-2xl bg-neutral-950 border border-neutral-900 font-mono text-[9px] text-neutral-400 break-all leading-normal flex items-start gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#ffc517] shrink-0 animate-pulse" />
                    <span>{txStatus}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL: User Portfolio, Active/Executed Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Active Orders List (Col span 8) */}
          <div className="lg:col-span-8 border border-neutral-900 rounded-3xl bg-[#0d0d0d] p-6 shadow-md">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-900 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-neutral-400" />
                Active Portfolios ({activeOrders.length})
              </h2>
              <span className="text-[9px] font-mono text-neutral-500 uppercase">Live Pricing Updates Tick-By-Tick</span>
            </div>

            <div className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {activeOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-neutral-500">
                  <Coins className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">No active orders in this workspace.</p>
                </div>
              ) : (
                activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-neutral-900 bg-neutral-950/40 p-4 rounded-2xl hover:border-neutral-800 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded font-mono ${
                            order.type === 'Buy'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {order.type.toUpperCase()}
                        </span>
                        <span className="text-xs font-bold text-white font-mono">
                          {order.amount} {order.tokenInSymbol} ➔ {order.tokenOutSymbol}
                        </span>
                        <span className="text-[9px] text-neutral-500">ID: #{order.id}</span>
                        {order.onChain && (
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold uppercase">On-chain</span>
                        )}
                      </div>
                      
                      {/* Price parameters overview */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] font-mono text-neutral-400 border-t border-neutral-900/50 pt-2.5 mt-1">
                        <div>
                          <span className="text-neutral-600 block text-[9px] uppercase font-semibold">Start Price</span>
                          <span>${order.startPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                          <span className="text-neutral-600 block text-[9px] uppercase font-semibold">Current Price</span>
                          <span className={order.type === 'Buy' ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                            ${order.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-600 block text-[9px] uppercase font-semibold">Slope</span>
                          <span>{order.slope >= 0 ? '+' : ''}{order.slope.toFixed(4)} USD/s</span>
                        </div>
                        <div>
                          <span className="text-neutral-600 block text-[9px] uppercase font-semibold">Expiry</span>
                          <span>{order.expiry > 0 ? new Date(order.expiry * 1000).toLocaleTimeString() : 'None'}</span>
                        </div>
                      </div>

                      {/* Boundary ranges */}
                      {(order.minPrice > 0 || order.maxPrice > 0) && (
                        <div className="flex gap-4 text-[9px] font-mono text-neutral-500 mt-2 bg-neutral-950 p-2 rounded-xl border border-neutral-900/50">
                          {order.minPrice > 0 && (
                            <span className="flex items-center gap-1">
                              <Shield className="w-3 h-3 text-[#ffc517]" />
                              Stop Loss Boundary: ${order.minPrice.toLocaleString()}
                            </span>
                          )}
                          {order.maxPrice > 0 && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-emerald-400" />
                              Take Profit Target: ${order.maxPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0 sm:self-center">
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="rounded-full border border-red-950 bg-red-950/20 px-4 py-2 text-[10px] font-bold text-red-400 hover:border-red-600 hover:bg-red-950/40 transition-colors shrink-0 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                      >
                        Cancel <X className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleSimulateSweep(order.id)}
                        className="rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-[10px] font-bold text-neutral-300 hover:border-neutral-600 hover:bg-neutral-900 transition-colors shrink-0 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                      >
                        Simulate Match <Zap className="w-3 h-3 fill-current" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Settled Matches Log (Col span 4) */}
          <div className="lg:col-span-4 border border-neutral-900 rounded-3xl bg-[#0d0d0d] p-6 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-neutral-900 pb-3">
              <History className="w-4 h-4 text-neutral-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Settled Logs</h2>
            </div>
            
            <div className="flex flex-col gap-3 font-mono text-[10px] text-neutral-400 max-h-96 overflow-y-auto pr-1">
              {settledHistory.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex justify-between items-center border-b border-neutral-900 pb-2.5 last:border-none last:pb-0"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-white font-bold">{item.pair} ({item.amount})</span>
                    <span className="text-[9px] text-neutral-500 font-sans">{item.age}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold block">{item.price}</span>
                    <span className="text-[9px] text-neutral-600 font-sans">#{item.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
