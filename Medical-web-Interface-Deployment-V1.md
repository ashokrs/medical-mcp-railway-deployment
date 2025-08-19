# Medical MCP Web Interface

A sophisticated web application that provides a beautiful UI/UX for the Medical MCP service, offering comprehensive medical information access through FDA, WHO, PubMed, and other authoritative medical APIs.

## 🌟 Features

- **Modern UI/UX**: Glass morphism design with smooth animations
- **Drug Information**: Search FDA database for comprehensive drug data
- **Health Statistics**: Access WHO Global Health Observatory data
- **Medical Literature**: Search PubMed for research articles
- **Drug Nomenclature**: Standardized drug names from RxNorm
- **Breast Cancer Dashboard**: Specialized research dashboard
- **Google Scholar Integration**: Academic research discovery
- **Responsive Design**: Works on all device sizes
- **PWA Ready**: Progressive Web App capabilities
- **API Middleware**: RESTful API layer for all medical data

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│   Frontend      │────│  API Middleware  │────│  Medical APIs       │
│   (HTML/JS/CSS) │    │  (Express.js)    │    │  (FDA/WHO/PubMed)   │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
```

## 🚀 Railway Deployment

### Prerequisites

1. Railway account ([railway.app](https://railway.app))
2. GitHub repository with this code
3. Railway CLI (optional)

### Deployment Steps

#### Option 1: GitHub Integration (Recommended)

1. **Push code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Medical MCP Web Interface"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will automatically detect the Dockerfile

3. **Configure Environment Variables** (in Railway dashboard):
   ```
   NODE_ENV=production
   PORT=3000
   PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
   PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
   ```

4. **Custom Domain** (optional):
   - In Railway dashboard, go to Settings → Domains
   - Add your custom domain
   - Configure DNS settings as instructed

#### Option 2: Railway CLI

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

### Environment Variables

Set these in Railway dashboard under "Variables":

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `PORT` | `3000` | Application port |
| `PUPPETEER_EXECUTABLE_PATH` | `/usr/bin/chromium` | Chrome executable path |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | `true` | Skip Puppeteer Chrome download |

## 🐳 Local Development

### Using Docker

1. **Build and run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost:3000
   - Health check: http://localhost:3000/health

### Using Node.js

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Development mode**:
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
medical-mcp-web/
├── src/
│   ├── server.js              # Express.js API server
│   └── medical-mcp-service.js # Medical MCP service wrapper
├── public/
│   └── index.html            # Frontend application
├── build/                    # Compiled TypeScript output
├── Dockerfile               # Container configuration
├── docker-compose.yml       # Local development setup
├── railway.toml            # Railway deployment config
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## 🔧 API Endpoints

### Drug Information
- `POST /api/drugs/search` - Search for drug information
- `POST /api/drugs/details` - Get detailed drug information by NDC
- `POST /api/drugs/nomenclature` - Search drug nomenclature

### Health Statistics
- `POST /api/health/statistics` - Get WHO health statistics

### Medical Literature
- `POST /api/literature/search` - Search PubMed articles
- `POST /api/scholar/search` - Search Google Scholar

### Breast Cancer Endpoints
- `POST /api/breast-cancer/drugs` - Get breast cancer drug information
- `POST /api/breast-cancer/statistics` - Get breast cancer statistics
- `POST /api/breast-cancer/research` - Get breast cancer research

### System
- `GET /health` - Health check endpoint

## 📊 Example API Requests

### Search for Drugs
```bash
curl -X POST http://localhost:3000/api/drugs/search \
  -H "Content-Type: application/json" \
  -d '{"query": "tamoxifen", "limit": 5}'
```

### Get Health Statistics
```bash
curl -X POST http://localhost:3000/api/health/statistics \
  -H "Content-Type: application/json" \
  -d '{"indicator": "breast cancer incidence", "country": "USA"}'
```

### Search Medical Literature
```bash
curl -X POST http://localhost:3000/api/literature/search \
  -H "Content-Type: application/json" \
  -d '{"query": "breast cancer immunotherapy", "max_results": 10}'
