import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import Card from '@/components/atoms/Card'
import SkeletonLoader from '@/components/molecules/SkeletonLoader'
import ErrorState from '@/components/molecules/ErrorState'
import expenseService from '@/services/api/expenseService'

const YearlyChart = ({ className = '' }) => {
  const [chartData, setChartData] = useState(null)
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
      const monthlyTotals = await expenseService.getMonthlyTotals(currentYear)
      processChartData(monthlyTotals)
    } catch (err) {
      setError(err.message || 'Failed to load yearly chart data')
    } finally {
      setLoading(false)
    }
  }

  const processChartData = (monthlyTotals) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    const data = monthNames.map((_, monthIndex) => {
      return monthlyTotals[monthIndex]?.total || 0
    })

    const series = [{
      name: 'Total Expenses',
      data: data,
      color: '#4F46E5'
    }]

    const options = {
      chart: {
        type: 'line',
        toolbar: {
          show: false
        },
        animations: {
          enabled: true,
          easing: 'easeout',
          speed: 800
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 6,
        strokeWidth: 2,
        strokeColors: '#ffffff',
        hover: {
          size: 8
        }
      },
      dataLabels: {
        enabled: false
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
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100]
        }
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
            Yearly Expense Trend
          </h3>
          <p className="text-surface-600 text-sm mt-1">
            Total monthly spending throughout the year
          </p>
        </div>

        <div className="h-80">
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="area"
            height="100%"
          />
        </div>
      </motion.div>
    </Card>
  )
}

export default YearlyChart