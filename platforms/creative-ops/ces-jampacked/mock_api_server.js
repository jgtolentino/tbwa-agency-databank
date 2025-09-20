import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
const PORT = 8001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory campaign storage
let campaigns = [];

// Load initial data
try {
  const validatedData = JSON.parse(fs.readFileSync('./validated_campaigns_dataset.json', 'utf8'));
  const campaignsData = JSON.parse(fs.readFileSync('./public/data/campaigns_corpus.json', 'utf8'));
  
  // Combine and score campaigns
  campaigns = campaignsData.map((campaign, index) => ({
    id: campaign.campaign_id || `campaign_${index}`,
    name: campaign.title || campaign.name,
    brand: campaign.brand,
    year: campaign.year || 2024,
    market: campaign.market || 'Global',
    agency: campaign.agency?.[0] || 'Unknown',
    category: campaign.category || 'General',
    creative_effectiveness_score: 59.5 + Math.random() * 26, // 59.5 to 85.5 range
    roi: campaign.results?.roi || (2.0 + Math.random() * 1.5), // 2.0 to 3.5 range
    challenge: campaign.challenge,
    strategy: campaign.strategy,
    implementation: campaign.implementation,
    results: campaign.results,
    features: {
      campaign_id: campaign.campaign_id,
      url: campaign.url,
      creative_assets: campaign.creative_assets
    },
    framework_dimensions: {
      disruption: 0.5 + Math.random() * 0.4,
      performance_predictors: 0.4 + Math.random() * 0.4,
      storytelling: 0.6 + Math.random() * 0.3,
      cultural_relevance: 0.5 + Math.random() * 0.3,
      csr_authenticity: 0.2 + Math.random() * 0.4,
      technology_integration: 0.3 + Math.random() * 0.3,
      platform_integration: 0.3 + Math.random() * 0.2,
      ai_personalization: 0.1 + Math.random() * 0.3
    },
    validated: true,
    imported_at: new Date().toISOString()
  }));
  
  // Add top performers from validated dataset
  const topPerformers = [
    {
      id: 'washtag_1',
      name: 'WASHTAG',
      brand: 'WASHTAG',
      year: 2024,
      market: 'Philippines',
      agency: 'TBWA\\SMP',
      category: 'Brand Campaign',
      creative_effectiveness_score: 70.8,
      roi: 3.2,
      challenge: 'Increase brand awareness and engagement',
      strategy: 'Disruptive creative approach with cultural relevance',
      implementation: 'Multi-channel campaign leveraging local insights',
      results: { roi: '3.2x', brand_awareness: '25% increase', engagement: '40% uplift' },
      validated: true,
      framework_dimensions: {
        disruption: 0.89,
        performance_predictors: 0.82,
        storytelling: 0.85,
        cultural_relevance: 0.78,
        csr_authenticity: 0.45,
        technology_integration: 0.65,
        platform_integration: 0.58,
        ai_personalization: 0.35
      },
      imported_at: new Date().toISOString()
    },
    {
      id: 'mcdonalds_higantes',
      name: 'McDonald\'s HIGANTES',
      brand: 'McDonald\'s',
      year: 2024,
      market: 'Philippines',
      agency: 'TBWA\\SMP',
      category: 'QSR',
      creative_effectiveness_score: 57.4,
      roi: 2.1,
      challenge: 'Launch new product with cultural relevance',
      strategy: 'Leverage local Filipino culture and humor',
      implementation: 'TV, digital, and social media campaign',
      results: { roi: '2.1x', sales_uplift: '18%', brand_consideration: '12% increase' },
      validated: true,
      framework_dimensions: {
        disruption: 0.72,
        performance_predictors: 0.65,
        storytelling: 0.88,
        cultural_relevance: 0.92,
        csr_authenticity: 0.25,
        technology_integration: 0.45,
        platform_integration: 0.55,
        ai_personalization: 0.22
      },
      imported_at: new Date().toISOString()
    },
    {
      id: 'mcdonalds_lovin_all',
      name: 'McDonald\'s Lovin\' All',
      brand: 'McDonald\'s',
      year: 2024,
      market: 'Philippines',
      agency: 'TBWA\\SMP',
      category: 'QSR',
      creative_effectiveness_score: 60.8,
      roi: 2.8,
      challenge: 'Promote inclusivity and diversity',
      strategy: 'Celebrate Filipino diversity through food',
      implementation: 'Integrated campaign across all channels',
      results: { roi: '2.8x', sentiment_improvement: '35%', social_engagement: '150% increase' },
      validated: true,
      framework_dimensions: {
        disruption: 0.65,
        performance_predictors: 0.58,
        storytelling: 0.82,
        cultural_relevance: 0.95,
        csr_authenticity: 0.85,
        technology_integration: 0.52,
        platform_integration: 0.68,
        ai_personalization: 0.18
      },
      imported_at: new Date().toISOString()
    }
  ];
  
  // Add top performers to campaigns
  campaigns = [...campaigns, ...topPerformers];
  
  console.log(`✅ Loaded ${campaigns.length} campaigns (${topPerformers.length} top performers added)`);
  console.log(`📊 CES Range: ${Math.min(...campaigns.map(c => c.creative_effectiveness_score)).toFixed(1)} - ${Math.max(...campaigns.map(c => c.creative_effectiveness_score)).toFixed(1)}`);
  console.log(`🏆 Top Performer: ${topPerformers[0].name} (CES: ${topPerformers[0].creative_effectiveness_score})`);
  
} catch (error) {
  console.error('Error loading data:', error.message);
  // Fallback with validated top performers
  campaigns = [
    {
      id: 'washtag_1',
      name: 'WASHTAG',
      brand: 'WASHTAG',
      year: 2024,
      market: 'Philippines',
      agency: 'TBWA\\SMP',
      category: 'Brand Campaign',
      creative_effectiveness_score: 70.8,
      roi: 3.2,
      challenge: 'Increase brand awareness',
      strategy: 'Disruptive creative approach',
      implementation: 'Multi-channel campaign',
      results: { roi: '3.2x', brand_awareness: '25% increase' },
      validated: true,
      imported_at: new Date().toISOString()
    }
  ];
}

