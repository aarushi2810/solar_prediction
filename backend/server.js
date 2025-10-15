const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());


app.post("/predict", (req, res) => {
  const data = req.body;

  
  const predictedPower = 
    (data.irradiance * 0.004) +
    (50 - data.temp) * 0.3 +
    (data.prevHour + data.prevDay + data.roll3 + data.roll6) / 4 * 0.1;

  res.json({ predictedPower });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));