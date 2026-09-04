'use client';

import { motion } from 'framer-motion';

const HOMEPAGE_FEATURES = [
  {
    title: 'Dynamic Pricing Curves',
    description: 'Configurable bonding curves ensure optimal liquidity depth and minimal slippage across all token pairs.',
    icon: 'curve',
  },
  {
    title: 'Autonomous Keepers',
    description: 'Decentralized network of keepers automatically match crossed orders and execute limit positions.',
    icon: 'network',
  },
  {
    title: 'Gas-Optimized',
    description: 'Smart contracts engineered for extreme gas efficiency during high-volume trading.',
    icon: 'fee',
  },
  {
    title: 'Seamless Web3 Integration',
    description: 'Connect your favorite EVM-compatible wallets to easily and securely interact with the protocol.',
    icon: 'chain',
  },
] as const;

function renderIcon(icon: string) {
  return <span className="font-mono text-2xl text-accent" aria-hidden="true">{icon === 'curve' ? '∿' : icon === 'network' ? '⌘' : icon === 'chain' ? '↗' : '◈'}</span>;
}

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
      id="features"
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
          {HOMEPAGE_FEATURES.map((feature, idx) => {
            /* Items 0 and 3 (1st and 4th) span 2 columns on desktop */
            const isWide = idx === 0 || idx === 3;

            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`
                  group relative rounded-2xl p-7 sm:p-8
                  cyber-card bg-panel/80 backdrop-blur-md
                  border border-accent/20
                  shadow-[0_1px_3px_rgba(0,0,0,0.4)]
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                  hover:border-accent hover:shadow-[0_0_28px_var(--accent-glow)]
                  hover:-translate-y-1
                  ${isWide ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                {/* Subtle inner gradient highlight on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-accent/10 via-transparent to-transparent" />

                <div className="relative flex flex-col gap-4">
                  {/* Icon container */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-accent/30 bg-accent/10 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
                    {renderIcon(feature.icon)}
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-mono text-base font-bold tracking-tight text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
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
