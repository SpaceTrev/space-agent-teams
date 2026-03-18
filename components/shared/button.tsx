'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

export type ButtonVariant = 'default' | 'primary' | 'destructive' | 'ghost' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    'bg-obsidian-800 text-slate-200 hover:bg-obsidian-700 border border-obsidian-700 hover:border-obsidian-600',
  primary:
    'bg-champagne-500 text-obsidian-900 hover:bg-champagne-400 border border-transparent shadow-[0_0_15px_rgba(230,194,128,0.2)] hover:shadow-[0_0_20px_rgba(230,194,128,0.3)]',
  destructive:
    'bg-red-900/40 text-red-400 hover:bg-red-900/60 border border-red-900/50 hover:border-red-500/50',
  ghost:
    'bg-transparent text-slate-400 hover:bg-obsidian-800 hover:text-white border border-transparent',
  outline:
    'bg-transparent text-slate-300 hover:bg-obsidian-800 border border-obsidian-700 hover:border-obsidian-600',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
  md: 'px-4 py-2 text-sm font-semibold rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-champagne-500/50 focus:ring-offset-2 focus:ring-offset-obsidian-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
