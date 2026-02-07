# Riseflake Landing Page

A production-ready, SEO-optimized landing page for riseflake.com built with Next.js Static Site Generation (SSG) and deployed on Cloudflare Pages.

## 🚀 Features

- ✅ **Static Site Generation (SSG)** - Fast, secure, and SEO-friendly
- ✅ **Mobile Responsive** - Perfect on all devices
- ✅ **SEO Optimized** - Meta tags, Open Graph, JSON-LD structured data
- ✅ **Performance** - Optimized for Lighthouse scores
- ✅ **Cloudflare Pages Ready** - One-click deployment
- ✅ **Zero Backend** - Pure static content
- ✅ **Accessibility** - WCAG compliant
- ✅ **Dark Theme** - Modern, professional design

## 📁 Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with metadata
│   │   ├── page.tsx        # Main landing page
│   │   └── globals.css     # Global styles with Tailwind
│   └── components/         # Reusable React components
├── public/
│   ├── robots.txt          # SEO robots rules
│   └── sitemap.xml         # SEO sitemap
├── next.config.js          # Next.js config (SSG export)
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
├── wrangler.toml          # Cloudflare Pages config
└── README.md              # This file
```

## 🛠 Setup & Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager
- Git
- Cloudflare account (for deployment)

### Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run start
   ```

## 🌐 Deployment on Cloudflare Pages

### Option 1: Using GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/website-riseflake.git
   git push -u origin main
   ```

2. **Create Cloudflare Pages Project**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com/)
   - Click "Create a project" → "Connect to Git"
   - Select your GitHub repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Build output directory:** `out`
     - **Framework preset:** Next.js
   - Click "Save and Deploy"

3. **Connect Custom Domain**
   - In Cloudflare Pages project settings
   - Add custom domain: `riseflake.com`
   - Update your domain's nameservers or use CNAME records

### Option 2: Using Wrangler CLI (Direct Upload)

1. **Install Wrangler**
   ```bash
   npm install -D wrangler
   ```

2. **Authenticate**
   ```bash
   npx wrangler login
   ```

3. **Build Project**
   ```bash
   npm run build
   ```

4. **Deploy**
   ```bash
   npx wrangler pages deploy out
   ```

### Option 3: Using Direct Upload UI

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to Cloudflare Pages dashboard
3. Click "Create project" → "Upload assets"
4. Upload the `out` folder
5. Link to your domain

## 🔍 SEO Optimization Details

### Implemented Features

1. **Metadata**
   - Page title and description
   - Open Graph tags for social sharing
   - Twitter card metadata
   - Canonical URLs

2. **Structured Data**
   - JSON-LD schema for JobPortal type
   - Organization schema
   - Proper heading hierarchy (H1 → H2 → H3)

3. **Technical SEO**
   - robots.txt for crawlers
   - sitemap.xml for indexing
   - Mobile-responsive design
   - Fast page load performance
   - Accessibility (WCAG 2.1)

4. **Content**
   - Keyword-rich sections
   - Clear value propositions
   - Call-to-action buttons
   - Social proof (testimonials, stats)

### SEO Checklist

- [ ] Update Google Site Verification in `layout.tsx`
- [ ] Update Bing Webmaster Tools verification
- [ ] Create Google Search Console property
- [ ] Add Analytics tracking (Google Analytics 4)
- [ ] Verify sitemaps in search consoles
- [ ] Check Core Web Vitals
- [ ] Set up monitoring for broken links
- [ ] Add email to newsletter service integration

## 📊 Performance Optimization

### Build Output

The `npm run build` command generates:
- **Output:** `out/` folder with static HTML, CSS, JS files
- **Size:** Typically 50-150KB (gzip compressed)

### Why SSG for This Project?

1. ✅ **Lightning Fast** - Pure static files served from global CDN
2. ✅ **SEO Friendly** - All content available at build time
3. ✅ **Secure** - No backend = no security vulnerabilities
4. ✅ **Scalable** - Handles millions of visitors without scaling servers
5. ✅ **Cost Effective** - Free tier hosting on Cloudflare Pages

## 🎨 Customization

### Colors & Branding

Edit `tailwind.config.ts` to customize colors:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#0066ff',
      'primary-dark': '#0052cc',
    },
  },
}
```

### Content Updates

Edit `src/app/page.tsx` to update:
- Hero section messaging
- Features list
- Testimonials
- Statistics
- Footer links

### Analytics Integration

Add to `src/app/layout.tsx`:

```typescript
// Google Analytics
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
/>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🔗 Redirect Configuration

All "Find Jobs" and CTA buttons redirect to: `https://app.riseflake.com/home`

To change redirect URL, update the `href` in:
- Navigation bar button
- Hero section CTA buttons
- Footer links
- Features section links

## 📧 Newsletter Integration

The newsletter form is ready for integration with services like:
- Mailchimp
- SendGrid
- Klaviyo
- ConvertKit

Update the `handleNewsletterSubmit` function in `src/app/page.tsx`.

## 🧪 Testing

### Lighthouse Audit

```bash
# Build optimized version
npm run build

# Test with PageSpeed Insights
# https://pagespeed.web.dev/
```

### Mobile Testing

- Test on iPhone and Android
- Use Chrome DevTools device emulation
- Verify touch targets are 48px minimum

### SEO Testing

- Use [SEO Checker](https://www.seobility.net/en/seocheck/)
- Verify robots.txt: `https://riseflake.com/robots.txt`
- Check sitemap: `https://riseflake.com/sitemap.xml`
- Validate with Google Search Console

## 🚀 Production Checklist

Before going live:

- [ ] Update metadata (title, description, keywords)
- [ ] Add company logo to `public/` folder
- [ ] Update social media links in footer
- [ ] Configure Google Analytics
- [ ] Set up Google Search Console
- [ ] Submit sitemap to Google/Bing
- [ ] Test redirect to app.riseflake.com
- [ ] Verify email validation in newsletter form
- [ ] Test all CTAs and links
- [ ] Performance test with real users (CDN)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Create error page (`public/404.html` if needed)

## 🔐 Security Best Practices

1. **HTTPS Only** - Cloudflare enforces free SSL
2. **Security Headers** - Configured in default Cloudflare setup
3. **No Backend = No Vulnerabilities** - Static content only
4. **Input Validation** - Newsletter form has email validation
5. **CORS** - Not needed for SSG site

## 📈 Monitoring & Analytics

### Key Metrics to Track

1. **Page Vector Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay) / INP
   - CLS (Cumulative Layout Shift)

2. **User Behavior**
   - Unique visitors
   - CTA click-through rates
   - Time on page
   - Bounce rate

3. **SEO Performance**
   - Impressions & clicks (GSC)
   - Rankings for target keywords
   - Backlink profile

## 🤝 Support & Maintenance

### Regular Updates

- Update Next.js: `npm update next`
- Update dependencies: `npm update`
- Review analytics monthly
- Test links quarterly
- Update sitemap if content changes

### Backups

- Code: Automatic via GitHub
- Content: Version controlled in git
- Configuration: Stored in wrangler.toml

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Web.dev SEO Guide](https://web.dev/lighthouse-seo/)

## 📄 License

All rights reserved © 2026 Riseflake

---

**Built with ❤️ using Next.js, Tailwind CSS, and Cloudflare Pages**
