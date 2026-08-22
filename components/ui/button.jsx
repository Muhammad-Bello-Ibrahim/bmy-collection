import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass disabled:pointer-events-none disabled:opacity-40 select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-ivory text-black border border-ivory hover:bg-brass hover:border-brass hover:text-black font-semibold shadow-sm',
        brass:
          'bg-brass text-black border border-brass hover:bg-brass-light hover:border-brass-light font-semibold',
        outline:
          'border border-ivory/20 text-ivory bg-transparent hover:border-brass hover:text-brass hover:bg-brass/5',
        secondary:
          'bg-white/10 text-ivory border border-white/10 hover:bg-white/15 hover:border-white/20',
        ghost:
          'text-ivory/70 hover:text-brass hover:bg-brass/10 border border-transparent',
        destructive:
          'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50',
        link: 'text-ivory underline-offset-4 hover:underline hover:text-brass',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-[10px]',
        lg: 'h-13 px-8 text-sm',
        icon: 'h-10 w-10 p-0 rounded-full border border-ivory/20',
        iconSm: 'h-8 w-8 p-0 rounded-full border border-ivory/15',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

export { Button, buttonVariants };
