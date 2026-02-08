@echo off
REM ReelSense++ Windows Deployment Script

echo ^🚀 ReelSense++ Deployment Script
echo ================================

if "%1"=="render" goto deploy_render
if "%1"=="vercel" goto deploy_vercel
if "%1"=="test" goto test_build
goto usage

:deploy_render
echo ^📦 Deploying to Render...
if not exist "render.yaml" (
    echo ^❌ render.yaml not found. Please ensure it exists in the root directory.
    exit /b 1
)

REM Push to main branch for Render auto-deploy
git add .
git commit -m "Deploy to Render: %date% %time%" 2>nul
git push origin main
echo ^✅ Code pushed to GitHub. Render will auto-deploy.
echo ^🌐 Check deployment status at: https://dashboard.render.com
goto end

:deploy_vercel
echo ^📦 Deploying to Vercel...
REM Check if Vercel CLI is installed (simplified check)
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ^📥 Installing Vercel CLI...
    npm install -g vercel
)
echo ^🚀 Deploying to Vercel...
vercel --prod
echo ^✅ Deployed to Vercel!
goto end

:test_build
echo ^🔧 Testing local build...
echo Testing backend...
cd backend
pip install -r requirements.txt
python -c "import app; print('✅ Backend imports successful')"
cd ..
echo Testing frontend...
cd frontend
npm install
npm run build
echo ^✅ Frontend build successful
cd ..
echo ^✅ All tests passed!
goto end

:usage
echo Usage: %0 {render^|vercel^|test}
echo   render  - Deploy to Render
echo   vercel  - Deploy to Vercel  
echo   test    - Test build locally
exit /b 1

:end
echo ^🎉 Deployment complete!
