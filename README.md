# 🌾 Smart Crop Prediction System

A modern, AI-powered web application that helps Indian farmers make informed crop selection decisions based on real-time weather data, soil conditions, and machine learning predictions.

![Crop Prediction System](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.20-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-cyan)

## 🚀 Features

### 🎯 Core Functionality
- **AI-Powered Predictions**: Machine learning algorithm recommends optimal crops based on environmental conditions
- **Real-Time Weather Data**: Fetches current weather conditions using Open-Meteo API
- **Soil Analysis**: Auto-detection or manual input of soil parameters (pH, NPK levels)
- **Location-Based Recommendations**: Geocoding support for Indian cities
- **Prediction History**: Track past predictions with confidence scores
- **Crop Information Database**: Comprehensive crop cultivation guides

### 🌟 Technical Features
- **Responsive Design**: Mobile-first, works seamlessly across all devices
- **Accessibility**: WCAG 2.1 compliant with proper ARIA labels and semantic HTML
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds
- **SEO Ready**: Proper meta tags and structured data
- **TypeScript**: Full type safety and enhanced developer experience
- **Modern Stack**: React 18, Vite, Tailwind CSS

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons

### APIs Used
- **Open-Meteo API** - Real-time weather data
- **Nominatim (OpenStreetMap)** - Geocoding and location services
- **Local Storage** - Prediction history persistence

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1\. **Clone the repository**
   ```bash
   git clone https://github.com/HEMANTH-S-KUMAR-1/crop-prediction.git
   cd crop-prediction
   ```

2\. **Install dependencies**
   ```bash
   npm install
   ```

3\. **Start development server**
   ```bash
   npm run dev
   ```

4\. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Standard build
npm run build

# Production optimized build
npm run build:production

# Preview production build
npm run preview
```

## 📱 Usage Guide

### Getting Crop Recommendations

1\. **Enter Location**: Type your city name (supports Indian cities)
2\. **Choose Soil Analysis Method**:
   - **Auto-detect**: System estimates soil conditions based on location
   - **Manual Input**: Enter specific pH and NPK values from soil testing
3\. **Get Prediction**: Click "Predict Best Crop" to receive recommendations
4\. **View Results**: See recommended crop with confidence score and alternatives

### Features Overview

#### 🔮 Prediction Tab
- Input location and soil parameters
- Real-time weather data integration
- ML-based crop recommendations
- Alternative crop suggestions

#### 📊 History Tab
- View past predictions by Farmer ID
- Track prediction confidence scores
- Statistics and analytics
- Clear history functionality

#### 📚 Crop Info Tab
- Detailed crop cultivation guides
- Climate and soil requirements
- Growing seasons and regions
- Best practices and tips

## 🌍 Deployment

### Cloudflare Pages (Recommended)

This project is optimized for Cloudflare Pages deployment:

1\. **Connect Repository**: Link your GitHub repo to Cloudflare Pages
2\. **Build Settings**:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node.js version: `18.x`

3\. **Environment Variables**: None required for basic functionality

### Performance Features
- ⚡ **CDN Optimization**: Global content delivery
- 🗂️ **Asset Compression**: Automatic Brotli/Gzip compression
- 🔄 **SPA Routing**: Proper fallback for client-side routing
- 🛡️ **Security Headers**: Production-ready security configuration

### Alternative Deployment Options
- **Vercel**: Zero-config deployment with GitHub integration
- **Netlify**: Continuous deployment with form handling
- **GitHub Pages**: Free hosting for open source projects

## 🛠️ Development

### Project Structure
```
src/
├── components/           # React components
│   ├── CropInfo.tsx     # Crop information display
│   ├── HistoryView.tsx  # Prediction history
│   ├── PredictionForm.tsx # Input form
│   └── PredictionResult.tsx # Results display
├── services/            # API and business logic
│   └── api.ts          # External API integrations
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Code Quality
- **ESLint**: Enforced coding standards and best practices
- **TypeScript**: Full type coverage with strict mode
- **Prettier-compatible**: Consistent code formatting
- **Modern Standards**: ES2020+ features with proper polyfills

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run build:production # Optimized production build
```

## 🌾 Crop Prediction Algorithm

The system uses a simplified Random Forest-like algorithm that considers:

### Input Parameters
- **Weather Data**: Temperature, humidity, rainfall, season
- **Soil Properties**: pH level, nitrogen, phosphorus, potassium content
- **Location**: Geographic coordinates and regional patterns

### Supported Crops
- **Rice**: High rainfall, warm climate, specific pH requirements
- **Wheat**: Cool dry climate, moderate water needs
- **Cotton**: Warm climate, black cotton soil preferred
- **Sugarcane**: Hot humid climate, high water requirements
- **Alternative crops**: Maize, pulses, vegetables

### Confidence Scoring
Predictions include confidence scores (0-100%) based on:
- Parameter alignment with ideal crop conditions
- Historical regional cultivation patterns
- Seasonal appropriateness

## 🔒 Privacy & Data

- **No Personal Data Collection**: System doesn't store personal information
- **Local Storage Only**: Prediction history stored locally in browser
- **API Data**: Only location and weather data from public APIs
- **GDPR Compliant**: No cookies or tracking mechanisms

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Test your changes: `npm run lint && npm run build`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push and create a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Add proper type annotations
- Write descriptive commit messages
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo**: Weather data API
- **OpenStreetMap**: Geocoding services
- **Lucide**: Beautiful icon library
- **Tailwind CSS**: Utility-first CSS framework
- **Indian Agricultural Research**: Crop cultivation data

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/HEMANTH-S-KUMAR-1/crop-prediction/issues)
- **Discussions**: [GitHub Discussions](https://github.com/HEMANTH-S-KUMAR-1/crop-prediction/discussions)
- **Documentation**: [Wiki](https://github.com/HEMANTH-S-KUMAR-1/crop-prediction/wiki)

---

**Built with ❤️ for Indian farmers** 🇮🇳

*Empowering agricultural decisions through technology*