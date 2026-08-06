import React, { forwardRef } from 'react'
import { Input, InputProps } from './Input'
import { cn } from '@lib/utils'

export interface TextFieldProps extends InputProps {
  label?: string
  helperText?: string
  errorMessage?: string
  required?: boolean
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, helperText, errorMessage, required, id, className, wrapperClassName, ...inputProps }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', wrapperClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-1">
            {label}
            {required && <span className="text-brand-orange font-bold">*</span>}
          </label>
        )}

        <Input
          ref={ref}
          id={inputId}
          error={!!errorMessage}
          className={className}
          {...inputProps}
        />

        {errorMessage ? (
          <p className="text-xs font-medium text-red-400 mt-0.5 animate-fadeIn">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

TextField.displayName = 'TextField'
