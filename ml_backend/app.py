from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import pickle
import os

app = Flask(__name__, static_folder="frontend-react/build")
CORS(app)

# Load model on startup
try:
    if not os.path.exists("ml_backend/model.pkl"):
        raise FileNotFoundError("model.pkl not found. Please run train.py first.")
    with open("ml_backend/model.pkl", "rb") as f:
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






from flask import send_from_directory
import os

# Serve React build files
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    build_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../frontend-react/build")
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, "index.html")




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5001)))