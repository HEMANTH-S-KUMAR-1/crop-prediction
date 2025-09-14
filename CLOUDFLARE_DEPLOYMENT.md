# Cloudflare Pages Deployment Configuration

## Environment Variables to Set in Cloudflare Dashboard

### Required Variables
```
NODE_VERSION=18.19.0
NPM_VERSION=10.2.4
VITE_APP_NAME=Crop Prediction System
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=production
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_LOGS=false
```

### Build Configuration
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (leave empty)
- **Node.js version**: `18.19.0`

### Cloudflare Pages Setup Instructions

1. **Connect Repository**:
   - Go to Cloudflare Dashboard → Pages
   - Click "Create a project" → "Connect to Git"
   - Select your GitHub repository: `HEMANTH-S-KUMAR-1/crop-prediction`

2. **Configure Build Settings**:
   ```
   Project name: crop-prediction
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   ```

3. **Set Environment Variables**:
   - Go to Settings → Environment variables
   - Add the variables listed above
   - Set them for "Production" environment

4. **Deploy**:
   - Click "Save and Deploy"
   - Cloudflare will automatically build and deploy your site

### Custom Domain (Optional)
- In Cloudflare Pages settings, go to "Custom domains"
- Add your domain and follow DNS configuration instructions

### Performance Optimizations
The project is already optimized for Cloudflare Pages with:
- ✅ Static site generation
- ✅ Asset optimization
- ✅ HTTP/2 server push headers
- ✅ Caching configurations in `_headers`
- ✅ SPA routing in `_redirects`

### Monitoring
- Monitor deployments in Cloudflare Pages dashboard
- Check Web Analytics in Cloudflare (free tier available)
- Enable Cloudflare Web Analytics by adding the beacon to your site

### Troubleshooting
- Build logs are available in Cloudflare Pages dashboard
- Common issues:
  - Node.js version mismatch: Ensure Node 18+ is set
  - Build timeout: Large dependencies may need optimization
  - Environment variables: Ensure all VITE_ prefixed vars are set