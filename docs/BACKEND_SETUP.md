# Backend Setup for Document Extraction

This guide explains how to set up the backend API server for the document extraction feature.

## Quick Start (Development Mode)

The application currently runs with mock APIs in development mode. To test the document extraction UI:

```bash
# Install dependencies
npm install

# Run in development mode (uses mock API)
npm run dev
```

## Full Backend Setup

To implement the actual backend with Google Drive integration:

### 1. Create Backend Server

Create a new directory for the backend:

```bash
mkdir tbwa-lions-backend
cd tbwa-lions-backend
npm init -y
```

### 2. Install Dependencies

```bash
npm install express cors multer googleapis @supabase/supabase-js dotenv
npm install -D @types/express @types/cors @types/multer typescript nodemon
```

### 3. Backend Implementation

Create `server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { google } from 'googleapis';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Test connection endpoint
app.post('/api/ces/extraction/test-connection', upload.single('credentials'), async (req, res) => {
  try {
    const { folderId } = req.body;
    const credentialsFile = req.file;
    
    if (!folderId || !credentialsFile) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    const credentials = JSON.parse(credentialsFile.buffer.toString());
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive.readonly']
    });

    const drive = google.drive({ version: 'v3', auth });

    // Test connection
    const folder = await drive.files.get({
      fileId: folderId,
      fields: 'name'
    });

    const files = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType)'
    });

    res.json({
      success: true,
      folderName: folder.data.name,
      fileCount: files.data.files?.length || 0
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Start extraction endpoint
app.post('/api/ces/extraction/start', upload.single('credentials'), async (req, res) => {
  try {
    const { folderId, options } = req.body;
    const credentialsFile = req.file;
    
    const credentials = JSON.parse(credentialsFile.buffer.toString());
    const extractionOptions = JSON.parse(options);
    
    const jobId = `job_${Date.now()}`;
    
    // Start async job (implement your extraction logic here)
    startExtractionJob({
      jobId,
      folderId,
      credentials,
      options: extractionOptions
    });
    
    res.json({
      jobId,
      estimatedTime: 300,
      message: 'Extraction job started'
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get job status endpoint
app.get('/api/ces/extraction/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Get job status from your job tracking system
    const status = await getJobStatus(jobId);
    
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 4. Environment Variables

Create `.env` file in backend:

```env
# Server
PORT=3001

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key

# Google Drive
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

### 5. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Drive API
4. Create a service account
5. Download the JSON credentials
6. Place in backend directory as `service-account.json`

### 6. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration SQL from the implementation guide
3. Get your project URL and service key
4. Add to `.env` file

### 7. Run Backend Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Frontend Configuration

Update the frontend `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=false
```

## Testing the Integration

1. Start the backend server
2. Start the frontend with `npm run dev`
3. Click the paperclip icon in the chat interface
4. Upload a Google service account JSON file
5. Enter a Google Drive folder ID
6. Test the connection
7. Run the extraction

## Deployment

For production deployment:

1. Deploy backend to your preferred platform (Vercel, Railway, etc.)
2. Update `VITE_API_URL` to point to production backend
3. Deploy frontend to Vercel/Netlify
4. Ensure CORS is properly configured

## Security Considerations

- Never commit service account credentials
- Use environment variables for sensitive data
- Implement proper authentication for production
- Rate limit the extraction endpoints
- Validate file uploads and folder access