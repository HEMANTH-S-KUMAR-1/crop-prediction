// API service functions for crop prediction system using verified Open-Meteo APIs

// API Configuration
const API_CONFIG = {
  FORECAST_URL: import.meta.env.VITE_OPEN_METEO_FORECAST_URL || 'https://api.open-meteo.com/v1/forecast',
  HISTORICAL_URL: import.meta.env.VITE_OPEN_METEO_HISTORICAL_URL || 'https://archive-api.open-meteo.com/v1/archive',
  GEOCODING_URL: import.meta.env.VITE_OPEN_METEO_GEOCODING_URL || 'https://geocoding-api.open-meteo.com/v1/search',
  CLIMATE_URL: import.meta.env.VITE_OPEN_METEO_CLIMATE_URL || 'https://climate-api.open-meteo.com/v1/climate',
  RATE_LIMIT: Number(import.meta.env.VITE_API_RATE_LIMIT) || 10000,
  CACHE_DURATION: Number(import.meta.env.VITE_API_CACHE_DURATION) || 300000, // 5 minutes
  ENABLE_LOGS: import.meta.env.VITE_ENABLE_API_LOGS === 'true'
};

// API Cache for rate limiting and performance
const apiCache = new Map<string, { data: unknown; timestamp: number }>();

// API Utility Functions
function getCachedData(key: string): unknown | null {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION) {
    return cached.data;
  }
  apiCache.delete(key);
  return null;
}

function setCachedData(key: string, data: unknown): void {
  apiCache.set(key, { data, timestamp: Date.now() });
}

function logAPICall(apiName: string, input: string, result?: unknown): void {
  if (API_CONFIG.ENABLE_LOGS) {
    console.log(`🌐 ${apiName} API:`, { input, result: result ? 'Success' : 'Error' });
  }
}

export interface LocationData {
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  timezone?: string;
  elevation?: number;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
}

export interface SoilData {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  soilType: string;
}

export interface PredictionInput {
  location: LocationData;
  weather: WeatherData;
  soil: SoilData;
  userId: string;
}

export interface PredictionResult {
  recommendedCrop: string;
  confidence: number;
  reasons: string[];
  alternatives: Array<{
    name: string;
    suitability: number;
  }>;
  location: LocationData;
  weatherData: WeatherData;
  soilData: SoilData;
  predictionId: string;
  timestamp: string;
}

// Enhanced Geocoding API using Open-Meteo Geocoding API
export async function getLocationData(city: string): Promise<LocationData> {
  const cacheKey = `geocoding_${city.toLowerCase()}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    logAPICall('Geocoding (cached)', city);
    return cached as LocationData;
  }
  
  try {
    // Primary: Open-Meteo Geocoding API (more reliable, includes timezone)
    const openMeteoUrl = `${API_CONFIG.GEOCODING_URL}?name=${encodeURIComponent(city)}&count=5&language=en&format=json`;
    const response = await fetch(openMeteoUrl);
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      // Fallback to Nominatim for Indian cities
      return await getLocationDataFallback(city);
    }
    
    // Find best match (prioritize India or closest match)
    const indiaResult = data.results.find((r: { country?: string; country_code?: string }) => r.country === 'India' || r.country_code === 'IN');
    const bestResult = indiaResult || data.results[0];
    
    const locationData: LocationData = {
      city: bestResult.name,
      state: bestResult.admin1 || 'Unknown',
      country: bestResult.country || 'India',
      lat: bestResult.latitude,
      lon: bestResult.longitude,
      timezone: bestResult.timezone || 'Asia/Kolkata',
      elevation: bestResult.elevation || 0
    };
    
    // Cache the result
    setCachedData(cacheKey, locationData);
    logAPICall('Open-Meteo Geocoding', city, locationData);
    
    return locationData;
  } catch (error) {
    console.error('Open-Meteo Geocoding error:', error);
    // Fallback to Nominatim
    return await getLocationDataFallback(city);
  }
}

// Fallback geocoding using Nominatim
async function getLocationDataFallback(city: string): Promise<LocationData> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},India&format=json&limit=1&addressdetails=1`
    );
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error(`Location not found: ${city}`);
    }
    
    const location = data[0];
    const locationData: LocationData = {
      city: location.display_name.split(',')[0],
      state: location.address?.state || 'Unknown',
      country: 'India',
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon),
      timezone: 'Asia/Kolkata'
    };
    
    logAPICall('Nominatim Geocoding (fallback)', city, locationData);
    return locationData;
  } catch (error) {
    console.error('Fallback geocoding error:', error);
    // Final fallback with mock data for common Indian cities
    return getMockLocationData(city);
  }
}

