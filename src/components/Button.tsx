import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700",
  secondary:
    "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300",
  outline:
    "border border-gray-400 text-gray-800 bg-transparent hover:bg-gray-100",
  ghost: "text-gray-700 hover:bg-gray-100",
  danger:
    "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <div>
      <button
        className={clsx(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5 text-white" />
        ) : (
          <>
            {icon && <span className="mr-2 flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </button>
    </div>
  );
}
