# Document Extraction & Archiving Feature

## Overview

The Document Extraction & Archiving feature enables Ask Ces to process documents from Google Drive folders, extract content, generate embeddings, and archive them for AI-powered analysis.

## Features

- 📁 **Google Drive Integration**: Connect to any Google Drive folder using service account credentials
- 🔍 **Smart Extraction**: Process PDFs, images, and documents with OCR capabilities
- 🏷️ **Auto-tagging**: Automatically categorize and tag creative documents
- 📊 **Vector Embeddings**: Generate embeddings for semantic search
- 📈 **Real-time Progress**: Track extraction progress with live updates
- 🎨 **TBWA Branded UI**: Seamless integration with the Ask Ces interface

## UI Integration

### Access Point
Click the **paperclip icon** (📎) in the Ask Ces chat interface to open the Document Extraction modal.

### Workflow

1. **Enter Google Drive Folder ID**
   - Find the folder ID in your Google Drive URL after `/folders/`
   - Example: `1XYZabodEfGhIjKlMnOpQrStUvWxYz`

2. **Upload Service Account Credentials**
   - Upload the JSON file containing your Google service account credentials
   - This file is obtained from Google Cloud Console

3. **Configure Extraction Options**
   - Process Images & Visual Content
   - Extract Text from Documents
   - Generate Vector Embeddings
   - Auto-tag Creative Documents

4. **Test Connection**
   - Validates credentials and folder access
   - Shows folder name and file count

5. **Run Full ETL**
   - Starts the extraction process
   - Shows real-time progress
   - Displays results upon completion

## Technical Architecture

### Frontend Components

- **DocumentExtractionModal**: Main UI component for the extraction interface
- **Progress Tracking**: Real-time status updates using polling
- **Error Handling**: Comprehensive error states and user feedback

### API Endpoints

```typescript
POST /api/ces/extraction/test-connection
- Tests Google Drive connection
- Returns folder info and file count

POST /api/ces/extraction/start
- Initiates extraction job
- Returns job ID for tracking

GET /api/ces/extraction/status/{jobId}
- Returns current job status
- Includes progress percentage and results
```

### Mock API (Development)

The frontend includes a mock API for development and testing:
- Simulates connection testing
- Provides fake progress updates
- Returns sample extraction results

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud account (for production)
- Supabase account (for production)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/jgtolentino/tbwa-lions-palette-forge.git
cd tbwa-lions-palette-forge

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run in development mode (with mock API)
npm run dev
```

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_USE_MOCK_API=true  # Set to false for real backend

# For production backend
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Production Setup

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions on:
- Setting up the backend server
- Configuring Google Drive API
- Setting up Supabase for document storage
- Deploying to production

## UI Customization

The modal uses TBWA brand colors and can be customized via Tailwind classes:

```typescript
// TBWA Brand Colors
- Yellow: hsl(51, 100%, 50%)
- Turquoise: hsl(160, 100%, 50%)
- Black: hsl(0, 0%, 0%)
- White: hsl(0, 0%, 100%)
```

## Security Considerations

- Service account credentials are never stored on the frontend
- All file uploads are validated
- API endpoints should be protected with authentication in production
- Rate limiting should be implemented for extraction endpoints

## Future Enhancements

- [ ] Batch folder processing
- [ ] Scheduled extraction jobs
- [ ] WebSocket for real-time updates
- [ ] Integration with other cloud storage providers
- [ ] Advanced filtering and search in extracted documents
- [ ] Export extraction reports

## Troubleshooting

### Common Issues

1. **"Invalid file" error when uploading credentials**
   - Ensure the file is a valid JSON file
   - Check that it's a service account key from Google Cloud

2. **Connection test fails**
   - Verify the folder ID is correct
   - Ensure the service account has access to the folder
   - Check that Google Drive API is enabled

3. **Extraction gets stuck**
   - Check browser console for errors
   - Verify backend server is running
   - Check network requests in DevTools

## Support

For issues or questions:
- Check the [BACKEND_SETUP.md](./BACKEND_SETUP.md) guide
- Review the mock API implementation for expected behavior
- Open an issue on GitHub

## License

This feature is part of the TBWA Lions Palette Forge project.