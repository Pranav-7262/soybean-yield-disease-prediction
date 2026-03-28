import React, { useState } from "react";
import axios from "axios";
import { Beaker, Thermometer, Droplets, CloudRain, Wind } from "lucide-react";
import InputField from "../components/InputField";
import { motion } from "framer-motion";

const YieldPredictor = () => {
  const [formData, setFormData] = useState({
    N: 40,
    P: 60,
    K: 40,
    ph: 6.5,
    temperature: 28,
    soil_moisture: 70,
    rainfall: 1000,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/yield/predict", {
        n: Number(formData.N),
        p: Number(formData.P),
        k: Number(formData.K),
        temperature: Number(formData.temperature),
        soil_moisture: Number(formData.soil_moisture),
        rainfall: Number(formData.rainfall),
        ph: Number(formData.ph),
      });
      setResult(res.data);
    } catch (err) {
      alert("Backend is sleeping! Make sure Node and Python are running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Soybean Yield Intelligence
        </h1>
        <p className="text-slate-400 mb-8">
          Enter soil and environmental parameters for Maharashtra-calibrated
          results.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
          {/* NPK Section */}
          <InputField
            label="Nitrogen (N)"
            icon={Beaker}
            name="N"
            value={formData.N}
            onChange={(e) => setFormData({ ...formData, N: e.target.value })}
            unit="kg/ha"
          />
          <InputField
            label="Phosphorus (P)"
            icon={Beaker}
            name="P"
            value={formData.P}
            onChange={(e) => setFormData({ ...formData, P: e.target.value })}
            unit="kg/ha"
          />
          <InputField
            label="Potassium (K)"
            icon={Beaker}
            name="K"
            value={formData.K}
            onChange={(e) => setFormData({ ...formData, K: e.target.value })}
            unit="kg/ha"
          />
          <InputField
            label="Soil pH"
            icon={Droplets}
            name="ph"
            value={formData.ph}
            onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
            unit="0-14"
          />

          {/* Environmental Section */}
          <InputField
            label="Temperature"
            icon={Thermometer}
            name="temperature"
            value={formData.temperature}
            onChange={(e) =>
              setFormData({ ...formData, temperature: e.target.value })
            }
            unit="°C"
          />
          <InputField
            label="Rainfall"
            icon={CloudRain}
            name="rainfall"
            value={formData.rainfall}
            onChange={(e) =>
              setFormData({ ...formData, rainfall: e.target.value })
            }
            unit="mm"
          />

          {/* Custom Soil Moisture Slider - Spans 2 columns */}
          <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10 mt-2">
            <div className="flex justify-between mb-4">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" /> Soil Moisture
                Content
              </label>
              <span className="text-cyan-400 font-mono font-bold">
                {formData.soil_moisture}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.soil_moisture}
              onChange={(e) =>
                setFormData({ ...formData, soil_moisture: e.target.value })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">
              <span>Dry</span>
              <span>Ideal (60-80%)</span>
              <span>Saturated</span>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={loading}
            className="md:col-span-2 mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Analyzing Soil Data...
              </span>
            ) : (
              "Generate Prediction Report"
            )}
          </button>
        </div>

        {result && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 p-8 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2.5rem] text-center backdrop-blur-md"
          >
            <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-black mb-2">
              AI Analysis Complete
            </p>
            <p className="text-slate-400 text-sm mb-1">
              Predicted Soybean Yield
            </p>
            <h2 className="text-7xl font-black text-white tracking-tighter">
              {result.predicted_yield}
              <span className="text-3xl font-light text-emerald-400 ml-2">
                q/acre
              </span>
            </h2>
            <div className="mt-4 inline-block px-4 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Maharashtra Regional Calibration Active
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default YieldPredictor;
