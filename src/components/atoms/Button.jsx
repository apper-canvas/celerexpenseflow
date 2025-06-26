import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm",
    secondary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-sm",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-sm",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-surface-700 hover:bg-surface-100 focus:ring-surface-300",
    danger: "bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg"
  }
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : ""

  const buttonContent = (
    <>
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className="w-4 h-4" />
      )}
    </>
  )

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      {...props}
    >
      {buttonContent}
    </motion.button>
  )
}

export default Button