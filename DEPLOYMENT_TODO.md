# 📋 Deployment TODO List

## 🚀 Complete Deployment Steps for Lions Palette Forge

### Phase 1: Deploy MCP Backend (30 mins)

- [ ] **1. Navigate to MCP server directory**
  ```bash
  cd /Users/tbwa/Documents/GitHub/mcp-sqlite-server
  ```

- [ ] **2. Test Docker build locally**
  ```bash
  ./deploy-docker.sh
  ```

- [ ] **3. Initialize Git repository (if not already)**
  ```bash
  git init
  echo "node_modules/" >> .gitignore
  echo ".env" >> .gitignore
  git add .
  git commit -m "Initial MCP backend with Docker support"
  ```

- [ ] **4. Create GitHub repository**
  - Go to https://github.com/new
  - Name: `mcp-sqlite-backend`
  - Make it private (if desired)
  - Don't initialize with README

- [ ] **5. Push to GitHub**
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/mcp-sqlite-backend.git
  git branch -M main
  git push -u origin main
  ```

- [ ] **6. Deploy on Render**
  - Go to https://render.com
  - Click "New +" → "Web Service"
  - Connect GitHub account
  - Select `mcp-sqlite-backend` repo
  - Name: `mcp-sqlite-backend`
  - Environment: Docker
  - Click "Create Web Service"
  - Wait for deployment (5-10 mins)

- [ ] **7. Get backend URL**
  - Copy URL: `https://mcp-sqlite-backend-xxxxx.onrender.com`
  - Save API key from Render dashboard

### Phase 2: Update Frontend Configuration (10 mins)

- [ ] **8. Navigate to frontend directory**
  ```bash
  cd /Users/tbwa/Documents/GitHub/tbwa-lions-palette-forge
  ```

- [ ] **9. Update .env file**
  ```bash
  echo "VITE_MCP_HTTP_URL=https://mcp-sqlite-backend-xxxxx.onrender.com" > .env
  echo "VITE_USE_MOCK_API=false" >> .env
  echo "VITE_API_KEY=your-render-api-key" >> .env
  ```

- [ ] **10. Test with live backend**
  ```bash
  npm run dev
  ```
  - Open http://localhost:8080
  - Check BackendStatusMonitor shows "Live API"
  - Test video analysis feature

- [ ] **11. Run verification**
  ```bash
  npm run verify-backend-live-strict
  ```
  - Must show: `REAL_BACKEND_CONFIRMED`

### Phase 3: Deploy Frontend (20 mins)

- [ ] **12. Build for production**
  ```bash
  npm run build
  ```

- [ ] **13. Test production build**
  ```bash
  npm run preview
  ```
  - Verify all features work
  - Check no console errors

- [ ] **14. Deploy to Vercel**
  ```bash
  npm install -g vercel
  vercel --prod
  ```
  - Follow prompts
  - Set environment variables in Vercel dashboard

  **OR Deploy to Netlify:**
  ```bash
  npm install -g netlify-cli
  netlify deploy --prod --dir=dist
  ```

- [ ] **15. Configure production environment**
  - Go to Vercel/Netlify dashboard
  - Add environment variables:
    - `VITE_MCP_HTTP_URL`
    - `VITE_USE_MOCK_API=false`
    - `VITE_API_KEY`

### Phase 4: Post-Deployment Verification (10 mins)

- [ ] **16. Test production frontend**
  - Visit your deployed URL
  - Check BackendStatusMonitor
  - Test all features

- [ ] **17. Monitor backend logs**
  - Check Render dashboard
  - Verify incoming requests
  - Check for errors

- [ ] **18. Security check**
  - [ ] API key not exposed in frontend
  - [ ] CORS configured correctly
  - [ ] HTTPS enforced
  - [ ] Rate limiting active

### Phase 5: Documentation & Handoff (10 mins)

- [ ] **19. Create deployment documentation**
  ```bash
  cat > DEPLOYMENT_INFO.md << EOF
  # Deployment Information
  
  ## Backend
  - URL: https://mcp-sqlite-backend-xxxxx.onrender.com
  - Provider: Render
  - Database: SQLite (upgrade to PostgreSQL for scale)
  
  ## Frontend
  - URL: https://tbwa-lions-palette-forge.vercel.app
  - Provider: Vercel
  
  ## Monitoring
  - Backend logs: Render dashboard
  - Frontend analytics: Vercel dashboard
  
  ## Maintenance
  - Database backups: Weekly (implement)
  - SSL certificates: Auto-renewed
  - Scaling: Upgrade to PostgreSQL when needed
  EOF
  ```

- [ ] **20. Final checklist**
  - [ ] All mock data removed
  - [ ] Backend deployed and healthy
  - [ ] Frontend connected to live backend
  - [ ] All features tested
  - [ ] Documentation complete
  - [ ] Credentials stored securely

## 🎯 Success Criteria

✅ **Backend Health Check**
```bash
curl https://mcp-sqlite-backend-xxxxx.onrender.com/health
# Should return: {"status":"healthy",...}
```

✅ **Frontend Shows Live Data**
- BackendStatusMonitor: "Live API"
- No mock data warnings
- Real-time data updates

✅ **Verification Passes**
```bash
npm run verify-backend-strict
# Result: PASSED

npm run verify-backend-live-strict  
# Result: REAL_BACKEND_CONFIRMED
```

## 🚨 Troubleshooting

**If backend fails to deploy:**
- Check Docker logs in Render
- Verify all files are committed
- Check environment variables

**If frontend can't connect:**
- Verify CORS settings
- Check API key
- Test backend URL directly

**If verification fails:**
- Ensure no mock patterns remain
- Check all API endpoints
- Verify environment variables

---

**Estimated Total Time: 1 hour 10 minutes**

Once all items are checked, your Lions Palette Forge application will be fully deployed with a real backend!