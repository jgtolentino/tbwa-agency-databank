# 🚀 Lions Palette Forge - MCP Backend Integration Guide

## Overview

This guide explains how to integrate the Lions Palette Forge frontend with your MCP (Model Context Protocol) backend system, enabling seamless shared workspaces between Claude Desktop, Claude Code CLI, and the claude.ai webapp.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Integration Architecture                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │
│  │  Claude Desktop │    │  Claude Code    │    │  claude.ai      │ │
│  │                 │    │  CLI            │    │  webapp         │ │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘ │
│           │                       │                       │       │
│           └───────────────────────┼───────────────────────┘       │
│                                   │                               │
│  ┌─────────────────────────────────┼─────────────────────────────────┐ │
│  │            MCP Backend          │                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │ │
│  │  │   SQLite/       │    │   HTTP API      │    │   WebSocket     │ │ │
│  │  │   PostgreSQL    │    │   Server        │    │   Real-time     │ │ │
│  │  │   Database      │    │                 │    │   Updates       │ │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                   │                               │
│  ┌─────────────────────────────────┼─────────────────────────────────┐ │
│  │        Lions Palette Forge      │                             │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐ │ │
│  │  │   React         │    │   MCP Service   │    │   Real-time     │ │ │
│  │  │   Frontend      │    │   Adapter       │    │   Monitoring    │ │ │
│  │  └─────────────────┘    └─────────────────┘    └─────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

1. **MCP Backend**: Your PostgreSQL/SQLite MCP server running (from previous setup)
2. **Node.js & npm**: For running the React frontend
3. **Environment Variables**: Configured for your MCP backend

## 🔧 Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure it:

```bash
cd /Users/tbwa/Documents/GitHub/tbwa-lions-palette-forge
cp .env.example .env
```

Edit `.env` with your MCP backend settings:

```env
# MCP Backend Configuration
VITE_MCP_HTTP_URL=http://localhost:3000
VITE_MCP_API_KEY=your-api-key-here
VITE_DATABASE_URL=postgresql://username:password@localhost:5432/mcp_database

# Development Mode
VITE_NODE_ENV=development
VITE_USE_MOCK_API=false

# Enable Real-time Features
VITE_ENABLE_WEBSOCKET=true
VITE_WEBSOCKET_URL=ws://localhost:3000/ws
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Your MCP Backend

Ensure your MCP backend is running:

```bash
# Local SQLite version
npm run start:sqlite

# Or PostgreSQL version
npm run start:postgres

# Or HTTP API version
npm run start:http
```

### 4. Start the Frontend

```bash
npm run dev
```

## 🔄 How It Works

### 1. **Shared Data Flow**

```
Lions Palette Forge → MCP Service Adapter → MCP Backend → Database
                                        ↓
Claude Desktop ← MCP Protocol ← MCP Backend ← Database
                                        ↓
Claude Code CLI ← MCP Protocol ← MCP Backend ← Database
```

### 2. **Real-time Synchronization**

- **WebSocket Connection**: Real-time updates between all interfaces
- **Task Monitoring**: Live progress updates for video analysis
- **Cross-Interface Sync**: Work started in one interface continues in another

### 3. **Service Integration**

The MCP Service Adapter translates Lions Palette Forge API calls to MCP format:

```typescript
// Before (direct API)
const response = await fetch('/api/analyze/video', { ... });

