'use client'

import { useState } from 'react'
import { AIBots, useAIBot } from '@/lib/ai-bots'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TestBotsPage() {
  const { loading, error, askGenie, analyzeRetail, analyzeAds } = useAIBot()
  const [results, setResults] = useState<any>({})

  const testGenie = async () => {
    try {
      const response = await askGenie(
        "What are the top 3 priorities for improving business performance?",
        { revenue: "₱2.5M", growth: "15%", satisfaction: "4.2/5" },
        "executive"
      )
      setResults((prev: any) => ({ ...prev, genie: response }))
    } catch (err) {
      console.error('Genie test failed:', err)
    }
  }

  const testRetailBot = async () => {
    try {
      const response = await analyzeRetail(
        "How can I improve my store performance this quarter?",
        {
          daily_sales: "₱45,000",
          foot_traffic: 280,
          conversion_rate: "12%",
          top_products: ["Electronics", "Fashion", "Groceries"]
        }
      )
      setResults((prev: any) => ({ ...prev, retail: response }))
    } catch (err) {
      console.error('RetailBot test failed:', err)
    }
  }

  const testAdsBot = async () => {
    try {
      const response = await analyzeAds(
        {
          campaign_name: "Holiday Sale 2024",
          impressions: 125000,
          clicks: 3750,
          conversions: 95,
          spend: 20000,
          revenue: 75000
        },
        ["ctr", "conversion", "roi", "cpc"]
      )
      setResults((prev: any) => ({ ...prev, ads: response }))
    } catch (err) {
      console.error('AdsBot test failed:', err)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">AI Bots Test Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>🧞 AI Genie</CardTitle>
            <CardDescription>Business Intelligence Assistant</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testGenie} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generating...' : 'Test AI Genie'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🏪 RetailBot</CardTitle>
            <CardDescription>Retail Analytics Specialist</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testRetailBot} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Test RetailBot'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📢 AdsBot</CardTitle>
            <CardDescription>Marketing Analytics Expert</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testAdsBot} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Optimizing...' : 'Test AdsBot'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="genie" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="genie">AI Genie Results</TabsTrigger>
          <TabsTrigger value="retail">RetailBot Results</TabsTrigger>
          <TabsTrigger value="ads">AdsBot Results</TabsTrigger>
        </TabsList>

        <TabsContent value="genie" className="space-y-4">
          {results.genie && (
            <Card>
              <CardHeader>
                <CardTitle>AI Genie Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Analysis:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{results.genie.content}</p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Model: {results.genie.metadata?.model}</p>
                  <p>Generated: {new Date(results.genie.generated_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="retail" className="space-y-4">
          {results.retail && (
            <Card>
              <CardHeader>
                <CardTitle>RetailBot Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Analysis:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{results.retail.analysis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside">
                    {results.retail.recommendations?.map((rec: string, i: number) => (
                      <li key={i} className="text-gray-700">{rec}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Metrics:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(results.retail.metrics || {}).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-2 rounded">
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          {results.ads && (
            <Card>
              <CardHeader>
                <CardTitle>AdsBot Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Analysis:</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{results.ads.analysis}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Optimization Tips:</h4>
                  <ul className="list-disc list-inside">
                    {results.ads.optimization_tips?.map((tip: string, i: number) => (
                      <li key={i} className="text-gray-700">{tip}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Performance Metrics:</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(results.ads.performance_metrics || {}).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-2 rounded text-center">
                        <div className="text-sm text-gray-500">{key.toUpperCase()}</div>
                        <div className="font-semibold">{String(value)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {results.ads.creative_insights && (
                  <div>
                    <h4 className="font-semibold mb-2">Creative Insights:</h4>
                    <p className="text-gray-700">{results.ads.creative_insights}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">🚀 Deployment Status</h3>
        <p className="text-sm text-gray-700">
          These bots are configured to run as Supabase Edge Functions. 
          Run <code className="bg-white px-1 py-0.5 rounded">./setup-edge-functions.sh</code> to deploy.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Using Groq API for fast LLM inference with your configured API key.
        </p>
      </div>
    </div>
  )
}