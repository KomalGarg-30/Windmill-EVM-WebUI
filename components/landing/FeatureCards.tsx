'use client';

import { motion } from 'framer-motion';

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const features: Feature[] = [
  {
    title: 'Dynamic Pricing Curves',
    description:
      'Configurable bonding curves ensure optimal liquidity depth and minimal slippage across all token pairs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M4 15s1-8 4-8 5 12 8 12 4-6 4-6"
        />
      </svg>
    ),
  },
  {
    title: 'Autonomous Keepers',
    description:
      'Decentralized network of keepers automatically match crossed orders and execute limit positions.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M12 4a3 3 0 100 6 3 3 0 000-6zM4 15a3 3 0 100 6 3 3 0 000-6zM20 15a3 3 0 100 6 3 3 0 000-6z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M8.5 8.5l4 4.5M15.5 8.5l-4 4.5M7 18h10"
        />
      </svg>
    ),
  },
  {
    title: 'Gas-Optimized',
    description:
      'Smart contracts engineered for extreme gas efficiency during high-volume trading.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: 'Institutional Liquidity',
    description:
      'Enterprise-grade APIs and deep liquidity pools designed for algorithmic trading firms.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-16 0H3m5-10h4m-4 4h4"
        />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function FeatureCards() {
  return (
    <section
      id="feature-cards"
      className="relative bg-white section-padding overflow-hidden"
    >
      {/* Subtle ambient background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] rounded-full opacity-[0.03] blur-3xl pointer-events-none bg-gradient-to-br from-neutral-400 to-neutral-600" />

      <div className="mx-auto max-w-5xl px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
            Core Capabilities
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight leading-tight">
            Built for Performance, Designed for Scale
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, idx) => {
            /* Items 0 and 3 (1st and 4th) span 2 columns on desktop */
            const isWide = idx === 0 || idx === 3;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`
                  group relative rounded-2xl p-7 sm:p-8
                  bg-white/70 backdrop-blur-md
                  border border-black/[0.06]
                  shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:border-black/[0.12]
                  hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]
                  hover:-translate-y-1
                  ${isWide ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                {/* Subtle inner gradient highlight on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-neutral-50/80 via-transparent to-transparent" />

                <div className="relative flex flex-col gap-4">
                  {/* Icon container */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-50 border border-neutral-200/80 shadow-sm text-black transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                    {feature.icon}
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold text-black tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
