from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pickle
import os

app = Flask(__name__)
CORS(app)

# Load model on startup
try:
    if not os.path.exists("model.pkl"):
        raise FileNotFoundError("model.pkl not found. Please run train.py first.")
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()
        features = np.array([[
            float(data["irradiance"]),
            float(data["temp"]),
            float(data["prevHour"]),
            float(data["prevDay"]),
            float(data["roll3"]),
            float(data["roll6"])
        ]])
        prediction = model.predict(features)[0]
        return jsonify({"predictedPower": float(prediction)})
    except Exception:
        return jsonify({"error": "Prediction failed"}), 500

    if __name__ == "__main__":
     app.run(host="0.0.0.0", port=5001)