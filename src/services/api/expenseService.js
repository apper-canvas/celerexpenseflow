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
  },

  async importFromCSV(csvData, columnMapping) {
    await delay(500)
    
    // Validate column mapping
    const requiredFields = ['date', 'amount', 'description']
    for (const field of requiredFields) {
      if (!columnMapping[field]) {
        throw new Error(`Missing mapping for required field: ${field}`)
      }
    }

    const importedExpenses = []
    const errors = []

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i]
      try {
        // Extract data based on column mapping
        const dateValue = row[columnMapping.date]
        const amountValue = row[columnMapping.amount]
        const descriptionValue = row[columnMapping.description]
        const categoryValue = columnMapping.category ? row[columnMapping.category] : 'Other'

        // Validate required fields
        if (!dateValue || !amountValue || !descriptionValue) {
          errors.push(`Row ${i + 1}: Missing required data`)
          continue
        }

        // Parse and validate amount
        const amount = parseFloat(amountValue.toString().replace(/[^0-9.-]/g, ''))
        if (isNaN(amount) || amount <= 0) {
          errors.push(`Row ${i + 1}: Invalid amount value`)
          continue
        }

        // Parse and validate date
        const date = new Date(dateValue)
        if (isNaN(date.getTime())) {
          errors.push(`Row ${i + 1}: Invalid date format`)
          continue
        }

        // Create expense object
        const expense = {
          Id: expenses.length > 0 ? Math.max(...expenses.map(e => e.Id)) + 1 : 1,
          description: descriptionValue.toString().trim(),
          amount: amount,
          category: categoryValue.toString().trim() || 'Other',
          date: date.toISOString(),
          createdAt: new Date().toISOString()
        }

        expenses.push(expense)
        importedExpenses.push({ ...expense })

      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`)
      }
    }

    return {
      imported: importedExpenses,
      errors: errors,
      totalRows: csvData.length,
      successCount: importedExpenses.length,
      errorCount: errors.length
    }
  }
}

export default expenseService