// API Endpoints

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    campaigns: campaigns.length,
    timestamp: new Date().toISOString()
  });
});

// Get all campaigns
app.get('/api/campaigns', (req, res) => {
  res.json({
    campaigns: campaigns,
    total: campaigns.length,
    mean_ces: campaigns.reduce((sum, c) => sum + c.creative_effectiveness_score, 0) / campaigns.length,
    mean_roi: campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length
  });
});

// Get specific campaign
app.get('/api/campaigns/:id', (req, res) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }
  res.json(campaign);
});

// Campaign analysis
app.post('/api/analyze-campaign', (req, res) => {
  const { campaignId, campaignName, dateRange, metrics } = req.body;
  
  // Find campaign
  let campaign = campaigns.find(c => c.id === campaignId || c.name === campaignName);
  if (!campaign) {
    campaign = campaigns[0]; // Default to first campaign
  }
  
  // Generate analysis
  const analysis = {
    performance: {
      impressions: Math.floor(Math.random() * 1000000) + 100000,
      clicks: Math.floor(Math.random() * 50000) + 5000,
      conversions: Math.floor(Math.random() * 2000) + 200,
      spend: Math.floor(Math.random() * 50000) + 10000,
      roi: campaign.roi || (2.0 + Math.random() * 1.5),
      ctr: Math.random() * 0.05 + 0.01,
      cvr: Math.random() * 0.08 + 0.02
    },
    insights: [
      {
        type: 'opportunity',
        title: 'Strong Creative Performance',
        description: `Campaign shows above-average creative effectiveness (CES: ${campaign.creative_effectiveness_score.toFixed(1)})`,
        impact: 'high',
        confidence: 0.85
      },
      {
        type: 'trend',
        title: 'ROI Performance',
        description: `ROI of ${campaign.roi.toFixed(1)}x exceeds industry average of 2.5x`,
        impact: 'medium',
        confidence: 0.78
      }
    ],
    recommendations: [
      {
        action: 'Scale successful creative elements',
        expectedImpact: '15-20% performance improvement',
        priority: 1
      },
      {
        action: 'Optimize targeting based on current performance',
        expectedImpact: '10-15% efficiency gain',
        priority: 2
      }
    ],
    visualizations: [
      {
        type: 'chart',
        data: [
          { name: 'Week 1', performance: 65 },
          { name: 'Week 2', performance: 72 },
          { name: 'Week 3', performance: 78 },
          { name: 'Week 4', performance: 82 }
        ]
      }
    ]
  };
  
  res.json(analysis);
});

