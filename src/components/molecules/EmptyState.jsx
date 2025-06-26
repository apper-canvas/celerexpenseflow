import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'

const EmptyState = ({ 
  title = 'No data found',
  description = 'Get started by adding your first item',
  actionLabel = 'Add Item',
  onAction,
  icon = 'Package',
  className = ''
}) => {
  return (
    <Card className={`text-center py-12 ${className}`}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md mx-auto"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <ApperIcon name={icon} className="w-8 h-8 text-surface-400" />
        </motion.div>
        
        <h3 className="text-lg font-semibold text-surface-900 mb-2">
          {title}
        </h3>
        
        <p className="text-surface-600 mb-6">
          {description}
        </p>
        
        {onAction && actionLabel && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              onClick={onAction}
              icon="Plus"
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Card>
  )
}

export default EmptyState