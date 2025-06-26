import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry, 
  title = 'Oops!',
  className = '' 
}) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto"
      >
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
        </div>
        
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          {title}
        </h3>
        
        <p className="text-surface-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
          >
            Try Again
          </Button>
        )}
      </motion.div>
    </Card>
  )
}

export default ErrorState