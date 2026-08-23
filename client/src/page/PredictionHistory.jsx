import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  Eye,
  History,
  Leaf,
  Loader,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import PredictionTypeTabs from "../components/PredictionTypeTabs";

const recordsFrom = (response) => response.data?.data || response.data || [];

const dateLabel = (date, includeTime = false) =>
  date
    ? new Date(date).toLocaleString(undefined, {
        dateStyle: "medium",
        ...(includeTime ? { timeStyle: "short" } : {}),
      })
    : "Unknown date";

const Detail = ({ label, value }) => (
  <div className="flex justify-between gap-6 border-b border-slate-800 pb-3">
    <span className="text-slate-400">{label}</span>
    <span className="text-right font-semibold text-white">{value}</span>
  </div>
);

const EmptySection = ({ type, onNavigate }) => {
  const disease = type === "disease";
  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 px-6 py-10 text-center">
      {disease ? (
        <ShieldAlert className="mx-auto mb-3 text-orange-400" size={32} />
      ) : (
        <Leaf className="mx-auto mb-3 text-emerald-400" size={32} />
      )}
      <h3 className="font-semibold text-white">
        No {disease ? "disease" : "yield"} predictions yet
      </h3>
      <p className="mt-1 text-sm text-slate-400">
        Your completed analyses will appear here.
      </p>
      <button
        onClick={onNavigate}
        className={`mt-5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
          disease
            ? "bg-orange-600 hover:bg-orange-500"
            : "bg-emerald-600 hover:bg-emerald-500"
        }`}
      >
        Start {disease ? "detection" : "prediction"}
      </button>
    </div>
  );
};

