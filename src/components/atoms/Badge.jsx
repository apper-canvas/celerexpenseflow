import ApperIcon from '@/components/ApperIcon'

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = "inline-flex items-center gap-1 font-medium rounded-full"
  
  const variants = {
    default: "bg-surface-100 text-surface-700",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info"
  }
  
  const sizes = {
    small: "px-2 py-1 text-xs",
    medium: "px-3 py-1.5 text-sm",
    large: "px-4 py-2 text-base"
  }

  const iconSizes = {
    small: "w-3 h-3",
    medium: "w-4 h-4",
    large: "w-5 h-5"
  }

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className={iconSizes[size]} />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className={iconSizes[size]} />
      )}
    </span>
  )
}

export default Badge