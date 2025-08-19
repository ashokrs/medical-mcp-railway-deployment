# Final Integration Steps

Now that I've seen your original `index.ts` file, here are the exact steps to integrate everything:

## Step 1: Set Up Directory Structure

```bash
cd /Users/ashok/Code/apps/mcp/medical-mcp

# Create the new structure
mkdir -p src/web
mkdir -p src/mcp
mkdir -p public
mkdir -p logs

# Move your original files to the mcp subfolder
mv src/index.ts src/mcp/
mv src/utils.js src/mcp/  # If this file exists
```

## Step 2: Place the New Files

### A. Update package.json
Replace your current `package.json` with the integrated version I provided above.

### B. Create Web Interface Files

**Place in `src/web/`:**
1. `medical-mcp-wrapper.ts` (I created this above)
2. `server.ts` (I created this above)

**Place in `public/`:**
1. `index.html` (from my earlier artifacts)
2. `sw.js` (from my earlier artifacts)

**Place in project root:**
1. `Dockerfile` (from my earlier artifacts)
2. `docker-compose.yml` (from my earlier artifacts)
3. `railway.toml` (from my earlier artifacts)
4. Updated `tsconfig.json` (from my earlier artifacts)

## Step 3: Verify File Structure

Your final structure should look like this:

```
medical-mcp/
├── src/
│   ├── mcp/
│   │   ├── index.ts              # Your original MCP server
│   │   └── utils.js              # Your original utilities
│   └── web/
│       ├── medical-mcp-wrapper.ts # Wrapper for web use
│       └── server.ts              # Web API server
├── public/
│   ├── index.html                # Frontend
│   └── sw.js                     # Service worker
├── build/                        # Will be created after build
├── logs/                         # For logging
├── package.json                  # Updated with web dependencies
├── tsconfig.json                 # Updated TypeScript config
├── Dockerfile                    # For Railway deployment
├── docker-compose.yml            # For local development
├── railway.toml                  # Railway configuration
└── README.md                     # Your original README
```

## Step 4: Install Dependencies

```bash
# Install new dependencies (includes original + web interface)
npm install

# Install tsx for development (TypeScript execution)
npm install --save-dev tsx
```

## Step 5: Build and Test

```bash
# Build everything
npm run build

# Test the original MCP server (should still work)
npm run start:mcp

# In another terminal, test the web interface
npm run start:web

# Or use development mode with auto-reload
npm run dev:web
```

## Step 6: Verify Both Modes Work

### Test Original MCP Server
```bash
npm run start:mcp
# This should show: "Medical MCP Server running on stdio"
# This preserves your Claude Desktop integration
```

### Test Web Interface
```bash
npm run start:web
# This should show: "🏥 Medical MCP Web API Server running on port 3000"
# Visit: http://localhost:3000
```

### Test API Endpoints
```bash
# Test health check
curl http://localhost:3000/health

# Test drug search
curl -X POST http://localhost:3000/api/drugs/search \
  -H "Content-Type: application/json" \
  -d '{"query": "aspirin", "limit": 3}'

# Test literature search
curl -X POST http://localhost:3000/api/literature/search \
  -H "Content-Type: application/json" \
  -d '{"query": "breast cancer", "max_results": 5}'
```

## Step 7: Deploy to Railway

### Option 1: Using Railway CLI
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Option 2: Using GitHub Integration
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Medical MCP Web Interface Integration"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Deploy on Railway:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will detect the Dockerfile

3. Set Environment Variables in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=3000
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   ```

## Step 8: Troubleshooting

### If you get import errors:
```bash
# Make sure utils.js exports are compatible
# Check if your utils.js file exports the functions correctly
cat src/mcp/utils.js | head -20
```

### If TypeScript compilation fails:
```bash
# Check TypeScript version and fix any type issues
npx tsc --noEmit  # Check for type errors without emitting files
```

### If the web server can't find the original functions:
The wrapper file (`medical-mcp-wrapper.ts`) imports from `../mcp/utils.js`. Make sure:
1. Your `utils.js` file is in `src/mcp/`
2. The exported function names match exactly:
   - `searchDrugs`
   - `getDrugByNDC`
   - `getHealthIndicators`
   - `searchPubMedArticles`
   - `searchRxNormDrugs`
   - `searchGoogleScholar`

## Step 9: Customization

### To add more breast cancer specific queries:
Edit the arrays in `src/web/server.ts`:
```typescript
// Add more drugs to breast cancer search
const breastCancerDrugs = [
    'tamoxifen', 'herceptin', 'anastrozole', 'letrozole', 
    'fulvestrant', 'pertuzumab', 'ribociclib', 'doxorubicin', 
    'cyclophosphamide',
    // Add more here
    'paclitaxel', 'carboplatin', 'trastuzumab'
];
```

### To modify the frontend:
Edit `public/index.html` to customize:
- Colors and styling
- Tool descriptions
- Example queries
- Breast cancer dashboard content

## Step 10: Production Considerations

### Security:
- API rate limiting is configured (100 requests per 15 minutes)
- CORS is enabled for development
- Helmet.js provides security headers

### Performance:
- Compression is enabled
- Static file serving is optimized
- Error handling prevents crashes

### Monitoring:
- Health check endpoint at `/health`
- Detailed error logging
- API response timing

## Commands Summary

```bash
# Development
npm run dev:mcp      # Original MCP server with auto-reload
npm run dev:web      # Web interface with auto-reload

# Production
npm run start:mcp    # Original MCP server
npm run start:web    # Web interface
npm run start        # Same as start:web (default)

# Building
npm run build        # Compile TypeScript
npm run clean        # Clean build directory

# Testing
npm test             # Run tests
npm run health-check # Test web server health
```

## Railway Deployment Environment Variables

Set these in your Railway dashboard:
```
NODE_ENV=production
PORT=3000
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Success Indicators

✅ **Original MCP still works**: Claude Desktop can still connect
✅ **Web interface loads**: Visit deployed URL shows the medical research interface
✅ **API endpoints respond**: Health check returns 200
✅ **Search tools work**: Drug search returns results
✅ **Breast cancer dashboard loads**: Specialized tools work
✅ **Responsive design**: Works on mobile and desktop

## What You Get

1. **Preserved Functionality**: Your original MCP server continues to work with Claude Desktop
2. **Beautiful Web Interface**: Modern, responsive frontend for medical research
3. **REST API**: RESTful endpoints for all medical tools
4. **Breast Cancer Research Dashboard**: Specialized interface for breast cancer research
5. **Production Ready**: Secure, scalable, and deployable to Railway
6. **Dual Mode**: Can run as MCP server OR web application

The integration maintains complete backward compatibility while adding powerful web capabilities. Your Claude Desktop setup continues to work exactly as before, while you gain a sophisticated web interface for broader access to the medical research tools.