const PredictionCard = ({ prediction, type, onView, onDelete }) => {
  const disease = type === "disease";
  const confidence = Number(prediction.confidence);
  const confidenceLabel = Number.isFinite(confidence)
    ? `${(confidence <= 1 ? confidence * 100 : confidence).toFixed(1)}%`
    : "Not available";
  const result = disease
    ? prediction.prediction
    : `${prediction.predicted_yield} ${prediction.unit || "kg/hectare"}`;

  return (
    <article className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-5 shadow-xl shadow-slate-950/20 transition-colors hover:border-slate-600">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`rounded-xl p-3 ${disease ? "bg-orange-500/15" : "bg-emerald-500/15"}`}
          >
            {disease ? (
              <ShieldAlert className="text-orange-400" size={22} />
            ) : (
              <BarChart3 className="text-emerald-400" size={22} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {disease ? "Crop health" : "Field outlook"}
            </p>
            <h3 className="truncate text-lg font-bold text-white">{result}</h3>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${disease ? "bg-orange-500/15 text-orange-300" : "bg-emerald-500/15 text-emerald-300"}`}
        >
          {disease ? "Disease" : "Yield"}
        </span>
      </div>

      <div className="space-y-3 border-y border-slate-700/60 py-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">
            {disease ? "Confidence" : "Model accuracy"}
          </span>
          <span className="font-semibold text-slate-200">
            {disease
              ? confidenceLabel
              : prediction.model_accuracy || "Not available"}
          </span>
        </div>
        {disease && prediction.model_accuracy && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Model accuracy</span>
            <span className="font-semibold text-slate-200">
              {prediction.model_accuracy}
            </span>
          </div>
        )}
        {!disease && (
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Field area</span>
            <span className="font-semibold text-slate-200">
              {prediction.area_hectare} ha
            </span>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Recorded</span>
          <span className="text-right text-slate-300">
            {dateLabel(prediction.createdAt)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onView(prediction, type)}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${disease ? "bg-orange-500/15 text-orange-300 hover:bg-orange-500/25" : "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"}`}
        >
          <Eye className="mr-2 inline" size={16} /> View details
        </button>
        <button
          onClick={() => onDelete(prediction._id, type)}
          aria-label={`Delete ${type} prediction`}
          className="rounded-lg bg-red-500/10 px-3 py-2 text-red-300 transition hover:bg-red-500/20"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
};

const PredictionHistory = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [diseasePredictions, setDiseasePredictions] = useState([]);
  const [yieldPredictions, setYieldPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeType, setActiveType] = useState("disease");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchPredictions = async () => {
      try {
        setLoading(true);
        const [diseaseResponse, yieldResponse] = await Promise.all([
          api.disease.getHistory(),
          api.history.getAll(),
        ]);
        setDiseasePredictions(recordsFrom(diseaseResponse));
        setYieldPredictions(recordsFrom(yieldResponse));
      } catch {
        toast.error("Failed to fetch prediction history");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [isAuthenticated, navigate]);

  const handleDelete = async () => {
    const { id, type } = deleteConfirm;
    try {
      if (type === "disease") {
        await api.disease.deleteHistory(id);
        setDiseasePredictions((current) =>
          current.filter((item) => item._id !== id),
        );
      } else {
        await api.history.delete(id);
        setYieldPredictions((current) =>
          current.filter((item) => item._id !== id),
        );
      }
      setDeleteConfirm(null);
      toast.success("Prediction deleted");
    } catch {
      toast.error("Failed to delete prediction");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Delete all disease and yield predictions?")) return;
    try {
      await Promise.all([
        diseasePredictions.length
          ? api.disease.deleteAllHistory()
          : Promise.resolve(),
        yieldPredictions.length ? api.history.deleteAll() : Promise.resolve(),
      ]);
      setDiseasePredictions([]);
      setYieldPredictions([]);
      toast.success("All predictions deleted");
    } catch {
      toast.error("Failed to delete all predictions");
    }
  };

  const totalPredictions = diseasePredictions.length + yieldPredictions.length;
  const renderSection = (type, predictions, title, Icon, color, onNavigate) => (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
         
          <h2 className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
            <Icon size={22} /> {title}
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${type === "disease" ? "bg-orange-500/10 text-orange-300" : "bg-emerald-500/10 text-emerald-300"}`}
        >
          {predictions.length} records
        </span>
      </div>
      {predictions.length ? (
        <div className="grid gap-5 md:grid-cols-2">
          {predictions.map((prediction) => (
            <PredictionCard
              key={prediction._id}
              prediction={prediction}
              type={type}
              onView={(item, itemType) =>
                setSelectedPrediction({ item, type: itemType })
              }
              onDelete={(id, itemType) =>
                setDeleteConfirm({ id, type: itemType })
              }
            />
          ))}
        </div>
      ) : (
        <EmptySection type={type} onNavigate={onNavigate} />
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 pb-20 pt-28 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-6 border-b border-slate-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <History className="text-cyan-400" size={30} />
              <h1 className="text-3xl font-bold text-white sm:text-4xl">
                Prediction history
              </h1>
            </div>
            <p className="text-slate-400">
              A clear record of your crop health and field outlook analyses.
            </p>
          </div>
          {totalPredictions > 0 && (
            <button
              onClick={handleDeleteAll}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              <Trash2 size={16} /> Clear all
            </button>
          )}
        </header>

        <div className="mb-10 flex justify-center sm:justify-start">
          <PredictionTypeTabs
            activeType={activeType}
            onChange={setActiveType}
            counts={{
              disease: diseasePredictions.length,
              yield: yieldPredictions.length,
            }}
          />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader className="animate-spin text-cyan-400" size={34} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeType}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {activeType === "disease"
                ? renderSection(
                    "disease",
                    diseasePredictions,
                    "Disease detections",
                    ShieldAlert,
                    "text-orange-400",
                    () => navigate("/disease"),
                  )
                : renderSection(
                    "yield",
                    yieldPredictions,
                    "Yield predictions",
                    BarChart3,
                    "text-emerald-400",
                    () => navigate("/yield"),
                  )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence>
        {selectedPrediction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelectedPrediction(null)}
          >
            <div
              className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {selectedPrediction.type === "disease"
                    ? "Disease detection"
                    : "Yield prediction"}
                </h2>
                <button
                  onClick={() => setSelectedPrediction(null)}
                  aria-label="Close details"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>
              <div className="space-y-4 text-sm">
                <Detail
                  label="Result"
                  value={
                    selectedPrediction.item.prediction ||
                    `${selectedPrediction.item.predicted_yield} ${selectedPrediction.item.unit || "kg/hectare"}`
                  }
                />
                {selectedPrediction.type === "disease" && (
                  <Detail
                    label="Confidence"
                    value={`${(Number(selectedPrediction.item.confidence) <= 1 ? Number(selectedPrediction.item.confidence) * 100 : Number(selectedPrediction.item.confidence)).toFixed(1)}%`}
                  />
                )}
                {selectedPrediction.item.model_accuracy && (
                  <Detail
                    label="Model accuracy"
                    value={selectedPrediction.item.model_accuracy}
                  />
                )}
                {selectedPrediction.type === "yield" && (
                  <>
                    <Detail
                      label="Field area"
                      value={`${selectedPrediction.item.area_hectare} ha`}
                    />
                    <Detail
                      label="Weather"
                      value={`${selectedPrediction.item.temperature_c}°C, ${selectedPrediction.item.humidity_percent}% humidity, ${selectedPrediction.item.rainfall_mm} mm rain`}
                    />
                  </>
                )}
                <Detail
                  label="Recorded"
                  value={dateLabel(selectedPrediction.item.createdAt, true)}
                />
              </div>
            </div>
          </div>
        )}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl border border-red-500/30 bg-slate-900 p-6">
              <AlertCircle className="mb-3 text-red-400" size={28} />
              <h2 className="text-xl font-bold text-white">
                Delete prediction?
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                This action cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionHistory;
