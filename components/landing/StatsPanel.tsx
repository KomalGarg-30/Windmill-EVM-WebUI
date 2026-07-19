'use client';

import React from 'react';
import Link from 'next/link';

const glass = 'bg-white/[0.15] backdrop-blur-[32px] border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.10)] relative overflow-hidden before:absolute before:inset-0 before:pointer-events-none before:bg-gradient-to-b before:from-white/[0.15] before:to-transparent';

const innerGlass = 'bg-white/[0.12] backdrop-blur-[16px] border border-white/20';

const glassCard = (className = '') =>
  `${glass} rounded-[28px] ${className}`;

function Sparkline({ data, color = '#0a0a0a', id }: { data: number[]; color?: string; id: string }) {
  const w = 120;
  const h = 32;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" fill="none">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts.join(' ')} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
      <polygon
        points={`${pts.join(' ')},${w},${h} 0,${h}`}
        fill={`url(#spark-${id})`}
      />
    </svg>
  );
}

function MiniBarChart({ data }: { data: number[] }) {
  const w = 100;
  const h = 28;
  const max = Math.max(...data) || 1;
  const barW = w / data.length * 0.7;
  const gap = w / data.length * 0.3;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      {data.map((v, i) => {
        const barH = (v / max) * h;
        const x = i * (barW + gap) + gap / 2;
        return (
          <rect
            key={i}
            x={x}
            y={h - barH}
            width={barW}
            height={barH}
            rx={2}
            fill="#0a0a0a"
            opacity={0.15 + (v / max) * 0.25}
          />
        );
      })}
    </svg>
  );
}

function CircularProgress({ value, label, sublabel }: { value: number; label: string; sublabel: string }) {
  const r = 28;
  const cx = 36;
  const cy = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0a0a0a" strokeWidth="3" opacity="0.08" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke="#0a0a0a" strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity="0.7"
        />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#0a0a0a" fontSize="13" fontWeight="700" fontFamily="system-ui">
          {value}%
        </text>
      </svg>
      <span className="text-[10px] font-semibold text-neutral-600">{label}</span>
      <span className="text-[8px] text-neutral-400">{sublabel}</span>
    </div>
  );
}