// Creative brief generation
app.post('/api/generate-brief', (req, res) => {
  const { brand, objective, targetAudience, budget, timeline } = req.body;
  
  const brief = {
    brief: {
      executiveSummary: `Strategic creative brief for ${brand} focused on ${objective}`,
      strategicDirection: 'Leverage brand disruption and cultural relevance to drive engagement',
      creativeTerritory: 'Authentic storytelling with technology integration',
      keyMessages: [
        'Primary: Brand authenticity drives connection',
        'Secondary: Innovation meets tradition',
        'Tertiary: Community-first approach'
      ],
      mandatories: [
        'Brand logo placement',
        'Key messaging consistency',
        'Compliance requirements'
      ],
      deliverables: [
        {
          type: 'Video',
          specifications: '30s hero video, 15s cutdowns',
          deadline: '2 weeks'
        },
        {
          type: 'Digital Assets',
          specifications: 'Static and animated display ads',
          deadline: '1 week'
        }
      ]
    },
    references: [
      {
        title: 'Similar successful campaign',
        description: 'Reference campaign that achieved 3.2x ROI',
        url: 'https://example.com/case-study'
      }
    ],
    moodboard: {
      images: ['hero_image_1.jpg', 'hero_image_2.jpg'],
      colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
      typography: ['Montserrat', 'Open Sans']
    }
  };
  
  res.json(brief);
});

// Market insights
app.post('/api/market-insights', (req, res) => {
  const { industry, timeframe } = req.body;
  
  const insights = {
    trends: [
      {
        name: 'AI-Powered Personalization',
        description: 'Increasing use of AI for personalized campaign optimization',
        impact: 85,
        timeHorizon: '6 months',
        evidence: ['35% increase in AI adoption', 'ROI improvement of 40%']
      },
      {
        name: 'Authentic Brand Storytelling',
        description: 'Consumer preference for genuine brand narratives',
        impact: 78,
        timeHorizon: '3 months',
        evidence: ['65% consumer preference', 'Brand trust increase of 25%']
      }
    ],
    opportunities: [
      {
        title: 'Cultural Relevance Gap',
        description: 'Opportunity to improve local market resonance',
        potentialValue: '$2.5M incremental revenue',
        requiredCapabilities: ['Local market research', 'Cultural consultants']
      }
    ],
    threats: [
      {
        risk: 'Ad fatigue',
        likelihood: 0.6,
        impact: 0.7,
        mitigation: 'Rotate creative frequently and test new formats'
      }
    ],
    competitiveLandscape: {
      marketSize: 125000000,
      growthRate: 12.5,
      keyPlayers: [
        {
          name: 'Market Leader',
          marketShare: 25,
          strengths: ['Strong brand recognition', 'Wide distribution']
        }
      ]
    }
  };
  
  res.json(insights);
});

// Competitor analysis
app.post('/api/competitor-analysis', (req, res) => {
  const { competitors, metrics, period } = req.body;
  
  const analysis = {
    comparison: {
      'Our Brand': {
        market_share: 15,
        campaigns: 12,
        spend: 2500000,
        roi: 2.8
      },
      'Competitor A': {
        market_share: 22,
        campaigns: 18,
        spend: 3200000,
        roi: 2.4
      },
      'Competitor B': {
        market_share: 18,
        campaigns: 15,
        spend: 2800000,
        roi: 2.6
      }
    },
    strengths: {
      'Our Brand': ['Higher ROI', 'Better creative effectiveness'],
      'Competitor A': ['Larger market share', 'More campaigns'],
      'Competitor B': ['Balanced approach', 'Consistent performance']
    },
    weaknesses: {
      'Our Brand': ['Lower market share', 'Fewer campaigns'],
      'Competitor A': ['Lower ROI', 'High spend'],
      'Competitor B': ['Lower innovation', 'Conservative approach']
    },
    opportunities: [
      'Leverage higher ROI to increase market share',
      'Expand campaign portfolio while maintaining quality'
    ],
    recommendations: [
      {
        strategy: 'Increase campaign frequency',
        rationale: 'Competitors run 20% more campaigns',
        expectedOutcome: '5-8% market share increase'
      }
    ]
  };
  
  res.json(analysis);
});

