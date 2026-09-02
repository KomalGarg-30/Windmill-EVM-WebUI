'use client';

import { STATS } from '@/utils/constants';
import { useScrollRevealChildren } from '@/hooks/useScrollReveal';

export default function StatsSection() {
  const containerRef = useScrollRevealChildren<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      id="stats"
      ref={containerRef}
      className="bg-white dark:bg-[#0a0a0a] text-foreground section-padding border-t border-black/5 dark:border-white/10 transition-colors duration-300"
    >
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.filter((stat) => !stat.illustrative).map((stat, idx) => (
            <div
              key={stat.label}
              data-reveal
              style={{ transitionDelay: `${idx * 100}ms` }}
              className="reveal-fade-up flex flex-col gap-2 p-6 bg-neutral-50/30 dark:bg-neutral-900/50 border border-black/5 dark:border-white/10 rounded-2xl shadow-xs text-center lg:text-left transition-all duration-300 hover:-translate-y-1 hover:border-black/10 dark:hover:border-white/20"
            >
              <span className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white font-sans tracking-tight">
                {stat.value}
              </span>
              <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