// After (MCP integration)
const response = await mcpServiceAdapter.analyzeVideo({ ... });
```

## 🌐 Claude.ai Webapp Integration

### Current Limitations

The claude.ai webapp is not directly controllable, but we can explore these approaches:

### 1. **Browser Extension Approach**

Create a browser extension that:
- Intercepts claude.ai messages
- Syncs with MCP backend
- Provides shared context

### 2. **API Bridge Approach**

Use the Claude API to create a bridge:
- Proxy requests through MCP backend
- Maintain session state in MCP database
- Sync with other interfaces

### 3. **Bookmark Integration**

Create a bookmarklet that:
- Injects MCP sync functionality
- Saves conversations to MCP backend
- Provides cross-session continuity

## 📊 Available Features

### Video Analysis
- **MCP-powered Analysis**: Video processing through MCP backend
- **Real-time Progress**: Live updates via WebSocket
- **Cross-Interface Results**: Analysis results available in all Claude interfaces

### Campaign Management
- **Shared Campaigns**: Campaign data synced across interfaces
- **Collaborative Insights**: Team members can contribute from different interfaces
- **Persistent History**: All campaign work preserved in MCP database

### Document Processing
- **Workspace Routing**: Automatic file organization based on MCP rules
- **Shared Documents**: Documents available across all interfaces
- **Intelligent Archiving**: Automatic retention and cleanup policies

## 🔍 Testing the Integration

### 1. **Test Video Analysis**

```bash
# In Lions Palette Forge
1. Upload a video
2. Start analysis
3. Monitor progress in real-time

# In Claude Desktop
1. Query: "Show me recent video analysis results"
2. Should see the analysis from Lions Palette Forge

# In Claude Code CLI
1. Run: claude-code query "video analysis results"
2. Should see the same data
```

### 2. **Test Document Sync**

```bash
# In Lions Palette Forge
1. Upload a document
2. Extract insights

# In Claude Desktop
1. Query: "Search for documents about [topic]"
2. Should find the uploaded document

# In Claude Code CLI
1. Run: claude-code search "documents [topic]"
2. Should return the same document
```

## 🚀 Deployment Options

### 1. **Local Development**
- SQLite database
- Local MCP server
- Development mode

### 2. **Cloud Deployment**
- PostgreSQL database
- Render/Vercel deployment
- Production mode

### 3. **Hybrid Setup**
- Local development
- Cloud MCP backend
- Shared team access

## 📈 Monitoring & Debugging

### 1. **Check MCP Connection**

```javascript
// In browser console
import { mcpIntegration } from './src/config/api';
const status = await mcpIntegration.connect();
console.log('MCP Status:', status);
```

### 2. **Monitor Real-time Updates**

```javascript
// Listen for MCP events
window.addEventListener('mcp:task_update', (event) => {
  console.log('Task Update:', event.detail);
});

window.addEventListener('mcp:analysis_complete', (event) => {
  console.log('Analysis Complete:', event.detail);
});
```

### 3. **Database Inspection**

```sql
-- Check active tasks
SELECT * FROM active_tasks ORDER BY created_at DESC;

-- Check analysis results
SELECT * FROM jampacked_creative_analysis ORDER BY created_at DESC;

-- Check workspace routing
SELECT * FROM workspace_routes WHERE user_id = 'your-user-id';
```

## 🔧 Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MCP backend is running
   - Verify environment variables
   - Check firewall/network settings

2. **WebSocket Errors**
   - Ensure WebSocket URL is correct
   - Check for proxy/firewall blocking
   - Verify WebSocket support in browser

3. **Task Not Found**
   - Check task ID format
   - Verify database connection
   - Check task expiration settings

### Debug Commands

```bash
# Check MCP server status
curl http://localhost:3000/health

# Check database connection
psql $DATABASE_URL -c "SELECT COUNT(*) FROM active_tasks;"

# Check WebSocket connection
wscat -c ws://localhost:3000/ws
```

## 🎯 Next Steps

1. **Deploy to Production**: Use Render/Vercel for cloud deployment
2. **Browser Extension**: Create extension for claude.ai webapp integration
3. **Team Setup**: Configure multi-user access and permissions
4. **Custom Integrations**: Add more MCP-powered features

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review MCP backend logs
3. Test with mock data fallback
4. Contact the development team

---

This integration provides a unified creative intelligence platform that works seamlessly across all Claude interfaces while maintaining the full power of your MCP backend system! 🚀
