# ⚡ EcoCharge Solar Power Predictor

A full-stack solar power prediction application that uses machine learning to predict AC power output from solar plant data. The system consists of a React frontend, Node.js/Express backend, and a Flask ML microservice.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Data Flow](#data-flow)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)

## 🏗️ Architecture Overview

The application follows a microservices architecture with three main components:

```
┌─────────────────┐
│  React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP POST /predict
         ▼
┌─────────────────┐
│  Node.js API    │
│   (Port 5002)   │
│  + SQLite DB    │
└────────┬────────┘
         │ HTTP POST /predict
         ▼
┌─────────────────┐
│  Flask ML       │
│  Microservice   │
│   (Port 5001)   │
└─────────────────┘
```

### Component Responsibilities

1. **Frontend (React)**: User interface for inputting solar plant data and displaying predictions
2. **Backend (Node.js)**: REST API that handles requests, forwards to ML service, and logs predictions to SQLite database (internal use)
3. **ML Service (Flask)**: Machine learning microservice that loads a trained RandomForest model and returns predictions

## 📁 Project Structure

```
ui_project/
├── frontend-react/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── PredictionForm.jsx
│   │   │   └── PredictionResult.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── predictions.db      # SQLite database (auto-created)
│   └── package.json
│
├── ml_backend/              # Flask ML microservice
│   ├── app.py              # Flask application
│   ├── train.py            # Model training script
│   ├── model.pkl           # Trained model (generated)
│   └── requirements.txt
│
└── README.md
```

## ✨ Features

### Frontend Features
- ✅ **Simple Responsive UI**: Straightforward form and output layout
- ✅ **Input Validation**: Range checks and required field validation
  - Irradiance: 0-1000 W/m²
  - Temperature: -20 to 60°C
  - Previous values: 0-10 kW
- ✅ **Real-time Predictions**: Submit solar plant data and receive instant predictions
- ✅ **Error Handling**: User-friendly error messages and connection status

### Backend Features
- ✅ **REST API**: Clean endpoints for predictions and logs
- ✅ **SQLite Database**: Persistent storage of all predictions with timestamps
- ✅ **CORS Enabled**: Cross-origin requests supported
- ✅ **Error Handling**: Comprehensive error handling and logging

### ML Service Features
- ✅ **RandomForest Model**: Trained on synthetic solar power dataset
- ✅ **Fast Predictions**: Low-latency prediction endpoint
- ✅ **Feature Importance**: Model includes feature importance analysis

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0**: UI framework
- **CSS3**: Simple responsive styling

### Backend
- **Node.js**: Runtime environment
- **Express 5.1.0**: Web framework
- **SQLite3 5.1.7**: Database for logging predictions
- **Axios 1.13.2**: HTTP client for ML service communication
- **CORS 2.8.5**: Cross-origin resource sharing

### ML Service
- **Flask 3.0.0**: Python web framework
- **Scikit-learn 1.3.2**: Machine learning library
- **NumPy 1.24.3**: Numerical computing
- **RandomForestRegressor**: ML model for predictions

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn

### Step 1: Setup ML Backend

```bash
cd ml_backend

# Create virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model
python train.py

# Start Flask server
python app.py
```

The ML service will run on `http://127.0.0.1:5001`

### Step 2: Setup Node.js Backend

```bash
cd backend

# Install dependencies
npm install

# Start server
npm start
```

The backend API will run on `http://localhost:5002`

### Step 3: Setup React Frontend

```bash
cd frontend-react

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📡 API Endpoints

### Backend API (Port 5002)

#### POST /predict
Submit solar plant data and receive AC power prediction.

**Request Body:**
```json
{
  "irradiance": 750.5,
  "temp": 25.3,
  "prevHour": 3.2,
  "prevDay": 2.8,
  "roll3": 3.0,
  "roll6": 2.9
}
```

**Response:**
```json
{
  "predictedPower": 4.25
}
```

**Error Response:**
```json
{
  "error": "Prediction failed"
}
```

### ML Service API (Port 5001)

#### POST /predict
Internal endpoint called by Node.js backend.

**Request Body:**
```json
{
  "irradiance": 750.5,
  "temp": 25.3,
  "prevHour": 3.2,
  "prevDay": 2.8,
  "roll3": 3.0,
  "roll6": 2.9
}
```

**Response:**
```json
{
  "predictedPower": 4.25
}
```

## 🔄 Data Flow

1. **User Input**: User enters solar plant data in the React form
2. **Frontend Validation**: Client-side validation checks input ranges
3. **API Request**: Frontend sends POST request to Node.js backend (`/predict`)
4. **Backend Processing**: Node.js server receives request and forwards to Flask ML service
5. **ML Prediction**: Flask service loads model, processes features, returns prediction
6. **Database Logging**: Node.js backend logs prediction to SQLite database
7. **Response**: Backend returns prediction to frontend
8. **UI Update**: Frontend displays the latest prediction below the form
9. **(Optional)**: Logged predictions are stored in SQLite for future analysis if needed

## 💻 Usage

### Making a Prediction

1. Open the application in your browser (`http://localhost:3000`)
2. Fill in the solar plant data form:
   - **Irradiance**: Solar irradiance in W/m² (0-1000)
   - **Temperature**: Ambient temperature in °C (-20 to 60)
   - **Previous Hour**: AC power from previous hour in kW (0-10)
   - **Previous Day**: AC power from previous day in kW (0-10)
   - **Rolling 3-Hour Avg**: 3-hour rolling average in kW (0-10)
   - **Rolling 6-Hour Avg**: 6-hour rolling average in kW (0-10)
3. Click "Predict AC Power Output"
4. View the predicted power output
5. (Optional) Review backend logs or the SQLite database for stored predictions

### Viewing Predictions

After submitting the form, the predicted AC power output appears directly below the form. Previous predictions are stored in SQLite for internal use.

## 🧪 Testing

### Test Backend API with cURL

```bash
# Test prediction endpoint
curl -X POST http://localhost:5002/predict \
  -H "Content-Type: application/json" \
  -d '{
    "irradiance": 750.5,
    "temp": 25.3,
    "prevHour": 3.2,
    "prevDay": 2.8,
    "roll3": 3.0,
    "roll6": 2.9
  }'

```

### Test ML Service Directly

```bash
curl -X POST http://127.0.0.1:5001/predict \
  -H "Content-Type: application/json" \
  -d '{
    "irradiance": 750.5,
    "temp": 25.3,
    "prevHour": 3.2,
    "prevDay": 2.8,
    "roll3": 3.0,
    "roll6": 2.9
  }'
```

### End-to-End Testing

1. Ensure all three services are running
2. Open browser to `http://localhost:3000`
3. Submit a prediction through the UI
4. Verify the prediction value appears below the form
5. Check browser console and server logs for any errors

## 🚢 Deployment

### Option 1: Heroku

1. **Backend**: Create `Procfile` in backend directory:
   ```
   web: node server.js
   ```

2. **Frontend**: Build React app and serve with Express or use static hosting

3. **ML Service**: Deploy Flask app separately or use Heroku's Python buildpack

### Option 2: Render / Railway

Similar process - deploy each service separately or use Docker containers.

### Option 3: Docker Compose

Create `docker-compose.yml` to orchestrate all three services:

```yaml
version: '3.8'
services:
  ml-service:
    build: ./ml_backend
    ports:
      - "5001:5001"
  
  backend:
    build: ./backend
    ports:
      - "5002:5002"
    depends_on:
      - ml-service
  
  frontend:
    build: ./frontend-react
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 📊 Model Details

The ML model is a **RandomForestRegressor** with:
- **n_estimators**: 100 trees
- **max_depth**: 10
- **random_state**: 42 for reproducibility

**Features:**
1. Irradiance (W/m²)
2. Temperature (°C)
3. Previous Hour Power (kW)
4. Previous Day Power (kW)
5. Rolling 3-Hour Average (kW)
6. Rolling 6-Hour Average (kW)

**Target:** AC Power Output (kW)

The model is trained on 2000 synthetic samples that simulate realistic solar power generation patterns.

## 🔧 Troubleshooting

### Common Issues

1. **"Error connecting to backend"**
   - Ensure Node.js backend is running on port 5002
   - Check if ML service is running on port 5001
   - Verify CORS is enabled

2. **"Failed to fetch logs"**
   - Check backend server status
   - Verify SQLite database exists and is accessible

3. **Port already in use**
   - Change port numbers in respective configuration files
   - Kill processes using the ports: `lsof -ti:5002 | xargs kill`

4. **Model not found**
   - Run `python train.py` in ml_backend directory to generate model.pkl

## 📝 License

This project is created for educational purposes.

## 👤 Author

EcoCharge Development Team

---

**Note**: This is a full-stack demonstration project showcasing integration of React frontend, Node.js backend, Flask ML microservice, and SQLite database for solar power prediction.

