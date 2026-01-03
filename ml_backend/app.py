

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import pickle
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")
REACT_BUILD_DIR = os.path.join(BASE_DIR, "../frontend-react/build")


app = Flask(__name__, static_folder=REACT_BUILD_DIR)
CORS(app)


try:
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("model.pkl not found. Please run train.py first.")
    
    with open(MODEL_PATH, "rb") as f:
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
    except Exception as e:
        print("Prediction error:", e)
        return jsonify({"error": "Prediction failed"}), 500


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(REACT_BUILD_DIR, path)):
        return send_from_directory(REACT_BUILD_DIR, path)
    else:
        return send_from_directory(REACT_BUILD_DIR, "index.html")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)