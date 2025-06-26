import mockData from '@/services/mockData/expenses.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let expenses = [...mockData]

const expenseService = {
  async getAll() {
    await delay(300)
    return [...expenses]
  },

  async getById(id) {
    await delay(200)
    const expense = expenses.find(item => item.Id === parseInt(id, 10))
    if (!expense) {
      throw new Error('Expense not found')
    }
    return { ...expense }
  },

  async create(expense) {
    await delay(400)
    const newExpense = {
      ...expense,
      Id: expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) + 1 : 1,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    expenses.push(newExpense)
    return { ...newExpense }
  },

  async update(id, data) {
    await delay(350)
    const index = expenses.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...data,
      Id: expenses[index].Id // Prevent Id modification
    }
    expenses[index] = updatedExpense
    return { ...updatedExpense }
  },

  async delete(id) {
    await delay(250)
    const index = expenses.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Expense not found')
    }
    
    const deletedExpense = { ...expenses[index] }
    expenses.splice(index, 1)
    return deletedExpense
  },

  async getMonthlyTotals(year) {
    await delay(200)
    const yearExpenses = expenses.filter(expense => 
      new Date(expense.date).getFullYear() === year
    )
    
    const monthlyData = {}
    for (let month = 0; month < 12; month++) {
      const monthExpenses = yearExpenses.filter(expense => 
        new Date(expense.date).getMonth() === month
      )
      
      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      const categoryBreakdown = monthExpenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount
        return acc
      }, {})
      
      monthlyData[month] = {
        month: month,
        year: year,
        total: total,
        categoryBreakdown: categoryBreakdown
      }
    }
    
    return monthlyData
  },

  async getCurrentMonthComparison() {
    await delay(250)
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear
    })
    
    const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const lastTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    
    const percentageChange = lastTotal === 0 ? 100 : ((currentTotal - lastTotal) / lastTotal) * 100
    
    return {
      currentMonth: {
        total: currentTotal,
        expenses: currentMonthExpenses.length
      },
      lastMonth: {
        total: lastTotal,
        expenses: lastMonthExpenses.length
      },
      percentageChange: Math.round(percentageChange * 100) / 100,
      trend: percentageChange > 0 ? 'up' : percentageChange < 0 ? 'down' : 'same'
    }
  }
}

export default expenseService