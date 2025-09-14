import { useState } from 'react';
import { Wheat, History, Info, TrendingUp } from 'lucide-react';
import PredictionForm from './components/PredictionForm';
import PredictionResult from './components/PredictionResult';
import HistoryView from './components/HistoryView';
import CropInfo from './components/CropInfo';
import { PredictionResult as PredictionResultType } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [predictionResult, setPredictionResult] = useState<PredictionResultType | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const handlePredictionResult = (result: PredictionResultType) => {
    setPredictionResult(result);
  };

  const handleCropSelect = (crop: string) => {
    setSelectedCrop(crop);
    setActiveTab('crop-info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-4 border-green-600" role="banner">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <Wheat className="h-8 w-8 text-green-600" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-800">Smart Crop Prediction System</h1>
          </div>
          <p className="text-gray-600 mt-2">AI-powered crop recommendations for Indian farmers</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-green-600 shadow-sm" role="navigation" aria-label="Main navigation">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8" role="tablist">
            <button
              onClick={() => setActiveTab('predict')}
              className={`py-4 px-6 text-white font-medium border-b-2 transition-all ${
                activeTab === 'predict'
                  ? 'border-white bg-green-700'
                  : 'border-transparent hover:bg-green-700'
              }`}
              role="tab"
              aria-selected={activeTab === 'predict'}
              aria-controls="predict-panel"
            >
              <TrendingUp className="h-4 w-4 inline mr-2" aria-hidden="true" />
              Predict Crop
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-6 text-white font-medium border-b-2 transition-all ${
                activeTab === 'history'
                  ? 'border-white bg-green-700'
                  : 'border-transparent hover:bg-green-700'
              }`}
              role="tab"
              aria-selected={activeTab === 'history'}
              aria-controls="history-panel"
            >
              <History className="h-4 w-4 inline mr-2" aria-hidden="true" />
              History
            </button>
            <button
              onClick={() => setActiveTab('crop-info')}
              className={`py-4 px-6 text-white font-medium border-b-2 transition-all ${
                activeTab === 'crop-info'
                  ? 'border-white bg-green-700'
                  : 'border-transparent hover:bg-green-700'
              }`}
              role="tab"
              aria-selected={activeTab === 'crop-info'}
              aria-controls="crop-info-panel"
            >
              <Info className="h-4 w-4 inline mr-2" aria-hidden="true" />
              Crop Info
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" role="main">
        {activeTab === 'predict' && (
          <div className="space-y-8" role="tabpanel" id="predict-panel" aria-labelledby="predict-tab">
            <PredictionForm onResult={handlePredictionResult} />
            {predictionResult && (
              <PredictionResult 
                result={predictionResult} 
                onCropSelect={handleCropSelect}
              />
            )}
          </div>
        )}
        
        {activeTab === 'history' && (
          <div role="tabpanel" id="history-panel" aria-labelledby="history-tab">
            <HistoryView />
          </div>
        )}
        
        {activeTab === 'crop-info' && (
          <div role="tabpanel" id="crop-info-panel" aria-labelledby="crop-info-tab">
            <CropInfo selectedCrop={selectedCrop} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Smart Crop Prediction</h3>
              <p className="text-gray-400">
                Empowering Indian farmers with data-driven crop recommendations using real-time weather and soil data.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Open-Meteo Weather API</li>
                <li>• SoilGrids for soil data</li>
                <li>• Wikipedia crop information</li>
                <li>• OpenStreetMap geocoding</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="text-gray-400 space-y-2">
                <li>• Real-time weather data</li>
                <li>• Soil analysis</li>
                <li>• ML-based predictions</li>
                <li>• Prediction history</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
            <p>&copy; 2025 Smart Crop Prediction System. Built for Indian farmers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;