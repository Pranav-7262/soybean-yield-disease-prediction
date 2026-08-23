import React from "react";
import { BarChart3, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

const options = [
  { id: "disease", label: "Disease", icon: ShieldAlert, accent: "orange" },
  { id: "yield", label: "Yield", icon: BarChart3, accent: "emerald" },
];

const PredictionTypeTabs = ({ activeType, onChange, counts = {} }) => (
  <div
    className="inline-flex w-full max-w-md rounded-2xl border border-slate-700/70 bg-slate-900/70 p-1.5 shadow-lg shadow-slate-950/20"
    role="tablist"
    aria-label="Prediction history type"
  >
    {options.map(({ id, label, icon: Icon, accent }) => {
      const active = activeType === id;
      const orange = accent === "orange";

      return (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active}
          onClick={() => onChange(id)}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${active ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
        >
          {active && (
            <motion.span
              layoutId="active-prediction-type"
              className={`absolute inset-0 rounded-xl ${orange ? "bg-orange-500/20" : "bg-emerald-500/20"}`}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <Icon
            className={`relative ${active ? (orange ? "text-orange-300" : "text-emerald-300") : "text-slate-500"}`}
            size={18}
          />
          <span className="relative">{label}</span>
          <span
            className={`relative rounded-full px-2 py-0.5 text-xs ${active ? (orange ? "bg-orange-500/20 text-orange-200" : "bg-emerald-500/20 text-emerald-200") : "bg-slate-800 text-slate-500"}`}
          >
            {counts[id] || 0}
          </span>
        </button>
      );
    })}
  </div>
);

export default PredictionTypeTabs;
