// backend/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

const app = express();


const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Connect to SQLite
const db = new sqlite3.Database("./predictions.db", (err) => {
  if (err) console.error("❌ DB connection error:", err.message);
  else console.log("✅ Connected to SQLite database");
});

// Create table
db.run(`
  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    irradiance REAL,
    temp REAL,
    prevHour REAL,
    prevDay REAL,
    roll3 REAL,
    roll6 REAL,
    prediction REAL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// POST /predict
app.post("/predict", async (req, res) => {
  const data = req.body;
  console.log("➡️ Request received:", data);

  // Validate required fields
  const requiredFields = ["irradiance", "temp", "prevHour", "prevDay", "roll3", "roll6"];
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    return res.status(400).json({ 
      error: "Missing required fields", 
      missing: missingFields 
    });
  }

  try {
    
    const response = await axios.post(
      "https://YOUR-FLASK-ML.onrender.com/predict",
      data
    );

    const predictedPower = response.data.predictedPower;
    console.log("⬅️ Prediction from Flask:", predictedPower);

    // Log to database
    db.run(
      `INSERT INTO predictions (irradiance, temp, prevHour, prevDay, roll3, roll6, prediction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.irradiance, data.temp, data.prevHour, data.prevDay, data.roll3, data.roll6, predictedPower],
      (err) => {
        if (err) {
          console.error("❌ DB insert error:", err.message);
        } else {
          console.log("✅ Logged to DB");
        }
      }
    );

    res.json({ predictedPower });
  } catch (error) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});