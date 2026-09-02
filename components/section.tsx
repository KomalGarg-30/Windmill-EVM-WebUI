import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  as?: 'section' | 'div' | 'article';
}

export function Section({
  children,
  className,
  containerClassName,
  id,
  as: Component = 'section',
  ...props
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn(
        'w-full px-6 py-16 md:px-8 md:py-24 bg-background text-foreground transition-colors duration-300',
        className
      )}
      {...props}
    >
      <div className={cn('mx-auto w-full max-w-6xl', containerClassName)}>{children}</div>
    </Component>
  );
}

export default Section;
