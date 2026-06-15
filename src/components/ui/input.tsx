import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "../../lib/utils"

type InputWithIconProps = React.ComponentProps<"input"> & {
  icon?: React.ReactNode
  showTogglePassword?: boolean
}

function Input({
  className,
  type,
  icon: Icon = null,
  showTogglePassword = false,
  ...props
}: InputWithIconProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  const isPassword = type === "password" && showTogglePassword
  const inputType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <div className="relative w-full">
      {Icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {Icon}
        </span>
      )}

      <input
        type={inputType}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-white border-input flex h-11 w-full min-w-0 rounded-md border bg-transparent py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          Icon && "pl-10",
          isPassword && "pr-10",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      )}
    </div>
  )
}

export { Input }
