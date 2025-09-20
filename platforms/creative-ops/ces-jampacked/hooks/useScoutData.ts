import { useState, useEffect } from 'react'
import { dataService } from '../services/dataService'

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

export function useScoutData(): UseScoutDataReturn {
  const [data, setData] = useState<ScoutTransaction[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Use dataService to fetch from Supabase
        const transactions = await dataService.fetchTx(10000)

        // Transform to expected format
        const transformedData: ScoutTransaction[] = transactions.map(tx => ({
          transaction_id: tx.transaction_id || '',
          facialid: tx.facialid || '',
          storeid: String(tx.storeid || ''),
          real_transaction_date: tx.transactiondate || '',
          real_hour: tx.time_ph?.split(':')[0] || '',
          real_day_of_week: tx.day_of_week || '',
          real_month: tx.date_ph?.split('-')[1] || '',
          real_year: tx.date_ph?.split('-')[0] || '',
          gender: tx.gender || '',
          age: String(tx.age || ''),
          age_group: tx.agebracket || '',
          emotion: tx.emotion || '',
          transcript_audio: tx.transcript_audio || '',
          date_ph: tx.date_ph || '',
          ts_ph: tx.ts_ph || '',
          device: tx.device || '',
          store: String(tx.store || ''),
          category: tx.category || '',
          brand: tx.brand || '',
          product: tx.product || '',
          payment_method: tx.payment_method || '',
          qty: String(tx.qty || ''),
          unit_price: String(tx.unit_price || ''),
          total_price: String(tx.total_price || ''),
          brand_raw: tx.brand_raw || '',
          unit: tx.unit || '',
          storename: tx.storename || '',
          storelocationmaster: tx.storelocationmaster || '',
          storedeviceid: tx.storedeviceid || '',
          storedevicename: tx.storedevicename || '',
          location: tx.location || '',
          time_ph: tx.time_ph || '',
          day_of_week: tx.day_of_week || '',
          weekday_weekend: tx.weekday_weekend || '',
          time_of_day: tx.time_of_day || '',
          bought_with_other_brands: tx.bought_with_other_brands || '',
          edge_version: tx.edge_version || '',
          sku: tx.sku || '',
          agebracket: tx.agebracket || '',
          interactionid: tx.interactionid || '',
          productid: tx.productid || '',
          transactiondate: tx.transactiondate || '',
          deviceid: tx.deviceid || '',
          sex: tx.sex || '',
          age__query_4_1: String(tx.age__query_4_1 || ''),
          emotionalstate: tx.emotionalstate || '',
          transcriptiontext: tx.transcriptiontext || '',
          gender__query_4_1: tx.gender__query_4_1 || '',
          barangay: tx.barangay || '',
          storename__query_10: tx.storename__query_10 || '',
          location__query_10: tx.location__query_10 || '',
          size: String(tx.size || ''),
          geolatitude: String(tx.geolatitude || ''),
          geolongitude: String(tx.geolongitude || ''),
          storegeometry: tx.storegeometry || '',
          managername: tx.managername || '',
          managercontactinfo: tx.managercontactinfo || '',
          devicename: tx.devicename || '',
          deviceid__query_10: tx.deviceid__query_10 || '',
          barangay__query_10: tx.barangay__query_10 || '',
          link_id: tx.transaction_id || '', // Use transaction_id as link_id
          real_daypart: tx.time_of_day || '',
          real_day_type: tx.weekday_weekend || ''
        }))

        setData(transformedData)
        console.log(`✅ Loaded ${transformedData.length} Scout transactions from Supabase`)

      } catch (err) {
        console.error('Failed to fetch Scout data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}