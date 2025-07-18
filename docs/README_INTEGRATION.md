# Lions Palette Forge - CES & Video Analysis Integration

## Overview
This document describes the integration of CES Dashboard and InsightVideo AI capabilities into the Lions Palette Forge application.

## New Features Added

### 1. Video Analysis Page (`/video-analysis`)
- **Dual Input Methods**:
  - File upload with drag & drop support
  - Video URL input (YouTube, Vimeo, direct video links)
- AI-powered video campaign analysis with CES scoring
- Visual timeline analysis of campaign effectiveness
- Scene detection and emotion tracking
- Speech analysis and transcription
- Custom Q&A about video content
- Export capabilities (PDF, CSV, JSON)

### 2. Campaign Dashboard (`/campaign-dashboard`)
- Portfolio-level campaign intelligence
- Real-time CES score tracking
- Industry benchmarking
- Feature importance analysis
- Performance trends and predictions
- Recent campaign overview

## Technical Implementation

### Routes Added
```typescript
// src/App.tsx
<Route path="/video-analysis" element={<VideoAnalysis />} />
<Route path="/campaign-dashboard" element={<CampaignDashboard />} />
<Route path="/dashboard" element={<CampaignDashboard />} />
```

### Navigation Updated
- Added navigation links to new pages in the main navigation bar
- Active state highlighting for current page
- Consistent TBWA branding with yellow accent color

### Services Created
1. **videoAnalysis.ts** - Video analysis API integration
   - Upload and analyze videos
   - Query analysis results
   - Export reports
   - Batch processing

2. **campaignService.ts** - Campaign analytics service
   - Get campaign metrics
   - Industry benchmarks
   - Historical data

3. **ces-backend.ts** - CES backend integration
   - Document upload and processing
   - Feature extraction
   - CES score calculation

### Components Created
- **VideoAnalysis.tsx** - Complete video upload and analysis page
- **CampaignDashboard.tsx** - Comprehensive campaign dashboard
- **CampaignAnalysisViewer.tsx** - Results viewer component

## Configuration

### API Endpoints
Configure the following environment variables:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_CES_API_URL=http://localhost:8000
VITE_LAYOUTMIND_URL=http://localhost:10000
```

### Tailwind Configuration
Added TBWA brand colors including:
- `tbwa-red: #dc2626` for CES branding
- Existing TBWA yellow, turquoise, black, white, gray

## Usage

### Video Analysis
1. Navigate to `/video-analysis`
2. **Choose input method**:
   - **Upload File**: Drag & drop or browse for video files (MP4, MOV, AVI, WebM)
   - **Video URL**: Paste YouTube, Vimeo, or direct video URLs
3. Click "Start Analysis" to process
4. View results including:
   - CES Score
   - Timeline analysis
   - Feature importance
   - AI recommendations
5. Ask custom questions about the video
6. Export results as PDF or CSV

#### Supported Video Sources
- **File Upload**: MP4, MOV, AVI, WebM (max 500MB)
- **YouTube**: https://www.youtube.com/watch?v=... or https://youtu.be/...
- **Vimeo**: https://vimeo.com/...
- **Direct Video Links**: Any direct link to .mp4, .mov, .avi, .webm files

### Campaign Dashboard
1. Navigate to `/campaign-dashboard`
2. Filter by:
   - Time range
   - Industry
   - Campaign type
3. View insights:
   - Portfolio overview
   - CES distribution
   - Performance trends
   - Industry benchmarks
   - Recent campaigns

## Next Steps

### Backend Integration
1. Connect to actual InsightVideo AI backend API
2. Implement authentication flow
3. Set up WebSocket for real-time updates

### Feature Enhancements
1. Add campaign comparison view
2. Implement collaborative features
3. Add more export formats
4. Create custom report builder

### Testing
1. Add unit tests for services
2. Add integration tests for API calls
3. Add E2E tests for user flows

## Dependencies
No additional dependencies were required. The integration uses:
- Existing React/TypeScript setup
- shadcn/ui components
- Recharts for visualizations
- Framer Motion for animations
- React Router for navigation

## Support
For questions or issues, please contact the development team or refer to the main project documentation.