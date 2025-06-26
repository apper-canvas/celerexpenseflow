const SkeletonLoader = ({ count = 1, variant = 'default' }) => {
  const variants = {
    default: (
      <div className="animate-pulse">
        <div className="h-4 bg-surface-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-surface-200 rounded w-1/2"></div>
      </div>
    ),
    card: (
      <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-4 bg-surface-200 rounded w-20 mb-3"></div>
            <div className="h-8 bg-surface-200 rounded w-24"></div>
          </div>
          <div className="w-12 h-12 bg-surface-200 rounded-full"></div>
        </div>
      </div>
    ),
    list: (
      <div className="bg-white border border-surface-200 rounded-lg p-4 shadow-sm animate-pulse">
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 bg-surface-200 rounded-full mt-2"></div>
          <div className="flex-1">
            <div className="h-4 bg-surface-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-surface-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    ),
    chart: (
      <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-surface-200 rounded w-1/3 mb-6"></div>
        <div className="h-64 bg-surface-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {variants[variant]}
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader