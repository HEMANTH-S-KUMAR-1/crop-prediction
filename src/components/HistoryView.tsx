import React, { useState, useEffect } from 'react';
import { History, Calendar, MapPin, TrendingUp, RefreshCw, Plus } from 'lucide-react';
import { initializeSampleData, generateSamplePredictions, addPredictionToHistory, cropSearchSuggestions } from '../services/sampleData';

interface Prediction {
  id: string;
  date: string;
  city: string;
  crop: string;
  confidence: number;
}

const HistoryView: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [userId, setUserId] = useState('farmer_001');

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData(userId);
    
    // Load predictions from localStorage
    try {
      const storedPredictions = localStorage.getItem('cropPredictions');
      if (storedPredictions) {
        const allPredictions = JSON.parse(storedPredictions) as Array<{
          id: string;
          userId: string;
          date: string;
          city: string;
          crop: string;
          confidence: number;
        }>;
        // Filter predictions for the current user
        const userPredictions = allPredictions
          .filter((pred) => pred.userId === userId)
          .map((pred) => ({
            id: pred.id,
            date: pred.date,
            city: pred.city,
            crop: pred.crop,
            confidence: pred.confidence
          }));
        setPredictions(userPredictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
      setPredictions([]);
    }
  }, [userId]);

  const clearHistory = () => {
    try {
      const storedPredictions = localStorage.getItem('cropPredictions');
      if (storedPredictions) {
        // Remove predictions for current user only
        const allPredictions = JSON.parse(storedPredictions) as Array<{userId: string}>;
        const otherUserPredictions = allPredictions.filter((pred) => pred.userId !== userId);
        localStorage.setItem('cropPredictions', JSON.stringify(otherUserPredictions));
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const generateMoreSamples = () => {
    try {
      const newPredictions = generateSamplePredictions(userId, 10);
      const storedPredictions = localStorage.getItem('cropPredictions');
      const allPredictions = storedPredictions ? JSON.parse(storedPredictions) : [];
      
      const updatedPredictions = [...allPredictions, ...newPredictions];
      localStorage.setItem('cropPredictions', JSON.stringify(updatedPredictions));
      
      // Refresh the display
      const userPredictions = updatedPredictions
        .filter((pred: { userId: string }) => pred.userId === userId)
        .map((pred: { id: string; date: string; city: string; crop: string; confidence: number }) => ({
          id: pred.id,
          date: pred.date,
          city: pred.city,
          crop: pred.crop,
          confidence: pred.confidence
        }));
      setPredictions(userPredictions);
    } catch (error) {
      console.error('Error generating sample data:', error);
    }
  };

  const addQuickPrediction = () => {
    try {
      const randomCrop = cropSearchSuggestions[Math.floor(Math.random() * cropSearchSuggestions.length)];
      const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'];
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      
      const newPrediction = addPredictionToHistory({
        userId,
        date: new Date().toISOString(),
        city: randomCity,
        crop: randomCrop,
        confidence: Math.floor(Math.random() * 30) + 70
      });

      if (newPrediction) {
        setPredictions(prev => [
          {
            id: newPrediction.id,
            date: newPrediction.date,
            city: newPrediction.city,
            crop: newPrediction.crop,
            confidence: newPrediction.confidence
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error('Error adding quick prediction:', error);
    }
  };
    
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <History className="h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-800">Prediction History</h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={addQuickPrediction}
              className="text-green-600 hover:text-green-700 text-sm font-medium px-3 py-1 border border-green-300 rounded hover:bg-green-50 flex items-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Sample</span>
            </button>
            <button
              onClick={generateMoreSamples}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1 border border-blue-300 rounded hover:bg-blue-50 flex items-center space-x-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Generate 10 More</span>
            </button>
            {predictions.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-300 rounded hover:bg-red-50"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
            Farmer ID
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No prediction history found for this farmer ID.</p>
            <button
              onClick={generateMoreSamples}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Generate Sample History
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {predictions.map((prediction) => (
              <div key={prediction.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{prediction.crop}</h3>
                  <div className="flex items-center space-x-2 text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">{prediction.confidence}%</span>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{prediction.city}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(prediction.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {predictions.length > 0 && (
          <div className="mt-8 space-y-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Statistics</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Predictions:</span>
                  <span className="font-semibold ml-2">{predictions.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Avg Confidence:</span>
                  <span className="font-semibold ml-2">
                    {Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Most Recent:</span>
                  <span className="font-semibold ml-2">{predictions[0]?.crop}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Popular Crop Searches</h4>
              <div className="flex flex-wrap gap-2">
                {cropSearchSuggestions.slice(0, 20).map((crop, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white text-blue-700 text-xs rounded-full border border-blue-200"
                  >
                    {crop}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Total {cropSearchSuggestions.length} crops available for prediction and information lookup
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;