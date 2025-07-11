# Sample Backend API Implementation for Ask CES

## FastAPI Implementation Example

```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, date
import openai
from sqlalchemy.orm import Session

app = FastAPI(title="Ask CES API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://your-frontend.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class CampaignAnalysisRequest(BaseModel):
    campaign_id: Optional[str]
    campaign_name: Optional[str]
    date_range: Dict[str, date]
    metrics: List[str]
    filters: Optional[Dict[str, str]]

class CampaignAnalysisResponse(BaseModel):
    performance: Dict[str, float]
    insights: List[Dict[str, any]]
    recommendations: List[Dict[str, str]]
    visualizations: Optional[List[Dict[str, any]]]

class CreativeBriefRequest(BaseModel):
    brand: str
    objective: str
    target_audience: Dict[str, List[str]]
    budget: Optional[float]
    timeline: Optional[str]
    mandatories: Optional[List[str]]
    tone: Optional[str]

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, any]]
    agent: Optional[str] = "general"

# API Endpoints
@app.post("/api/analyze-campaign", response_model=CampaignAnalysisResponse)
async def analyze_campaign(request: CampaignAnalysisRequest, db: Session = Depends(get_db)):
    """
    Analyze campaign performance and generate insights
    """
    try:
        # 1. Fetch campaign data from database
        campaign_data = db.query(Campaign).filter(
            Campaign.name == request.campaign_name,
            Campaign.date >= request.date_range["start"],
            Campaign.date <= request.date_range["end"]
        ).all()
        
        # 2. Calculate performance metrics
        performance = {
            "impressions": sum(c.impressions for c in campaign_data),
            "clicks": sum(c.clicks for c in campaign_data),
            "conversions": sum(c.conversions for c in campaign_data),
            "spend": sum(c.spend for c in campaign_data),
            "roi": calculate_roi(campaign_data),
            "ctr": calculate_ctr(campaign_data),
            "cvr": calculate_cvr(campaign_data)
        }
        
        # 3. Generate AI insights using Claude/OpenAI
        insights = await generate_campaign_insights(campaign_data, performance)
        
        # 4. Generate recommendations
        recommendations = await generate_recommendations(performance, insights)
        
        # 5. Create visualizations data
        visualizations = create_campaign_visualizations(campaign_data)
        
        return CampaignAnalysisResponse(
            performance=performance,
            insights=insights,
            recommendations=recommendations,
            visualizations=visualizations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-brief")
async def generate_creative_brief(request: CreativeBriefRequest):
    """
    Generate creative brief using AI
    """
    try:
        # Use Claude/OpenAI to generate brief
        prompt = f"""
        Generate a comprehensive creative brief for:
        Brand: {request.brand}
        Objective: {request.objective}
        Target Audience: {request.target_audience}
        Budget: {request.budget}
        Timeline: {request.timeline}
        
        Include:
        1. Executive Summary
        2. Strategic Direction
        3. Creative Territory
        4. Key Messages
        5. Mandatories
        6. Deliverables with specifications
        """
        
        response = await generate_ai_response(prompt)
        
        # Parse and structure the response
        brief_data = parse_creative_brief(response)
        
        return {
            "brief": brief_data,
            "references": await fetch_relevant_references(request.brand, request.objective),
            "moodboard": await generate_moodboard(brief_data)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/market-insights")
async def get_market_insights(request: Dict[str, any]):
    """
    Generate market insights and trends
    """
    try:
        # 1. Fetch market data from external APIs or database
        market_data = await fetch_market_data(
            request["industry"],
            request["timeframe"]
        )
        
        # 2. Analyze trends
        trends = analyze_market_trends(market_data)
        
        # 3. Identify opportunities
        opportunities = identify_opportunities(market_data, trends)
        
        # 4. Assess threats
        threats = assess_market_threats(market_data)
        
        # 5. Competitive landscape
        competitive_data = await fetch_competitive_data(request["industry"])
        
        return {
            "trends": trends,
            "opportunities": opportunities,
            "threats": threats,
            "competitive_landscape": competitive_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/competitor-analysis")
async def analyze_competitors(request: Dict[str, any]):
    """
    Perform competitor analysis
    """
    try:
        # 1. Fetch competitor data
        competitor_data = {}
        for competitor in request["competitors"]:
            data = await fetch_competitor_data(
                competitor,
                request["period"],
                request["metrics"]
            )
            competitor_data[competitor] = data
        
        # 2. Compare performance
        comparison = compare_competitor_performance(competitor_data)
        
        # 3. Identify strengths and weaknesses
        strengths = {}
        weaknesses = {}
        for competitor, data in competitor_data.items():
            analysis = analyze_competitor_strengths_weaknesses(data)
            strengths[competitor] = analysis["strengths"]
            weaknesses[competitor] = analysis["weaknesses"]
        
        # 4. Generate strategic recommendations
        recommendations = generate_competitive_strategy(
            comparison,
            strengths,
            weaknesses
        )
        
        return {
            "comparison": comparison,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "opportunities": identify_competitive_opportunities(competitor_data),
            "recommendations": recommendations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Handle chat interactions with AI
    """
    try:
        # 1. Determine intent and extract entities
        intent = classify_intent(request.message)
        entities = extract_entities(request.message)
        
        # 2. Route to appropriate handler
        if intent == "campaign_analysis":
            response = await handle_campaign_query(entities, request.context)
        elif intent == "creative_brief":
            response = await handle_creative_query(entities, request.context)
        elif intent == "market_insights":
            response = await handle_market_query(entities, request.context)
        elif intent == "competitor_analysis":
            response = await handle_competitor_query(entities, request.context)
        else:
            # General chat with Claude/OpenAI
            response = await generate_chat_response(
                request.message,
                request.context,
                request.agent
            )
        
        return {
            "response": response,
            "metadata": {
                "processing_time": 0.8,
                "confidence": 0.92,
                "sources": ["campaign_db", "market_research"],
                "intent": intent,
                "entities": entities
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard")
async def get_dashboard_data(
    date_start: Optional[date] = None,
    date_end: Optional[date] = None,
    market: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get dashboard data with filters
    """
    try:
        # Build query with filters
        query = db.query(Campaign)
        
        if date_start:
            query = query.filter(Campaign.date >= date_start)
        if date_end:
            query = query.filter(Campaign.date <= date_end)
        if market:
            query = query.filter(Campaign.market == market)
        if brand:
            query = query.filter(Campaign.brand == brand)
        
        campaigns = query.all()
        
        # Calculate KPIs
        kpis = [
            {
                "id": "revenue",
                "label": "Total Revenue",
                "value": sum(c.revenue for c in campaigns),
                "delta": calculate_delta(campaigns, "revenue"),
                "period": f"{date_start} - {date_end}"
            },
            {
                "id": "campaigns",
                "label": "Active Campaigns",
                "value": len(campaigns),
                "delta": calculate_delta(campaigns, "count"),
                "period": "Current"
            }
        ]
        
        # Generate charts data
        charts = {
            "revenue_trend": generate_trend_data(campaigns, "revenue"),
            "category_breakdown": generate_category_breakdown(campaigns),
            "location_performance": generate_location_data(campaigns)
        }
        
        # AI-generated insights
        insights = await generate_dashboard_insights(campaigns, kpis)
        
        return {
            "kpis": kpis,
            "charts": charts,
            "insights": insights,
            "filters": {
                "date_start": date_start,
                "date_end": date_end,
                "market": market,
                "brand": brand
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper Functions
async def generate_ai_response(prompt: str) -> str:
    """Generate response using Claude/OpenAI"""
    # Example with OpenAI
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a marketing analytics expert."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    return response.choices[0].message.content

def calculate_roi(campaigns) -> float:
    total_revenue = sum(c.revenue for c in campaigns)
    total_spend = sum(c.spend for c in campaigns)
    return (total_revenue - total_spend) / total_spend if total_spend > 0 else 0

def calculate_ctr(campaigns) -> float:
    total_clicks = sum(c.clicks for c in campaigns)
    total_impressions = sum(c.impressions for c in campaigns)
    return total_clicks / total_impressions if total_impressions > 0 else 0

def calculate_cvr(campaigns) -> float:
    total_conversions = sum(c.conversions for c in campaigns)
    total_clicks = sum(c.clicks for c in campaigns)
    return total_conversions / total_clicks if total_clicks > 0 else 0

# Database Models (SQLAlchemy)
from sqlalchemy import Column, Integer, String, Float, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Campaign(Base):
    __tablename__ = "campaigns"
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    brand = Column(String)
    market = Column(String)
    date = Column(Date)
    impressions = Column(Integer)
    clicks = Column(Integer)
    conversions = Column(Integer)
    spend = Column(Float)
    revenue = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

# Startup
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Express.js Implementation Example

```javascript
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Campaign Analysis Endpoint
app.post('/api/analyze-campaign', async (req, res) => {
  try {
    const { campaignName, dateRange, metrics } = req.body;
    
    // 1. Fetch campaign data
    const campaigns = await prisma.campaign.findMany({
      where: {
        name: campaignName,
        date: {
          gte: new Date(dateRange.start),
          lte: new Date(dateRange.end)
        }
      }
    });
    
    // 2. Calculate metrics
    const performance = {
      impressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      clicks: campaigns.reduce((sum, c) => sum + c.clicks, 0),
      conversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      spend: campaigns.reduce((sum, c) => sum + c.spend, 0),
      roi: calculateROI(campaigns),
      ctr: calculateCTR(campaigns),
      cvr: calculateCVR(campaigns)
    };
    
    // 3. Generate insights
    const insights = await generateInsights(campaigns, performance);
    
    // 4. Generate recommendations
    const recommendations = await generateRecommendations(performance);
    
    res.json({
      performance,
      insights,
      recommendations,
      visualizations: createVisualizations(campaigns)
    });
    
  } catch (error) {
    console.error('Campaign analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze campaign' });
  }
});

