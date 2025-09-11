# 🌾 Crop Prediction System

A machine learning-powered web application that predicts the most suitable crop based on soil and environmental conditions. Built with Flask and Random Forest classifier, this system helps farmers and agricultural experts make data-driven decisions for optimal crop selection.

## 🎯 Features

- **Machine Learning Prediction**: Uses Random Forest algorithm for accurate crop recommendations
- **User-Friendly Web Interface**: Clean, responsive web form for input parameters
- **Input Validation**: Ensures all inputs are within valid agricultural ranges
- **Visual Analytics**: Generates comparison charts showing input vs typical values
- **Detailed Crop Information**: Provides specific growing conditions and requirements for each crop
- **Real-time Results**: Instant predictions with detailed explanations

## 📊 Dataset Overview

The application uses a comprehensive agricultural dataset with:
- **2,197 data points** covering various crops and growing conditions
- **7 input features**:
  - **N (Nitrogen)**: 0-300 range - Essential macronutrient for plant growth
  - **P (Phosphorus)**: 0-150 range - Critical for root development and flowering
  - **K (Potassium)**: 0-200 range - Important for water regulation and disease resistance
  - **Temperature**: 5-45°C - Ambient temperature conditions
  - **Humidity**: 10-100% - Relative humidity levels
  - **pH**: 4.5-10.0 - Soil acidity/alkalinity levels
  - **Rainfall**: 0-2000mm - Annual precipitation

- **Supported Crops**: Rice, Wheat, Maize, Cotton, Banana, Apple, and many more

## 🚀 Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip package manager

### Step 1: Clone the Repository
```bash
git clone https://github.com/HEMANTH-S-KUMAR-1/crop-prediction.git
cd crop-prediction
```

### Step 2: Create Virtual Environment
```bash
python -m venv venv
```

### Step 3: Activate Virtual Environment
**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### Step 4: Install Dependencies
```bash
pip install flask pandas numpy scikit-learn matplotlib
```

### Step 5: Run the Application
```bash
python app.py
```

The application will be available at `http://localhost:5000`

## 🏗️ Project Structure

```
crop-prediction/
├── app.py                 # Main Flask application
├── crop_data.csv         # Training dataset (2,197 records)
├── README.md            # Project documentation
├── static/              # Static files directory
│   └── prediction_chart.png  # Generated comparison charts
├── templates/           # HTML templates
│   └── index.html      # Main web interface
└── venv/               # Virtual environment (auto-generated)
```

## 💻 Usage

1. **Launch the Application**: Run `python app.py` and navigate to `http://localhost:5000`

2. **Input Parameters**: Fill in the form with your soil and environmental data:
   - Nitrogen content (N)
   - Phosphorus content (P)
   - Potassium content (K)
   - Temperature (°C)
   - Humidity (%)
   - Soil pH level
   - Rainfall (mm)

3. **Get Prediction**: Click "Predict" to receive:
   - Recommended crop type
   - Detailed crop information and growing requirements
   - Visual chart comparing your inputs with typical values
   - Model accuracy information

## 🔧 Technical Details

### Machine Learning Model
- **Algorithm**: Random Forest Classifier with 100 estimators
- **Training Split**: 80% training, 20% testing
- **Model Performance**: Displays real-time accuracy on the web interface
- **Random State**: 42 (for reproducible results)

### Input Validation
The application validates all inputs against agricultural standards:
- Prevents out-of-range values that could lead to unrealistic predictions
- Provides clear error messages for invalid inputs
- Ensures data quality for accurate predictions

### Web Framework
- **Backend**: Flask (Python web framework)
- **Frontend**: HTML5 with modern CSS styling
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Processing**: Instant prediction results

### Data Visualization
- **Chart Generation**: Matplotlib integration for comparison charts
- **Dynamic Updates**: Charts generated for each prediction
- **Visual Comparison**: Input values vs typical crop requirements

## 📈 Model Performance

The Random Forest model is trained on diverse agricultural data and provides:
- High accuracy predictions across different crop types
- Robust performance with various soil and climate conditions
- Real-time accuracy metrics displayed on the interface

## 🌱 Supported Crops

The system can predict optimal conditions for various crops including:
- **Cereal Grains**: Rice, Wheat, Maize
- **Cash Crops**: Cotton, Sugarcane
- **Fruits**: Banana, Apple, Orange, Grapes
- **Legumes**: Various bean and pulse varieties
- **And many more...**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Add more crop varieties to the dataset
- [ ] Implement crop yield prediction
- [ ] Add weather API integration for real-time data
- [ ] Include soil type classification
- [ ] Add multi-language support
- [ ] Implement user accounts and history tracking
- [ ] Add mobile app version
- [ ] Include seasonal planting recommendations

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Agricultural research data sources
- Flask web framework community
- Scikit-learn machine learning library
- Agricultural experts who provided domain knowledge

## 📞 Contact

**Author**: HEMANTH-S-KUMAR-1  
**Repository**: [crop-prediction](https://github.com/HEMANTH-S-KUMAR-1/crop-prediction)

---

*Made with ❤️ for sustainable agriculture and smart farming solutions*