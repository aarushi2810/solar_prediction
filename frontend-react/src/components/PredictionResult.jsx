const PredictionResult = ({ prediction }) => (
  <div className="prediction-result">
    {prediction === "Error connecting to backend!" ? (
      <p className="error-box">
        {prediction} (check that the backend on port 5002 and ML service on port 5001 are running)
      </p>
    ) : prediction ? (
      <p className="result-box">Estimated AC Power Output: {prediction} kW</p>
    ) : (
      <p className="placeholder">Enter solar plant data above to get AC power prediction.</p>
    )}
  </div>
);

export default PredictionResult;
