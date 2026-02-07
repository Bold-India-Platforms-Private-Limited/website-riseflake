# Cloudflare Pages Deployment Guide for Riseflake Landing Page

## Quick Start - Deploy in 5 Minutes

### Step 1: Prepare Your Repository

Ensure your code is on GitHub:

```bash
git add .
git commit -m "Initial commit: Riseflake landing page"
git push origin main
```

### Step 2: Connect Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your domain (riseflake.com)
3. Navigate to **Pages** section
4. Click **Create a project** → **Connect to Git**
5. Select GitHub repository: `website-riseflake`
6. Click **Begin setup**

### Step 3: Configure Build Settings

Fill in these values:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `out` |
| Root directory | `/` |
| Environment | Production |

### Step 4: Add Environment Variables (Optional)

Click "Add environment variable" for:

```
NEXT_PUBLIC_GA_ID = YOUR_GOOGLE_ANALYTICS_ID
NEXT_PUBLIC_API_URL = https://api.riseflake.com
```

### Step 5: Deploy

Click **Save and Deploy**

Cloudflare will:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Build the project (`npm run build`)
4. Upload the `out/` folder to Pages
5. Assign a preview URL (e.g., `main.riseflake.pages.dev`)

### Step 6: Connect Custom Domain

1. Go to your Cloudflare Pages project
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter: `riseflake.com`
5. Click **Configure domain**
6. Add the CNAME record (if needed) or use nameservers

Your site is now live at `https://riseflake.com`!

## Deployment Options Details

### Option A: Automatic Deployments via GitHub (Recommended)

✅ Simplest
✅ Automatic on every commit to main
✅ Automatic previews for pull requests
✅ Rollback capability

Every push to main automatically deploys to production.

### Option B: Manual Deployment via Wrangler CLI

For more control over deployments:

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy
wrangler pages deploy out
```

### Option C: Direct Upload UI

Manual upload without Git integration:

1. `npm run build`
2. Cloudflare Pages dashboard → Create project → Upload assets
3. Select the `out` folder
4. Set custom domain

## Deployment Verification

### Check Deployment Status

```bash
# Test the deployed site
curl -I https://riseflake.com

# Expected response:
# HTTP/2 200
# content-type: text/html
# cf-cache-status: HIT
```

### Verify SEO Files

```bash
curl https://riseflake.com/sitemap.xml
curl https://riseflake.com/robots.txt
```

### Check Page Load Speed

1. Go to [PageSpeed Insights](https://pagespeed.web.dev/)
2. Enter: `https://riseflake.com`
3. Verify Core Web Vitals are good

## Performance Monitoring

### Cloudflare Analytics

1. Dashboard → Pages → riseflake-landing
2. Monitor:
   - Request rates
   - Cache performance
   - Geographic distribution
   - Error rates

### Recommended Integrations

- **Google Analytics 4**: Track user behavior
- **Sentry**: Error tracking
- **Cloudflare Analytics Engine**: Custom metrics

## Continuous Integration / Deployment (CI/CD)

### Automatic Deployments

Cloudflare Pages automatically:
- Deploys on push to `main` branch
- Creates preview deployments for pull requests
- Allows rollback to previous versions

### Deployment Status

Check deployment status:

1. Cloudflare Dashboard → Pages
2. View deployment history
3. Click on any deployment to see logs

## Environment-Specific Settings

### Production (`main` branch)

- Domain: `riseflake.com`
- Cache: Aggressive (7 days)
- Auto-deploy: Yes

### Preview (`pull-requests`)

- Domain: `feature-xyz.riseflake.pages.dev`
- Cache: Short (5 minutes)
- Auto-deploy: Yes (on PR open)

## Troubleshooting

### Build Fails

Check logs:
1. Cloudflare Pages dashboard
2. Deployment logs
3. Look for error messages

Common issues:
```bash
# Error: "Cannot find module"
npm install

# Error: "Build output directory not found"
# Ensure 'out' directory is created
npm run build

# Error: "Port 3000 already in use"
# Not relevant for Pages (static build)
```

### Site Not Loading

1. Check if deployment is successful (green checkmark)
2. Clear CloudFlare cache: Analytics > Caching > Purge Cache
3. Wait 5 minutes for DNS propagation
4. Check custom domain configuration

### Slow Performance

1. Enable Cloudflare optimizations:
   - Speed → Optimization → Auto Minify (HTML, CSS, JS)
   - Speed → Optimization → Brotli compression
   - Caching → Cache Rules (aggressive for static assets)

2. Monitor Core Web Vitals:
   - [PageSpeed Insights](https://pagespeed.web.dev/)

## Rollback to Previous Deployment

If you need to revert a deployment:

1. Cloudflare Pages dashboard
2. Click "Deployments"
3. Find the stable version
4. Click "View"
5. Click "Rollback to this version"

## Domain Migration (If Changing Domains)

1. Keep current domain connected
2. Add new domain in Pages settings
3. Update nameservers for new domain
4. Wait for DNS propagation (up to 48 hours)
5. Remove old domain after verification

## Cost & Limits

### Cloudflare Pages Free Tier

- ✅ Unlimited sites
- ✅ Unlimited bandwidth
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ Free SSL

Perfect for static sites!

## Advanced Configuration

### Custom Rewrite Rules

Create `_routes.json` in `public/`:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/api/*", "/.well-known/*"]
}
```

### Security Headers

In Cloudflare dashboard:

1. Security → Headers
2. Set:
   - Strict-Transport-Security: max-age=31536000
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: SAMEORIGIN

### Cache Control

Add to `next.config.js` for granular control:

```javascript
const headers = [
  {
    source: '/(.*)',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=3600, s-maxage=86400'
      }
    ]
  }
]
```

## Support & Documentation

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Deployment](https://nextjs.org/learn/basics/deploying-nextjs-app)
- [Cloudflare Community](https://community.cloudflare.com/)

---

**Deployment Status: Ready for Production ✓**
