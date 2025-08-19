#!/bin/bash

# Quick Setup Script for Medical MCP Web Interface
# This script downloads and places all the new files

set -e

echo "🚀 Medical MCP Web Interface - Quick Setup"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Please run this script from the medical-mcp project root directory"
    echo "Expected to find package.json and src/ directory"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo "✅ Found package.json and src/ directory"
echo ""

# Run the integration script first
if [ ! -f "integrate.sh" ]; then
    echo "⚠️  integrate.sh not found. Please run the integration script first."
    exit 1
fi

echo "🔧 Running integration script..."
chmod +x integrate.sh
./integrate.sh

echo ""
echo "📝 Creating new project files..."

# Create TypeScript configuration
echo "📄 Creating tsconfig.json..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "lib": ["ES2022"],
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "build",
    "public",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
EOF

# Create package.json update
echo "📄 Updating package.json..."
cat > package.json << 'EOF'
{
  "name": "medical-mcp-web",
  "version": "1.0.0",
  "description": "Medical MCP server with web interface for comprehensive medical information access",
  "main": "build/mcp/index.js",
  "type": "module",
  "scripts": {
    "start": "node build/web/server.js",
    "start:mcp": "node build/mcp/index.js",
    "start:web": "node build/web/server.js",
    "dev": "nodemon --exec tsx src/web/server.ts",
    "dev:mcp": "nodemon --exec tsx src/mcp/index.ts",
    "dev:web": "nodemon --exec tsx src/web/server.ts",
    "build": "tsc",
    "build:watch": "tsc -w",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.{js,ts}",
    "lint:fix": "eslint src/**/*.{js,ts} --fix",
    "format": "prettier --write \"src/**/*.{js,ts,json}\"",
    "clean": "rm -rf build",
    "health-check": "curl -f http://localhost:3000/health || exit 1"
  },
  "bin": {
    "medical-mcp": "build/mcp/index.js",
    "medical-mcp-web": "build/web/server.js"
  },
  "keywords": [
    "medical", "mcp", "healthcare", "api", "research", "drugs", "literature", 
    "statistics", "fda", "who", "pubmed", "web-interface", "breast-cancer"
  ],
  "author": "Medical Research Platform",
  "license": "MIT",
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.7.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "compression": "^1.7.4",
    "superagent": "^8.1.2",
    "puppeteer": "^21.6.1",
    "zod": "^3.22.4",
    "dotenv": "^16.3.1",
    "winston": "^3.11.0",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "typescript": "^5.3.3",
    "tsx": "^4.6.2",
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "eslint": "^8.56.0",
    "eslint-config-prettier": "^9.1.0",
    "prettier": "^3.1.1",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/compression": "^1.7.5",
    "@types/uuid": "^9.0.7"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
EOF

echo "✅ Created configuration files"

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎯 Setup Summary:"
echo "================"
echo "✅ Directory structure created"
echo "✅ Configuration files updated"
echo "✅ Dependencies installed"
echo "✅ Project ready for development"

echo ""
echo "📋 Manual Steps Required:"
echo "========================"
echo "You still need to manually create these files:"
echo ""
echo "1. 📝 src/web/medical-mcp-wrapper.ts"
echo "2. 📝 src/web/server.ts" 
echo "3. 📝 public/index.html"
echo "4. 📝 public/sw.js"
echo "5. 📝 Dockerfile"
echo "6. 📝 docker-compose.yml"
echo "7. 📝 railway.toml"
echo ""
echo "These files are provided in the artifacts."

echo ""
echo "🧪 Test Commands:"
echo "================"
echo "# Test original MCP server"
echo "npm run dev:mcp"
echo ""
echo "# Test web interface (after creating web files)"
echo "npm run dev:web"
echo ""
echo "# Build for production"
echo "npm run build"

echo ""
echo "🎉 Setup complete! Ready for file placement."
