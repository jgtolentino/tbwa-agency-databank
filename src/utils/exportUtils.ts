import { saveAs } from 'file-saver'
import html2canvas from 'html2canvas'

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n'
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      // Escape values containing commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return '"' + value.replace(/"/g, '""') + '"'
      }
      return value
    })
    csvContent += values.join(',') + '\n'
  })

  // Create blob and save
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, filename + '_' + new Date().toISOString().split('T')[0] + '.csv')
}

export const exportToPNG = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId)
  if (!element) {
    console.warn('Element not found for export')
    return
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
    })
    
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, filename + '_' + new Date().toISOString().split('T')[0] + '.png')
      }
    })
  } catch (error) {
    console.error('Error exporting to PNG:', error)
  }
}

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toFixed(0)
}

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export const formatPercent = (num: number): string => {
  return (num * 100).toFixed(1) + '%'
}
