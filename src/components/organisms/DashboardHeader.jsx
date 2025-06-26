import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import StatCard from '@/components/molecules/StatCard'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import expenseService from '@/services/api/expenseService'

const DashboardHeader = ({ refreshTrigger }) => {
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadComparison()
  }, [refreshTrigger])

  const loadComparison = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await expenseService.getCurrentMonthComparison()
      setComparison(data)
    } catch (err) {
      setError(err.message || 'Failed to load month comparison')
    } finally {
      setLoading(false)
    }
  }

  const currentMonth = format(new Date(), 'MMMM yyyy')

  if (loading) {
    return (
      <div className="mb-8">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-surface-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonLoader variant="card" count={3} />
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadComparison} />
  }

  if (!comparison) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-surface-900 font-display">
          ExpenseFlow Dashboard
        </h1>
        <p className="text-surface-600 mt-2">
          Track your spending patterns and financial trends for {currentMonth}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="This Month Total"
          value={comparison.currentMonth.total}
          change={Math.abs(comparison.percentageChange)}
          trend={comparison.trend}
          icon="DollarSign"
          color="primary"
        />
        
        <StatCard
          title="Expenses This Month"
          value={comparison.currentMonth.expenses}
          icon="Receipt"
          color="secondary"
        />
        
        <StatCard
          title="Last Month Total"
          value={comparison.lastMonth.total}
          icon="Calendar"
          color="accent"
        />
      </div>
    </motion.div>
  )
}

export default DashboardHeader