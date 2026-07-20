import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Thermometer,
  Droplets,
  CloudRain,
  Beaker,
  Loader,
  Leaf,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../services/api";
import InputField from "../components/InputField";

const YieldPredictor = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    soil_n: "",
    soil_p: "",
    soil_k: "",
    temperature_c: "",
    humidity_percent: "",
    rainfall_mm: "",
    area_hectare: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || (!authLoading && !isAuthenticated)) {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handlePredict = async () => {
    if (Object.values(formData).some((v) => !v || v === "" || Number(v) <= 0)) {
      toast.error("Please fill all fields with positive values");
      return;
    }

    setLoading(true);
    try {
      const response = await api.yield.predict(formData);
      const payload = response.data?.data || response.data;

      if (payload) {
        setResult(payload);
        toast.success("Yield prediction completed");
      } else {
        throw new Error(response.data?.message || "Prediction failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to predict yield");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <div className="max-w-4xl w-full">
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
            label="Soil Nitrogen (N)"
            icon={Beaker}
            name="soil_n"
            value={formData.soil_n}
            onChange={handleInputChange}
            unit="ppm"
          />
          <InputField
            label="Soil Phosphorus (P)"
            icon={Beaker}
            name="soil_p"
            value={formData.soil_p}
            onChange={handleInputChange}
            unit="ppm"
          />
          <InputField
            label="Soil Potassium (K)"
            icon={Beaker}
            name="soil_k"
            value={formData.soil_k}
            onChange={handleInputChange}
            unit="ppm"
          />
          <InputField
            label="Area (Hectares)"
            icon={Leaf}
            name="area_hectare"
            value={formData.area_hectare}
            onChange={handleInputChange}
            unit="ha"
          />

          {/* Environmental Section */}
          <InputField
            label="Temperature"
            icon={Thermometer}
            name="temperature_c"
            value={formData.temperature_c}
            onChange={handleInputChange}
            unit="°C"
          />
          <InputField
            label="Rainfall"
            icon={CloudRain}
            name="rainfall_mm"
            value={formData.rainfall_mm}
            onChange={handleInputChange}
            unit="mm"
          />

          {/* Humidity Slider - Spans 2 columns */}
          <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10 mt-2">
            <div className="flex justify-between mb-4">
              <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Droplets size={16} className="text-cyan-400" /> Humidity
              </label>
              <span className="text-cyan-400 font-mono font-bold">
                {formData.humidity_percent}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.humidity_percent}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  humidity_percent: Number(e.target.value),
                })
              }
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">
              <span>Low</span>
              <span>Ideal (70-80%)</span>
              <span>High</span>
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
          <div className="mt-8 p-8 bg-gradient-to-b from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2.5rem] text-center backdrop-blur-md">
            <p className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-black mb-2">
              AI Analysis Complete
            </p>
            <p className="text-slate-400 text-sm mb-1">
              Predicted Soybean Yield
            </p>
            <h2 className="text-7xl font-black text-white tracking-tighter">
              {result?.predicted_yield}
              <span className="text-3xl font-light text-emerald-400 ml-2">
                kg/ha
              </span>
            </h2>
            <div className="mt-4 inline-block px-4 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold border border-emerald-500/30">
              🎯 Model Accuracy: {result?.model_accuracy} | Maharashtra
              Calibrated
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPredictor;
