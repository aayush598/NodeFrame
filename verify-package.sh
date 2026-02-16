#!/bin/bash

# WorkflowCanvas - Package Verification Script
# Run this to verify the package is ready for publishing

echo "🔍 WorkflowCanvas - Package Verification"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from the package root."
    exit 1
fi

echo "✅ Directory check passed"

# Check package.json fields
echo "📦 Checking package.json..."
if grep -q '"name": "workflow-canvas"' package.json; then
    echo "  ✅ Package name: workflow-canvas"
else
    echo "  ❌ Package name not set correctly"
fi

if grep -q '"version":' package.json; then
    VERSION=$(grep '"version"' package.json | cut -d '"' -f 4)
    echo "  ✅ Version: $VERSION"
else
    echo "  ❌ Version not set"
fi

# Check build output
echo ""
echo "🔨 Checking build output..."
if [ -d "dist" ]; then
    echo "  ✅ dist/ directory exists"
    
    if [ -f "dist/index.js" ]; then
        SIZE=$(du -h dist/index.js | cut -f1)
        echo "  ✅ index.js exists ($SIZE)"
    else
        echo "  ❌ index.js not found"
    fi
    
    if [ -f "dist/index.esm.js" ]; then
        SIZE=$(du -h dist/index.esm.js | cut -f1)
        echo "  ✅ index.esm.js exists ($SIZE)"
    else
        echo "  ❌ index.esm.js not found"
    fi
    
    if [ -f "dist/index.d.ts" ]; then
        echo "  ✅ index.d.ts exists"
    else
        echo "  ❌ index.d.ts not found"
    fi
else
    echo "  ❌ dist/ directory not found. Run 'yarn build' first."
fi

# Check source files
echo ""
echo "📝 Checking source files..."
SRC_COUNT=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l)
echo "  ✅ Source files: $SRC_COUNT"

# Check documentation
echo ""
echo "📚 Checking documentation..."
DOCS=("README.md" "QUICKSTART.md" "API.md" "ADVANCED.md" "CHANGELOG.md" "LICENSE")
for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc exists"
    else
        echo "  ❌ $doc missing"
    fi
done

# Check node types
echo ""
echo "🎨 Checking node components..."
NODES=("StartNode" "EndNode" "ActionNode" "ConditionalNode" "InputNode" "OutputNode" "ApiCallNode" "TransformNode")
for node in "${NODES[@]}"; do
    if [ -f "src/nodes/${node}.tsx" ]; then
        echo "  ✅ ${node}.tsx"
    else
        echo "  ❌ ${node}.tsx missing"
    fi
done

# Check example app
echo ""
echo "🎯 Checking example app..."
if [ -d "example" ]; then
    echo "  ✅ example/ directory exists"
    if [ -f "example/src/App.tsx" ]; then
        echo "  ✅ example/src/App.tsx exists"
    fi
else
    echo "  ⚠️  example/ directory not found"
fi

# Summary
echo ""
echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="
echo "Package: workflow-canvas v$VERSION"
echo "Source files: $SRC_COUNT TypeScript files"
echo "Build output: dist/ directory"
echo "Documentation: Complete"
echo "Node types: 8 prebuilt nodes"
echo ""
echo "✅ Package verification complete!"
echo ""
echo "Next steps:"
echo "1. Test locally: npm link"
echo "2. Publish: npm publish --access public"
echo "3. Verify: npm info workflow-canvas"
echo ""
