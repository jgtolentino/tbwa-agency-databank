import type { DataSource, DataCache } from '../types/crossTab'

export interface DatabaseConnection {
  query: (sql: string, params?: any[]) => Promise<any[]>
  isConnected: () => boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export interface AnalyticsData {
  transactions: TransactionRecord[]
  customers: CustomerRecord[]
  products: ProductRecord[]
  stores: StoreRecord[]
  timeframes: TimeframeData[]
}

export interface TransactionRecord {
  id: string
  store_id: string
  customer_id?: string
  timestamp: Date
  total_amount: number
  payment_method: string
  items: TransactionItem[]
  daypart: 'morning' | 'afternoon' | 'evening' | 'night'
}

export interface TransactionItem {
  product_id: string
  quantity: number
  unit_price: number
  category: string
  subcategory?: string
}

export interface CustomerRecord {
  id: string
  age_group: string
  gender?: string
  customer_type: 'regular' | 'occasional' | 'new'
  total_lifetime_value: number
  avg_basket_size: number
  preferred_payment: string
}

export interface ProductRecord {
  id: string
  name: string
  category: string
  subcategory: string
  brand: string
  pack_size: string
  price: number
  margin: number
}

export interface StoreRecord {
  id: string
  name: string
  location: string
  type: string
  performance_tier: 'Top' | 'Medium' | 'Low'
  revenue: number
  transactions: number
  avg_transaction_value: number
  revenue_share: number
  analyzed: boolean
}

export interface TimeframeData {
  hour: number
  daypart: string
  day_of_week: string
  week_of_month: number
  month: string
  quarter: string
  is_weekend: boolean
  is_holiday: boolean
}

export class DataIntegrationService {
  private dataSources: Map<string, DataSource>
  private cache: Map<string, DataCache>
  private connection: DatabaseConnection | null = null
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor() {
    this.dataSources = new Map()
    this.cache = new Map()
    this.initializeDataSources()
  }

  private initializeDataSources(): void {
    const sources: DataSource[] = [
      {
        name: 'scout_gold_transactions',
        type: 'transaction',
        endpoint: 'analytics.exec_readonly_sql',
        updateFrequency: 15, // 15 minutes
        lastUpdate: new Date(),
        status: 'active'
      },
      {
        name: 'scout_customer_segments',
        type: 'customer',
        endpoint: 'analytics.exec_readonly_sql',
        updateFrequency: 60, // 1 hour
        lastUpdate: new Date(),
        status: 'active'
      },
      {
        name: 'scout_product_catalog',
        type: 'inventory',
        endpoint: 'analytics.exec_readonly_sql',
        updateFrequency: 240, // 4 hours
        lastUpdate: new Date(),
        status: 'active'
      },
      {
        name: 'scout_store_performance',
        type: 'external',
        endpoint: 'analytics.exec_readonly_sql',
        updateFrequency: 30, // 30 minutes
        lastUpdate: new Date(),
        status: 'active'
      }
    ]

    sources.forEach(source => {
      this.dataSources.set(source.name, source)
    })
  }

  public async getTransactionData(filters?: {
    store_id?: string
    timeframe?: string
    category?: string
    payment_method?: string
  }): Promise<TransactionRecord[]> {
    const cacheKey = `transactions_${JSON.stringify(filters || {})}`
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached as TransactionRecord[]
    }

    try {
      // Mock data that matches the actual Scout data patterns
      const mockTransactions: TransactionRecord[] = [
        {
          id: 'txn_001',
          store_id: 'store_108',
          customer_id: 'cust_001',
          timestamp: new Date('2024-01-15T14:30:00'),
          total_amount: 847.50,
          payment_method: 'cash',
          daypart: 'afternoon',
          items: [
            {
              product_id: 'prod_snack_001',
              quantity: 2,
              unit_price: 45.00,
              category: 'Snacks',
              subcategory: 'Chips'
            },
            {
              product_id: 'prod_bev_001',
              quantity: 3,
              unit_price: 25.50,
              category: 'Beverages',
              subcategory: 'Soft Drinks'
            }
          ]
        },
        {
          id: 'txn_002',
          store_id: 'store_205',
          customer_id: 'cust_002',
          timestamp: new Date('2024-01-15T18:45:00'),
          total_amount: 1250.00,
          payment_method: 'credit_card',
          daypart: 'evening',
          items: [
            {
              product_id: 'prod_hhc_001',
              quantity: 1,
              unit_price: 350.00,
              category: 'Household Care',
              subcategory: 'Cleaning'
            },
            {
              product_id: 'prod_pc_001',
              quantity: 2,
              unit_price: 125.00,
              category: 'Personal Care',
              subcategory: 'Skincare'
            }
          ]
        }
      ]

      this.setCache(cacheKey, mockTransactions)
      return mockTransactions
    } catch (error) {
      console.error('Error fetching transaction data:', error)
      return []
    }
  }

  public async getCrossTabData(analysisType: string, parameters: any): Promise<any[]> {
    const cacheKey = `crosstab_${analysisType}_${JSON.stringify(parameters)}`
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached as any[]
    }

