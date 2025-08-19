#!/bin/bash

# Medical MCP Service - GitHub Repository Setup Script
# This script creates a GitHub repo and pushes your code

set -e  # Exit on any error

echo "🚀 Medical MCP Service - GitHub Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "❌ Error: Please run this script from the medical-mcp-service project root directory"
    exit 1
fi

echo "📁 Current directory: $(pwd)"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "🔧 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo ""
    echo "Please install GitHub CLI first:"
    echo "🍺 macOS: brew install gh"
    echo "🐧 Linux: Follow instructions at https://cli.github.com/"
    echo ""
    echo "After installation, run: gh auth login"
    exit 1
fi

# Check if user is logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "🔐 GitHub authentication required..."
    echo "Please authenticate with GitHub:"
    gh auth login
else
    echo "✅ GitHub authentication verified"
fi

# Get repository name (default to current directory name)
REPO_NAME=$(basename "$PWD")
REPO_NAME="medical-mcp-railway-deployment"
echo ""
echo "📝 Repository name: $REPO_NAME"
echo ""

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
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

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# IDE files
.vscode/
.idea/
*.swp
.DS_Store

# Railway
.railway/

# Backup files
*.backup
*.bak

# OS generated files
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msm
*.msp
*.lnk
EOF
    echo "✅ Created .gitignore"
else
    echo "✅ .gitignore already exists"
fi

# Add all files to git
echo ""
echo "📦 Adding files to git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Medical MCP Web Interface

- Complete medical research platform with web UI
- REST API for FDA, WHO, PubMed, RxNorm data access
- Breast cancer research dashboard
- Progressive Web App with service worker
- Docker containerization for Railway deployment
- Dual mode: MCP server + web interface"

echo "✅ Initial commit created"

# Create GitHub repository
echo ""
echo "🌐 Creating GitHub repository..."
gh repo create "$REPO_NAME" --public --description "Medical MCP Web Interface - Comprehensive medical research platform with FDA, WHO, PubMed integration" --clone=false

echo "✅ GitHub repository created: https://github.com/$(gh api user --jq .login)/$REPO_NAME"

# Add remote origin
GITHUB_USERNAME=$(gh api user --jq .login)
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo "✅ Remote origin added"

# Push to main branch
echo ""
echo "🚀 Pushing code to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🎉 SUCCESS! Repository setup complete!"
echo ""
echo "📊 Repository Details:"
echo "====================="
echo "🔗 URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "📝 Description: Medical MCP Web Interface"
echo "🌟 Visibility: Public"
echo "🌿 Branch: main"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. ✅ GitHub repository created and code pushed"
echo "2. 🚀 Ready for Railway deployment!"
echo "3. 🔗 Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🎯 Ready to run the Railway deployment script!"
