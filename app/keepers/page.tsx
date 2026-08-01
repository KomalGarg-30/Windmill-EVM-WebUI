'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WalletModal from '@/components/wallet/WalletModal';
import { useScrollRevealChildren } from '@/hooks/useScrollReveal';
import { Monitor, Activity, Zap, CheckCircle2, Percent, Fuel, Search, RefreshCw } from 'lucide-react';

const MOCK_MATCH_LOGS = [
  { status: 'SUCCESS', detail: 'Buy #298 matched Sell #120 — 0.12 ETH settled at $3,148.50', time: '2 mins ago', keeper: '0x7a3b...f291' },
  { status: 'SUCCESS', detail: 'Buy #295 matched Sell #118 — 54.00 USDC settled at $1.0002', time: '5 mins ago', keeper: '0x1c8e...a402' },
  { status: 'SWEEP', detail: 'Two-pointer sweep cycle complete. 3 pairs scanned, 2 matched.', time: '7 mins ago', keeper: '0x7a3b...f291' },
  { status: 'SUCCESS', detail: 'Buy #284 matched Sell #102 — 1,250 DAI settled at $0.9998', time: '12 mins ago', keeper: '0x1c8e...a402' },
  { status: 'SUCCESS', detail: 'Buy #280 matched Sell #99 — 0.05 WBTC settled at $94,220.00', time: '18 mins ago', keeper: '0x7a3b...f291' },
  { status: 'SKIP', detail: 'No matchable pairs found in this sweep cycle.', time: '22 mins ago', keeper: '0x1c8e...a402' },
  { status: 'SUCCESS', detail: 'Buy #275 matched Sell #95 — 2.3 ETH settled at $3,155.20', time: '30 mins ago', keeper: '0x7a3b...f291' },
];

const KEEPER_STATS = [
  { label: 'Active Nodes', value: '14', icon: Monitor },
  { label: 'Network Uptime', value: '99.98%', icon: Activity, highlight: true },
  { label: 'Sweep Latency', value: '0.03s', icon: Zap },
  { label: 'Matches Settled', value: '1,402', icon: CheckCircle2 },
  { label: 'Keeper Fee Rate', value: '0.1%', icon: Percent },
  { label: 'Avg Gas Cost', value: '~120k', icon: Fuel },
  { label: 'Pairs Monitored', value: '8', icon: Search },
  { label: 'Cycle Interval', value: '15s', icon: RefreshCw },
];

