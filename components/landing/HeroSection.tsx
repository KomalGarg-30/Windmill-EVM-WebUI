'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import StatsPanel from '@/components/landing/StatsPanel';
import { Zap } from 'lucide-react';

/* ── Framer Motion Variants ─────────────────────────────────────── */

const ease = [0.16, 1, 0.3, 1] as const;

const fadeSlideUp = (delay: number) => ({
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease, delay },
  },
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

/* ── Sub-components ─────────────────────────────────────────────── */

function BuyCurvePanel() {
  return (
    <div className="flex-1 w-full flex flex-col gap-3 p-4 bg-neutral-50/50 rounded-xl border border-black/5 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-neutral-800">BUY ORDER CURVE</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
          s &lt; 0
        </span>
      </div>
      <div className="h-20 flex items-end justify-between gap-1 pt-6 border-b border-dashed border-black/5 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
          <div className="border-b border-black/5 w-full" />
          <div className="border-b border-black/5 w-full" />
        </div>
        <div className="w-full h-16 bg-black rounded-t-sm opacity-100" />
        <div className="w-full h-12 bg-black rounded-t-sm opacity-80" />
        <div className="w-full h-9 bg-black rounded-t-sm opacity-60" />
        <div className="w-full h-6 bg-black rounded-t-sm opacity-30" />
      </div>
      <div className="flex justify-between text-[9px] text-neutral-400 font-mono mt-1">
        <span>P(t) = P₀ + s·t</span>
        <span>Decreasing Bid</span>
      </div>
    </div>
  );
}

function SellCurvePanel() {
  return (
    <div className="flex-1 w-full flex flex-col gap-3 p-4 bg-neutral-50/50 rounded-xl border border-black/5 shadow-sm">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-neutral-800">SELL ORDER CURVE</span>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
          s &gt; 0
        </span>
      </div>
      <div className="h-20 flex items-end justify-between gap-1 pt-6 border-b border-dashed border-black/5 relative">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
          <div className="border-b border-black/5 w-full" />
          <div className="border-b border-black/5 w-full" />
        </div>
        <div className="w-full h-6 bg-neutral-300 rounded-t-sm opacity-40" />
        <div className="w-full h-9 bg-neutral-400 rounded-t-sm opacity-60" />
        <div className="w-full h-12 bg-neutral-500 rounded-t-sm opacity-80" />
        <div className="w-full h-16 bg-neutral-700 rounded-t-sm opacity-90" />
      </div>
      <div className="flex justify-between text-[9px] text-neutral-400 font-mono mt-1">
        <span>P(t) = P₀ + s·t</span>
        <span>Increasing Ask</span>
      </div>
    </div>
  );
}

function MockInterfacePanel() {
  return (
    <motion.div
      variants={fadeSlideUp(0.55)}
      className="relative w-full max-w-3xl rounded-2xl border border-black/5 bg-neutral-50/50 p-2 shadow-xl backdrop-blur-md pointer-events-auto transform rotate-x-6 rotate-y-[-3deg] transition-all duration-700 hover:rotate-x-0 hover:rotate-y-0 hover:scale-[1.01]"
    >
      <div className="rounded-xl border border-black/10 bg-white overflow-hidden shadow-inner aspect-[16/9] flex flex-col">
        {/* Mock header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/5 bg-neutral-50">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
            <span className="w-2.5 h-2.5 rounded-full bg-black/10" />
          </div>
          <span className="text-[10px] font-mono text-neutral-400 tracking-wider">solver-match-node</span>
          <div className="w-4" />
        </div>

        {/* Live Pricing Curves Diagram */}
        <div className="flex-1 p-6 flex flex-col sm:flex-row gap-6 items-center justify-center bg-white">
          <BuyCurvePanel />

          {/* Connecting Match Action */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0">
            <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center shadow-lg font-mono font-bold text-xs">
              <Zap className="w-3.5 h-3.5 fill-current text-white" />
            </div>
            <span className="text-[9px] font-bold tracking-widest text-neutral-800 uppercase mt-1">SWEEP</span>
          </div>

          <SellCurvePanel />
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-32 pb-16 bg-light-mesh"
    >
      {/* Ambient soft glow spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[60vw] h-[60vw] glow-spot-light-1 rounded-full opacity-[0.4] blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[50vw] h-[50vw] glow-spot-light-2 rounded-full opacity-[0.3] blur-3xl pointer-events-none animate-pulse-slow" />

      {/* Floating 3D Geometric Accents */}
      <div className="absolute left-[8%] top-[25%] hidden lg:block animate-float pointer-events-none">
        <div className="w-14 h-14 border border-black/10 rounded-xl transform rotate-12 rotate-x-45 rotate-y-12 transition-transform duration-500 hover:border-black/30" />
      </div>
      <div className="absolute right-[10%] bottom-[20%] hidden lg:block animate-float-delayed pointer-events-none">
        <div className="w-16 h-16 border border-black/10 rounded-full border-dashed transform -rotate-12 transition-transform duration-500 hover:scale-110" />
      </div>

      <motion.div
        className="relative mx-auto max-w-4xl px-6 md:px-8 text-center flex flex-col items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Heading */}
        <motion.h1
          variants={fadeSlideUp(0.1)}
          className="font-sans text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-black max-w-3xl leading-[1.15] mb-6"
        >
          The Decentralized{' '}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-black via-neutral-700 to-neutral-500">
            Matchmaking
          </span>{' '}
          Protocol for EVM.
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={fadeSlideUp(0.25)}
          className="font-sans text-sm sm:text-base text-neutral-500 max-w-xl leading-relaxed mb-10"
        >
          A high-efficiency dynamic orderbook matching engine running entirely on-chain. Configure price slopes; let solvers settle automatically.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeSlideUp(0.4)}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-10 w-full sm:w-auto"
        >
          <Link
            href="/dashboard"
            className="btn-premium-dark w-full sm:w-auto hover:scale-105 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
          >
            Launch Exchange
          </Link>
          <Link
            href="/docs"
            className="btn-premium-light w-full sm:w-auto cursor-pointer"
          >
            Docs / API Reference
          </Link>
        </motion.div>

        {/* Stats Panel */}
        <motion.div variants={fadeSlideUp(0.55)} className="w-full mb-16">
          <StatsPanel />
        </motion.div>

        {/* 3D Visual Mock Interface Panel */}
        <MockInterfacePanel />
      </motion.div>
    </section>
  );
}
