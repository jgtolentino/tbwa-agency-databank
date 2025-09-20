interface TopPerformersProps {
  data: any[]
  type: 'category' | 'brand' | 'product'
}

export function TopPerformers({ data, type }: TopPerformersProps) {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-4">No data available</div>
  }
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => {
        const maxRevenue = data[0]?.revenue || 1
        const percentage = (item.revenue / maxRevenue) * 100
        
        return (
          <div key={item.name || index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                {index + 1}. {item.name}
              </span>
              <span className="text-gray-600">
                ₱{(item.revenue / 1000).toFixed(1)}k
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {item.count} transactions
            </div>
          </div>
        )
      })}
    </div>
  )
}