// Enhanced Weather API using Open-Meteo Forecast API
export async function getWeatherData(lat: number, lon: number, timezone?: string): Promise<WeatherData> {
  const cacheKey = `weather_${lat.toFixed(4)}_${lon.toFixed(4)}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    logAPICall('Weather (cached)', `${lat},${lon}`);
    return cached as WeatherData;
  }
  
  try {
    // Enhanced Open-Meteo Forecast API with comprehensive parameters
    const forecastUrl = `${API_CONFIG.FORECAST_URL}?` + new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m', 
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'pressure_msl'
      ].join(','),
      daily: [
        'precipitation_sum',
        'temperature_2m_max',
        'temperature_2m_min',
        'weather_code'
      ].join(','),
      timezone: timezone || 'Asia/Kolkata',
      forecast_days: '7'
    }).toString();
    
    const response = await fetch(forecastUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const current = data.current;
    const daily = data.daily;
    const season = getCurrentSeason();
    
    // Calculate more accurate annual rainfall from weekly forecast + climate data
    const weeklyRainfall = daily.precipitation_sum?.slice(0, 7)?.reduce((sum: number, val: number) => sum + (val || 0), 0) || 0;
    const estimatedAnnualRainfall = Math.round(weeklyRainfall * 7.5); // Rough estimate
    
    const weatherData: WeatherData = {
      temperature: Math.round(current.temperature_2m || 25),
      humidity: Math.round(current.relative_humidity_2m || 65),
      rainfall: estimatedAnnualRainfall,
      season
    };
    
    // Cache the result
    setCachedData(cacheKey, weatherData);
    logAPICall('Open-Meteo Forecast', `${lat},${lon}`, weatherData);
    
    return weatherData;
  } catch (error) {
    console.error('Weather API error:', error);
    logAPICall('Weather (error)', `${lat},${lon}`);
    return getMockWeatherData();
  }
}

// Historical Weather Data API using Open-Meteo Archive
export async function getHistoricalWeatherData(lat: number, lon: number, startDate: string, endDate: string): Promise<unknown> {
  const cacheKey = `historical_${lat.toFixed(4)}_${lon.toFixed(4)}_${startDate}_${endDate}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    logAPICall('Historical Weather (cached)', `${lat},${lon} ${startDate}-${endDate}`);
    return cached;
  }
  
  try {
    const historicalUrl = `${API_CONFIG.HISTORICAL_URL}?` + new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      start_date: startDate,
      end_date: endDate,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'temperature_2m_mean',
        'precipitation_sum',
        'relative_humidity_2m_mean'
      ].join(','),
      timezone: 'Asia/Kolkata'
    }).toString();
    
    const response = await fetch(historicalUrl);
    
    if (!response.ok) {
      throw new Error(`Historical Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    setCachedData(cacheKey, data);
    logAPICall('Open-Meteo Historical', `${lat},${lon} ${startDate}-${endDate}`, data);
    
    return data;
  } catch (error) {
    console.error('Historical Weather API error:', error);
    logAPICall('Historical Weather (error)', `${lat},${lon}`);
    return null;
  }
}

// Climate Data API using Open-Meteo Climate API
export async function getClimateData(lat: number, lon: number): Promise<unknown> {
  const cacheKey = `climate_${lat.toFixed(4)}_${lon.toFixed(4)}`;
  
  // Check cache first (longer cache for climate data)
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION * 10) { // 50 minutes cache
    logAPICall('Climate Data (cached)', `${lat},${lon}`);
    return cached.data;
  }
  
  try {
    const climateUrl = `${API_CONFIG.CLIMATE_URL}?` + new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      daily: [
        'temperature_2m_mean',
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum'
      ].join(','),
      start_date: '1991-01-01',
      end_date: '2020-12-31'
    }).toString();
    
    const response = await fetch(climateUrl);
    
    if (!response.ok) {
      throw new Error(`Climate API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result with extended duration
    apiCache.set(cacheKey, { data, timestamp: Date.now() });
    logAPICall('Open-Meteo Climate', `${lat},${lon}`, data);
    
    return data;
  } catch (error) {
    console.error('Climate API error:', error);
    logAPICall('Climate Data (error)', `${lat},${lon}`);
    return null;
  }
}

