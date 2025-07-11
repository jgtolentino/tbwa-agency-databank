# 🚀 Quick Implementation Guide - Ask CES Backend Integration

## Overview
This guide shows how to quickly wire up the Ask CES interface to work with real backend functionality.

## Step 1: Update Your Current Chat Component

Replace the existing `CESChatHandler.tsx` with the new version that includes backend integration:

```bash
# Backup current version
mv src/components/CESChatHandler.tsx src/components/CESChatHandler.backup.tsx

# Use the new version
mv src/components/CESChatHandlerV2.tsx src/components/CESChatHandler.tsx
```

## Step 2: Install Required Dependencies

```bash
npm install axios @tanstack/react-query recharts
```

## Step 3: Set Up API Service

The API service is already created at `src/services/askCesApi.ts`. This handles:
- Campaign analysis
- Creative brief generation
- Market insights
- Competitor analysis
- Chat interactions

## Step 4: Configure Environment Variables

Update your `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000  # Your backend URL
VITE_API_KEY=your-api-key-here

# AI Integration (if using directly from frontend)
VITE_OPENAI_API_KEY=sk-...
VITE_CLAUDE_API_KEY=sk-ant-...
```

## Step 5: Quick Backend Setup (if needed)

If you don't have a backend yet, here's the fastest way:

### Option A: Use Supabase (Fastest)

1. Create a Supabase project
2. Use their built-in database and Edge Functions

```sql
-- Create tables in Supabase SQL editor
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  brand TEXT,
  impressions INT,
  clicks INT,
  conversions INT,
  spend DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  type TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Option B: Deploy the Sample Backend

Use the provided FastAPI or Express.js implementation:

```bash
# FastAPI
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Express.js
cd backend
npm install
npm start
```

## Step 6: Test the Integration

1. **Start your backend** (if not using Supabase)
2. **Start the frontend**:
   ```bash
   npm run dev
   ```
3. **Test each feature**:
   - Type "Analyze campaign performance for Q1 2024"
   - Type "Generate creative brief for summer campaign"
   - Type "Show market insights for retail industry"
   - Type "Compare our performance vs competitors"

## Step 7: Quick Fixes for Common Issues

### CORS Errors
Add to your backend:
```python
# FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Authentication Issues
Temporarily disable auth for testing:
```typescript
// In askCesApi.ts, comment out auth header
// config.headers.Authorization = `Bearer ${token}`;
```

### No Data Returned
Use mock data initially:
```typescript
// In your API endpoint
if (!data || data.length === 0) {
  return getMockData();
}
```

## Step 8: Progressive Enhancement

Start with basic functionality and add features:

1. **Phase 1**: Get chat working with static responses
2. **Phase 2**: Connect to real database
3. **Phase 3**: Add AI integration
4. **Phase 4**: Implement visualizations
5. **Phase 5**: Add file uploads and exports

## Quick Mock Backend (For Testing)

If you need to test immediately without a real backend, create `mockServer.js`:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock endpoints
app.post('/api/analyze-campaign', (req, res) => {
  res.json({
    performance: {
      impressions: 150000,
      clicks: 7500,
      conversions: 450,
      spend: 5000,
      roi: 2.5,
      ctr: 0.05,
      cvr: 0.06
    },
    insights: [
      {
        type: 'opportunity',
        title: 'Improve CTR',
        description: 'CTR is below industry average',
        impact: 'high',
        confidence: 0.85
      }
    ],
    recommendations: [
      {
        action: 'A/B test new creatives',
        expectedImpact: '20% CTR improvement',
        priority: 1
      }
    ]
  });
});

app.post('/api/chat', (req, res) => {
  res.json({
    response: {
      content: 'Based on your campaign data, I recommend focusing on improving CTR through creative optimization.',
      type: 'text'
    },
    metadata: {
      processingTime: 0.5,
      confidence: 0.9,
      sources: ['mock_data']
    }
  });
});

app.listen(8000, () => {
  console.log('Mock server running on port 8000');
});
```

Run with:
```bash
node mockServer.js
```

## Next Steps

1. **Implement real database queries**
2. **Add Claude/OpenAI integration**
3. **Build visualization components**
4. **Add authentication**
5. **Deploy to production**

## Resources

- Backend implementation: `/backend/SAMPLE_API_IMPLEMENTATION.md`
- API service: `/src/services/askCesApi.ts`
- Updated chat component: `/src/components/CESChatHandlerV2.tsx`
- Full TODO list: `/ASK_CES_IMPLEMENTATION_TODO.md`

---

**Remember**: Start simple, test often, and incrementally add features. The UI is ready - you just need to connect it to real data!