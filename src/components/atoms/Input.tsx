import * as React from 'react'
import { cn } from '../../utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'shadow-xl p-1 border-2 border-primary bg-secondary bg-opacity-80 ring-primary px-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-80 hover:ring-1 hover:ring-primary hover:ring-opacity-25 duration-200 placeholder:text-primary placeholder:text-opacity-75',
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