export default function StatsPanel() {
  const statsData = [
    { label: 'Total Volume', value: '$24.7M', sub: '+12.4% this week' },
    { label: 'Total Trades', value: '12,845', sub: '2,341 this week' },
    { label: 'Active Traders', value: '3,120', sub: '+482 new' },
    { label: 'Uptime', value: '99.9%', sub: '30d average' },
  ];

  return (
    <div className="w-full mt-16 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {/* ── Card 1: Analytics Overview ── */}
        <div className={`${glassCard('md:col-span-2 p-6')} z-10`}>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">Live Analytics</span>
              </div>
              <span className="text-[9px] text-neutral-400 font-mono">updated 2s ago</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {statsData.slice(0, 2).map((s) => (
                <div key={s.label}>
                  <span className="text-[10px] text-neutral-500 font-medium">{s.label}</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-bold text-neutral-900 tracking-tight">{s.value}</span>
                    <span className="text-[9px] text-emerald-600/80 font-medium">{s.sub.split(' ')[0]}</span>
                  </div>
                  <span className="text-[9px] text-neutral-400">{s.sub.replace(/^[+0-9.%]+\s/, '')}</span>
                  <div className="mt-2 h-8">
                    <Sparkline id={s.label.replace(/\s+/g, '-')} data={[22, 28, 25, 35, 30, 42, 38, 45, 40, 48, 52, 50, 55, 58]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Card 2: Chart ── */}
        <div className={`${glassCard('p-6')} z-10`}>
          <div className="relative z-10 flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">Volume</span>
              <span className="text-[15px] font-bold text-neutral-900">$2.4M</span>
            </div>
            <div className="flex-1 h-24">
              <svg viewBox="0 0 160 60" className="w-full h-full" fill="none">
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0a0a0a" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,50 Q20,45 40,35 Q60,25 80,30 Q100,35 120,18 Q140,8 160,12 L160,60 L0,60 Z" fill="url(#volGrad)" opacity="0.5" />
                <path d="M0,50 Q20,45 40,35 Q60,25 80,30 Q100,35 120,18 Q140,8 160,12" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-[9px] text-neutral-400 font-mono">
              <span>00:00</span>
              <span>12:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        {/* ── Card 3: Mini Stats ── */}
        <div className={`${glassCard('p-6')} z-10`}>
          <div className="relative z-10 flex flex-col h-full gap-3">
            <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">System</span>
            <div className="flex-1 flex flex-col justify-center gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">Gas Price</span>
                <span className="text-xs font-semibold text-neutral-900">24.5 Gwei</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">TPS</span>
                <span className="text-xs font-semibold text-neutral-900">1,284</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">Blocks</span>
                <span className="text-xs font-semibold text-neutral-900">19,450,221</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">Peers</span>
                <span className="text-xs font-semibold text-neutral-900">142</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 4: Circular Progress ── */}
        <div className={`${glassCard('p-6')} z-10`}>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <CircularProgress value={87} label="Solver Uptime" sublabel="30d avg" />
            <MiniBarChart data={[40, 60, 35, 80, 55, 70, 45, 65, 90, 75, 60, 85]} />
            <span className="text-[9px] text-neutral-400 font-mono">24h activity</span>
          </div>
        </div>

        {/* ── Card 5: Trading Stats ── */}
        <div className={`${glassCard('md:col-span-2 p-6')} z-10`}>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">Trading Statistics</span>
              </div>
              <span className="flex items-center gap-1.5 text-[9px] text-emerald-600/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`${innerGlass} rounded-2xl p-3`}>
                <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">Best Bid</span>
                <div className="text-sm font-bold text-neutral-900 mt-1">$1,234.50</div>
                <span className="text-[9px] text-emerald-600/70">+2.3%</span>
              </div>
              <div className={`${innerGlass} rounded-2xl p-3`}>
                <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">Best Ask</span>
                <div className="text-sm font-bold text-neutral-900 mt-1">$1,235.20</div>
                <span className="text-[9px] text-rose-600/70">-0.8%</span>
              </div>
              <div className={`${innerGlass} rounded-2xl p-3`}>
                <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">Spread</span>
                <div className="text-sm font-bold text-neutral-900 mt-1">$0.70</div>
                <span className="text-[9px] text-neutral-400">0.06%</span>
              </div>
              <div className={`${innerGlass} rounded-2xl p-3`}>
                <span className="text-[9px] text-neutral-500 font-medium uppercase tracking-wider">24h High</span>
                <div className="text-sm font-bold text-neutral-900 mt-1">$1,267.80</div>
                <span className="text-[9px] text-neutral-400">Low: $1,198.20</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[9px] text-neutral-400">{statsData[1].sub}</span>
              <Link
                href="/dashboard"
                type="button"
                className="px-5 py-2 rounded-full bg-neutral-900 text-white text-[10px] font-bold hover:bg-neutral-800 transition-all shadow-lg active:scale-[0.97] cursor-pointer inline-block"
              >
                View Full Dashboard →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Card 6: Network Status ── */}
        <div className={`${glassCard('p-6')} z-10`}>
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">Network</span>
            <div className="flex flex-col gap-2.5">
              {[
                { name: 'Ethereum', status: 'Connected', latency: '12ms', ok: true },
                { name: 'Base', status: 'Connected', latency: '24ms', ok: true },
                { name: 'Polygon', status: 'Syncing', latency: '48ms', ok: false },
                { name: 'Arbitrum', status: 'Connected', latency: '18ms', ok: true },
              ].map((net) => (
                <div key={net.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${net.ok ? 'bg-emerald-500' : 'bg-amber-500'} shadow-[0_0_6px_rgba(52,211,153,0.4)]`} />
                    <span className="text-[10px] font-medium text-neutral-700">{net.name}</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 font-mono">{net.latency}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Card 7: Profile / Status ── */}
        <div className={`${glassCard('p-6')} z-10`}>
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${innerGlass} flex items-center justify-center`}>
              <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-neutral-900">0x7B...f3a2</div>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] text-neutral-500">Keeper Node Active</span>
              </div>
            </div>
            <div className={`w-full ${innerGlass} rounded-2xl p-3`}>
              <div className="flex justify-between text-[9px] text-neutral-400 mb-1">
                <span>Matched Today</span>
                <span className="text-neutral-900 font-semibold">847</span>
              </div>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[72%] bg-neutral-900/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 8: Wallet / Tokens ── */}
        <div className={`${glassCard('md:col-span-2 p-6')} z-10`}>
          <div className="relative z-10 flex flex-col gap-3">
            <span className="text-[11px] font-semibold text-neutral-800 uppercase tracking-wider">Portfolio</span>
            <div className="grid grid-cols-3 gap-3">
              {[
                { token: 'ETH', balance: '42.50', value: '$52,445', change: '+3.2%' },
                { token: 'USDC', balance: '125,000', value: '$125,000', change: '0.0%' },
                { token: 'WBTC', balance: '2.85', value: '$48,735', change: '-1.8%' },
              ].map((t) => (
                <div key={t.token} className={`${innerGlass} rounded-2xl p-3`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-neutral-900">{t.token}</span>
                    <span className={`text-[8px] font-medium ${t.change.startsWith('+') ? 'text-emerald-600/80' : t.change === '0.0%' ? 'text-neutral-400' : 'text-rose-600/80'}`}>{t.change}</span>
                  </div>
                  <div className="text-xs font-bold text-neutral-900">{t.balance}</div>
                  <div className="text-[9px] text-neutral-500">{t.value}</div>
                  <div className="mt-2 h-6">
                    <MiniBarChart data={[30, 45, 35, 50, 40, 55, 48, 60, 52, 58]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
