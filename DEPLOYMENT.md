# Deployment Guide

This guide will help you deploy your Employee Dashboard application to various cloud platforms.

## Prerequisites

1. **Git Repository**: Make sure your code is in a Git repository (GitHub, GitLab, etc.)
2. **Build Test**: Test that your app builds locally
3. **Environment Variables**: Set up your n8n webhook URL

## Option 1: Deploy to Vercel (Recommended - Free)

### Step 1: Prepare for Vercel
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Build your app locally to test:
   ```bash
   npm run install-all
   npm run build
   ```

### Step 2: Deploy to Vercel
1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Link to existing project? **N**
   - What's the name of your project? **employee-dashboard**
   - In which directory is your code located? **.**
   - Want to override the settings? **N**

4. Set environment variables in Vercel dashboard:
   - Go to your project in Vercel dashboard
   - Go to Settings > Environment Variables
   - Add: `N8N_WEBHOOK_URL` with your n8n webhook URL

### Step 3: Configure Custom Domain (Optional)
- In Vercel dashboard, go to Settings > Domains
- Add your custom domain

## Option 2: Deploy to Railway (Free tier available)

### Step 1: Setup Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project from GitHub repo

### Step 2: Configure Railway
1. Add environment variables:
   - `N8N_WEBHOOK_URL`: Your n8n webhook URL
   - `NODE_ENV`: production

2. Configure build settings:
   - Root directory: `/`
   - Build command: `npm run install-all && npm run build`
   - Start command: `npm start`

## Option 3: Deploy to Heroku

### Step 1: Setup Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`

### Step 2: Configure Heroku
1. Set buildpacks:
   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

2. Set environment variables:
   ```bash
   heroku config:set N8N_WEBHOOK_URL=your-n8n-webhook-url
   heroku config:set NODE_ENV=production
   ```

3. Deploy:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## Option 4: Deploy to DigitalOcean App Platform

### Step 1: Setup DigitalOcean
1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Create new App from GitHub repository

### Step 2: Configure App
1. Set build command: `npm run install-all && npm run build`
2. Set run command: `npm start`
3. Add environment variables in App settings

## Important Notes

### Database Considerations
- Currently using JSON file for data storage
- For production, consider upgrading to:
  - PostgreSQL (Heroku Postgres, Railway, etc.)
  - MongoDB Atlas
  - Supabase

### n8n Integration
- Make sure your n8n instance is accessible
- Update webhook URL in environment variables
- Test email functionality after deployment

### Environment Variables Needed
- `N8N_WEBHOOK_URL`: Your n8n webhook endpoint
- `NODE_ENV`: Set to "production"
- `PORT`: Usually set automatically by hosting platform

### SSL/HTTPS
- Most platforms provide HTTPS automatically
- Update any hardcoded HTTP URLs to HTTPS

## Testing Your Deployment

1. Visit your deployed URL
2. Test employee CRUD operations
3. Test email sending functionality
4. Check browser console for any errors
5. Verify all API endpoints work

## Troubleshooting

### Common Issues:
1. **Build fails**: Check that all dependencies are in package.json
2. **API calls fail**: Verify API URL configuration in client
3. **Email not working**: Check n8n webhook URL and accessibility
4. **Static files not loading**: Verify build process and static file serving

### Debug Steps:
1. Check platform logs for errors
2. Verify environment variables are set
3. Test API endpoints directly
4. Check network tab in browser dev tools
