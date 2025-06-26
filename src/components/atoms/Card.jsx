import { motion } from 'framer-motion'

const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'medium',
  shadow = 'small',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  }

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg'
  }

  const baseClasses = `bg-white rounded-lg border border-surface-200 ${shadowClasses[shadow]} ${paddingClasses[padding]} ${className}`

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        transition={{ duration: 0.2 }}
        className={baseClasses}
        {...props}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}

export default Card