export default function KeepersPage() {
  const containerRef = useScrollRevealChildren<HTMLDivElement>({ threshold: 0.1 });
  const [activeSection, setActiveSection] = useState<'monitor' | 'guide'>('monitor');

  return (
    <main className="w-full min-h-screen bg-white text-black pt-24">
      <WalletModal />

      <div ref={containerRef} className="max-w-4xl mx-auto px-6 py-16 flex flex-col gap-10">
        {/* Header */}
        <div>
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">Network Node Monitor</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black mt-2">
            Keeper Dashboard
          </h1>
          <p className="text-neutral-500 text-sm mt-3 max-w-xl">
            Autonomous keepers scan and match compatible orders using the O(N log N) two-pointer sweep algorithm. Run your own keeper node to earn fees.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 bg-neutral-50 p-1 rounded-full border border-neutral-100 w-fit">
          <button
            onClick={() => setActiveSection('monitor')}
            className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              activeSection === 'monitor' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Live Monitor
          </button>
          <button
            onClick={() => setActiveSection('guide')}
            className={`px-5 py-2 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
              activeSection === 'guide' ? 'bg-black text-white' : 'text-neutral-500 hover:text-black'
            }`}
          >
            Run a Keeper
          </button>
        </div>

        {activeSection === 'monitor' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {KEEPER_STATS.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    data-reveal
                    style={{ transitionDelay: `${idx * 60}ms` }}
                    className="reveal-fade-up border border-neutral-100 bg-white rounded-2xl p-4 text-center hover:-translate-y-1 hover:shadow-md hover:border-neutral-200 transition-all duration-300 flex flex-col items-center justify-center"
                  >
                    <span className="text-neutral-600 mb-2 block">
                      <StatIcon className="w-5 h-5" />
                    </span>
                    <span className={`text-xl font-bold font-mono ${stat.highlight ? 'text-emerald-600' : 'text-black'}`}>
                      {stat.value}
                    </span>
                    <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Match Logs */}
            <div data-reveal className="reveal-fade-up border border-neutral-100 rounded-2xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-black">Recent Match Logs</h3>
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Feed
                </div>
              </div>
              <div className="font-mono text-xs flex flex-col gap-3 max-h-96 overflow-y-auto">
                {MOCK_MATCH_LOGS.map((log, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-50 pb-3 last:border-none last:pb-0">
                    <div className="flex items-start gap-2">
                      <span
                        className={`text-[10px] font-bold shrink-0 px-1.5 py-0.5 rounded ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700'
                            : log.status === 'SWEEP'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {log.status}
                      </span>
                      <span className="text-neutral-600 font-sans text-[11px]">{log.detail}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[9px] text-neutral-400 font-sans">{log.keeper}</span>
                      <span className="text-[10px] text-neutral-400">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Diagram */}
            <div data-reveal className="reveal-fade-up border border-neutral-100 rounded-2xl p-6 bg-neutral-50/30">
              <h3 className="text-sm font-bold text-black mb-4 uppercase tracking-wider">Keeper Execution Flow</h3>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
                {[
                  { step: '1', title: 'Scan Events', desc: 'Discover pairs from OrderCreated logs' },
                  { step: '2', title: 'Fetch Orders', desc: 'Paginate active orders per pair' },
                  { step: '3', title: 'Price Check', desc: 'Query currentPrice() on-chain' },
                  { step: '4', title: 'Sweep Match', desc: 'Two-pointer O(N log N) matching' },
                  { step: '5', title: 'Execute', desc: 'Call matchOrders() to settle' },
                ].map((item, idx) => (
                  <React.Fragment key={item.step}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <span className="text-xs font-bold text-black">{item.title}</span>
                      <span className="text-[9px] text-neutral-400 max-w-[120px]">{item.desc}</span>
                    </div>
                    {idx < 4 && (
                      <span className="text-neutral-300 font-mono hidden sm:block">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === 'guide' && (
          <div data-reveal className="reveal-fade-up flex flex-col gap-8">
            {/* Setup Guide */}
            <div className="border border-neutral-100 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-black mb-4">Run Your Own Keeper</h3>
              <p className="text-sm text-neutral-500 mb-6">
                Anyone can operate a keeper node to earn matching fees. The keeper scans for compatible orders and executes
                settlement transactions on-chain, earning 0.1% of each matched trade.
              </p>

              <div className="flex flex-col gap-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-black">Clone & Install</h4>
                    <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 font-mono text-xs text-black mt-2 overflow-x-auto">
                      <pre className="whitespace-pre">{`git clone https://github.com/StabilityNexus/Windmill-EVM-Contracts.git
cd Windmill-EVM-Contracts/Windmill-EVM-Keeper2
npm ci`}</pre>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-black">Configure Environment</h4>
                    <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 font-mono text-xs text-black mt-2 overflow-x-auto">
                      <pre className="whitespace-pre">{`cp .env.example .env

# Edit .env:
KEEPER_STRATEGY=windmill
RPC_URL=https://sepolia.base.org
EXPECTED_CHAIN_ID=84532
PRIVATE_KEY=<your-keeper-wallet-private-key>
CONTRACT_ADDRESS=<deployed-windmill-exchange-address>
KEEPER_INTERVAL_MS=15000
DRY_RUN=false`}</pre>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-black">Run the Keeper</h4>
                    <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4 font-mono text-xs text-black mt-2 overflow-x-auto">
                      <pre className="whitespace-pre">{`# Test with dry run first (no transactions)
npm run start:dry-run

# Single cycle test
npm run start:once

# Production continuous loop
npm run start`}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Calculator */}
            <div className="border border-neutral-100 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-black mb-4">Keeper Economics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-center">
                  <span className="text-2xl font-bold font-mono text-black">0.1%</span>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">Fee per Match</p>
                  <p className="text-[9px] text-neutral-400 mt-2">Calculated on the notional amount of each settled trade</p>
                </div>
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-center">
                  <span className="text-2xl font-bold font-mono text-black">~120k</span>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">Gas per Match</p>
                  <p className="text-[9px] text-neutral-400 mt-2">Average gas units consumed by matchOrders()</p>
                </div>
                <div className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4 text-center">
                  <span className="text-2xl font-bold font-mono text-emerald-600">Profitable</span>
                  <p className="text-[10px] text-neutral-400 uppercase font-semibold mt-1">On L2 Chains</p>
                  <p className="text-[9px] text-neutral-400 mt-2">Base, Polygon, BSC offer low gas for high-frequency matching</p>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="border border-neutral-100 rounded-2xl p-6 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-black mb-3">Requirements</h3>
              <ul className="flex flex-col gap-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                  Node.js 20+ runtime
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                  Funded wallet for gas (keeper earns 0.1% per match to offset costs)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                  RPC endpoint (free public endpoints available for all supported chains)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-black shrink-0" />
                  Deployed WindmillExchange contract address
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
