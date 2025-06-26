import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import expenseService from '@/services/api/expenseService'
import categoryService from '@/services/api/categoryService'

const MonthlyChart = ({ className = '' }) => {
  const [chartData, setChartData] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const currentYear = new Date().getFullYear()
      const [monthlyTotals, categoriesData] = await Promise.all([
        expenseService.getMonthlyTotals(currentYear),
        categoryService.getAll()
      ])
      
      setCategories(categoriesData)
      processChartData(monthlyTotals, categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load chart data')
    } finally {
      setLoading(false)
    }
  }

  const processChartData = (monthlyTotals, categoriesData) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    // Create series for each category
    const series = categoriesData.map(category => {
      const data = monthNames.map((_, monthIndex) => {
        const monthData = monthlyTotals[monthIndex]
        return monthData?.categoryBreakdown?.[category.name] || 0
      })

      return {
        name: category.name,
        data: data,
        color: category.color
      }
    })

    const options = {
      chart: {
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          borderRadius: 4,
          borderRadiusApplication: 'end',
          borderRadiusWhenStacked: 'last'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: monthNames,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter, ui-sans-serif, system-ui'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6B7280',
            fontSize: '12px',
            fontFamily: 'Inter, ui-sans-serif, system-ui'
          },
          formatter: function (val) {
            return '$' + val.toFixed(0)
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (val) {
            return '$' + val.toFixed(2)
          }
        },
        style: {
          fontSize: '12px',
          fontFamily: 'Inter, ui-sans-serif, system-ui'
        }
      },
      legend: {
        show: false
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false
          }
        }
      }
    }

    setChartData({ series, options })
  }

  if (loading) {
    return (
      <div className={className}>
        <SkeletonLoader variant="chart" />
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState 
          message={error}
          onRetry={loadData}
          title="Chart Error"
        />
      </div>
    )
  }

  if (!chartData) {
    return null
  }

  return (
    <Card className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-surface-900">
            Monthly Expenses by Category
          </h3>
          <p className="text-surface-600 text-sm mt-1">
            Stacked view of spending across categories this year
          </p>
        </div>

        <div className="h-80">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height="100%"
          />
        </div>
      </motion.div>
    </Card>
  )
}

export default MonthlyChart