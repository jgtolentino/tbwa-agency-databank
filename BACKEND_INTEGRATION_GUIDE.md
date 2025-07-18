# 🚀 Backend Integration Guide - Lions Palette Forge

## ✅ Current Status
- **Backend URL**: https://mcp-sqlite-server.onrender.com ✅ LIVE
- **Frontend**: Ready for backend integration
- **Environment**: Configured in `.env` file

## 🎯 Quick Start

### Option 1: Use the Start Script (Recommended)
```bash
./start-with-backend.sh
```

### Option 2: Manual Start
```bash
# 1. Verify backend is running
curl https://mcp-sqlite-server.onrender.com/health

# 2. Start the app
npm run dev
```

## 🔧 How the Integration Works

### 1. **Environment Configuration** (`.env`)
```env
VITE_MCP_HTTP_URL=https://mcp-sqlite-server.onrender.com
VITE_MCP_API_KEY=sk-test-123456
VITE_USE_MOCK_API=false  # Must be false for backend
```

### 2. **API Endpoints**
The app connects to these backend endpoints:
- `/api/jampacked/analyze` - Video analysis
- `/api/jampacked/campaigns` - Campaign data
- `/api/documents/extract` - Document extraction
- `/api/jampacked/insights` - Market intelligence

### 3. **Features Available with Backend**
- ✅ **Live Video Analysis**: Upload and analyze real videos
- ✅ **Campaign Dashboard**: View real campaign data
- ✅ **Document Extraction**: Extract insights from PDFs/PPTs
- ✅ **Market Intelligence**: Get competitive insights
- ✅ **Backend Status Monitor**: Shows connection status

## 📱 Using the App

### 1. **Check Backend Status**
- Look for the "Backend Status" indicator in the top-right
- Green = Connected, Red = Disconnected

### 2. **Video Analysis**
1. Click "Video Analysis" in navigation
2. Upload a video file OR enter a video URL
3. Click "Analyze Video"
4. View results with CES score and insights

### 3. **Campaign Dashboard**
1. Click "Campaign Dashboard"
2. View real campaign analytics
3. Use the query box to ask questions about campaigns

### 4. **Document Extraction**
1. Click "Extract" button
2. Upload PDF/PPT documents
3. View extracted insights

## 🔍 Troubleshooting

### Issue: "Backend unavailable" error
**Solution**: 
1. Check if backend is running: `curl https://mcp-sqlite-server.onrender.com/health`
2. Verify `.env` file has correct URL
3. Make sure `VITE_USE_MOCK_API=false`

### Issue: App shows mock data
**Solution**:
1. Set `VITE_USE_MOCK_API=false` in `.env`
2. Restart the development server
3. Clear browser cache

### Issue: CORS errors
**Solution**: Backend is configured for CORS. If issues persist:
1. Try incognito/private browsing
2. Clear browser cache and cookies

## 🚀 Deployment

### Deploy Frontend to Vercel
```bash
# Build for production
npm run build

# Deploy
vercel --prod
```

### Deploy Frontend to Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📊 Backend API Reference

### Health Check
```bash
GET https://mcp-sqlite-server.onrender.com/health
```

### Analyze Video
```bash
POST https://mcp-sqlite-server.onrender.com/api/jampacked/analyze
Content-Type: application/json

{
  "videoUrl": "https://example.com/video.mp4",
  "options": {
    "enableEnrichment": true
  }
}
```

### Get Campaigns
```bash
GET https://mcp-sqlite-server.onrender.com/api/jampacked/campaigns
```

## 💡 Tips

1. **Performance**: The backend may have a cold start (first request takes 10-15 seconds)
2. **Data Persistence**: Data is stored in SQLite on the backend
3. **Rate Limits**: Free tier has rate limits, upgrade for production use
4. **API Key**: Current key is for testing; get a production key for real use

## 🆘 Need Help?

1. Check backend logs at: https://dashboard.render.com
2. View browser console for frontend errors
3. Run `npm run verify-backend-live` to test connection

---

**Ready to go!** The backend is live and the app is configured to use it. Just run `npm run dev` or `./start-with-backend.sh` to start! 🎉