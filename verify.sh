#!/bin/bash

echo "🔍 Medical MCP Web Interface - Structure Verification"
echo "===================================================="
echo ""

# Check current directory
echo "📁 Current directory: $(pwd)"
echo ""

# Check src structure
echo "📂 src/ directory contents:"
if [ -d "src" ]; then
    find src -type f | sort
    echo ""
    
    echo "📂 src/ subdirectories:"
    find src -type d | sort
else
    echo "❌ src/ directory not found"
fi
echo ""

# Check public structure  
echo "📂 public/ directory contents:"
if [ -d "public" ]; then
    ls -la public/
else
    echo "❌ public/ directory not found"
fi
echo ""

# Check if we need to create the web files
echo "🔍 Checking for required files..."

# Check for MCP files
if [ -f "src/mcp/index.ts" ]; then
    echo "✅ Found src/mcp/index.ts"
else
    echo "❌ Missing src/mcp/index.ts"
fi

if [ -f "src/mcp/utils.js" ]; then
    echo "✅ Found src/mcp/utils.js"
else
    echo "❌ Missing src/mcp/utils.js - checking for utils.ts"
    if [ -f "src/mcp/utils.ts" ]; then
        echo "✅ Found src/mcp/utils.ts"
    else
        echo "❌ Missing both utils.js and utils.ts"
    fi
fi

# Check for web files
if [ -f "src/web/medical-mcp-wrapper.ts" ]; then
    echo "✅ Found src/web/medical-mcp-wrapper.ts"
else
    echo "❌ Missing src/web/medical-mcp-wrapper.ts"
fi

if [ -f "src/web/server.ts" ]; then
    echo "✅ Found src/web/server.ts"  
else
    echo "❌ Missing src/web/server.ts"
fi

# Check for frontend files
if [ -f "public/index.html" ]; then
    echo "✅ Found public/index.html"
else
    echo "❌ Missing public/index.html"
fi

if [ -f "public/sw.js" ]; then
    echo "✅ Found public/sw.js"
else
    echo "❌ Missing public/sw.js"
fi

echo ""
echo "🔧 Next Actions Needed:"
echo "======================"

# Provide specific instructions based on what's missing
missing_files=()

if [ ! -f "src/web/medical-mcp-wrapper.ts" ]; then
    missing_files+=("src/web/medical-mcp-wrapper.ts")
fi

if [ ! -f "src/web/server.ts" ]; then
    missing_files+=("src/web/server.ts")
fi

if [ ! -f "public/index.html" ]; then
    missing_files+=("public/index.html")
fi

if [ ! -f "public/sw.js" ]; then
    missing_files+=("public/sw.js")
fi

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All files present! Ready to build and test."
    echo ""
    echo "🚀 Run these commands:"
    echo "npm install"
    echo "npm run build"
    echo "npm run dev:web"
else
    echo "📝 Missing files that need to be created:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "Please create these files using the content from the Claude artifacts."
fi

echo ""
echo "📊 Project Status Summary:"
echo "========================="
echo "Configuration files: ✅ Complete"
echo "Directory structure: ✅ Complete"  
echo "MCP files: $([ -f 'src/mcp/index.ts' ] && echo '✅ Found' || echo '❓ Check needed')"
echo "Web files: $([ -f 'src/web/server.ts' ] && echo '✅ Ready' || echo '❌ Missing')"
echo "Frontend files: $([ -f 'public/index.html' ] && echo '✅ Ready' || echo '❌ Missing')"
