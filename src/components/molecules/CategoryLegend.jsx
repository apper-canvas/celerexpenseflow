import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import categoryService from '@/services/api/categoryService'

const CategoryLegend = ({ className = '' }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error('Failed to load categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Categories</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 bg-surface-200 rounded-full"></div>
              <div className="h-4 bg-surface-200 rounded flex-1"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Categories</h3>
      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.Id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color }}
            />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <ApperIcon 
                name={category.icon} 
                className="w-4 h-4 text-surface-600 flex-shrink-0" 
              />
              <span className="text-sm font-medium text-surface-700 truncate">
                {category.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default CategoryLegend