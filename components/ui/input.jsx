import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-11 w-full rounded-lg border border-ivory/15 bg-white/[0.04] px-4 py-2 text-sm text-ivory placeholder:text-ivory/30 focus:border-brass focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-brass disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
