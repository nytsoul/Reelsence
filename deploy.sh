#!/bin/bash
# ReelSense++ Deployment Script

set -e

echo "🚀 ReelSense++ Deployment Script"
echo "================================"

# Function to deploy to Render
deploy_render() {
    echo "📦 Deploying to Render..."
    
    # Check if render.yaml exists
    if [ ! -f "render.yaml" ]; then
        echo "❌ render.yaml not found. Please ensure it exists in the root directory."
        exit 1
    fi
    
    # Push to main branch (Render auto-deploys from main)
    git add .
    git commit -m "Deploy to Render: $(date '+%Y-%m-%d %H:%M:%S')" || true
    git push origin main
    
    echo "✅ Code pushed to GitHub. Render will auto-deploy."
    echo "🌐 Check deployment status at: https://dashboard.render.com"
}

# Function to deploy to Vercel
deploy_vercel() {
    echo "📦 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "📥 Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Deploy to Vercel
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo "✅ Deployed to Vercel!"
}

# Function to build and test locally
test_build() {
    echo "🔧 Testing local build..."
    
    # Test backend
    echo "Testing backend..."
    cd backend
    pip install -r requirements.txt
    python -c "import app; print('✅ Backend imports successful')"
    cd ..
    
    # Test frontend
    echo "Testing frontend..."
    cd frontend
    npm install
    npm run build
    echo "✅ Frontend build successful"
    cd ..
    
    echo "✅ All tests passed!"
}

# Main deployment logic
case "$1" in
    "render")
        deploy_render
        ;;
    "vercel")
        deploy_vercel
        ;;
    "test")
        test_build
        ;;
    *)
        echo "Usage: $0 {render|vercel|test}"
        echo "  render  - Deploy to Render"
        echo "  vercel  - Deploy to Vercel"
        echo "  test    - Test build locally"
        exit 1
        ;;
esac

echo "🎉 Deployment complete!"
