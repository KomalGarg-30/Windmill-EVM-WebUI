'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import StatsPanel from '@/components/landing/StatsPanel';
import ThemeSwitcher from '@/components/landing/ThemeSwitcher';
import { useWallet } from '@/context/WalletContext';

function CurvePanel({ sell = false }: { sell?: boolean }) {
  const heights = sell ? ['1.5rem', '2.5rem', '3.5rem', '4.5rem', '6rem'] : ['6rem', '4.5rem', '3.5rem', '2.5rem', '1.5rem'];

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 border border-white/10 bg-black/40 p-5">
      <div className="flex items-center justify-between gap-3 font-mono text-[10px]">
        <span className="font-bold text-white">{sell ? 'SELL' : 'BUY'} ORDER CURVE</span>
        <span className="text-accent">s {sell ? '>' : '<'} 0</span>
      </div>
      <div className="flex h-28 items-end gap-2 border-b border-dashed border-white/10">
        {heights.map((height, index) => (
          <div key={`${sell ? 'sell' : 'buy'}-${index}`} className="w-full rounded-t-sm bg-accent" style={{ height, opacity: sell ? (index + 1) * 0.2 : 1 - index * 0.2 }} />
        ))}
      </div>
      <div className="flex justify-between gap-3 font-mono text-[10px] text-muted-foreground">
        <span>P(t) = P₀ + s·t</span>
        <span className="text-accent">{sell ? 'Increasing Ask' : 'Decreasing Bid'}</span>
      </div>
    </div>
  );
}

function MatchingEngine() {
  return (
    <section id="matching-engine" className="border-t border-white/10 bg-black/60 px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="cyber-panel p-5 sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-accent">solver-match-node</span>
            <div className="flex gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
          </div>
          <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]">
            <CurvePanel />
            <div className="flex flex-col items-center gap-2 text-accent">
              <div className="flex h-12 w-12 items-center justify-center border border-accent shadow-[0_0_24px_var(--accent-glow)]">
                <Zap className="h-5 w-5 fill-current" aria-hidden="true" />
              </div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">SWEEP</span>
            </div>
            <CurvePanel sell />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HeroSection() {
  const { isConnected, network } = useWallet();

  return (
    <>
      <section id="home" className="relative overflow-hidden bg-surface px-6 pb-16 pt-36 sm:pt-40">
        <div className="absolute inset-0 cyber-grid opacity-70" aria-hidden="true" />
        <div className="hero-spotlight" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" /> Decentralized. Efficient. Built for EVM.
            </div>
            <h1 className="font-heading text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl">
              The Decentralized <span className="text-glow text-accent">Matchmaking</span> Protocol for EVM.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A high-efficiency dynamic orderbook matching engine running entirely on-chain. Configure price slopes; let solvers settle automatically.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/dashboard" className="button-primary"><span>Launch Exchange</span><ArrowRight className="h-4 w-4" /></Link>
              <Link href="/docs" className="button-secondary">Docs / API Reference</Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Non-custodial</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> Permissionless</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-accent" /> On-chain settlement</span>
            </div>
          </div>
          <div className="relative flex min-h-[330px] items-center justify-center">
            <div className="absolute right-0 top-0 border border-accent/30 bg-surface/90 p-4 font-mono text-[10px] text-muted-foreground shadow-xl backdrop-blur-md">
              <div className="flex justify-between gap-8"><span>STATUS</span><span className="text-accent">{isConnected ? 'CONNECTED' : 'READY'}</span></div>
              <div className="mt-2 flex justify-between gap-8"><span>NETWORK</span><span className="text-accent">{isConnected ? network.toUpperCase() : 'EVM'}</span></div>
              <div className="mt-2 flex justify-between gap-8"><span>SETTLEMENT</span><span className="text-accent">ON-CHAIN</span></div>
            </div>
            <div className="relative flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
              <div className="absolute inset-0 rounded-full border border-accent/20 animate-spin-slow" />
              <div className="absolute inset-8 rounded-full border border-dashed border-accent/30 animate-spin-reverse" />
              <div className="absolute inset-16 rounded-full border border-accent/20" />
              <div className="relative flex h-28 w-28 items-center justify-center border border-accent/60 bg-accent/10 shadow-[0_0_45px_var(--accent-glow)] sm:h-36 sm:w-36">
                <img src="/windmill-logo.svg" alt="Windmill Exchange" width={96} height={96} className="h-20 w-20 object-contain sm:h-24 sm:w-24" />
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
        <div id="stats" className="relative mx-auto mt-14 max-w-5xl"><StatsPanel /></div>
      </section>
      <MatchingEngine />
    </>
  );
}
