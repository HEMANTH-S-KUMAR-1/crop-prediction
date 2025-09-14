import React from 'react';
import { Award, TrendingUp, Droplets, Thermometer, MapPin, Calendar } from 'lucide-react';
import type { PredictionResult } from '../services/api';

interface PredictionResultProps {
  result: PredictionResult;
  onCropSelect: (crop: string) => void;
}

const PredictionResult: React.FC<PredictionResultProps> = ({ result, onCropSelect }) => {
  const { recommendedCrop, confidence, reasons, alternatives, weatherData, soilData, location } = result;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Prediction Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-600">
        <div className="flex items-center space-x-3 mb-6">
          <Award className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Recommended Crop</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-center mb-4">
              <h3 className="text-4xl font-bold text-green-600 mb-2">
                {recommendedCrop}
              </h3>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>Confidence: {confidence}%</span>
              </div>
            </div>
            
            <button
              onClick={() => onCropSelect(recommendedCrop)}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              View Crop Details
            </button>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800 mb-3">Why this crop?</h4>
            <ul className="space-y-2 text-gray-600">
              {reasons.map((reason: string, index: number) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Alternative Crops */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Alternative Recommendations</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {alternatives.map((crop: { name: string; suitability: number }, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-gray-800">{crop.name}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>{crop.suitability}% suitable</span>
              </div>
              <button
                onClick={() => onCropSelect(crop.name)}
                className="text-green-600 hover:text-green-700 text-sm mt-2 font-medium"
              >
                Learn more →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Data Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weather Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-blue-500" />
            <span>Weather Conditions</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Temperature</span>
              <span className="font-semibold">{weatherData.temperature}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Humidity</span>
              <span className="font-semibold">{weatherData.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rainfall (annual)</span>
              <span className="font-semibold">{weatherData.rainfall}mm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Season</span>
              <span className="font-semibold">{weatherData.season}</span>
            </div>
          </div>
        </div>

        {/* Soil Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <Droplets className="h-5 w-5 text-brown-500" />
            <span>Soil Analysis</span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">pH Level</span>
              <span className="font-semibold">{soilData.ph}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nitrogen (N)</span>
              <span className="font-semibold">{soilData.nitrogen}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phosphorus (P)</span>
              <span className="font-semibold">{soilData.phosphorus}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Potassium (K)</span>
              <span className="font-semibold">{soilData.potassium}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span>Location: {location.city}, {location.state}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600 mb-2">
          <Calendar className="h-4 w-4" />
          <span>Analyzed on: {new Date().toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-500">
          Coordinates: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
        </p>
      </div>
    </div>
  );
};

export default PredictionResult;