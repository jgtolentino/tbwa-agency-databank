import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Target, Lightbulb, ArrowRight, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/config/api";
import { toast } from "@/hooks/use-toast";

const InsightCards = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/insights`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }

      const data = await response.json();
      
      // Map the data to include icons and colors
      const mappedInsights = data.map((insight: any, index: number) => ({
        ...insight,
        icon: [TrendingUp, Users, Lightbulb, Target][index % 4],
        color: ["text-green-600", "text-tbwa-turquoise", "text-tbwa-yellow", "text-purple-600"][index % 4]
      }));
      
      setInsights(mappedInsights);
    } catch (err) {
      console.error('Error fetching insights:', err);
      setError('Unable to load insights');
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Intelligence Hub</h2>
            <p className="text-muted-foreground">Latest insights and AI-powered analysis</p>
          </div>
          <Button variant="tbwa-outline" onClick={fetchInsights} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                View All Insights
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading insights...</p>
            </div>
          </div>
        ) : error || insights.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Data Available</h3>
              <p className="text-gray-500 mb-4">
                {error || "No insights are currently available. Please check back later."}
              </p>
              <Button onClick={fetchInsights} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight) => {
              const IconComponent = insight.icon;
              return (
                <Card key={insight.id} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-5 w-5 ${insight.color}`} />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {insight.trend}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {insight.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {insight.type}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {insight.date}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightCards;