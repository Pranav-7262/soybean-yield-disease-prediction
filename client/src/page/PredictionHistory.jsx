import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  Trash2,
  Download,
  Eye,
  Loader,
  AlertCircle,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const PredictionHistory = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    fetchPredictions();
  }, [isAuthenticated, navigate]);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const response = await api.history.getAll();
      setPredictions(response.data.data || response.data || []);
    } catch (error) {
      toast.error("Failed to fetch predictions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.history.delete(id);
      setPredictions((prev) => prev.filter((p) => p._id !== id));
      toast.success("Prediction deleted");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete prediction");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all predictions?")) {
      return;
    }

    try {
      await api.history.deleteAll();
      setPredictions([]);
      toast.success("All predictions deleted");
    } catch (error) {
      toast.error("Failed to delete predictions");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-32 pb-20">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center justify-between"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <History size={32} className="text-emerald-400" />
              <h1 className="text-4xl font-bold text-white">
                Prediction History
              </h1>
            </div>
            <p className="text-slate-400">View and manage your predictions</p>
          </div>
          {predictions.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteAll}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 rounded-lg transition-all"
            >
              Clear All
            </motion.button>
          )}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : predictions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-12 text-center"
          >
            <AlertCircle size={48} className="text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              No predictions yet
            </h2>
            <p className="text-slate-400 mb-6">
              Start by making a disease detection or yield prediction
            </p>
            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/disease")}
                className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all"
              >
                Disease Detector
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/yield")}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
              >
                Yield Predictor
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {predictions.map((prediction) => (
              <motion.div
                key={prediction._id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-emerald-400 text-sm font-semibold">
                        Yield Prediction
                      </p>
                      <h3 className="text-lg font-bold text-white">
                        {prediction.predicted_yield
                          ? `${prediction.predicted_yield} ${prediction.unit || "kg/ha"}`
                          : "Result"}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                      Yield
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {prediction.model_accuracy && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Model Accuracy</span>
                        <span className="text-emerald-400 font-semibold">
                          {prediction.model_accuracy}
                        </span>
                      </div>
                    )}
                    {prediction.predicted_yield && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Predicted Yield</span>
                        <span className="text-emerald-400 font-semibold">
                          {prediction.predicted_yield}{" "}
                          {prediction.unit || "kg/ha"}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Date</span>
                      <span className="text-slate-300">
                        {new Date(prediction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPrediction(prediction)}
                      className="flex-1 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDeleteConfirm(prediction._id)}
                      className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm font-medium rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {selectedPrediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPrediction(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-8 max-w-md w-full max-h-96 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Yield Result
              </h2>

              <div className="space-y-4">
                {selectedPrediction.predicted_yield && (
                  <div>
                    <p className="text-slate-400 text-sm">Predicted Yield</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      {selectedPrediction.predicted_yield}{" "}
                      {selectedPrediction.unit || "kg/ha"}
                    </p>
                  </div>
                )}

                {selectedPrediction.model_accuracy && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">
                      Model Accuracy
                    </p>
                    <p className="text-emerald-400 text-sm font-semibold">
                      {selectedPrediction.model_accuracy}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-slate-400 text-sm">Date</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedPrediction.createdAt).toLocaleString()}
                  </p>
                </div>

                {selectedPrediction.recommendations && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">
                      Recommendations
                    </p>
                    <ul className="space-y-1">
                      {selectedPrediction.recommendations.map((rec, i) => (
                        <li
                          key={i}
                          className="text-slate-300 text-sm flex items-start gap-2"
                        >
                          <span className="text-emerald-400 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedPrediction(null)}
                className="mt-6 w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-900 border border-red-500/20 rounded-2xl p-8 max-w-sm w-full"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Delete Prediction?
              </h2>
              <p className="text-slate-400 mb-6">
                This action cannot be undone.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PredictionHistory;
