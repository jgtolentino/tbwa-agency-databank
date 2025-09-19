import React, { useMemo } from 'react'
import { Package, TrendingUp, Target, ShoppingCart, ArrowRight, Star } from 'lucide-react'

interface BundleRecommendation {
  primaryProduct: string
  recommendedProduct: string
  frequency: number
  lift: number
  confidence: number
  revenueImpact: number
  priority: 'high' | 'medium' | 'low'
}

interface ProductAffinityRule {
  category1: string
  category2: string
  strength: number
  seasonality?: string
}

interface BundleRecommendationEngineProps {
  transactions: any[]
  className?: string
}

const BundleRecommendationEngine: React.FC<BundleRecommendationEngineProps> = ({
  transactions,
  className = ''
}) => {
  const bundleAnalysis = useMemo(() => {
    if (!transactions.length) return { recommendations: [], affinityRules: [], insights: [] }

    // Analyze actual bundle data from bought_with_other_brands field
    const bundleTransactions = transactions.filter(t =>
      t.bought_with_other_brands && t.bought_with_other_brands.trim()
    )

    // Create product co-occurrence matrix
    const coOccurrence = new Map<string, Map<string, number>>()
    const productFrequency = new Map<string, number>()

    bundleTransactions.forEach(transaction => {
      const primary = transaction.brand || transaction.product || 'Unknown'
      const secondary = transaction.bought_with_other_brands

      // Update individual product frequency
      productFrequency.set(primary, (productFrequency.get(primary) || 0) + 1)
      productFrequency.set(secondary, (productFrequency.get(secondary) || 0) + 1)

      // Update co-occurrence
      if (!coOccurrence.has(primary)) {
        coOccurrence.set(primary, new Map())
      }
      const primaryMap = coOccurrence.get(primary)!
      primaryMap.set(secondary, (primaryMap.get(secondary) || 0) + 1)
    })

    // Generate recommendations based on lift and confidence
    const recommendations: BundleRecommendation[] = []

    coOccurrence.forEach((secondaryMap, primary) => {
      secondaryMap.forEach((coCount, secondary) => {
        const primaryCount = productFrequency.get(primary) || 0
        const secondaryCount = productFrequency.get(secondary) || 0

        // Calculate metrics
        const confidence = (coCount / primaryCount) * 100
        const support = (coCount / transactions.length) * 100
        const expectedCoOccurrence = (primaryCount * secondaryCount) / transactions.length
        const lift = coCount / expectedCoOccurrence

        // Only include meaningful recommendations
        if (confidence > 10 && lift > 1.2 && coCount >= 3) {
          const avgPrice = transactions
            .filter(t => t.brand === primary || t.product === primary)
            .reduce((sum, t) => sum + (parseFloat(t.total_price) || 0), 0) / primaryCount

          recommendations.push({
            primaryProduct: primary,
            recommendedProduct: secondary,
            frequency: support,
            lift: Math.round(lift * 100) / 100,
            confidence: Math.round(confidence),
            revenueImpact: Math.round(avgPrice * lift * coCount),
            priority: lift > 2 ? 'high' : lift > 1.5 ? 'medium' : 'low'
          })
        }
      })
    })

    // Sort by potential impact (lift * confidence * frequency)
    recommendations.sort((a, b) => {
      const scoreA = a.lift * a.confidence * a.frequency
      const scoreB = b.lift * b.confidence * b.frequency
      return scoreB - scoreA
    })

    // Generate category affinity rules
    const categoryPairs = new Map<string, { coCount: number, cat1Count: number, cat2Count: number }>()

    transactions.forEach(t => {
      if (t.category && t.bought_with_other_brands) {
        // Try to infer category of secondary product (simplified)
        const secondaryCategory = inferCategory(t.bought_with_other_brands)
        if (secondaryCategory && t.category !== secondaryCategory) {
          const key = [t.category, secondaryCategory].sort().join('-')
          if (!categoryPairs.has(key)) {
            categoryPairs.set(key, { coCount: 0, cat1Count: 0, cat2Count: 0 })
          }
          categoryPairs.get(key)!.coCount += 1
        }
      }
    })

    const affinityRules: ProductAffinityRule[] = Array.from(categoryPairs.entries())
      .map(([key, data]) => {
        const [cat1, cat2] = key.split('-')
        const strength = (data.coCount / transactions.length) * 100
        return { category1: cat1, category2: cat2, strength }
      })
      .filter(rule => rule.strength > 1)
      .sort((a, b) => b.strength - a.strength)
      .slice(0, 6)

    // Generate insights
    const insights = []

    const topRecommendation = recommendations[0]
    if (topRecommendation) {
      insights.push({
        type: 'Top Bundle Opportunity',
        message: `${topRecommendation.primaryProduct} + ${topRecommendation.recommendedProduct} shows ${topRecommendation.lift}x lift`,
        action: `Create prominent bundle display with ${topRecommendation.confidence}% confidence`,
        impact: `₱${topRecommendation.revenueImpact.toLocaleString()} potential revenue`
      })
    }

    const crossCategoryRules = affinityRules.filter(rule =>
      rule.category1 !== rule.category2
    )
    if (crossCategoryRules.length > 0) {
      const topRule = crossCategoryRules[0]
      insights.push({
        type: 'Cross-Category Opportunity',
        message: `${topRule.category1} and ${topRule.category2} frequently bought together`,
        action: 'Reorganize store layout for proximity placement',
        impact: `${topRule.strength.toFixed(1)}% of transactions show this pattern`
      })
    }

    return {
      recommendations: recommendations.slice(0, 8),
      affinityRules,
      insights,
      totalBundles: bundleTransactions.length,
      bundleRate: (bundleTransactions.length / transactions.length) * 100
    }
  }, [transactions])

  // Simple category inference based on common product names
  function inferCategory(productName: string): string | null {
    const name = productName.toLowerCase()
    if (name.includes('coca') || name.includes('pepsi') || name.includes('sprite')) return 'Beverages'
    if (name.includes('marlboro') || name.includes('lucky') || name.includes('philip')) return 'Tobacco'
    if (name.includes('pringles') || name.includes('chips') || name.includes('biscuit')) return 'Snacks'
    if (name.includes('shampoo') || name.includes('soap') || name.includes('cream')) return 'Personal Care'
    return null
  }

  if (!transactions.length) {
    return (
      <div className={`scout-card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Package className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">Bundle Recommendation Engine</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No transaction data available for bundle analysis</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`scout-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-scout-secondary" />
          <h3 className="text-lg font-semibold text-scout-text">AI Bundle Recommendation Engine</h3>
        </div>
        <div className="text-sm text-gray-500">
          {bundleAnalysis.totalBundles} bundles ({bundleAnalysis.bundleRate.toFixed(1)}%)
        </div>
      </div>

      {/* Bundle Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-scout-text">{bundleAnalysis.recommendations.length}</div>
          <div className="text-xs text-gray-600">Recommendations</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-scout-text">{bundleAnalysis.bundleRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Bundle Rate</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-scout-text">{bundleAnalysis.affinityRules.length}</div>
          <div className="text-xs text-gray-600">Affinity Rules</div>
        </div>
      </div>

      {/* Top Recommendations */}
      {Array.isArray(bundleAnalysis.recommendations) && bundleAnalysis.recommendations.length > 0 ? (
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-scout-text">High-Impact Bundle Recommendations</h4>
          {bundleAnalysis.recommendations.slice(0, 4).map((rec, index) => (
            <div key={index} className={`border rounded-lg p-4 ${
              rec.priority === 'high' ? 'border-green-200 bg-green-50' :
              rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-scout-secondary" />
                  <span className="font-medium text-scout-text">
                    {rec.primaryProduct}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400" />
                  <span className="text-scout-text">{rec.recommendedProduct}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  rec.priority === 'high' ? 'bg-green-100 text-green-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {rec.priority}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Lift:</span>
                  <span className="font-semibold text-green-600 ml-1">{rec.lift}x</span>
                </div>
                <div>
                  <span className="text-gray-600">Confidence:</span>
                  <span className="font-semibold text-scout-text ml-1">{rec.confidence}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Frequency:</span>
                  <span className="font-semibold text-scout-text ml-1">{rec.frequency.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Impact:</span>
                  <span className="font-semibold text-green-600 ml-1">₱{rec.revenueImpact.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 mb-6">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No significant bundle patterns detected</p>
          <p className="text-sm">Need more bundle transaction data</p>
        </div>
      )}

      {/* Category Affinity Rules */}
      {Array.isArray(bundleAnalysis.affinityRules) && bundleAnalysis.affinityRules.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-scout-text mb-3">Category Affinity Rules</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bundleAnalysis.affinityRules.slice(0, 4).map((rule, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {rule.category1} ↔ {rule.category2}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-blue-700">
                    {rule.strength.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {Array.isArray(bundleAnalysis.insights) && bundleAnalysis.insights.length > 0 && (
        <div>
          <h4 className="font-medium text-scout-text mb-3">Bundle Intelligence Insights</h4>
          <div className="space-y-3">
            {bundleAnalysis.insights.map((insight, index) => (
              <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-purple-900">{insight.type}</div>
                    <div className="text-sm text-purple-800">{insight.message}</div>
                    <div className="text-xs text-purple-600 mt-1">→ {insight.action}</div>
                    <div className="text-xs text-purple-700 font-medium mt-1">{insight.impact}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Package className="w-3 h-3" />
          <span>AI-powered market basket analysis with lift, confidence, and frequency calculations</span>
        </div>
      </div>
    </div>
  )
}

export default BundleRecommendationEngine