import { useState, useEffect } from 'react'

interface ScoutTransaction {
  transaction_id: string
  facialid: string
  storeid: string
  real_transaction_date: string
  real_hour: string
  real_day_of_week: string
  real_month: string
  real_year: string
  gender: string
  age: string
  age_group: string
  emotion: string
  transcript_audio: string
  date_ph: string
  ts_ph: string
  device: string
  store: string
  category: string
  brand: string
  product: string
  payment_method: string
  qty: string
  unit_price: string
  total_price: string
  brand_raw: string
  unit: string
  storename: string
  storelocationmaster: string
  storedeviceid: string
  storedevicename: string
  location: string
  time_ph: string
  day_of_week: string
  weekday_weekend: string
  time_of_day: string
  bought_with_other_brands: string
  edge_version: string
  sku: string
  agebracket: string
  interactionid: string
  productid: string
  transactiondate: string
  deviceid: string
  sex: string
  age__query_4_1: string
  emotionalstate: string
  transcriptiontext: string
  gender__query_4_1: string
  barangay: string
  storename__query_10: string
  location__query_10: string
  size: string
  geolatitude: string
  geolongitude: string
  storegeometry: string
  managername: string
  managercontactinfo: string
  devicename: string
  deviceid__query_10: string
  barangay__query_10: string
  link_id: string
  real_daypart: string
  real_day_type: string
}

interface UseScoutDataReturn {
  data: ScoutTransaction[] | null
  loading: boolean
  error: string | null
}

const CSV_URL = 'https://cxzllzyxwpyptfretryc.supabase.co/storage/v1/object/sign/scout-ingest/full_flat_enhanced.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9lZDdiZGI2YS05YzY1LTQxOTktYTJkNS01NzFmMWQ4NWIyZjciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJzY291dC1pbmdlc3QvZnVsbF9mbGF0X2VuaGFuY2VkLmNzdiIsImlhdCI6MTc1ODIzNDE5MCwiZXhwIjoxNzU4ODM4OTkwfQ.ILrxHUf3Lrud_IY_Fd6PXvks7dpqTGgPaRJa9LUXeS8'

function parseCSV(csvText: string): ScoutTransaction[] {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',')

  return lines.slice(1)
    .filter(line => line.trim()) // Remove empty lines
    .map(line => {
      const values = line.split(',')
      const row: any = {}

      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || ''
      })

      return row as ScoutTransaction
    })
}

export function useScoutData(): UseScoutDataReturn {
  const [data, setData] = useState<ScoutTransaction[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(CSV_URL)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const csvText = await response.text()
        const parsedData = parseCSV(csvText)

        if (isMounted) {
          setData(parsedData)
          setLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch data')
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [])

  return { data, loading, error }
}