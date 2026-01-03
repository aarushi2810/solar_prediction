
const lastPrediction = localStorage.getItem("lastPrediction");
if (lastPrediction) {
  document.getElementById("output").innerText =
    `Last predicted power: ${parseFloat(lastPrediction).toFixed(2)} kW`;
}


document.getElementById("solarForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitButton = e.target.querySelector("button");
  submitButton.disabled = true; // disable button while processing
  document.getElementById("output").innerText = "Predicting...";

  const data = {
    irradiance: parseFloat(document.getElementById("irradiance").value),
    temp: parseFloat(document.getElementById("temp").value),
    prevHour: parseFloat(document.getElementById("prevHour").value),
    prevDay: parseFloat(document.getElementById("prevDay").value),
    roll3: parseFloat(document.getElementById("roll3").value),
    roll6: parseFloat(document.getElementById("roll6").value),
  };

  try {
    
    const res = await fetch("http://localhost:5002/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    document.getElementById("output").innerText =
      `Estimated AC Power Output: ${parseFloat(result.predictedPower).toFixed(2)} kW`;

   
    localStorage.setItem("lastPrediction", result.predictedPower);

  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").innerText = "Error connecting to backend!";
  } finally {
    submitButton.disabled = false; 
  }
});