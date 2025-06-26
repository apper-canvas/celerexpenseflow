import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Papa from 'papaparse'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import expenseService from '@/services/api/expenseService'

const CSVImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [csvData, setCsvData] = useState([])
  const [csvHeaders, setCsvHeaders] = useState([])
  const [columnMapping, setColumnMapping] = useState({
    date: '',
    amount: '',
    description: '',
    category: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Upload, 2: Map, 3: Preview
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file')
          return
        }

        if (results.data.length === 0) {
          toast.error('CSV file is empty')
          return
        }

        setCsvHeaders(Object.keys(results.data[0]))
        setCsvData(results.data)
        setStep(2)
      },
      error: (error) => {
        toast.error('Failed to read CSV file')
        console.error('CSV parsing error:', error)
      }
    })
  }

  const handleColumnMappingChange = (field, column) => {
    setColumnMapping(prev => ({
      ...prev,
      [field]: column
    }))
  }

  const isValidMapping = () => {
    return columnMapping.date && columnMapping.amount && columnMapping.description
  }

  const handleImport = async () => {
    if (!isValidMapping()) {
      toast.error('Please map all required fields')
      return
    }

    setIsLoading(true)
    try {
      const result = await expenseService.importFromCSV(csvData, columnMapping)
      
      if (result.errors.length > 0) {
        toast.warning(`Import completed with ${result.errors.length} errors. ${result.successCount} expenses imported.`)
      } else {
        toast.success(`Successfully imported ${result.successCount} expenses`)
      }
      
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error('Failed to import expenses: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCsvData([])
    setCsvHeaders([])
    setColumnMapping({ date: '', amount: '', description: '', category: '' })
    setStep(1)
    onClose()
  }

  const columnOptions = [
    { value: '', label: 'Select column...' },
    ...csvHeaders.map(header => ({ value: header, label: header }))
  ]

  const previewData = csvData.slice(0, 5)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-surface-900">Import Expenses from CSV</h2>
            <Button
              variant="ghost"
              size="small"
              icon="X"
              onClick={handleClose}
              className="text-surface-500 hover:text-surface-700"
            />
          </div>

          {/* Step 1: File Upload */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="border-2 border-dashed border-surface-300 rounded-lg p-8 hover:border-primary transition-colors">
                  <ApperIcon name="Upload" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-surface-700 mb-2">Upload CSV File</p>
                  <p className="text-surface-500 mb-4">Select a CSV file with your expense data</p>
                  <Button
                    variant="primary"
                    icon="FileText"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="bg-surface-50 rounded-lg p-4">
                <h3 className="font-medium text-surface-800 mb-2">CSV Format Requirements:</h3>
                <ul className="text-sm text-surface-600 space-y-1">
                  <li>• Date column (MM/DD/YYYY, YYYY-MM-DD, or similar formats)</li>
                  <li>• Amount column (numeric values, currency symbols will be removed)</li>
                  <li>• Description column (text describing the expense)</li>
                  <li>• Category column (optional, will default to "Other")</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-primary">
                  <ApperIcon name="CheckCircle" className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">File uploaded</span>
                </div>
                <div className="flex-1 h-px bg-surface-200"></div>
                <div className="flex items-center text-surface-400">
                  <span className="text-sm font-medium">Map columns</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-surface-800 mb-4">Map CSV Columns to Expense Fields</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={columnMapping.date}
                        onChange={(value) => handleColumnMappingChange('date', value)}
                        options={columnOptions}
                        placeholder="Select date column"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={columnMapping.amount}
                        onChange={(value) => handleColumnMappingChange('amount', value)}
                        options={columnOptions}
                        placeholder="Select amount column"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={columnMapping.description}
                        onChange={(value) => handleColumnMappingChange('description', value)}
                        options={columnOptions}
                        placeholder="Select description column"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Category <span className="text-surface-500">(optional)</span>
                      </label>
                      <Select
                        value={columnMapping.category}
                        onChange={(value) => handleColumnMappingChange('category', value)}
                        options={columnOptions}
                        placeholder="Select category column"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-surface-800 mb-4">Preview Data</h3>
                  <div className="bg-surface-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="text-sm text-surface-600 mb-2">
                      Found {csvData.length} rows. Showing first 5:
                    </div>
                    {previewData.map((row, index) => (
                      <div key={index} className="border-b border-surface-200 py-2 last:border-b-0">
                        {Object.entries(row).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="font-medium text-surface-600">{key}:</span>
                            <span className="text-surface-800 ml-2 truncate">{value}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={handleImport}
                  disabled={!isValidMapping() || isLoading}
                  loading={isLoading}
                >
                  Import {csvData.length} Expenses
                </Button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

export default CSVImportModal