import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import expenseService from '@/services/api/expenseService'
import categoryService from '@/services/api/categoryService'

const ExpenseListItem = ({ expense, onUpdate, onDelete }) => {
  const [showActions, setShowActions] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [categoryColor, setCategoryColor] = useState('#6B7280')

  // Load category color
  useState(() => {
    const loadCategoryColor = async () => {
      try {
        const categories = await categoryService.getAll()
        const category = categories.find(cat => cat.name === expense.category)
        if (category) {
          setCategoryColor(category.color)
        }
      } catch (error) {
        console.error('Failed to load category color:', error)
      }
    }
    loadCategoryColor()
  }, [expense.category])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    setDeleting(true)
    try {
      await expenseService.delete(expense.Id)
      toast.success('Expense deleted successfully!')
      onDelete?.(expense.Id)
    } catch (error) {
      toast.error('Failed to delete expense')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white border border-surface-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Category Indicator & Content */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div
            className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
            style={{ backgroundColor: categoryColor }}
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="default" size="small">
                {expense.category}
              </Badge>
              <span className="text-xs text-surface-500">
                {format(new Date(expense.date), 'MMM dd, yyyy')}
              </span>
            </div>
            
            <h4 className="font-medium text-surface-900 truncate mb-1">
              {expense.description}
            </h4>
            
            <p className="text-lg font-bold text-surface-900">
              ${expense.amount.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 flex-shrink-0"
            >
              <Button
                variant="ghost"
                size="small"
                icon="Edit2"
                onClick={() => onUpdate?.(expense)}
                className="text-surface-600 hover:text-primary"
              />
              <Button
                variant="ghost"
                size="small"
                icon="Trash2"
                onClick={handleDelete}
                loading={deleting}
                className="text-surface-600 hover:text-error"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ExpenseListItem