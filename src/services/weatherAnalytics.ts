// Enhanced API Analytics and Utilities for Crop Prediction System
// Uses verified Open-Meteo APIs for comprehensive weather and climate data

import { 
  getHistoricalWeatherData
} from './api';



// Interface for API response data structures
interface WeatherApiResponse {
  daily?: {
    temperature_2m_mean?: number[];
    precipitation_sum?: number[];
  };
}

interface CurrentWeatherData {
  temperature: number;
  rainfall: number;
  humidity?: number;
  season?: string;
}

interface SoilAnalysisData {
  ph: number;
  organicMatter?: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
}

interface CropData {
  name: string;
  optimalTemp: number[];
  optimalRainfall: number[];
  optimalPH: number[];
  season: string[];
}

export interface WeatherAnalytics {
  currentVsHistorical: {
    temperatureDifference: number;
    rainfallDifference: number;
    trend: 'above_average' | 'below_average' | 'average';
  };
  seasonalPatterns: {
    averageTemperature: number;
    averageRainfall: number;
    seasonName: string;
    isOptimalSeason: boolean;
  };
  riskFactors: {
    droughtRisk: 'low' | 'medium' | 'high';
    floodRisk: 'low' | 'medium' | 'high';
    temperatureStress: 'low' | 'medium' | 'high';
  };
}

export interface CropSuitabilityData {
  crop: string;
  suitabilityScore: number;
  climateMatch: number;
  seasonalFit: number;
  riskAssessment: 'low' | 'medium' | 'high';
  recommendations: string[];
}

// Get comprehensive weather analytics for better crop predictions
export async function getWeatherAnalytics(
  lat: number, 
  lon: number, 
  currentWeather: CurrentWeatherData
): Promise<WeatherAnalytics> {
  try {
    // Get historical data for the same period last year
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const startDate = lastYear.toISOString().split('T')[0];
    
    const endDate = new Date(lastYear.getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]; // 30 days period
    
    // Get historical weather data
    const historicalData = await getHistoricalWeatherData(lat, lon, startDate, endDate);
    
    // Calculate analytics
    const analytics = calculateWeatherAnalytics(currentWeather, historicalData as WeatherApiResponse);
    
    return analytics;
  } catch (error) {
    console.error('Weather analytics error:', error);
    // Return default analytics
    return {
      currentVsHistorical: {
        temperatureDifference: 0,
        rainfallDifference: 0,
        trend: 'average'
      },
      seasonalPatterns: {
        averageTemperature: currentWeather.temperature || 25,
        averageRainfall: currentWeather.rainfall || 800,
        seasonName: currentWeather.season || 'Unknown',
        isOptimalSeason: true
      },
      riskFactors: {
        droughtRisk: 'low',
        floodRisk: 'low',
        temperatureStress: 'low'
      }
    };
  }
}

// Calculate detailed weather analytics from historical and climate data
function calculateWeatherAnalytics(
  current: CurrentWeatherData, 
  historical: WeatherApiResponse
): WeatherAnalytics {
  // Calculate historical averages if data available
  let historicalAvgTemp = current.temperature;
  let historicalAvgRain = current.rainfall;
  
  if (historical?.daily) {
    const temps = historical.daily.temperature_2m_mean?.filter((t: number) => t != null) || [];
    const rainfall = historical.daily.precipitation_sum?.filter((r: number) => r != null) || [];
    
    if (temps.length > 0) {
      historicalAvgTemp = temps.reduce((sum: number, temp: number) => sum + temp, 0) / temps.length;
    }
    
    if (rainfall.length > 0) {
      historicalAvgRain = rainfall.reduce((sum: number, rain: number) => sum + rain, 0) * 12; // Annualize
    }
  }
  
  // Temperature and rainfall differences
  const tempDiff = current.temperature - historicalAvgTemp;
  const rainDiff = current.rainfall - historicalAvgRain;
  
  // Determine trend
  let trend: 'above_average' | 'below_average' | 'average' = 'average';
  if (Math.abs(tempDiff) > 2 || Math.abs(rainDiff) > 200) {
    trend = (tempDiff > 0 || rainDiff > 0) ? 'above_average' : 'below_average';
  }
  
  // Risk assessment
  const droughtRisk = current.rainfall < 400 ? 'high' : current.rainfall < 800 ? 'medium' : 'low';
  const floodRisk = current.rainfall > 2000 ? 'high' : current.rainfall > 1500 ? 'medium' : 'low';
  const temperatureStress = current.temperature > 35 || current.temperature < 10 ? 'high' : 
                           current.temperature > 30 || current.temperature < 15 ? 'medium' : 'low';
  
  return {
    currentVsHistorical: {
      temperatureDifference: Math.round(tempDiff * 10) / 10,
      rainfallDifference: Math.round(rainDiff),
      trend
    },
    seasonalPatterns: {
      averageTemperature: Math.round(historicalAvgTemp * 10) / 10,
      averageRainfall: Math.round(historicalAvgRain),
      seasonName: current.season || 'Unknown',
      isOptimalSeason: isOptimalGrowingSeason(current.season || 'Unknown')
    },
    riskFactors: {
      droughtRisk,
      floodRisk,
      temperatureStress
    }
  };
}

