import { useState, forwardRef } from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  iconPosition = 'left',
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false)

  const handleFocus = (e) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setFocused(false)
    onBlur?.(e)
  }

  const hasValue = value && value.toString().length > 0
  const showFloatingLabel = focused || hasValue

  const inputClasses = `
    w-full px-4 py-3 text-base border-2 rounded-lg transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/20
    ${error 
      ? 'border-error focus:border-error' 
      : focused 
        ? 'border-primary' 
        : 'border-surface-300 hover:border-surface-400'
    }
    ${disabled ? 'bg-surface-100 cursor-not-allowed opacity-60' : 'bg-white'}
    ${icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''}
    ${label ? 'pt-6 pb-2' : ''}
  `

  return (
    <div className={`relative ${className}`}>
      {/* Floating Label */}
      {label && (
        <label
          className={`
            absolute left-4 pointer-events-none transition-all duration-200 text-surface-600
            ${showFloatingLabel 
              ? 'top-2 text-xs font-medium' 
              : 'top-1/2 -translate-y-1/2 text-base'
            }
            ${focused ? 'text-primary' : ''}
            ${error ? 'text-error' : ''}
          `}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={label ? '' : placeholder}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />

      {/* Icon */}
      {icon && (
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500
            ${iconPosition === 'left' ? 'left-4' : 'right-4'}
            ${focused ? 'text-primary' : ''}
            ${error ? 'text-error' : ''}
          `}
        >
          <ApperIcon name={icon} className="w-5 h-5" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-error flex items-center gap-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input