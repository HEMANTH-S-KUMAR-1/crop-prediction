import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Info, Search, Book, Droplets, Thermometer, Calendar, MapPin } from 'lucide-react';

interface CropData {
  name: string;
  scientificName?: string;
  description: string;
  climate: string;
  soil: string;
  water: string;
  season: string;
  regions: string;
  yield: string;
  tips: string[];
}

interface CropInfoProps {
  selectedCrop?: string | null;
}

const CropInfo: React.FC<CropInfoProps> = ({ selectedCrop }) => {
  const [searchCrop, setSearchCrop] = useState(selectedCrop || '');
  const [cropData, setCropData] = useState<CropData | null>(null);
  const [loading, setLoading] = useState(false);

  const cropDatabase: Record<string, CropData> = useMemo(() => ({
    'Rice': {
      name: 'Rice',
      scientificName: 'Oryza sativa',
      description: 'Rice is a staple cereal grain and the most important food crop in India. It is primarily grown in the kharif season with high water requirements.',
      climate: 'Tropical and subtropical regions with high humidity and temperature between 20-35°C',
      soil: 'Clay or loamy soil with pH 5.5-7.0. Requires good water retention capacity.',
      water: 'High water requirement (1000-1500mm annually). Flooded fields preferred.',
      season: 'Kharif (June-October) and Rabi (December-April) seasons',
      regions: 'West Bengal, Punjab, Uttar Pradesh, Andhra Pradesh, Tamil Nadu',
      yield: '2000-4000 kg/hectare',
      tips: [
        'Ensure adequate water supply throughout growing season',
        'Use certified seeds for better yield',
        'Apply fertilizers in split doses',
        'Control weeds regularly'
      ]
    },
    'Wheat': {
      name: 'Wheat',
      scientificName: 'Triticum aestivum',
      description: 'Wheat is the second most important cereal crop in India after rice. It is primarily a rabi crop requiring cool climate for growth.',
      climate: 'Cool and dry climate with temperature between 10-25°C during growing period',
      soil: 'Well-drained loamy soil with pH 6.0-7.5. Good organic matter content preferred.',
      water: 'Moderate water requirement (450-600mm). Sensitive to waterlogging.',
      season: 'Rabi season (November-April)',
      regions: 'Punjab, Haryana, Uttar Pradesh, Madhya Pradesh, Rajasthan',
      yield: '3000-4500 kg/hectare',
      tips: [
        'Sow at optimal time for maximum yield',
        'Provide adequate drainage',
        'Use balanced fertilization',
        'Monitor for diseases and pests'
      ]
    },
    'Cotton': {
      name: 'Cotton',
      scientificName: 'Gossypium spp.',
      description: 'Cotton is the most important cash crop and natural fiber crop in India. It requires warm climate and adequate rainfall or irrigation.',
      climate: 'Warm climate with temperature between 21-30°C. Long frost-free period needed.',
      soil: 'Well-drained black cotton soil (regur) with pH 6.0-8.5. Good water holding capacity.',
      water: 'Moderate to high water requirement (500-800mm). Critical during flowering and boll development.',
      season: 'Kharif season (April-October)',
      regions: 'Gujarat, Maharashtra, Telangana, Karnataka, Punjab, Haryana',
      yield: '400-600 kg/hectare',
      tips: [
        'Choose appropriate variety for your region',
        'Ensure proper plant spacing',
        'Integrated pest management essential',
        'Proper harvesting and storage important'
      ]
    },
    'Sugarcane': {
      name: 'Sugarcane',
      scientificName: 'Saccharum officinarum',
      description: 'Sugarcane is an important cash crop grown for sugar production. It requires hot and humid climate with adequate water supply.',
      climate: 'Hot and humid climate with temperature between 20-30°C. High sunshine hours needed.',
      soil: 'Deep, fertile, well-drained loamy soil with pH 6.5-7.5. Rich in organic matter.',
      water: 'High water requirement (1500-2000mm). Regular irrigation essential.',
      season: 'Year-round crop with planting in spring (February-April)',
      regions: 'Uttar Pradesh, Maharashtra, Karnataka, Tamil Nadu, Gujarat',
      yield: '60-80 tonnes/hectare',
      tips: [
        'Use disease-free seed material',
        'Maintain proper row spacing',
        'Apply fertilizers at right time',
        'Harvest at optimal maturity'
      ]
    }
  }), []);

  const handleSearch = useCallback(async (crop: string = searchCrop) => {
    if (!crop.trim()) return;

    setLoading(true);
    
    // Simulate API call - in real app, call Wikipedia API
    setTimeout(() => {
      const foundKey = Object.keys(cropDatabase).find(key => 
        key.toLowerCase().includes(crop.toLowerCase())
      );
      const cropInfo = cropDatabase[crop] || (foundKey ? cropDatabase[foundKey] : null);
      
      setCropData(cropInfo || {
        name: crop,
        description: `Information about ${crop} is currently being updated. Please check back later.`,
        climate: 'Climate information not available',
        soil: 'Soil information not available',
        water: 'Water requirement information not available',
        season: 'Season information not available',
        regions: 'Region information not available',
        yield: 'Yield information not available',
        tips: ['Consult local agricultural experts for guidance']
      });
      setLoading(false);
    }, 1000);
  }, [searchCrop, cropDatabase]);

  useEffect(() => {
    if (selectedCrop) {
      setSearchCrop(selectedCrop);
      handleSearch(selectedCrop);
    }
  }, [selectedCrop, handleSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Info className="h-8 w-8 text-green-600" />
          <h2 className="text-2xl font-bold text-gray-800">Crop Information</h2>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex space-x-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchCrop}
                onChange={(e) => setSearchCrop(e.target.value)}
                placeholder="Enter crop name (e.g., Rice, Wheat, Cotton)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching crop information...</p>
          </div>
        )}

        {cropData && !loading && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center pb-6 border-b border-gray-200">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">{cropData.name}</h3>
              {cropData.scientificName && (
                <p className="text-gray-600 italic">{cropData.scientificName}</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Book className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-800">Description</h4>
              </div>
              <p className="text-gray-700 leading-relaxed">{cropData.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <h4 className="font-semibold text-gray-800">Climate Requirements</h4>
                </div>
                <p className="text-gray-600 text-sm">{cropData.climate}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <h4 className="font-semibold text-gray-800">Soil Requirements</h4>
                </div>
                <p className="text-gray-600 text-sm">{cropData.soil}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                  <h4 className="font-semibold text-gray-800">Water Requirements</h4>
                </div>
                <p className="text-gray-600 text-sm">{cropData.water}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <h4 className="font-semibold text-gray-800">Growing Season</h4>
                </div>
                <p className="text-gray-600 text-sm">{cropData.season}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold text-gray-800">Major Growing Regions</h4>
                </div>
                <p className="text-gray-600 text-sm">{cropData.regions}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Info className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold text-gray-800">Average Yield</h4>
                </div>
                <p className="text-gray-600 text-sm">{cropData.yield}</p>
              </div>
            </div>

            {/* Tips */}
            {cropData.tips && (
              <div className="bg-yellow-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Cultivation Tips</h4>
                <ul className="space-y-2">
                  {cropData.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-yellow-600 mt-1 text-xs">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!cropData && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Book className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Search for a crop to view detailed information</p>
            <p className="text-sm mt-2">Available: Rice, Wheat, Cotton, Sugarcane, and more</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropInfo;