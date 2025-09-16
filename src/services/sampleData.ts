// Sample data service for generating test prediction history and crop searches

export interface SamplePrediction {
  id: string;
  userId: string;
  date: string;
  city: string;
  crop: string;
  confidence: number;
}

// Generate sample prediction history for testing
export const generateSamplePredictions = (userId: string, count: number = 15): SamplePrediction[] => {
  const crops = [
    'Rice', 'Wheat', 'Cotton', 'Jaggery', 'Sugarcane', 'Maize', 'Potato', 'Tomato',
    'Soybean', 'Mustard', 'Gram', 'Arhar', 'Groundnut', 'Sunflower', 'Jowar',
    'Bajra', 'Ragi', 'Barley', 'Onion', 'Chili', 'Turmeric', 'Ginger'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Chennai', 'Hyderabad', 'Pune', 'Ahmedabad',
    'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam',
    'Patna', 'Vadodara', 'Coimbatore', 'Madurai', 'Kochi', 'Thiruvananthapuram',
    'Chandigarh', 'Amritsar', 'Jodhpur', 'Gwalior', 'Vijayawada', 'Mysore'
  ];

  const predictions: SamplePrediction[] = [];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Random date within last 90 days
    
    predictions.push({
      id: `pred_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      date: date.toISOString(),
      city: cities[Math.floor(Math.random() * cities.length)],
      crop: crops[Math.floor(Math.random() * crops.length)],
      confidence: Math.floor(Math.random() * 30) + 70 // 70-99% confidence
    });
  }

  // Sort by date (newest first)
  return predictions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// List of comprehensive crop searches for testing
export const cropSearchSuggestions = [
  // Cereals
  'Rice', 'Wheat', 'Maize', 'Jowar', 'Bajra', 'Ragi', 'Barley', 'Oats',
  
  // Pulses
  'Gram', 'Arhar', 'Moong', 'Urad', 'Masoor', 'Field Pea', 'Black Gram',
  
  // Oilseeds
  'Groundnut', 'Mustard', 'Sunflower', 'Safflower', 'Sesame', 'Niger', 'Castor',
  
  // Cash Crops
  'Cotton', 'Sugarcane', 'Jaggery', 'Tobacco', 'Jute', 'Tea', 'Coffee',
  
  // Spices
  'Turmeric', 'Chili', 'Coriander', 'Cumin', 'Fenugreek', 'Ginger', 'Garlic',
  
  // Vegetables
  'Potato', 'Tomato', 'Onion', 'Cabbage', 'Cauliflower', 'Brinjal', 'Okra',
  'Carrot', 'Radish', 'Spinach', 'Pumpkin', 'Bottle Gourd', 'Ridge Gourd',
  
  // Fruits
  'Mango', 'Banana', 'Orange', 'Apple', 'Grapes', 'Pomegranate', 'Papaya',
  'Guava', 'Coconut', 'Sugarcane', 'Watermelon', 'Muskmelon',
  
  // Fiber Crops
  'Cotton', 'Jute', 'Hemp', 'Flax',
  
  // Fodder Crops
  'Berseem', 'Lucerne', 'Cowpea', 'Maize Fodder', 'Sorghum Fodder',
  
  // Plantation Crops
  'Tea', 'Coffee', 'Rubber', 'Coconut', 'Areca Nut', 'Oil Palm'
];

// Note: Sample data initialization and user-based functions removed
// App now stores only real predictions made through the prediction form