// Enhanced Soil API - Get soil data (using SoilGrids would be ideal, but using enhanced mock data)
export async function getSoilData(lat: number, lon: number): Promise<SoilData> {
  const cacheKey = `soil_${lat.toFixed(4)}_${lon.toFixed(4)}`;
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    logAPICall('Soil Data (cached)', `${lat},${lon}`);
    return cached as SoilData;
  }
  
  try {
    // TODO: Implement SoilGrids API integration
    // const soilGridsUrl = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&property=nitrogen&property=soc&depth=0-5cm&value=mean`;
    
    // For now, generate enhanced mock data based on geographic patterns
    const soilData = generateEnhancedSoilData(lat, lon);
    
    // Cache the result
    setCachedData(cacheKey, soilData);
    logAPICall('Soil Data (mock)', `${lat},${lon}`, soilData);
    
    return soilData;
  } catch (error) {
    console.error('Soil API error:', error);
    return getMockSoilData();
  }
}

// ML Prediction - Predict best crop using Random Forest algorithm (simplified)
export async function predictCrop(input: PredictionInput): Promise<PredictionResult> {
  try {
    // In a real implementation, this would call your FastAPI backend
    // For demo purposes, using a simplified prediction algorithm
    
    const prediction = runSimplifiedMLModel(input);
    
    // Save to database (in real app)
    await savePredictionToDatabase(prediction, input.userId);
    
    return prediction;
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}

// Simplified ML model for demo purposes
function runSimplifiedMLModel(input: PredictionInput): PredictionResult {
  const { weather, soil, location } = input;
  
  // Simplified decision tree based on conditions
  let recommendedCrop = 'Rice';
  let confidence = 75;
  let reasons: string[] = [];
  
  // Rice conditions
  if (weather.rainfall > 1000 && weather.temperature > 20 && soil.ph >= 5.5 && soil.ph <= 7.0) {
    recommendedCrop = 'Rice';
    confidence = 87;
    reasons = [
      'High rainfall suitable for rice cultivation',
      'Temperature range optimal for rice growth',
      'Soil pH ideal for rice production',
      'Humid climate favors rice development'
    ];
  }
  // Wheat conditions
  else if (weather.temperature < 25 && weather.rainfall < 800 && soil.ph >= 6.0) {
    recommendedCrop = 'Wheat';
    confidence = 92;
    reasons = [
      'Cool temperature ideal for wheat',
      'Moderate rainfall suitable',
      'Soil pH favorable for wheat growth',
      'Climate conditions match wheat requirements'
    ];
  }
  // Cotton conditions
  else if (weather.temperature > 21 && weather.temperature < 30 && soil.ph >= 6.0) {
    recommendedCrop = 'Cotton';
    confidence = 79;
    reasons = [
      'Warm climate suitable for cotton',
      'Soil conditions favor cotton growth',
      'Temperature range optimal',
      'Good for cash crop cultivation'
    ];
  }
  // Sugarcane conditions
  else if (weather.temperature > 20 && weather.rainfall > 1200 && soil.nitrogen > 40) {
    recommendedCrop = 'Sugarcane';
    confidence = 84;
    reasons = [
      'High rainfall excellent for sugarcane',
      'Warm temperature promotes growth',
      'Rich nitrogen content in soil',
      'Suitable for long-duration crop'
    ];
  }

  const alternatives = [
    { name: 'Maize', suitability: Math.round(Math.random() * 30 + 60) },
    { name: 'Pulses', suitability: Math.round(Math.random() * 25 + 55) },
    { name: 'Vegetables', suitability: Math.round(Math.random() * 35 + 50) }
  ].filter(crop => crop.name !== recommendedCrop);

  return {
    recommendedCrop,
    confidence,
    reasons,
    alternatives,
    location,
    weatherData: weather,
    soilData: soil,
    predictionId: generateId(),
    timestamp: new Date().toISOString()
  };
}

// Helper functions
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1; // 1-12
  if (month >= 6 && month <= 9) return 'Monsoon';
  if (month >= 10 && month <= 2) return 'Post-Monsoon/Winter';
  return 'Summer';
}

function getMockLocationData(city: string): LocationData {
  const mockLocations: { [key: string]: LocationData } = {
    'mumbai': { city: 'Mumbai', state: 'Maharashtra', country: 'India', lat: 19.0760, lon: 72.8777 },
    'delhi': { city: 'Delhi', state: 'Delhi', country: 'India', lat: 28.7041, lon: 77.1025 },
    'bangalore': { city: 'Bangalore', state: 'Karnataka', country: 'India', lat: 12.9716, lon: 77.5946 },
    'chennai': { city: 'Chennai', state: 'Tamil Nadu', country: 'India', lat: 13.0827, lon: 80.2707 },
    'hyderabad': { city: 'Hyderabad', state: 'Telangana', country: 'India', lat: 17.3850, lon: 78.4867 }
  };

  return mockLocations[city.toLowerCase()] || mockLocations['mumbai'];
}

