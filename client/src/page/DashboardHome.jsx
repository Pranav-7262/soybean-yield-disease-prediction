import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ScanEye, ArrowRight } from "lucide-react";

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          Precision Agriculture <br /> for Maharashtra
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Harnessing XGBoost for yield forecasting and Deep Learning for instant
          disease diagnosis.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Yield Prediction */}
        <ServiceCard
          title="Yield Intelligence"
          desc="Predict soybean harvest quantity based on Soil NPK, pH, and Maharashtra weather patterns."
          icon={<TrendingUp size={32} />}
          color="emerald"
          onClick={() => navigate("/yield")}
        />

        {/* Section 2: Disease Detection */}
        <ServiceCard
          title="Disease Detection"
          desc="Instant leaf analysis using Convolutional Neural Networks to identify Septoria, Rust, or Mosaic virus."
          icon={<ScanEye size={32} />}
          color="blue"
          onClick={() => navigate("/disease")}
        />
      </div>
    </div>
  );
};

const ServiceCard = ({ title, desc, icon, color, onClick }) => (
  <motion.div
    whileHover={{ y: -10 }}
    onClick={onClick}
    className="group cursor-pointer relative overflow-hidden bg-slate-900/40 border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-md"
  >
    <div
      className={`mb-6 p-4 inline-block rounded-2xl bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
      {title}{" "}
      <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
    </h3>
    <p className="text-slate-400 leading-relaxed mb-6">{desc}</p>
    <div
      className={`absolute bottom-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl rounded-full translate-x-10 translate-y-10`}
    />
  </motion.div>
);

export default DashboardHome;
