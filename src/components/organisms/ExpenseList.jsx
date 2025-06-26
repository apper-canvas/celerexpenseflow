import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ExpenseListItem from '@/components/molecules/ExpenseListItem'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import EmptyState from '@/components/molecules/EmptyState'
import expenseService from '@/services/api/expenseService'
import categoryService from '@/services/api/categoryService'

const ExpenseList = ({ onEditExpense, refreshTrigger }) => {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    loadData()
  }, [refreshTrigger])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [expensesData, categoriesData] = await Promise.all([
        expenseService.getAll(),
        categoryService.getAll()
      ])
      
      setExpenses(expensesData)
      setCategories(categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load expenses')
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExpense = (expenseId) => {
    setExpenses(prev => prev.filter(expense => expense.Id !== expenseId))
  }

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || expense.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date)
        case 'amount':
          return b.amount - a.amount
        case 'category':
          return a.category.localeCompare(b.category)
        default:
          return 0
      }
    })

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ]

  const sortOptions = [
    { value: 'date', label: 'Date (Newest First)' },
    { value: 'amount', label: 'Amount (Highest First)' },
    { value: 'category', label: 'Category (A-Z)' }
  ]

  if (loading) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Expenses</h3>
        <SkeletonLoader variant="list" count={5} />
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-surface-900 mb-4">Recent Expenses</h3>
        <ErrorState 
          message={error}
          onRetry={loadData}
        />
      </Card>
    )
  }

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-surface-900 mb-4">
          Recent Expenses
        </h3>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
          
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categoryOptions}
          />
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={sortOptions}
          />
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          description="Start tracking your spending by adding your first expense"
          actionLabel="Add Expense"
          icon="CreditCard"
        />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState
          title="No matching expenses"
          description="Try adjusting your search or filter criteria"
          icon="SearchX"
        />
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {filteredExpenses.map((expense, index) => (
              <motion.div
                key={expense.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <ExpenseListItem
                  expense={expense}
                  onUpdate={onEditExpense}
                  onDelete={handleDeleteExpense}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </Card>
  )
}

export default ExpenseList