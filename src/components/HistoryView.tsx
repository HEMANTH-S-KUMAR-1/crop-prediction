import React, { useState, useEffect } from 'react';
import { History, Calendar, MapPin, TrendingUp } from 'lucide-react';

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
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
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
        )}
      </div>
    </div>
  );
};

export default HistoryView;