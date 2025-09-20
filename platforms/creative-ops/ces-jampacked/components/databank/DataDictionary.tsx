import React, { useState } from 'react'
import { Search, Database, FileText, Hash, Calendar, MapPin, Tag, ShoppingCart, User, BarChart3, Clock, Star, Shield, CreditCard, Users } from 'lucide-react'

interface FieldDefinition {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
  values?: string[]
  icon: React.ReactNode
}

const DataDictionary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fieldDefinitions: FieldDefinition[] = [
    {
      name: 'id',
      type: 'string required unique',
      required: true,
      description: 'Unique transaction identifier',
      example: 'TXN00012847',
      icon: <Hash className="w-4 h-4" />
    },
    {
      name: 'store_id',
      type: 'string required',
      required: true,
      description: 'Store unique identifier, matches to Stores master',
      example: 'STO00284',
      icon: <Database className="w-4 h-4" />
    },
    {
      name: 'timestamp',
      type: 'ISO 8601 string required',
      required: true,
      description: 'UTC datetime of transaction',
      example: '2024-06-15T14:32:18.000Z',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      name: 'time_of_day',
      type: 'string (enum) required',
      required: true,
      description: 'Period of day the transaction occurred (derived or raw)',
      values: ['morning', 'afternoon', 'evening', 'night'],
      icon: <Clock className="w-4 h-4" />
    },
    {
      name: 'location',
      type: 'object required',
      required: true,
      description: 'Full Philippine geographic hierarchy of the transaction. Should use real admin names, not codes.',
      example: 'barangay: "Brgy_23", city: "Quezon City", province: "Metro Manila", region: "NCR"',
      icon: <MapPin className="w-4 h-4" />
    },
    {
      name: 'product_category',
      type: 'string required',
      required: true,
      description: 'High-level category of purchased product',
      example: 'Snack, Tobacco',
      icon: <Tag className="w-4 h-4" />
    },
    {
      name: 'brand_name',
      type: 'string required',
      required: true,
      description: 'Brand of the purchased SKU',
      example: 'Oishi Prawn Crackers',
      icon: <Tag className="w-4 h-4" />
    },
    {
      name: 'sku',
      type: 'string required',
      required: true,
      description: 'Full product SKU/variant description',
      example: 'Oishi Prawn Crackers 30 g',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      name: 'units_per_transaction',
      type: 'integer required',
      required: true,
      description: 'Number of units of this SKU purchased in the transaction',
      icon: <Hash className="w-4 h-4" />
    },
    {
      name: 'peso_value',
      type: 'float required',
      required: true,
      description: 'Peso value for this transaction (can be computed or raw, but must be present)',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      name: 'basket_size',
      type: 'integer required',
      required: true,
      description: 'Number of unique SKUs (products) in this transaction. Required for basket/combination analysis.',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      name: 'combo_basket',
      type: 'array of strings required',
      required: true,
      description: 'List of SKUs in the same transaction. Use for "combination basket" or "usually bought with" analytics.',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      name: 'request_mode',
      type: 'string (enum) required',
      required: true,
      description: 'How the product was requested at the counter (as distinct from branded/unbranded)',
      values: ['verbal', 'pointing', 'indirect'],
      icon: <User className="w-4 h-4" />
    },
    {
      name: 'request_type',
      type: 'string (enum) required',
      required: true,
      description: 'What the customer asked for: by brand, by category, by gesture, or by description',
      values: ['branded', 'unbranded', 'point', 'indirect'],
      icon: <User className="w-4 h-4" />
    },
    {
      name: 'suggestion_accepted',
      type: 'boolean required',
      required: true,
      description: 'Did the customer accept the storeowner\'s suggestion? (true/false)',
      icon: <User className="w-4 h-4" />
    },
    {
      name: 'gender',
      type: 'string (enum) required',
      required: true,
      description: 'Inferred gender of customer',
      values: ['male', 'female', 'unknown'],
      icon: <User className="w-4 h-4" />
    },
    {
      name: 'age_bracket',
      type: 'string (enum) required',
      required: true,
      description: 'Estimated age range of customer',
      values: ['18-24', '25-34', '35-44', '45-54', '55+', 'unknown'],
      icon: <User className="w-4 h-4" />
    },
    {
      name: 'substitution_event',
      type: 'object required',
      required: true,
      description: 'Captures if a substitution happened (customer switched requested product/brand). occurred: boolean, from: string/null, to: string/null, reason: string/null',
      example: 'reason enum: "stockout", "suggestion", "unknown"',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      name: 'duration_seconds',
      type: 'integer required',
      required: true,
      description: 'Duration of the transaction in seconds',
      icon: <Clock className="w-4 h-4" />
    },
    {
      name: 'campaign_influenced',
      type: 'boolean required',
      required: true,
      description: 'Was this purchase influenced by a campaign? (If yes, this should link to campaign analysis.)',
      icon: <Star className="w-4 h-4" />
    },
    {
      name: 'handshake_score',
      type: 'float (0.0 – 1.0) required',
      required: true,
      description: 'Score reflecting "handshake"/engagement quality between staff and customer, if tracked',
      icon: <Star className="w-4 h-4" />
    },
    {
      name: 'is_tbwa_client',
      type: 'boolean required',
      required: true,
      description: 'True if this transaction is with a TBWA client brand (for market share slice/attribution)',
      icon: <Shield className="w-4 h-4" />
    },
    {
      name: 'payment_method',
      type: 'string (enum) required',
      required: true,
      description: 'Payment type used in the transaction',
      values: ['cash', 'gcash', 'maya', 'credit', 'other'],
      icon: <CreditCard className="w-4 h-4" />
    },
    {
      name: 'customer_type',
      type: 'string (enum) required',
      required: true,
      description: 'Customer relationship type (retained, new, etc.)',
      values: ['regular', 'occasional', 'new', 'unknown'],
      icon: <Users className="w-4 h-4" />
    },
    {
      name: 'store_type',
      type: 'string (enum) required',
      required: true,
      description: 'Store typology for segmentation',
      values: ['urban_high', 'urban_medium', 'residential', 'rural', 'transport', 'other'],
      icon: <Database className="w-4 h-4" />
    },
    {
      name: 'economic_class',
      type: 'string (enum) required',
      required: true,
      description: 'Socio-economic bracket of the store or area (for stratified analytics)',
      values: ['A', 'B', 'C', 'D', 'E', 'unknown'],
      icon: <BarChart3 className="w-4 h-4" />
    }
  ]

  const categories = [
    { id: 'all', label: 'All Fields' },
    { id: 'basic', label: 'Basic Info' },
    { id: 'product', label: 'Product Data' },
    { id: 'customer', label: 'Customer Info' },
    { id: 'behavior', label: 'Behavior' },
    { id: 'business', label: 'Business Logic' }
  ]

  const getCategoryFields = (category: string) => {
    if (category === 'all') return fieldDefinitions
    
    const categoryMap: Record<string, string[]> = {
      basic: ['id', 'store_id', 'timestamp', 'time_of_day', 'location'],
      product: ['product_category', 'brand_name', 'sku', 'units_per_transaction', 'peso_value', 'basket_size', 'combo_basket'],
      customer: ['gender', 'age_bracket', 'customer_type', 'payment_method'],
      behavior: ['request_mode', 'request_type', 'suggestion_accepted', 'substitution_event', 'duration_seconds', 'handshake_score'],
      business: ['campaign_influenced', 'is_tbwa_client', 'store_type', 'economic_class']
    }
    
    return fieldDefinitions.filter(field => categoryMap[category]?.includes(field.name))
  }

  const filteredFields = getCategoryFields(selectedCategory).filter(field =>
    field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    field.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="bg-tbwa-white rounded-lg shadow-sm border border-tbwa-yellow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search fields or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-tbwa-yellow rounded-lg focus:ring-2 focus:ring-tbwa-yellow focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-tbwa-yellow text-tbwa-black'
                    : 'bg-tbwa-lightGray text-tbwa-black hover:bg-tbwa-yellow hover:bg-opacity-20'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-3 text-sm text-tbwa-black text-opacity-70">
          Showing {filteredFields.length} of {fieldDefinitions.length} fields
        </div>
      </div>

      {/* Field Definitions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFields.map((field) => (
          <div key={field.name} className="bg-tbwa-white rounded-lg shadow-sm border border-tbwa-yellow border-opacity-30 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 p-2 bg-tbwa-yellow bg-opacity-20 rounded-lg">
                {field.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-mono text-lg font-semibold text-tbwa-black">
                    {field.name}
                  </h3>
                  {field.required && (
                    <span className="px-2 py-1 text-xs font-medium bg-tbwa-red bg-opacity-20 text-tbwa-red rounded">
                      Required
                    </span>
                  )}
                </div>
                
                <div className="mb-2">
                  <span className="inline-block px-2 py-1 text-xs font-mono bg-tbwa-lightGray text-tbwa-black rounded">
                    {field.type}
                  </span>
                </div>
                
                <p className="text-tbwa-black text-opacity-80 text-sm mb-3">
                  {field.description}
                </p>
                
                {field.example && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-tbwa-black text-opacity-70 mb-1">Example:</div>
                    <code className="text-xs bg-tbwa-lightGray text-tbwa-black px-2 py-1 rounded">
                      {field.example}
                    </code>
                  </div>
                )}
                
                {field.values && (
                  <div>
                    <div className="text-xs font-medium text-tbwa-black text-opacity-70 mb-1">Values:</div>
                    <div className="flex flex-wrap gap-1">
                      {field.values.map((value) => (
                        <span key={value} className="px-2 py-1 text-xs bg-tbwa-blue bg-opacity-20 text-tbwa-blue rounded">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="bg-tbwa-yellow bg-opacity-10 rounded-lg p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-tbwa-black mb-2">
            Scout Dashboard Transactions Data Dictionary
          </h3>
          <p className="text-tbwa-black text-opacity-80 text-sm mb-4">
            TBWA | 2025 | Generated for production deployment and backend integration
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-tbwa-blue">{fieldDefinitions.length}</div>
              <div className="text-sm text-tbwa-black text-opacity-70">Total Fields</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tbwa-emerald">{fieldDefinitions.filter(f => f.required).length}</div>
              <div className="text-sm text-tbwa-black text-opacity-70">Required Fields</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tbwa-purple">{fieldDefinitions.filter(f => f.values).length}</div>
              <div className="text-sm text-tbwa-black text-opacity-70">Enum Fields</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-tbwa-orange">{categories.length - 1}</div>
              <div className="text-sm text-tbwa-black text-opacity-70">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataDictionary