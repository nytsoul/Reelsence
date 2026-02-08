# 🚀 ReelSense++ Deployment Guide

This guide covers deploying ReelSense++ to both **Render** and **Vercel** platforms.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Environment Variables**: Have your TMDB API key ready
3. **Node.js & Python**: For local testing (optional)

## 🎯 Quick Deploy

### Option 1: Use Deployment Scripts

```bash
# Make scripts executable (Linux/Mac)
chmod +x deploy.sh

# Deploy to Render
./deploy.sh render

# Deploy to Vercel  
./deploy.sh vercel

# Test locally first
./deploy.sh test
```

```cmd
# Windows
deploy.bat render
deploy.bat vercel
deploy.bat test
```

### Option 2: Manual Deployment

## 🌐 Render Deployment

### Backend API (Python/Flask)

1. **Connect Repository**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository root

2. **Configure Service**:
   - **Name**: `reelsense-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `cd backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && python app.py`
   - **Plan**: Free tier available

3. **Environment Variables**:
   ```
   PYTHON_VERSION=3.9.18
   FLASK_ENV=production
   PORT=5000
   TMDB_API_KEY=your_actual_api_key
   ```

4. **Health Check**: `/health`

### Frontend (React Static Site)

1. **Create Static Site**:
   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect same GitHub repository

2. **Configure**:
   - **Name**: `reelsense-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`

3. **Environment Variables**:
   ```
   NODE_VERSION=18.19.0
   REACT_APP_API_URL=https://your-api-name.onrender.com
   REACT_APP_ENV=production
   ```

## ⚡ Vercel Deployment

### Full-Stack App (Monorepo)

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Root Configuration**:
   - Framework: `Other`
   - Root Directory: `./` (leave empty)
   - Build settings will use `vercel.json`

3. **Environment Variables**:
   ```
   PYTHON_VERSION=3.9
   TMDB_API_KEY=your_actual_api_key
   REACT_APP_API_URL=https://your-project.vercel.app/api
   REACT_APP_ENV=production
   ```

### Separate Deployments

#### Frontend Only:
```bash
cd frontend
vercel --prod
```

#### Backend Only:
```bash
cd backend  
vercel --prod
```

## 🔧 Configuration Files

The deployment configurations are already set up:

- `render.yaml` - Render configuration
- `vercel.json` - Vercel configuration
- `.env.production` - Production environment variables
- `package.json` - Build scripts

## 🔐 Environment Variables Setup

### Required Variables:

#### Backend:
- `TMDB_API_KEY` - Your TMDB API key
- `FLASK_ENV=production`
- `PORT=5000` (Render auto-sets this)

#### Frontend:
- `REACT_APP_API_URL` - Your deployed API URL
- `REACT_APP_ENV=production`
- `NODE_VERSION=18.19.0`

### Setting Variables:

#### Render:
1. Go to your service dashboard
2. Navigate to "Environment" tab
3. Add key-value pairs
4. Click "Save Changes"

#### Vercel:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add variables for Production
4. Redeploy if needed

## 🚦 Deployment URLs

After successful deployment, you'll get:

### Render:
- **API**: `https://your-api-name.onrender.com`
- **Frontend**: `https://your-frontend-name.onrender.com`

### Vercel:
- **Full-Stack**: `https://your-project.vercel.app`
- **API Routes**: `https://your-project.vercel.app/api/*`

## 🔍 Testing Deployment

### Health Checks:
- **API Health**: `https://your-api-url/health`
- **Frontend**: Should load the ReelSense++ homepage
- **API Test**: `https://your-api-url/api/recommendations/1`

### Common Issues:

1. **Build Fails**: Check build logs for missing dependencies
2. **API 404**: Verify environment variables are set
3. **CORS Errors**: Ensure API URL is correctly configured
4. **Slow Cold Starts**: Free tier limitation on Render

## 🎉 Success Checklist

- [ ] Backend API responds at `/health`
- [ ] Frontend loads with proper styling
- [ ] Movie search works
- [ ] Recommendations load properly  
- [ ] No console errors in browser
- [ ] Both HTTP and HTTPS work

## 📞 Troubleshooting

### Render Issues:
- Check service logs in dashboard
- Verify environment variables
- Ensure `requirements.txt` is in backend folder

### Vercel Issues:
- Check function logs
- Verify `vercel.json` configuration
- Test API routes individually

## 🔄 Updates & Redeployment

- **Render**: Auto-deploys on push to main branch
- **Vercel**: Auto-deploys on push (if connected to Git)
- **Manual**: Use deployment scripts or platform dashboards

---

**🎬 Your ReelSense++ app is now live and ready to serve movie recommendations to the world!**