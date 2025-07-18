# Testing the Document Extraction Integration

## Prerequisites

Ensure you have:
- Node.js installed
- The project dependencies installed (`npm install`)

## Testing Steps

### 1. Start the Development Server

```bash
npm run dev
```

The application should start at `http://localhost:5173` (or another port if 5173 is busy).

### 2. Navigate to Ask Ces

1. Open the application in your browser
2. You should see the Ask Ces chat interface

### 3. Test the Document Extraction Modal

1. **Click the paperclip icon** (📎) in the chat input area
2. The "Document Extraction Setup" modal should appear

### 4. Test Modal Functionality

#### A. Input Validation
1. Try clicking "Test Connection" without entering any data
   - Button should be disabled
2. Enter only a folder ID without uploading credentials
   - "Test Connection" should still be disabled
3. Upload a non-JSON file
   - Should show error: "Please upload a valid JSON file"

#### B. Mock API Testing (Development Mode)
1. Enter any folder ID (e.g., `test123`)
2. Upload any valid JSON file (can use the package.json as a test)
3. Click "Test Connection"
   - Should show loading state
   - After ~1.5 seconds, should show success message
   - Should display: "Found 42 files in TBWA Campaign Assets 2024"

#### C. Extraction Options
1. Toggle the checkboxes for extraction options
   - All should be checked by default
   - Should be able to uncheck/check each option

#### D. Run Extraction
1. After successful connection test, click "Run Full ETL"
   - Should show progress bar
   - Progress should update every 2 seconds
   - Should show "Processing: X / 42 files"
   - When complete, should show success message with:
     - 42 documents processed
     - 210 pages extracted
     - 42 embeddings generated
     - Tags: campaign-2024, creative, archived

### 5. UI/UX Verification

- [ ] Modal is responsive and scrollable on mobile
- [ ] TBWA brand colors are applied (yellow/turquoise gradient on buttons)
- [ ] Dark mode compatibility (if implemented)
- [ ] Smooth animations and transitions
- [ ] Clear error states and success messages
- [ ] Modal can be closed with ESC key or clicking outside
- [ ] Modal cannot be closed while extraction is in progress

### 6. Console Verification

Open browser DevTools and check:
- No console errors
- API calls are made to `/api/ces/extraction/*` endpoints
- In development mode, should see mock responses

## Expected Behavior Summary

✅ **Success Criteria:**
- Modal opens when paperclip is clicked
- Form validation works correctly
- Mock API simulates real behavior
- Progress tracking shows updates
- Success/error states display properly
- Modal integrates seamlessly with chat UI

## Troubleshooting

If you encounter issues:

1. **Modal doesn't open:**
   - Check console for errors
   - Verify DocumentExtractionModal is imported correctly

2. **Styles look broken:**
   - Run `npm install` to ensure all dependencies are installed
   - Check that Tailwind CSS is processing correctly

3. **Mock API not working:**
   - Verify you're in development mode
   - Check that `import.meta.env.DEV` is true
   - Look for network errors in DevTools

## Production Testing

To test with a real backend:

1. Set up the backend server (see BACKEND_SETUP.md)
2. Update `.env` file:
   ```env
   VITE_API_URL=http://localhost:3001/api
   VITE_USE_MOCK_API=false
   ```
3. Start both frontend and backend
4. Use real Google Drive folder ID and service account credentials

## Next Steps

After successful testing:
1. Implement the actual backend server
2. Set up Google Cloud and Supabase
3. Deploy to production
4. Add authentication and security measures