// Chat endpoint
app.post('/api/chat', (req, res) => {
  const { message, agent, context } = req.body;
  
  // Simple intent detection
  let response = {
    content: 'I understand you want to know about campaign performance. Based on our data, I can help with analysis, insights, and recommendations.',
    type: 'text'
  };
  
  if (message.toLowerCase().includes('campaign')) {
    response.content = `I found ${campaigns.length} campaigns in our database. The average CES is ${(campaigns.reduce((sum, c) => sum + c.creative_effectiveness_score, 0) / campaigns.length).toFixed(1)} with an average ROI of ${(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(1)}x.`;
  } else if (message.toLowerCase().includes('top')) {
    const topCampaign = campaigns.sort((a, b) => b.creative_effectiveness_score - a.creative_effectiveness_score)[0];
    response.content = `The top performing campaign is "${topCampaign.name}" by ${topCampaign.brand} with a CES of ${topCampaign.creative_effectiveness_score.toFixed(1)} and ROI of ${topCampaign.roi.toFixed(1)}x.`;
  }
  
  res.json({
    response,
    metadata: {
      processingTime: 0.5,
      confidence: 0.9,
      sources: ['campaign_database'],
      intent: 'campaign_query'
    }
  });
});

// Dashboard data
app.get('/api/dashboard', (req, res) => {
  const { dateStart, dateEnd, market, brand } = req.query;
  
  let filteredCampaigns = campaigns;
  
  // Apply filters
  if (market) {
    filteredCampaigns = filteredCampaigns.filter(c => c.market === market);
  }
  if (brand) {
    filteredCampaigns = filteredCampaigns.filter(c => c.brand === brand);
  }
  
  const kpis = [
    {
      id: 'campaigns',
      label: 'Total Campaigns',
      value: filteredCampaigns.length,
      delta: '+12%',
      period: 'vs last month'
    },
    {
      id: 'ces',
      label: 'Average CES',
      value: (filteredCampaigns.reduce((sum, c) => sum + c.creative_effectiveness_score, 0) / filteredCampaigns.length).toFixed(1),
      delta: '+8%',
      period: 'vs last month'
    },
    {
      id: 'roi',
      label: 'Average ROI',
      value: (filteredCampaigns.reduce((sum, c) => sum + c.roi, 0) / filteredCampaigns.length).toFixed(1) + 'x',
      delta: '+15%',
      period: 'vs last month'
    }
  ];
  
  const charts = {
    cesDistribution: filteredCampaigns.map(c => ({
      name: c.name.substring(0, 20) + '...',
      ces: c.creative_effectiveness_score,
      roi: c.roi
    })),
    brandPerformance: Object.values(
      filteredCampaigns.reduce((acc, c) => {
        if (!acc[c.brand]) {
          acc[c.brand] = { brand: c.brand, campaigns: 0, avgCes: 0, avgRoi: 0 };
        }
        acc[c.brand].campaigns++;
        acc[c.brand].avgCes += c.creative_effectiveness_score;
        acc[c.brand].avgRoi += c.roi;
        return acc;
      }, {})
    ).map(b => ({
      ...b,
      avgCes: b.avgCes / b.campaigns,
      avgRoi: b.avgRoi / b.campaigns
    }))
  };
  
  res.json({
    kpis,
    charts,
    insights: [
      {
        title: 'Strong Performance Trend',
        description: 'Campaign effectiveness is trending upward',
        impact: 'positive'
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock Ask CES API server running on port ${PORT}`);
  console.log(`📊 Loaded ${campaigns.length} campaigns`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Dashboard: http://localhost:${PORT}/api/dashboard`);
});