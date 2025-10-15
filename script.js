document.getElementById("solarForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  
  const data = {
    irradiance: parseFloat(document.getElementById("irradiance").value),
    temp: parseFloat(document.getElementById("temp").value),
    prevHour: parseFloat(document.getElementById("prevHour").value),
    prevDay: parseFloat(document.getElementById("prevDay").value),
    roll3: parseFloat(document.getElementById("roll3").value),
    roll6: parseFloat(document.getElementById("roll6").value),
  };

  try {
   
    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    document.getElementById("output").innerText =
      `Estimated AC Power Output: ${result.predictedPower.toFixed(2)} kW`;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").innerText = "Error connecting to backend!";
  }
});