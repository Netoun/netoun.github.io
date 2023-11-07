import * as React from 'react'
import { cn } from '../../utils'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <button
        type={type}
        className={cn(
          'bg-primary text-secondary shadow-xl p-2 aspect-square rounded-xl hover:ring-1 hover:bg-opacity-90 hover:ring-primary hover:ring-opacity-25 duration-200 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-opacity-80',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