// Creative Brief Generation
app.post('/api/generate-brief', async (req, res) => {
  try {
    const { brand, objective, targetAudience, budget, timeline } = req.body;
    
    const prompt = `
      Generate a comprehensive creative brief for:
      Brand: ${brand}
      Objective: ${objective}
      Target Audience: ${JSON.stringify(targetAudience)}
      Budget: ${budget}
      Timeline: ${timeline}
    `;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative director." },
        { role: "user", content: prompt }
      ]
    });
    
    const briefContent = completion.choices[0].message.content;
    const brief = parseBriefContent(briefContent);
    
    res.json({
      brief,
      references: await fetchReferences(brand, objective),
      moodboard: await generateMoodboard(brief)
    });
    
  } catch (error) {
    console.error('Brief generation error:', error);
    res.status(500).json({ error: 'Failed to generate brief' });
  }
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, context, agent } = req.body;
    
    // Classify intent
    const intent = await classifyIntent(message);
    
    let response;
    if (intent === 'campaign_analysis') {
      response = await handleCampaignQuery(message, context);
    } else if (intent === 'creative_brief') {
      response = await handleCreativeQuery(message, context);
    } else {
      // General chat
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: getSystemPrompt(agent) },
          ...formatContext(context),
          { role: "user", content: message }
        ]
      });
      
      response = {
        content: completion.choices[0].message.content,
        type: 'text'
      };
    }
    
    res.json({
      response,
      metadata: {
        processingTime: Date.now() - req.startTime,
        confidence: 0.92,
        sources: ['database', 'ai_model']
      }
    });
    
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Dashboard Data
app.get('/api/dashboard', async (req, res) => {
  try {
    const { dateStart, dateEnd, market, brand } = req.query;
    
    const where = {};
    if (dateStart && dateEnd) {
      where.date = {
        gte: new Date(dateStart),
        lte: new Date(dateEnd)
      };
    }
    if (market) where.market = market;
    if (brand) where.brand = brand;
    
    const campaigns = await prisma.campaign.findMany({ where });
    
    const kpis = [
      {
        id: 'revenue',
        label: 'Total Revenue',
        value: campaigns.reduce((sum, c) => sum + c.revenue, 0),
        delta: calculateDelta(campaigns, 'revenue'),
        period: `${dateStart} - ${dateEnd}`
      }
    ];
    
    const charts = {
      revenueTrend: generateTrendData(campaigns),
      categoryBreakdown: generateCategoryData(campaigns),
      locationPerformance: generateLocationData(campaigns)
    };
    
    res.json({
      kpis,
      charts,
      insights: await generateDashboardInsights(campaigns)
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Helper functions
function calculateROI(campaigns) {
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  return totalSpend > 0 ? (totalRevenue - totalSpend) / totalSpend : 0;
}

function getSystemPrompt(agent) {
  const prompts = {
    general: "You are a helpful marketing assistant.",
    creative: "You are an expert creative director.",
    analytics: "You are a data analyst specializing in marketing metrics.",
    market: "You are a market research expert."
  };
  return prompts[agent] || prompts.general;
}

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Database Schema (Prisma)

```prisma
// schema.prisma

model Campaign {
  id          String   @id @default(cuid())
  name        String
  brand       String
  market      String
  category    String
  date        DateTime
  impressions Int
  clicks      Int
  conversions Int
  spend       Float
  revenue     Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  insights    Insight[]
  creatives   Creative[]
}

model Insight {
  id          String   @id @default(cuid())
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id])
  type        String   // opportunity, risk, trend
  title       String
  description String
  impact      String   // high, medium, low
  confidence  Float
  createdAt   DateTime @default(now())
}

model Creative {
  id          String   @id @default(cuid())
  campaignId  String
  campaign    Campaign @relation(fields: [campaignId], references: [id])
  assetUrl    String
  assetType   String   // video, image, text
  performance Json
  analysis    Json
  createdAt   DateTime @default(now())
}

model ChatHistory {
  id        String   @id @default(cuid())
  userId    String
  role      String   // user, assistant
  content   String
  metadata  Json?
  createdAt DateTime @default(now())
}
```

## Environment Variables

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/askces"
OPENAI_API_KEY="sk-..."
CLAUDE_API_KEY="sk-ant-..."
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-key"
CORS_ORIGINS="http://localhost:8080,https://your-frontend.com"
```

## Deployment Instructions

1. **Deploy Backend API**
   ```bash
   # Using Docker
   docker build -t askces-api .
   docker run -p 8000:8000 --env-file .env askces-api
   
   # Or deploy to cloud
   # Render, Railway, Heroku, AWS, etc.
   ```

2. **Set up Database**
   ```bash
   # Run migrations
   prisma migrate deploy
   
   # Seed initial data
   prisma db seed
   ```

3. **Configure Frontend**
   ```env
   VITE_API_URL=https://your-api-url.com
   VITE_API_KEY=your-api-key
   ```

4. **Test Integration**
   ```bash
   # Test endpoints
   curl -X POST https://your-api-url.com/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Analyze campaign performance"}'
   ```