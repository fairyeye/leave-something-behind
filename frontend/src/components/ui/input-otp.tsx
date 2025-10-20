import * as React from "react"
import { cn } from "../../lib/utils"

export interface InputOTPProps extends React.HTMLAttributes<HTMLDivElement> {
  maxLength?: number
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(({ className, ...props }, ref) => (
  <div ref={ref} data-slot="input-otp" className={cn("flex flex-col gap-2", className)} {...props} />
))
InputOTP.displayName = "InputOTP"

const InputOTPGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex", className)} {...props} />
  )
)
InputOTPGroup.displayName = "InputOTPGroup"

export interface InputOTPSlotProps extends React.InputHTMLAttributes<HTMLInputElement> {
  index: number
}

const InputOTPSlot = React.forwardRef<HTMLInputElement, InputOTPSlotProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    inputMode="numeric"
    maxLength={1}
    data-slot="input-otp-slot"
    className={cn(
      "h-9 w-9 rounded-md border border-gray-200 bg-transparent text-center text-sm shadow-sm dark:border-gray-800",
      className
    )}
    {...props}
  />
))
InputOTPSlot.displayName = "InputOTPSlot"

export { InputOTP, InputOTPGroup, InputOTPSlot }
