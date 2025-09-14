// API service functions for crop prediction system

export interface LocationData {
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
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

// Geocoding API - Convert city name to coordinates
export async function getLocationData(city: string): Promise<LocationData> {
  try {
    // Using Nominatim (OpenStreetMap) API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)},India&format=json&limit=1&addressdetails=1`
    );
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error(`Location not found: ${city}`);
    }
    
    const location = data[0];
    return {
      city: location.display_name.split(',')[0],
      state: location.address?.state || 'Unknown',
      country: 'India',
      lat: parseFloat(location.lat),
      lon: parseFloat(location.lon)
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    // Fallback with mock data for common Indian cities
    return getMockLocationData(city);
  }
}

// Weather API - Get current weather data
export async function getWeatherData(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Using Open-Meteo API for weather data
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum&timezone=Asia/Kolkata`
    );
    
    const data = await response.json();
    
    const current = data.current;
    const season = getCurrentSeason();
    
    return {
      temperature: Math.round(current.temperature_2m || 25),
      humidity: Math.round(current.relative_humidity_2m || 65),
      rainfall: Math.round((data.daily?.precipitation_sum?.[0] || 0) * 365), // Annual estimate
      season
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return getMockWeatherData();
  }
}

// Soil API - Get soil data (using SoilGrids would be ideal, but using mock data for demo)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getSoilData(_lat: number, _lon: number): Promise<SoilData> {
  // In a real implementation, you would use SoilGrids API or other soil data sources
  // For demo purposes, generating reasonable soil data based on location
  
  try {
    // Mock implementation - in real app, use SoilGrids API
    return generateMockSoilData();
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

function generateMockSoilData(): SoilData {
  // Generate soil data based on geographical patterns
  const baseData = {
    ph: Math.round((Math.random() * 3 + 5.5) * 10) / 10, // 5.5-8.5
    nitrogen: Math.round(Math.random() * 40 + 20), // 20-60%
    phosphorus: Math.round(Math.random() * 30 + 15), // 15-45%
    potassium: Math.round(Math.random() * 35 + 25), // 25-60%
    soilType: ['Clay', 'Loamy', 'Sandy', 'Black Cotton'][Math.floor(Math.random() * 4)]
  };

  return baseData;
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