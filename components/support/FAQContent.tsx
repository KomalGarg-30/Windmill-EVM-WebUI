'use client';

import React from 'react';

interface FAQContentProps {
  theme?: 'light' | 'dark';
}

export default function FAQContent({ theme }: FAQContentProps) {
  const isDark = theme === 'dark';

  return (
    <div className="flex flex-col gap-4">
      <h3 className={`text-lg font-bold text-black dark:text-white ${isDark ? 'text-white' : ''}`}>
        Frequently Asked Questions
      </h3>
      <div className="flex flex-col gap-4 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
        <div>
          <h4 className="font-semibold text-black dark:text-white">
            How are dynamic curves executed?
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Orders specify starting prices and linear slopes. Buyers decrease bids; sellers increase asks, driving convergence.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-black dark:text-white">
            Is there a transaction fee?
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            Yes. A flat 0.1% keeper fee is deducted on settlement and rewarded to the solver node to cover gas.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-black dark:text-white">
            Are contracts audited?
          </h4>
          <p className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            The protocol architecture has been mathematically verified, and code review is active within Stability Nexus.
          </p>
        </div>
      </div>
    </div>
  );
}
