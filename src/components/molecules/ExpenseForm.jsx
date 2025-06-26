import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Textarea from '@/components/atoms/Textarea'
import Card from '@/components/atoms/Card'
import categoryService from '@/services/api/categoryService'
import expenseService from '@/services/api/expenseService'

const ExpenseForm = ({ onSuccess, expense = null, onCancel }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: ''
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadCategories()
    if (expense) {
      setFormData({
        category: expense.category || '',
        amount: expense.amount?.toString() || '',
        description: expense.description || ''
      })
    }
  }, [expense])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      const expenseData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        description: formData.description
      }

      if (expense) {
        await expenseService.update(expense.Id, expenseData)
        toast.success('Expense updated successfully!')
      } else {
        await expenseService.create(expenseData)
        toast.success('Expense added successfully!')
      }

      // Reset form if creating new expense
      if (!expense) {
        setFormData({
          category: '',
          amount: '',
          description: ''
        })
      }

      onSuccess?.()
    } catch (error) {
      toast.error(expense ? 'Failed to update expense' : 'Failed to add expense')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const categoryOptions = categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }))

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-surface-900">
          {expense ? 'Edit Expense' : 'Add New Expense'}
        </h2>
        <p className="text-surface-600 mt-1">
          {expense ? 'Update expense details below' : 'Track your spending by adding expense details'}
        </p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <Select
          label="Category"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
          options={categoryOptions}
          error={errors.category}
          required
          disabled={loading}
        />

        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          error={errors.amount}
          icon="DollarSign"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
          rows={3}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            disabled={loading}
            className="flex-1"
            icon={expense ? "Save" : "Plus"}
          >
            {expense ? 'Update Expense' : 'Add Expense'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </motion.form>
    </Card>
  )
}

export default ExpenseForm