```

## 🎨 Frontend Features

### Design System
- **Glass Morphism**: Modern frosted glass effects
- **Gradient Backgrounds**: Dynamic animated backgrounds
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Dark Theme**: Professional medical interface
- **Smooth Animations**: CSS transitions and keyframe animations

### User Experience
- **Tool Selection**: Interactive cards for different medical tools
- **Real-time Search**: Instant feedback and loading states
- **Error Handling**: Graceful error messages and recovery
- **Accessibility**: WCAG compliant with keyboard navigation
- **Mobile Optimized**: Touch-friendly interface for mobile devices

### Breast Cancer Dashboard
Specialized dashboard featuring:
- **Drug Information**: Common breast cancer treatments
- **Statistics**: Incidence, mortality, and survival rates
- **Research**: Latest literature and clinical studies

## 🔒 Security Features

- **Helmet.js**: Security headers and CSP protection
- **Rate Limiting**: API request throttling
- **Input Validation**: Zod schema validation
- **CORS Protection**: Cross-origin request filtering
- **Container Security**: Non-root user and minimal permissions

## 📈 Performance Optimizations

- **Compression**: Gzip compression for responses
- **Caching**: Response caching for static content
- **Lazy Loading**: Progressive content loading
- **Code Splitting**: Optimized JavaScript delivery
- **Image Optimization**: Responsive images and formats

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Manual Testing
1. **Health Check**: `curl http://localhost:3000/health`
2. **Drug Search**: Use frontend form or API endpoints
3. **Error Handling**: Test with invalid inputs
4. **Performance**: Monitor response times and memory usage

## 📝 Configuration

### Environment Variables (Development)
Create a `.env` file:
```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

### Production Configuration
```env
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## 🚨 Troubleshooting

### Common Issues

1. **Puppeteer Chrome Error**:
   ```bash
   # Ensure Chrome is installed in container
   apt-get update && apt-get install -y chromium
   ```

2. **Memory Issues**:
   ```bash
   # Increase Railway memory limit or optimize Puppeteer
   export PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage"
   ```

3. **API Timeouts**:
   ```bash
   # Check external API status
   curl -I https://api.fda.gov/drug/label.json
   curl -I https://ghoapi.azureedge.net/api/Indicator
   ```

4. **Build Failures**:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Railway Specific Issues

1. **Deployment Timeout**:
   - Increase build timeout in Railway settings
   - Optimize Docker image size

2. **Domain Issues**:
   - Verify DNS settings
   - Check Railway domain configuration

3. **Environment Variables**:
   - Ensure all required vars are set in Railway dashboard
   - Check variable names and values

## 📊 Monitoring

### Health Endpoints
- `/health` - Application health status
- `/api/*/` - All API endpoints return structured responses

### Logging
The application uses Winston for structured logging:
- **Error Level**: Critical errors and exceptions
- **Warn Level**: API failures and timeouts
- **Info Level**: Request/response logging
- **Debug Level**: Detailed execution information

### Metrics to Monitor
- Response times for API endpoints
- Error rates and types
- Memory usage (important for Puppeteer)
- CPU utilization
- External API availability

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure responsive design
- Test on multiple browsers

## 📚 API Documentation

### Request/Response Format
All API endpoints follow this structure:

**Request:**
```json
{
  "query": "search term",
  "limit": 10,
  "additional_params": "value"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "query": "search term",
    "total": 5,
    "results": [...]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔗 External APIs Used

1. **FDA Drug Database**: https://api.fda.gov/drug/label.json
2. **WHO Global Health Observatory**: https://ghoapi.azureedge.net/api
3. **PubMed**: https://eutils.ncbi.nlm.nih.gov/entrez/eutils
4. **RxNorm**: https://rxnav.nlm.nih.gov/REST
5. **Google Scholar**: Web scraping with Puppeteer

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

This application provides information from authoritative medical sources but should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical decisions.

- Information is for educational and informational purposes only
- Drug information may not be complete or up-to-date for all medications
- Health statistics are aggregated data and may not reflect individual circumstances
- Medical literature should be interpreted by qualified healthcare professionals

## 🆘 Support

- **Issues**: Open an issue on GitHub
- **Email**: support@medical-mcp.com
- **Documentation**: https://medical-mcp.github.io/docs
- **Railway Support**: https://railway.app/help

## 🎯 Roadmap

### Upcoming Features
- [ ] User authentication and saved searches
- [ ] Advanced filtering and sorting
- [ ] Data visualization charts
- [ ] Export functionality (PDF, CSV)
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Integration with EHR systems

### Performance Improvements
- [ ] Redis caching layer
- [ ] CDN integration
- [ ] Database for user data
- [ ] GraphQL API
- [ ] Serverless functions for specific endpoints

---

**Built with ❤️ for the medical research community**