function getMockWeatherData(): WeatherData {
  return {
    temperature: Math.round(Math.random() * 15 + 20), // 20-35°C
    humidity: Math.round(Math.random() * 30 + 50), // 50-80%
    rainfall: Math.round(Math.random() * 1000 + 500), // 500-1500mm
    season: getCurrentSeason()
  };
}

// Enhanced soil data generation based on geographic patterns
function generateEnhancedSoilData(lat: number, lon: number): SoilData {
  // Generate more realistic soil data based on Indian geographic regions
  let ph: number;
  let nitrogen: number;
  let phosphorus: number;
  let potassium: number;
  let soilType: string;
  
  // Regional soil patterns for India
  if (lat > 28) { // Northern India (Punjab, Haryana, UP)
    ph = Math.round((Math.random() * 1.5 + 7.0) * 10) / 10; // 7.0-8.5 (alkaline)
    nitrogen = Math.round(Math.random() * 20 + 25); // 25-45%
    phosphorus = Math.round(Math.random() * 15 + 20); // 20-35%
    potassium = Math.round(Math.random() * 25 + 30); // 30-55%
    soilType = Math.random() > 0.5 ? 'Alluvial' : 'Loamy';
  } else if (lat > 20 && lon > 77) { // Central India (MP, Chhattisgarh)
    ph = Math.round((Math.random() * 2 + 6.0) * 10) / 10; // 6.0-8.0
    nitrogen = Math.round(Math.random() * 25 + 20); // 20-45%
    phosphorus = Math.round(Math.random() * 20 + 15); // 15-35%
    potassium = Math.round(Math.random() * 30 + 25); // 25-55%
    soilType = Math.random() > 0.6 ? 'Black Cotton' : 'Red';
  } else if (lat < 20 && lon > 77) { // South India (Karnataka, AP, TN)
    ph = Math.round((Math.random() * 1.5 + 5.5) * 10) / 10; // 5.5-7.0 (acidic to neutral)
    nitrogen = Math.round(Math.random() * 30 + 15); // 15-45%
    phosphorus = Math.round(Math.random() * 25 + 10); // 10-35%
    potassium = Math.round(Math.random() * 20 + 35); // 35-55%
    soilType = Math.random() > 0.4 ? 'Red' : 'Laterite';
  } else { // Western India (Maharashtra, Gujarat, Rajasthan)
    ph = Math.round((Math.random() * 2.5 + 6.5) * 10) / 10; // 6.5-9.0
    nitrogen = Math.round(Math.random() * 25 + 18); // 18-43%
    phosphorus = Math.round(Math.random() * 20 + 12); // 12-32%
    potassium = Math.round(Math.random() * 30 + 28); // 28-58%
    soilType = Math.random() > 0.5 ? 'Black Cotton' : 'Desert Sandy';
  }
  
  return {
    ph,
    nitrogen,
    phosphorus,
    potassium,
    soilType
  };
}



function getMockSoilData(): SoilData {
  return {
    ph: 6.8,
    nitrogen: 35,
    phosphorus: 25,
    potassium: 40,
    soilType: 'Loamy'
  };
}

async function savePredictionToDatabase(prediction: PredictionResult, userId: string): Promise<void> {
  try {
    // Get existing predictions from localStorage
    const existingPredictions = localStorage.getItem('cropPredictions');
    const predictions = existingPredictions ? JSON.parse(existingPredictions) : [];
    
    // Create prediction record
    const predictionRecord = {
      id: prediction.predictionId,
      userId: userId,
      date: prediction.timestamp.split('T')[0], // Extract date part
      city: prediction.location.city,
      crop: prediction.recommendedCrop,
      confidence: prediction.confidence,
      fullPrediction: prediction
    };
    
    // Add new prediction to the beginning of the array
    predictions.unshift(predictionRecord);
    
    // Keep only the last 50 predictions to avoid localStorage bloat
    if (predictions.length > 50) {
      predictions.splice(50);
    }
    
    // Save back to localStorage
    localStorage.setItem('cropPredictions', JSON.stringify(predictions));
    
    // console.log('Prediction saved to localStorage:', predictionRecord);
  } catch (error) {
    console.error('Error saving prediction:', error);
  }
}

function generateId(): string {
  return 'pred_' + Math.random().toString(36).substr(2, 9);
}