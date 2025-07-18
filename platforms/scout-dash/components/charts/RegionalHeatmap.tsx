interface RegionalHeatmapProps {
  data: any[]
  metric: string
}

export function RegionalHeatmap({ data, metric }: RegionalHeatmapProps) {
  // Simple heatmap visualization
  const maxValue = Math.max(...data.map(d => d[metric] || 0))
  
  return (
    <div className="grid grid-cols-2 gap-2">
      {data.map((region) => {
        const intensity = (region[metric] || 0) / maxValue
        const bgColor = `rgba(59, 130, 246, ${intensity})`
        
        return (
          <div
            key={region.name}
            className="p-3 rounded text-center"
            style={{ backgroundColor: bgColor }}
          >
            <div className="font-semibold text-sm">{region.name}</div>
            <div className="text-xs mt-1">
              ₱{((region[metric] || 0) / 1000).toFixed(1)}k
            </div>
          </div>
        )
      })}
    </div>
  )
}