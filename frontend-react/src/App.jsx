import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PredictionForm from "./components/PredictionForm";
import PredictionResult from "./components/PredictionResult";
import "./App.css";

function App() {
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const last = localStorage.getItem("lastPrediction");
    if (last) setPrediction(parseFloat(last).toFixed(2));
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <PredictionForm setPrediction={setPrediction} />
        <PredictionResult prediction={prediction} />
      </main>
      <Footer />
    </div>
  );
}

export default App;
