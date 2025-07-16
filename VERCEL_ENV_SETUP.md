# Vercel Environment Variables Setup

You need to add these environment variables to your Vercel deployment:

## Go to your Vercel dashboard:
1. Visit: https://vercel.com/dashboard
2. Click on your `emp-dash` project
3. Go to Settings → Environment Variables

## Add these variables:

### Database Configuration
- **Variable Name:** `SUPABASE_URL`
- **Value:** `https://erctqplufqthnesmigpf.supabase.co`
- **Environment:** All Environments (Production, Preview, Development)

### Database Key
- **Variable Name:** `SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyY3RxcGx1ZnF0aG5lc21pZ3BmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NDIxNjMsImV4cCI6MjA2ODIxODE2M30.IJiWVW-wc1By7YsyX-NQmkAkhhfqewwyy2kMiATAAlE`
- **Environment:** All Environments (Production, Preview, Development)

### n8n Integration
- **Variable Name:** `N8N_WEBHOOK_URL`
- **Value:** `https://maxwell-rubert.app.n8n.cloud/webhook/send-email`
- **Environment:** All Environments (Production, Preview, Development)

### Server Configuration
- **Variable Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production only

## After adding the variables:
1. Click "Save" for each variable
2. Go to the Deployments tab
3. Click "..." on the latest deployment and select "Redeploy"

## Quick Link:
https://vercel.com/dashboard/[your-username]/emp-dash/settings/environment-variables

## Alternatively, use Vercel CLI:
```bash
npx vercel env add SUPABASE_URL
# When prompted, paste: https://erctqplufqthnesmigpf.supabase.co

npx vercel env add SUPABASE_ANON_KEY
# When prompted, paste the anon key above

npx vercel env add N8N_WEBHOOK_URL
# When prompted, paste: https://maxwell-rubert.app.n8n.cloud/webhook/send-email
```
