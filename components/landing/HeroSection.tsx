'use client';

import React from 'react';
import Link from 'next/link';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import StatsPanel from '@/components/landing/StatsPanel';

export default function HeroSection() {
  const containerRef = useScrollReveal<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: 'url(/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="relative mx-auto max-w-4xl px-6 md:px-8 text-center flex flex-col items-center justify-center pt-28">
        {/* Heading */}
        <h1 className="text-reveal-2 font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 max-w-3xl leading-[1.1] mb-6">
          The Decentralized{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500">
            Matchmaking
          </span>{' '}
          Protocol for EVM.
        </h1>

        {/* Description */}
        <p className="text-reveal-3 font-sans text-sm sm:text-base text-neutral-500 max-w-xl leading-relaxed mb-10">
          A high-efficiency dynamic orderbook matching engine running entirely on-chain. Configure price slopes; let solvers settle automatically.
        </p>

        {/* CTAs */}
        <div className="text-reveal-4 flex flex-col sm:flex-row gap-4 items-center justify-center mb-10 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-neutral-900 text-white font-semibold text-sm rounded-full hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
          >
            Launch Exchange
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-neutral-900 font-semibold text-sm rounded-full border border-neutral-200 hover:border-neutral-400 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
          >
            Docs / API Reference
          </Link>
        </div>

        {/* Stats Panel */}
        <div className="w-full text-reveal-4">
          <StatsPanel />
        </div>
      </div>
    </section>
  );
}
