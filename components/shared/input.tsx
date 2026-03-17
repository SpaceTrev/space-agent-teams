import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'block w-full rounded-lg border bg-gray-900 text-sm text-white placeholder-gray-500',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-600 hover:border-gray-500',
              leftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              'py-2',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-500 text-sm">{rightIcon}</span>
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'block w-full rounded-lg border bg-gray-900 text-sm text-white placeholder-gray-500',
            'transition-colors duration-150 resize-y min-h-[80px]',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'px-3 py-2',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 hover:border-gray-500',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: { value: string; label: string; disabled?: boolean }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'block w-full rounded-lg border bg-gray-900 text-sm text-white',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'px-3 py-2',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-600 hover:border-gray-500',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