// Enhanced crop suitability analysis using weather analytics
export function analyzeCropSuitability(
  weatherAnalytics: WeatherAnalytics,
  soilData: SoilAnalysisData
): CropSuitabilityData[] {
  const crops = [
    {
      name: 'Rice',
      optimalTemp: [20, 35],
      optimalRainfall: [1000, 2000],
      optimalPH: [5.5, 7.0],
      season: ['Monsoon', 'Post-Monsoon/Winter']
    },
    {
      name: 'Wheat',
      optimalTemp: [10, 25],
      optimalRainfall: [450, 800],
      optimalPH: [6.0, 7.5],
      season: ['Post-Monsoon/Winter', 'Summer']
    },
    {
      name: 'Cotton',
      optimalTemp: [21, 30],
      optimalRainfall: [500, 1200],
      optimalPH: [6.0, 8.5],
      season: ['Monsoon']
    },
    {
      name: 'Sugarcane',
      optimalTemp: [20, 30],
      optimalRainfall: [1200, 2000],
      optimalPH: [6.5, 7.5],
      season: ['Monsoon', 'Post-Monsoon/Winter']
    },
    {
      name: 'Maize',
      optimalTemp: [18, 27],
      optimalRainfall: [600, 1200],
      optimalPH: [6.0, 7.0],
      season: ['Monsoon', 'Summer']
    }
  ];
  
  return crops.map(crop => {
    // Calculate suitability scores
    const tempScore = calculateRangeScore(weatherAnalytics.seasonalPatterns.averageTemperature, crop.optimalTemp);
    const rainScore = calculateRangeScore(weatherAnalytics.seasonalPatterns.averageRainfall, crop.optimalRainfall);
    const phScore = calculateRangeScore(soilData.ph, crop.optimalPH);
    const seasonScore = crop.season.includes(weatherAnalytics.seasonalPatterns.seasonName) ? 1 : 0.5;
    
    const climateMatch = Math.round((tempScore + rainScore) * 50);
    const seasonalFit = Math.round(seasonScore * 100);
    const suitabilityScore = Math.round((tempScore + rainScore + phScore + seasonScore) * 25);
    
    // Risk assessment based on weather analytics
    const risks = Object.values(weatherAnalytics.riskFactors);
    const highRisks = risks.filter(risk => risk === 'high').length;
    const riskAssessment: 'low' | 'medium' | 'high' = highRisks > 1 ? 'high' : highRisks === 1 ? 'medium' : 'low';
    
    // Generate recommendations
    const recommendations = generateCropRecommendations(crop, weatherAnalytics, soilData);
    
    return {
      crop: crop.name,
      suitabilityScore,
      climateMatch,
      seasonalFit,
      riskAssessment,
      recommendations
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}

// Helper functions
function calculateRangeScore(value: number, range: number[]): number {
  const [min, max] = range;
  if (value >= min && value <= max) return 1;
  if (value < min) return Math.max(0, 1 - (min - value) / min * 2);
  return Math.max(0, 1 - (value - max) / max * 2);
}

function isOptimalGrowingSeason(season: string): boolean {
  const optimalSeasons = ['Monsoon', 'Post-Monsoon/Winter'];
  return optimalSeasons.includes(season);
}

function generateCropRecommendations(
  crop: CropData, 
  analytics: WeatherAnalytics, 
  soilData: SoilAnalysisData
): string[] {
  const recommendations: string[] = [];
  
  // Temperature-based recommendations
  if (analytics.riskFactors.temperatureStress === 'high') {
    recommendations.push(`Monitor temperature stress for ${crop.name} - consider shade nets or cooling methods`);
  }
  
  // Rainfall-based recommendations
  if (analytics.riskFactors.droughtRisk === 'high') {
    recommendations.push(`Install drip irrigation system - drought risk detected for ${crop.name}`);
  } else if (analytics.riskFactors.floodRisk === 'high') {
    recommendations.push(`Ensure proper drainage - excess rainfall risk for ${crop.name}`);
  }
  
  // Soil-based recommendations
  if (soilData.ph < 6.0) {
    recommendations.push(`Apply lime to increase soil pH for optimal ${crop.name} growth`);
  } else if (soilData.ph > 8.0) {
    recommendations.push(`Apply sulfur or organic matter to reduce soil alkalinity for ${crop.name}`);
  }
  
  // Seasonal recommendations
  if (!analytics.seasonalPatterns.isOptimalSeason) {
    recommendations.push(`Consider alternative planting schedule - current season may not be optimal for ${crop.name}`);
  }
  
  return recommendations.slice(0, 3); // Limit to top 3 recommendations
}

// Export utility for checking API health
export async function checkAPIHealth(): Promise<{ status: string; apis: Record<string, boolean> }> {
  const apis: Record<string, boolean> = {};
  
  try {
    // Test Open-Meteo Forecast API
    const forecastTest = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.7041&longitude=77.1025&current=temperature_2m');
    apis.forecast = forecastTest.ok;
    
    // Test Open-Meteo Geocoding API
    const geocodingTest = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=Delhi&count=1');
    apis.geocoding = geocodingTest.ok;
    
    // Test Open-Meteo Historical API
    const historicalTest = await fetch('https://archive-api.open-meteo.com/v1/archive?latitude=28.7041&longitude=77.1025&start_date=2023-01-01&end_date=2023-01-02&daily=temperature_2m_mean');
    apis.historical = historicalTest.ok;
    
    const allHealthy = Object.values(apis).every(status => status);
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      apis
    };
  } catch (error) {
    console.error('API health check failed:', error);
    return {
      status: 'error',
      apis
    };
  }
}