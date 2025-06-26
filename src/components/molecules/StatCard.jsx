import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatCard = ({
  title,
  value,
  change,
  trend,
  icon,
  color = 'primary',
  isLoading = false
}) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    error: 'text-error bg-error/10'
  }

  const trendColors = {
    up: 'text-error',
    down: 'text-success',
    same: 'text-surface-500'
  }

  const trendIcons = {
    up: 'TrendingUp',
    down: 'TrendingDown',
    same: 'Minus'
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-surface-200 rounded w-20 mb-3"></div>
            <div className="h-8 bg-surface-200 rounded w-24 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-16"></div>
          </div>
          <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-600 mb-1">{title}</p>
          <motion.p 
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-surface-900 mb-2"
          >
            {typeof value === 'number' ? `$${value.toFixed(2)}` : value}
          </motion.p>
          
          {change !== undefined && trend && (
            <div className={`flex items-center gap-1 ${trendColors[trend]}`}>
              <ApperIcon name={trendIcons[trend]} className="w-4 h-4" />
              <span className="text-sm font-medium">
                {Math.abs(change)}% from last month
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]}`}>
            <ApperIcon name={icon} className="w-6 h-6" />
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatCard