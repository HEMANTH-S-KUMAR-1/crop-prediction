import React, { useState } from 'react';
import { MapPin, Cloud, Droplets, Thermometer, Loader2 } from 'lucide-react';
import { getLocationData, getWeatherData, getSoilData, predictCrop } from '../services/api';

import { PredictionResult } from '../services/api';

interface PredictionFormProps {
  onResult: (result: PredictionResult) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onResult }) => {
  const [formData, setFormData] = useState({
    city: '',
    soilMode: 'auto' // 'auto' or 'manual'
  });
  const [manualSoilData, setManualSoilData] = useState({
    ph: 6.5,
    nitrogen: 30,
    phosphorus: 25,
    potassium: 35
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('input'); // input, fetching, results

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.city.trim()) return;

    setLoading(true);
    setStep('fetching');

    try {
      // Step 1: Get location coordinates
      const locationData = await getLocationData(formData.city);
      
      // Step 2: Get weather data with timezone support
      const weatherData = await getWeatherData(locationData.lat, locationData.lon, locationData.timezone);
      
      // Step 3: Get soil data
      const soilData = formData.soilMode === 'manual' 
        ? { ...manualSoilData, soilType: 'User Specified' }
        : await getSoilData(locationData.lat, locationData.lon);
      
      // Step 4: Predict crop
      const prediction = await predictCrop({
        location: locationData,
        weather: weatherData,
        soil: soilData
      });

      onResult(prediction);
      setStep('results');
    } catch (error) {
      console.error('Prediction error:', error);
      // Show error state
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSoilModeChange = (mode: 'auto' | 'manual') => {
    setFormData({
      ...formData,
      soilMode: mode
    });
  };

  const handleManualSoilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSoilData({
      ...manualSoilData,
      [e.target.name]: parseFloat(e.target.value) || 0
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Get Crop Recommendation
        </h2>
        
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                Enter Your City (India)
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., Mumbai, Delhi, Bangalore, Chennai"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll fetch real-time weather and soil data for your location
              </p>
            </div>

            {/* Soil Analysis Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Droplets className="h-4 w-4 inline mr-2" />
                Soil Analysis Method
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="soilMode"
                    value="auto"
                    checked={formData.soilMode === 'auto'}
                    onChange={() => handleSoilModeChange('auto')}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Auto-detect soil conditions</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="soilMode"
                    value="manual"
                    checked={formData.soilMode === 'manual'}
                    onChange={() => handleSoilModeChange('manual')}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Enter soil data manually</span>
                </label>
              </div>
            </div>

            {/* Manual Soil Input Fields */}
            {formData.soilMode === 'manual' && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-4">Enter Soil Parameters</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ph" className="block text-sm font-medium text-gray-700 mb-1">
                      pH Level (5.0 - 8.5)
                    </label>
                    <input
                      type="number"
                      id="ph"
                      name="ph"
                      value={manualSoilData.ph}
                      onChange={handleManualSoilChange}
                      min="5.0"
                      max="8.5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700 mb-1">
                      Nitrogen (N) %
                    </label>
                    <input
                      type="number"
                      id="nitrogen"
                      name="nitrogen"
                      value={manualSoilData.nitrogen}
                      onChange={handleManualSoilChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700 mb-1">
                      Phosphorus (P) %
                    </label>
                    <input
                      type="number"
                      id="phosphorus"
                      name="phosphorus"
                      value={manualSoilData.phosphorus}
                      onChange={handleManualSoilChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="potassium" className="block text-sm font-medium text-gray-700 mb-1">
                      Potassium (K) %
                    </label>
                    <input
                      type="number"
                      id="potassium"
                      name="potassium"
                      value={manualSoilData.potassium}
                      onChange={handleManualSoilChange}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-gray-500">
                  💡 Tip: You can get soil test results from your local agricultural office or use a soil testing kit
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.city.trim()}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin inline mr-2" />
              ) : null}
              Predict Best Crop
            </button>
          </form>
        )}

        {step === 'fetching' && (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Analyzing Your Location
            </h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Getting coordinates for {formData.city}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Cloud className="h-4 w-4" />
                <span>Fetching real-time weather data</span>
              </div>
              {formData.soilMode === 'auto' && (
                <div className="flex items-center justify-center space-x-2">
                  <Droplets className="h-4 w-4" />
                  <span>Analyzing soil conditions</span>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <Thermometer className="h-4 w-4" />
                <span>Processing ML prediction</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Cloud className="h-6 w-6 text-blue-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Real-time Weather</h4>
          <p className="text-sm text-gray-600">Temperature, humidity, rainfall data</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Droplets className="h-6 w-6 text-brown-500 mb-2" />
          <h4 className="font-semibold text-gray-800">Soil Analysis</h4>
          <p className="text-sm text-gray-600">Auto-detect or manual input</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Thermometer className="h-6 w-6 text-green-500 mb-2" />
          <h4 className="font-semibold text-gray-800">ML Prediction</h4>
          <p className="text-sm text-gray-600">Random Forest algorithm</p>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;