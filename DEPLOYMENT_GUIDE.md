# Deployment Guide - Revival Couture Circle

This guide will help you deploy your application with:
- **Frontend**: Vercel
- **Backend**: Render
- **Database & Auth**: Supabase

## Prerequisites

- GitHub account with your code pushed
- Vercel account
- Render account
- Supabase project set up

---

## Part 1: Deploy Backend to Render

### Step 1: Prepare Backend for Deployment

1. Make sure your `server` folder has these files:
   - `index.js` (your main server file)
   - `database.js` (database functions)
   - `package.json` (dependencies)
   - `render.yaml` (Render configuration) ✅ Created
   - `.env.example` (environment variable template) ✅ Created

2. Ensure `package.json` has a start script:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 3: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `revival-couture-backend` (or your choice)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Instance Type**: Free (or paid for better performance)

5. Add Environment Variables:
   - Click **"Advanced"** → **"Add Environment Variable"**
   - Add these variables:
     ```
     PORT=3000
     SUPABASE_URL=<your-supabase-project-url>
     SUPABASE_KEY=<your-supabase-anon-key>
     ```
   
   Get these from Supabase:
   - Go to your Supabase project
   - Settings → API
   - Copy **Project URL** and **anon/public key**

6. Click **"Create Web Service"**

7. Wait for deployment (5-10 minutes)

8. **Copy your Render URL** (e.g., `https://revival-couture-backend.onrender.com`)

---

## Part 2: Update Frontend for Production

### Step 1: Create Environment Files

1. Create `.env.production` in the root directory:
```bash
VITE_API_URL=https://your-render-backend-url.onrender.com
```

Replace `your-render-backend-url` with your actual Render URL from Part 1, Step 8.

2. Create `.env` for local development:
```bash
VITE_API_URL=http://localhost:3000
```

### Step 2: Update API Calls to Use Environment Variable

The frontend needs to use `import.meta.env.VITE_API_URL` instead of hardcoded URLs.

I'll update the necessary files for you.

### Step 3: Configure CORS on Backend

The backend needs to allow requests from your Vercel domain. This is already configured in `index.js` with:
```javascript
app.use(cors());
```

For production, you may want to restrict to specific origins:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:8080']
}));
```

---

## Part 3: Deploy Frontend to Vercel

### Step 1: Push Updated Code

```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variables:
   - Click **"Environment Variables"**
   - Add:
     ```
     VITE_API_URL=https://your-render-backend-url.onrender.com
     ```

6. Click **"Deploy"**

7. Wait for deployment (2-5 minutes)

8. **Copy your Vercel URL** (e.g., `https://revival-couture.vercel.app`)

---

## Part 4: Configure Supabase

### Update Supabase URL Allowlist

1. Go to Supabase Dashboard
2. Settings → API
3. Under **"URL Configuration"**, add your Vercel URL:
   ```
   https://your-vercel-app.vercel.app
   ```

### Update Authentication URLs

1. Go to Authentication → URL Configuration
2. Add **Site URL**: `https://your-vercel-app.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://your-vercel-app.vercel.app/*
   http://localhost:8080/*
   ```

---

## Part 5: Test Your Deployment

### Test Backend

1. Open: `https://your-render-backend-url.onrender.com/api/products`
2. You should see JSON response with products

### Test Frontend

1. Open your Vercel URL
2. Test these features:
   - Browse products on Shop page
   - Login/Register
   - Create auction
   - List product for sale
   - View "My Products"

---

## Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
- Check Render logs: Dashboard → Logs
- Verify environment variables are set correctly
- Ensure `PORT` is set to 3000

**Problem**: Database connection errors
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are correct
- Check Supabase is accessible (not paused)

### Frontend Issues

**Problem**: API calls failing
- Check browser console for CORS errors
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure backend is running on Render

**Problem**: Authentication not working
- Check Supabase redirect URLs are configured
- Verify Site URL matches your Vercel domain

### CORS Errors

If you see CORS errors:
1. Update `server/index.js` to allow your Vercel domain:
```javascript
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:8080'],
  credentials: true
}));
```

2. Redeploy backend on Render

---

## Important Notes

### Free Tier Limitations

**Render Free Tier**:
- Spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading for production use

**Vercel Free Tier**:
- 100GB bandwidth per month
- Serverless function execution limits

### Environment Variables

Never commit `.env` files to Git! They're already in `.gitignore`.

Always use:
- `.env` for local development
- `.env.production` for production builds
- Vercel/Render dashboard for deployed environment variables

---

## Maintenance

### Updating Backend

1. Make changes locally
2. Test locally
3. Push to GitHub
4. Render auto-deploys from `main` branch

### Updating Frontend

1. Make changes locally
2. Test locally
3. Push to GitHub
4. Vercel auto-deploys from `main` branch

### Database Migrations

Run SQL migrations in Supabase SQL Editor:
```sql
-- Example: Add new column
ALTER TABLE products ADD COLUMN new_column TEXT;
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Configure environment variables
3. ✅ Deploy frontend to Vercel
4. ✅ Test all features
5. 🎉 Share your live URL!

Your app will be accessible at: `https://your-vercel-app.vercel.app`
