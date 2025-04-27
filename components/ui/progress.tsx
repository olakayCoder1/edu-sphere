// 'use client';

// import * as React from 'react';
// import * as ProgressPrimitive from '@radix-ui/react-progress';

// import { cn } from '@/lib/utils';

// const Progress = React.forwardRef<
//   React.ElementRef<typeof ProgressPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
// >(({ className, value, ...props }, ref) => (
//   <ProgressPrimitive.Root
//     ref={ref}
//     className={cn(
//       'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
//       className
//     )}
//     {...props}
//   >
//     <ProgressPrimitive.Indicator
//       className="h-full w-full flex-1 bg-primary transition-all"
//       style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
//     />
//   </ProgressPrimitive.Root>
// ));
// Progress.displayName = ProgressPrimitive.Root.displayName;

// export { Progress };

// @ts-nocheck

'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  // Handle the `value` inside the component to ensure it's a valid number
  const normalizedValue = React.useMemo(() => {
    // Ensure value is a number, if it's not a number fallback to 0
    const numericValue = Number(value);
    
    // Handle cases where the value is NaN or out of bounds
    if (isNaN(numericValue)) {
      return 0; // Default to 0 if it's not a valid number
    }
    
    // Ensure the value is between 0 and 100
    return Math.min(Math.max(numericValue, 0), 100);
  }, [value]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary', // Default styling
        className // Additional classes from props
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - normalizedValue}%)` }} // Update the indicator based on the value
      />
    </ProgressPrimitive.Root>
  );
});

// Add a display name for better debugging
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
