import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CSVImportModal from "@/components/molecules/CSVImportModal";
import ApperIcon from "@/components/ApperIcon";
import ExpenseForm from "@/components/molecules/ExpenseForm";
import CategoryLegend from "@/components/molecules/CategoryLegend";
import YearlyChart from "@/components/organisms/YearlyChart";
import ExpenseList from "@/components/organisms/ExpenseList";
import MonthlyChart from "@/components/organisms/MonthlyChart";
import DashboardHeader from "@/components/organisms/DashboardHeader";
import Button from "@/components/atoms/Button";
const Dashboard = () => {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [showCSVImport, setShowCSVImport] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
const handleExpenseSuccess = () => {
    setShowExpenseForm(false)
    setEditingExpense(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleCSVImportSuccess = () => {
    setShowCSVImport(false)
    setRefreshTrigger(prev => prev + 1)
  }
  const handleEditExpense = (expense) => {
    setEditingExpense(expense)
    setShowExpenseForm(true)
  }

  const handleCancelForm = () => {
    setShowExpenseForm(false)
    setEditingExpense(null)
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard Header */}
        <DashboardHeader refreshTrigger={refreshTrigger} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <MonthlyChart />
              <YearlyChart />
            </div>

            {/* Expense List */}
            <ExpenseList 
              onEditExpense={handleEditExpense} 
              refreshTrigger={refreshTrigger}
            />
          </div>

          {/* Right Column - Form and Legend */}
          <div className="space-y-6">
            {/* Quick Add Button (Mobile) */}
            <div className="lg:hidden">
              <Button
                variant="primary"
                size="large"
                icon="Plus"
                onClick={() => setShowExpenseForm(true)}
                className="w-full"
              >
                Add Expense
</Button>
            </div>

            {/* CSV Import Button (Mobile) */}
            <div className="lg:hidden">
              <Button
                variant="secondary"
                size="large"
                icon="Upload"
                onClick={() => setShowCSVImport(true)}
                className="w-full"
              >
                Import CSV
              </Button>
            </div>

            {/* Expense Form */}
            <AnimatePresence mode="wait">
              {showExpenseForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ExpenseForm
                    expense={editingExpense}
                    onSuccess={handleExpenseSuccess}
                    onCancel={handleCancelForm}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="add-button"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="primary"
                      size="large"
                      icon="Plus"
                      onClick={() => setShowExpenseForm(true)}
className="w-full h-20 text-lg"
                    >
                      Add New Expense
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CSV Import Button (Desktop) */}
            <div className="hidden lg:block">
              <Button
                variant="secondary"
                size="large"
                icon="Upload"
                onClick={() => setShowCSVImport(true)}
                className="w-full"
              >
                Import from CSV
              </Button>
            </div>
            {/* Category Legend */}
            <CategoryLegend />
          </div>
        </div>

        {/* Floating Action Button (Mobile) */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowExpenseForm(!showExpenseForm)}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: showExpenseForm ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
<ApperIcon name="Plus" className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>

        {/* CSV Import Modal */}
        <CSVImportModal
          isOpen={showCSVImport}
          onClose={() => setShowCSVImport(false)}
          onSuccess={handleCSVImportSuccess}
        />
      </div>
    </div>
}

export default Dashboard