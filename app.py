from flask import Flask, render_template, request
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
import os

# Initialize Flask app
app = Flask(__name__)

# Load and train the model
csv_path = 'crop_data.csv'  # Ensure your dataset file is located here
df = pd.read_csv(csv_path)
X = df[['N', 'P', 'K', 'Temperature', 'Humidity', 'pH', 'Rainfall']]
y = df['Label']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Accuracy of the model
accuracy = model.score(X_test, y_test) * 100

# Crop details dictionary (expand as needed)
crop_details = {
    "rice": "Requires high rainfall and moderate temperature.",
    "wheat": "Best in cool climates with less than 75cm of rainfall.",
    "maize": "Thrives in warm climates with moderate rainfall.",
    "sugarcane": "Requires high temperatures and adequate water supply.",
    # Add more crops and details here
}

@app.route('/')
def home():
    return render_template('index.html', accuracy=accuracy)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from form
        N = float(request.form['N'])
        P = float(request.form['P'])
        K = float(request.form['K'])
        temperature = float(request.form['Temperature'])
        humidity = float(request.form['Humidity'])
        pH = float(request.form['pH'])
        rainfall = float(request.form['Rainfall'])

        # Make a prediction
        inputs = np.array([[N, P, K, temperature, humidity, pH, rainfall]])
        prediction = model.predict(inputs)[0]

        # Get crop details
        detail = crop_details.get(prediction, "Details not available")

        # Generate and save a bar chart comparing input values with typical values
        typical_values = [80, 40, 50, 25, 80, 6.5, 200]  # Example typical values for crops
        categories = ['N', 'P', 'K', 'Temp', 'Humidity', 'pH', 'Rainfall']
        plt.bar(categories, [N, P, K, temperature, humidity, pH, rainfall], label='Input Values')
        plt.bar(categories, typical_values, alpha=0.5, label='Typical Values')
        plt.legend()
        chart_path = os.path.join('static', 'prediction_chart.png')
        plt.savefig(chart_path)
        plt.close()

        # Return the result with the chart and crop details
        return render_template('index.html', prediction=f"Predicted Crop: {prediction}", detail=detail, chart_url=chart_path)

    except ValueError:
        return render_template('index.html', prediction="Invalid input. Please enter numeric values.")

if __name__ == '__main__':
    app.run(debug=True)
