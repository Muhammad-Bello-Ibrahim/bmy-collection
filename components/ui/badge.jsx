import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono tracking-wider uppercase font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-brass',
  {
    variants: {
      variant: {
        default: 'bg-ivory text-black border-transparent shadow',
        brass: 'bg-brass text-black font-bold',
        outline: 'border border-ivory/20 text-ivory/80',
        secondary: 'bg-white/10 text-ivory/90 border border-white/10',
        inStock: 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30',
        lowStock: 'bg-amber-950/80 text-amber-300 border border-amber-500/30',
        outOfStock: 'bg-red-950/80 text-red-300 border border-red-500/30',
        poa: 'bg-brass/15 text-brass border border-brass/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