    try {
      // Return data based on analysis type
      const data = await this.generateCrossTabData(analysisType, parameters)
      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching cross-tab data:', error)
      return []
    }
  }

  public async getStorePerformanceData(): Promise<StoreRecord[]> {
    const cacheKey = 'store_performance'
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached as StoreRecord[]
    }

    try {
      const storeData: StoreRecord[] = [
        {
          id: 'store_108',
          name: 'Store 108 (Quezon Ave)',
          location: 'Quezon City',
          type: 'flagship',
          performance_tier: 'Top',
          revenue: 2847500,
          transactions: 15420,
          avg_transaction_value: 847.50,
          revenue_share: 44.6,
          analyzed: true
        },
        {
          id: 'store_205',
          name: 'Store 205 (SM North)',
          location: 'Quezon City',
          type: 'mall',
          performance_tier: 'Medium',
          revenue: 1650000,
          transactions: 8750,
          avg_transaction_value: 685.20,
          revenue_share: 25.8,
          analyzed: true
        },
        {
          id: 'store_312',
          name: 'Store 312 (Eastwood)',
          location: 'Quezon City',
          type: 'urban',
          performance_tier: 'Medium',
          revenue: 890000,
          transactions: 5200,
          avg_transaction_value: 612.40,
          revenue_share: 13.9,
          analyzed: false
        }
      ]

      this.setCache(cacheKey, storeData)
      return storeData
    } catch (error) {
      console.error('Error fetching store performance data:', error)
      return []
    }
  }

  public async getCustomerSegmentData(): Promise<CustomerRecord[]> {
    const cacheKey = 'customer_segments'
    const cached = this.getFromCache(cacheKey)

    if (cached) {
      return cached as CustomerRecord[]
    }

    try {
      const customerData: CustomerRecord[] = [
        {
          id: 'segment_millennials',
          age_group: '25-40',
          gender: 'mixed',
          customer_type: 'regular',
          total_lifetime_value: 12500,
          avg_basket_size: 4.2,
          preferred_payment: 'credit_card'
        },
        {
          id: 'segment_gen_x',
          age_group: '41-55',
          gender: 'mixed',
          customer_type: 'regular',
          total_lifetime_value: 18700,
          avg_basket_size: 5.8,
          preferred_payment: 'cash'
        },
        {
          id: 'segment_gen_z',
          age_group: '18-24',
          gender: 'mixed',
          customer_type: 'occasional',
          total_lifetime_value: 6800,
          avg_basket_size: 2.9,
          preferred_payment: 'digital'
        }
      ]

      this.setCache(cacheKey, customerData)
      return customerData
    } catch (error) {
      console.error('Error fetching customer segment data:', error)
      return []
    }
  }

  private async generateCrossTabData(analysisType: string, parameters: any): Promise<any[]> {
    // Generate mock data based on analysis type
    switch (analysisType) {
      case 'time_product_category':
        return [
          { time: 'Morning', category: 'Beverages', transactions: 425, revenue: 28900 },
          { time: 'Afternoon', category: 'Snacks', transactions: 719, revenue: 45200 },
          { time: 'Evening', category: 'Household Care', transactions: 392, revenue: 89500 },
          { time: 'Night', category: 'Snacks', transactions: 842, revenue: 52100 }
        ]

      case 'basket_payment_method':
        return [
          { payment: 'Cash', avg_basket: 4.2, avg_value: 847.50, frequency: '100%' },
          { payment: 'Credit Card', avg_basket: 5.8, avg_value: 1250.00, frequency: '0%' },
          { payment: 'Digital', avg_basket: 3.1, avg_value: 650.00, frequency: '0%' }
        ]

      case 'age_product_category':
        return [
          { age_group: '18-24', category: 'Snacks', preference: 85, spending: 2500 },
          { age_group: '25-40', category: 'Personal Care', preference: 78, spending: 4200 },
          { age_group: '41-55', category: 'Household Care', preference: 92, spending: 6800 },
          { age_group: '55+', category: 'Health', preference: 88, spending: 5400 }
        ]

      default:
        return [
          { category: 'General', value: 100, metric: 'baseline' }
        ]
    }
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp.getTime() > this.CACHE_TTL) {
      this.cache.delete(key)
      return null
    }

    cached.hitCount++
    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: new Date(),
      ttl: this.CACHE_TTL,
      hitCount: 0
    })
  }

  public getDataSourceStatus(): DataSource[] {
    return Array.from(this.dataSources.values())
  }

  public async refreshDataSource(sourceName: string): Promise<boolean> {
    const source = this.dataSources.get(sourceName)
    if (!source) return false

    try {
      source.lastUpdate = new Date()
      source.status = 'active'

      // Clear related cache entries
      for (const [key] of this.cache) {
        if (key.includes(sourceName)) {
          this.cache.delete(key)
        }
      }

      return true
    } catch (error) {
      source.status = 'error'
      return false
    }
  }

  public clearCache(): void {
    this.cache.clear()
  }
}

// Export singleton instance
export const dataIntegration = new DataIntegrationService()