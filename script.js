document.getElementById("solarForm").addEventListener("submit", function(e) {
  e.preventDefault();

  
  const irradiance = parseFloat(document.getElementById("irradiance").value);
  const temp = parseFloat(document.getElementById("temp").value);
  const prevHour = parseFloat(document.getElementById("prevHour").value);
  const prevDay = parseFloat(document.getElementById("prevDay").value);
  const roll3 = parseFloat(document.getElementById("roll3").value);
  const roll6 = parseFloat(document.getElementById("roll6").value);


  const predictedPower = (irradiance * 0.004) + (50 - temp) * 0.3 + (prevHour + prevDay + roll3 + roll6) / 4 * 0.1;

  document.getElementById("output").innerText = 
    `Estimated AC Power Output: ${predictedPower.toFixed(2)} kW`;
});