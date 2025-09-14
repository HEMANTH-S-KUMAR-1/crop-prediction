# Smart Crop Prediction System - Cloudflare Pages Deployment

## 🌟 API-Powered Architecture (v3.0.0)

### **No Environment Variables Required!**
The system now uses **completely free APIs** with no authentication needed:
- ✅ **Wikipedia REST API**: Automatic crop information
- ✅ **Wikipedia Content API**: Detailed agricultural data  
- ✅ **Open-Meteo API**: Weather and geocoding
- ✅ **Zero Configuration**: No API keys or tokens required

### Optional Performance Variables
```
NODE_VERSION=18.19.0
VITE_APP_NAME=Smart Crop Prediction System
VITE_APP_VERSION=3.0.0
VITE_NODE_ENV=production
VITE_API_CACHE_DURATION=300000
VITE_ENABLE_API_LOGS=false
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

3. **Environment Variables** (Optional):
   - No variables required for basic functionality
   - All APIs work without authentication
   - Optional: Add performance variables if needed

4. **Deploy & Verify**:
   - Click "Save and Deploy"
   - Test crop information retrieval (try "Jaggery", "Potato")
   - Verify history shows only real predictions
   - Confirm Wikipedia API integration works

### Custom Domain (Optional)
- In Cloudflare Pages settings, go to "Custom domains"
- Add your domain and follow DNS configuration instructions

### 🚀 API Performance Features
The v3.0.0 system is optimized for Cloudflare's global network:
- ✅ **Wikipedia API Caching**: Client-side storage reduces API calls
- ✅ **CORS Optimization**: Proper cross-origin headers configured
- ✅ **Error Resilience**: Graceful fallbacks when APIs are unavailable
- ✅ **Global CDN**: Cloudflare caches static assets worldwide
- ✅ **Real-time Data**: Fresh crop information without manual updates

### 🌾 Supported Crop Categories
- **Cereals**: Rice, Wheat, Maize, Jowar, Bajra, Ragi, Barley
- **Pulses**: Gram, Arhar, Moong, Urad, Masoor, Field Pea
- **Cash Crops**: Cotton, Sugarcane, Jaggery, Tobacco, Jute
- **Spices**: Turmeric, Chili, Coriander, Cumin, Fenugreek
- **Vegetables**: Potato, Tomato, Onion, Cabbage, Cauliflower
- **And 50+ more varieties automatically supported!

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