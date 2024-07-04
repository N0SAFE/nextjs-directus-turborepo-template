import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'ui-flex ui-h-10 ui-w-full ui-rounded-md ui-border ui-border-input ui-bg-background ui-px-3 ui-py-2 ui-text-sm ui-ring-offset-background file:ui-border-0 file:ui-bg-transparent file:ui-text-sm file:ui-font-medium placeholder:ui-text-muted-foreground focus-visible:ui-outline-none focus-visible:ui-ring-2 focus-visible:ui-ring-ring focus-visible:ui-ring-offset-2 disabled:ui-cursor-not-allowed disabled:ui-opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

export { Input }
