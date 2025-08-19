#!/bin/bash

# Medical MCP Web Interface Integration Script
# This script integrates the web interface with the existing Medical MCP project

set -e  # Exit on any error

echo "🏥 Medical MCP Web Interface Integration"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found"
    echo "Please run this script from the medical-mcp project root directory"
    exit 1
fi

if [ ! -d "src" ]; then
    echo "❌ Error: src/ directory not found"
    echo "Please run this script from the medical-mcp project root directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo "✅ Found package.json and src/ directory"
echo ""

# Show current structure
echo "🔍 Current project structure:"
find . -type f -name "*.ts" -o -name "*.js" -o -name "*.json" | grep -E '\.(ts|js|json)$' | head -10
echo ""

# Backup original files
echo "💾 Creating backups..."
cp package.json package.json.backup
echo "✅ Backed up package.json → package.json.backup"

if [ -f "tsconfig.json" ]; then
    cp tsconfig.json tsconfig.json.backup
    echo "✅ Backed up tsconfig.json → tsconfig.json.backup"
fi

# Create new directory structure
echo ""
echo "🏗️  Creating new directory structure..."

# Create web-related directories
mkdir -p src/web
mkdir -p src/mcp
mkdir -p public
mkdir -p logs

echo "✅ Created directories: src/web/, src/mcp/, public/, logs/"

# Move original src files to mcp subfolder
echo ""
echo "📦 Moving original MCP server files to src/mcp/..."

moved_files=0
if [ -f "src/index.ts" ]; then
    mv src/index.ts src/mcp/
    echo "✅ Moved src/index.ts → src/mcp/index.ts"
    moved_files=$((moved_files + 1))
fi

if [ -f "src/utils.js" ]; then
    mv src/utils.js src/mcp/
    echo "✅ Moved src/utils.js → src/mcp/utils.js"
    moved_files=$((moved_files + 1))
fi

if [ -f "src/utils.ts" ]; then
    mv src/utils.ts src/mcp/
    echo "✅ Moved src/utils.ts → src/mcp/utils.ts"
    moved_files=$((moved_files + 1))
fi

# Move any other TypeScript/JavaScript files
for file in src/*.ts src/*.js; do
    if [ -f "$file" ] && [ "$(basename "$file")" != "index.ts" ] && [ "$(basename "$file")" != "utils.js" ] && [ "$(basename "$file")" != "utils.ts" ]; then
        mv "$file" src/mcp/
        echo "✅ Moved $file → src/mcp/$(basename "$file")"
        moved_files=$((moved_files + 1))
    fi
done

if [ $moved_files -eq 0 ]; then
    echo "⚠️  No source files found to move"
else
    echo "✅ Moved $moved_files file(s) to src/mcp/"
fi

# Verify the original MCP files exist
echo ""
echo "🔍 Verifying original MCP files..."
if [ -f "src/mcp/index.ts" ]; then
    echo "✅ Found src/mcp/index.ts"
else
    echo "⚠️  src/mcp/index.ts not found - you may need to create this"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo ""
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
.DS_Store

# Railway
.railway/

# Docker
.dockerignore
EOF
    echo "✅ Created .gitignore"
fi

# Create .env.example
echo ""
echo "📝 Creating .env.example..."
if [ ! -f ".env.example" ]; then
    echo ""
    echo "📝 Creating .env.example..."
    cat > .env.example << 'EOF'
# Environment Configuration
NODE_ENV=development
PORT=3000

# Puppeteer Configuration (for Google Scholar)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Logging
LOG_LEVEL=info

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=*
EOF
    echo "✅ Created .env.example"
fi

# Show new structure
echo ""
echo "📂 New directory structure:"
if command -v tree >/dev/null 2>&1; then
    tree -a . -I 'node_modules|.git|build' | head -20
else
    find . -type d -not -path './node_modules*' -not -path './.git*' -not -path './build*' | sort | head -20
fi

echo ""
echo "🎯 Integration Status:"
echo "====================="
echo "✅ Directory structure created"
echo "✅ Original files backed up"
echo "✅ MCP files moved to src/mcp/"
echo "✅ Web directories created"
echo "✅ Configuration files prepared"

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. 📝 Place the provided files in these locations:"
echo "   - medical-mcp-wrapper.ts → src/web/"
echo "   - server.ts → src/web/"
echo "   - index.html → public/"
echo "   - sw.js → public/"
echo "   - Dockerfile → project root"
echo "   - docker-compose.yml → project root"
echo "   - railway.toml → project root"
echo "   - Updated package.json → replace current"
echo "   - Updated tsconfig.json → replace current"
echo ""
echo "2. 🔧 Install dependencies:"
echo "   npm install"
echo ""
echo "3. 🏗️  Build the project:"
echo "   npm run build"
echo ""
echo "4. 🧪 Test both modes:"
echo "   npm run dev:mcp    # Test original MCP server"
echo "   npm run dev:web    # Test web interface"
echo ""
echo "5. 🚀 Deploy to Railway:"
echo "   railway up"
echo ""
echo "📄 Backup files created:"
echo "- package.json.backup"
if [ -f "tsconfig.json.backup" ]; then
    echo "- tsconfig.json.backup"
fi
echo ""
echo "🎉 Integration preparation complete!"
echo "   Ready to place the new files and start development."
