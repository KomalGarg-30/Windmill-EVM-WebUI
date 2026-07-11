'use client';

import { memo } from 'react';

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: 'default' | 'white';
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({}: GlowingEffectProps) => {
    return null;
  }
);

GlowingEffect.displayName = 'GlowingEffect';

export { GlowingEffect };
export type { GlowingEffectProps };
