import React, { useState, useEffect } from 'react';
import { History, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { cropSearchSuggestions } from '../services/sampleData';

interface Prediction {
  id: string;
  date: string;
  city: string;
  crop: string;
  confidence: number;
}

const HistoryView: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // Load only real predictions (no sample data)
    try {
      const storedPredictions = localStorage.getItem('cropPredictions');
      if (storedPredictions) {
        const allPredictions = JSON.parse(storedPredictions) as Array<{
          id: string;
          date: string;
          city: string;
          crop: string;
          confidence: number;
          isRealPrediction?: boolean; // Flag to identify real predictions
        }>;
        
        // Only keep real predictions and remove all sample data
        const realPredictions = allPredictions
          .filter((pred) => pred.isRealPrediction === true)
          .map((pred) => ({
            id: pred.id,
            date: pred.date,
            city: pred.city,
            crop: pred.crop,
            confidence: pred.confidence
          }));
        
        // Update localStorage to only contain real predictions
        localStorage.setItem('cropPredictions', JSON.stringify(allPredictions.filter((pred) => pred.isRealPrediction === true)));
        
        setPredictions(realPredictions);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error loading predictions:', error);
      setPredictions([]);
    }
  }, []);

  const clearHistory = () => {
    try {
      // Clear all prediction history
      localStorage.removeItem('cropPredictions');
      setPredictions([]);
    } catch (error) {
      console.error('Error clearing history:', error);
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
          {predictions.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-300 rounded hover:bg-red-50"
            >
              Clear History
            </button>
          )}
        </div>

        <div className="mb-6">
        </div>

        {predictions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>No prediction history found.</p>
            <p className="text-sm mt-2">Make crop predictions to see them appear here.</p>
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