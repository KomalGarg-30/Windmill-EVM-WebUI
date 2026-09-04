'use client';

import { useScrollReveal } from '@/hooks/useScrollReveal';
import Link from 'next/link';

export default function CTASection() {
  const containerRef = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section
      id="cta"
      ref={containerRef}
      className="relative overflow-hidden border-t border-white/10 bg-surface section-padding"
    >
      {/* Background Decorators */}
      <div className="absolute inset-0 cyber-grid opacity-50 pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 md:px-8 relative z-10">
        <div className="cyber-panel relative flex flex-col items-center justify-center overflow-hidden px-8 py-14 text-center shadow-2xl md:py-20">
          {/* Radial ambient background light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(0,255,102,0.16),transparent_75%)] pointer-events-none" />

          {/* Heading */}
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight mb-4 max-w-xl leading-tight text-white">
            Ready to experience decentralized matchmaking?
          </h2>

          {/* Subheading */}
          <p className="text-muted-foreground text-xs sm:text-sm max-w-md mb-8 leading-relaxed">
            Deploy dynamic price curves, configure slopes, and let keepers settle your orders at optimal rates on any supported EVM chain.
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
            <Link href="/dashboard" className="button-primary w-full sm:w-auto">
              Launch Platform
            </Link>
            <Link href="/docs" className="button-secondary w-full sm:w-auto">
              Read Documentation
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
