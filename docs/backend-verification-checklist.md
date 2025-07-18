# Backend/API Verification Checklist

## 1. Network/API Call Audit
- [ ] Open Chrome DevTools → Network tab
- [ ] Reload the Video Campaign Analysis page
- [ ] Observe all XHR/Fetch calls—confirm requests to `/api/`, `/v1/`, `/backend/` or your backend endpoint
- [ ] Click buttons like **Ask AI**, **Export PDF**, **Export Data**—check for outgoing API calls
- [ ] For each API call, inspect the response. Confirm data is not static (random values, NaN%, or always identical)

## 2. Live Data Change Test
- [ ] Upload a new campaign/video or trigger a backend-modifying action
- [ ] Confirm new results/data appear in the UI without a manual page reload
- [ ] Change a parameter (e.g., update campaign name, edit campaign metadata) and check for immediate reflection

## 3. API Failure/Mock Detection
- [ ] In DevTools, toggle **Offline mode** (simulate network disconnect)
- [ ] Reload or trigger analysis—real backend: error or loading indicator appears
- [ ] Mock: UI still shows previous data, loads instantly, or no error shown

## 4. Source Code Verification
- [ ] Search for mock data/services in codebase:
```bash
grep -ri mock src/
grep -ri fake src/
```
- [ ] Locate API service files (e.g., `api.js`, `campaignService.ts`)
- [ ] Confirm actual API calls (`fetch`, `axios`) with remote URLs
- [ ] Verify there's no fallback to local JS/TS files or hardcoded responses

## 5. Backend Log/DB Check (if you have access)
- [ ] Check backend logs for recent requests from your session
- [ ] Check the database for records matching your UI/test changes

## 6. Automated API Test (Optional)
- [ ] Run API test suite (`npm test`, `pytest`, or via Postman collection)
- [ ] Confirm all endpoints return expected, dynamic values

## Command Examples

### List API network calls (Chrome DevTools Console)
```javascript
performance.getEntriesByType('resource')
  .filter(e => e.initiatorType === 'xmlhttprequest' || e.initiatorType === 'fetch')
  .map(e => e.name)
```

### Search for mock data in code
```bash
grep -r mock src/
grep -r fake src/
```

## Pass/Fail Criteria
- **Pass all steps above** = confirmed real backend
- **Any fail, or mock detected** = not a real full-stack implementation

Execute as audit script or code review task, no manual confirmation needed.