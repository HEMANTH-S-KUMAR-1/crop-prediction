import React, { useState, useEffect, useCallback } from 'react';
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

  // Cache for API responses
  const [apiCache, setApiCache] = useState<Record<string, CropData>>({});

  // Function to fetch crop data from Wikipedia API
  const fetchCropDataFromAPI = useCallback(async (cropName: string): Promise<CropData | null> => {
    try {
      // Check cache first
      if (apiCache[cropName.toLowerCase()]) {
        return apiCache[cropName.toLowerCase()];
      }

      // Fetch from Wikipedia API
      const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cropName)}`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error('Wikipedia API request failed');
      }

      const data = await response.json();
      
      // Extract basic information
      let description = data.extract || `${cropName} is an important agricultural crop.`;
      let scientificName = '';
      
      // Try to extract scientific name from the description
      const scientificNameMatch = description.match(/\(([A-Z][a-z]+ [a-z]+)\)/);
      if (scientificNameMatch) {
        scientificName = scientificNameMatch[1];
      }

      // Try to get more detailed information from Wikipedia content API
      let detailedInfo = null;
      try {
        const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(cropName)}&prop=extracts&exintro=1&explaintext=1&origin=*`;
        const contentResponse = await fetch(contentUrl);
        const contentData = await contentResponse.json();
        
        const pages = contentData.query?.pages;
        if (pages) {
          const pageKey = Object.keys(pages)[0];
          if (pages[pageKey]?.extract) {
            detailedInfo = pages[pageKey].extract;
            description = detailedInfo.substring(0, 300) + '...';
          }
        }
      } catch {
        console.log('Could not fetch detailed content, using summary');
      }

      // Generate intelligent crop information based on common patterns
      const cropData: CropData = {
        name: cropName,
        scientificName: scientificName,
        description: description,
        climate: await generateClimateInfo(cropName),
        soil: await generateSoilInfo(cropName),
        water: await generateWaterInfo(cropName),
        season: await generateSeasonInfo(cropName),
        regions: await generateRegionInfo(cropName),
        yield: await generateYieldInfo(cropName),
        tips: await generateCultivationTips(cropName)
      };

      // Cache the result
      setApiCache(prev => ({
        ...prev,
        [cropName.toLowerCase()]: cropData
      }));

      return cropData;
    } catch (error) {
      console.error('Error fetching crop data:', error);
      return null;
    }
  }, [apiCache]);

  // Helper functions to generate intelligent crop information
  const generateClimateInfo = async (cropName: string): Promise<string> => {
    const crop = cropName.toLowerCase();
    
    // Climate patterns based on crop type
    if (crop.includes('rice') || crop.includes('paddy')) {
      return 'Tropical and subtropical climate with high humidity and temperature 20-35°C. Requires warm, wet conditions.';
    } else if (crop.includes('wheat')) {
      return 'Cool, dry climate with temperatures 10-25°C during growing period. Requires moderate rainfall.';
    } else if (crop.includes('cotton')) {
      return 'Warm climate with temperatures 21-30°C. Long frost-free period with moderate to high humidity.';
    } else if (crop.includes('jaggery') || crop.includes('sugarcane')) {
      return 'Hot, humid tropical climate with temperatures 20-30°C. High sunshine hours required.';
    } else if (crop.includes('maize') || crop.includes('corn')) {
      return 'Warm temperate climate with temperatures 18-27°C. Moderate rainfall during growing season.';
    } else if (crop.includes('soybean')) {
      return 'Warm climate with temperatures 20-30°C. Moderate to high rainfall required.';
    } else if (crop.includes('potato')) {
      return 'Cool climate with temperatures 15-20°C. Requires well-distributed rainfall.';
    } else if (crop.includes('tomato')) {
      return 'Warm climate with temperatures 20-25°C. Requires moderate humidity and rainfall.';
    } else {
      return 'Temperate to tropical climate with moderate temperatures and rainfall. Specific requirements vary by variety.';
    }
  };

  const generateSoilInfo = async (cropName: string): Promise<string> => {
    const crop = cropName.toLowerCase();
    
    if (crop.includes('rice') || crop.includes('paddy')) {
      return 'Clay or clayey loam soil with pH 5.5-7.0. Good water retention capacity required.';
    } else if (crop.includes('wheat')) {
      return 'Well-drained loamy soil with pH 6.0-7.5. Good organic matter content preferred.';
    } else if (crop.includes('cotton')) {
      return 'Deep, well-drained black cotton soil with pH 6.0-8.5. Good water holding capacity.';
    } else if (crop.includes('jaggery') || crop.includes('sugarcane')) {
      return 'Deep, fertile, well-drained loamy soil with pH 6.5-7.5. Rich in organic matter.';
    } else if (crop.includes('potato')) {
      return 'Sandy loam to loam soil with pH 5.5-6.5. Well-drained with good organic content.';
    } else if (crop.includes('tomato')) {
      return 'Well-drained sandy loam soil with pH 6.0-7.0. Rich in organic matter.';
    } else {
      return 'Well-drained fertile soil with pH 6.0-7.5. Good organic matter content recommended.';
    }
  };

  const generateWaterInfo = async (cropName: string): Promise<string> => {
    const crop = cropName.toLowerCase();
    
    if (crop.includes('rice') || crop.includes('paddy')) {
      return 'High water requirement (1000-1500mm annually). Flooded field conditions preferred.';
    } else if (crop.includes('sugarcane') || crop.includes('jaggery')) {
      return 'High water requirement (1500-2000mm annually). Regular irrigation essential.';
    } else if (crop.includes('cotton')) {
      return 'Moderate to high water requirement (500-800mm). Critical during flowering and boll development.';
    } else if (crop.includes('wheat')) {
      return 'Moderate water requirement (450-600mm). Sensitive to waterlogging.';
    } else {
      return 'Moderate water requirement (400-800mm annually). Regular irrigation recommended.';
    }
  };

  const generateSeasonInfo = async (cropName: string): Promise<string> => {
    const crop = cropName.toLowerCase();
    
    if (crop.includes('rice') || crop.includes('paddy')) {
      return 'Kharif season (June-October) and Rabi season (December-April) depending on variety.';
    } else if (crop.includes('wheat')) {
      return 'Rabi season (November-April). Winter crop requiring cool weather.';
    } else if (crop.includes('cotton')) {
      return 'Kharif season (April-October). Long growing season required.';
    } else if (crop.includes('sugarcane') || crop.includes('jaggery')) {
      return 'Year-round crop with planting typically in spring (February-April).';
    } else if (crop.includes('maize') || crop.includes('corn')) {
      return 'Kharif season (June-September) and Rabi season (November-February).';
    } else {
      return 'Season varies by region and variety. Both Kharif and Rabi seasons possible.';
    }
  };

  const generateRegionInfo = async (cropName: string): Promise<string> => {
    const crop = cropName.toLowerCase();
    
    if (crop.includes('rice') || crop.includes('paddy')) {
      return 'West Bengal, Punjab, Uttar Pradesh, Andhra Pradesh, Tamil Nadu, Odisha';
    } else if (crop.includes('wheat')) {
      return 'Punjab, Haryana, Uttar Pradesh, Madhya Pradesh, Rajasthan, Bihar';
    } else if (crop.includes('cotton')) {
      return 'Gujarat, Maharashtra, Telangana, Karnataka, Punjab, Haryana';
    } else if (crop.includes('sugarcane') || crop.includes('jaggery')) {
      return 'Uttar Pradesh, Maharashtra, Karnataka, Tamil Nadu, Gujarat, Punjab';
    } else {
      return 'Cultivated across multiple states in India. Major growing regions vary by climate suitability.';
    }
  };

  const generateYieldInfo = async (cropName: string): Promise<string> => {
    const crop = cropName.toLowerCase();
    
    if (crop.includes('rice') || crop.includes('paddy')) {
      return '2000-4000 kg/hectare depending on variety and farming practices.';
    } else if (crop.includes('wheat')) {
      return '3000-4500 kg/hectare under good management conditions.';
    } else if (crop.includes('cotton')) {
      return '400-600 kg/hectare of cotton fiber.';
    } else if (crop.includes('sugarcane') || crop.includes('jaggery')) {
      return '60-80 tonnes/hectare of cane. Jaggery yield: 10-15% of cane weight.';
    } else if (crop.includes('potato')) {
      return '20-30 tonnes/hectare under good conditions.';
    } else if (crop.includes('tomato')) {
      return '25-40 tonnes/hectare depending on variety.';
    } else {
      return 'Yield varies significantly based on variety, climate, and farming practices.';
    }
  };

  const generateCultivationTips = async (cropName: string): Promise<string[]> => {
    const crop = cropName.toLowerCase();
    
    const commonTips = [
      'Use quality seeds from certified sources',
      'Follow proper sowing time and spacing',
      'Apply balanced fertilization',
      'Monitor for pests and diseases regularly',
      'Ensure adequate water management',
      'Harvest at proper maturity stage'
    ];

    if (crop.includes('jaggery') || crop.includes('sugarcane')) {
      return [
        'Select disease-free and pest-free seed cane',
        'Plant during optimal season (Feb-April)',
        'Maintain proper spacing between rows',
        'Apply organic manure and balanced fertilizers',
        'Ensure regular irrigation especially during dry periods',
        'Harvest when cane reaches full maturity (10-12 months)',
        'Process immediately after harvesting for best jaggery quality'
      ];
    }

    return commonTips;
  };

  const handleSearch = useCallback(async (crop: string = searchCrop) => {
    if (!crop.trim()) return;

    setLoading(true);
    
    try {
      // Try to fetch from API first
      const apiData = await fetchCropDataFromAPI(crop);
      
      if (apiData) {
        setCropData(apiData);
      } else {
        // Fallback data if API fails
        setCropData({
          name: crop,
          description: `${crop} is an important agricultural crop. While specific details are being updated, it contributes significantly to agricultural production.`,
          climate: 'Climate requirements vary by region and variety. Generally requires favorable temperature and humidity conditions.',
          soil: 'Requires well-drained, fertile soil with appropriate pH levels for optimal growth.',
          water: 'Water requirements depend on crop type and growing conditions. Adequate irrigation is essential.',
          season: 'Growing season varies by region and variety. Consult local agricultural guidelines.',
          regions: 'Grown in various regions with suitable climate and soil conditions.',
          yield: 'Yield varies based on variety, farming practices, and environmental conditions.',
          tips: [
            'Consult local agricultural extension services',
            'Use certified seeds and proper planting techniques',
            'Follow integrated pest management practices',
            'Ensure proper soil preparation and nutrition',
            'Monitor crop health regularly'
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching crop data:', error);
      setCropData({
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
    } finally {
      setLoading(false);
    }
  }, [searchCrop, fetchCropDataFromAPI]);

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
            <p>Search for any crop to view detailed information</p>
            <p className="text-sm mt-2">Examples: Rice, Wheat, Cotton, Jaggery, Potato, Tomato, Maize, etc.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {['Rice', 'Wheat', 'Cotton', 'Jaggery', 'Potato', 'Tomato', 'Maize', 'Soybean'].map((crop) => (
                <button
                  key={crop}
                  onClick={() => {
                    setSearchCrop(crop);
                    handleSearch(crop);
                  }}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropInfo;