import * as React from 'react';
import { cn } from '@/lib/utils';

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[90px] w-full rounded-lg border border-ivory/15 bg-white/[0.04] px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-brass focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-brass disabled:cursor-not-allowed disabled:opacity-50 transition-all font-sans resize-y',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
