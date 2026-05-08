import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Loader,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../services/api";

const DiseaseDetector = () => {
  const { isAuthenticated } = useAuth();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result);
      reader.readAsDataURL(file);
      setPrediction(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-emerald-500", "bg-emerald-500/5");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-500/5");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-emerald-500", "bg-emerald-500/5");
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      handleFileSelect({ target: { files: dataTransfer.files } });
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await api.disease.predict(formData);
      if (response.data) {
        setPrediction(response.data);
        toast.success("Disease detection completed");
      } else {
        throw new Error(response.message || "Prediction failed");
      }
    } catch (error) {
      toast.error(error.message || "Failed to detect disease");
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const getDiseaseInfo = (diseaseName) => {
    const diseases = {
      healthy: {
        icon: CheckCircle,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        severity: "No Disease Detected",
        description:
          "Your crop appears healthy. Continue monitoring regularly.",
      },
      rust: {
        icon: AlertTriangle,
        color: "text-orange-400",
        bgColor: "bg-orange-500/10",
        severity: "Moderate",
        description:
          "Fungal infection detected. Apply fungicides and improve air circulation.",
      },
      powdery_mildew: {
        icon: AlertTriangle,
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        severity: "Moderate",
        description:
          "Powdery mildew detected. Use appropriate fungal treatments.",
      },
      leaf_spot: {
        icon: ShieldAlert,
        color: "text-red-400",
        bgColor: "bg-red-500/10",
        severity: "High",
        description: "Leaf spot disease detected. Isolate affected plants.",
      },
    };

    return diseases[diseaseName?.toLowerCase()] || diseases.healthy;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
        <div className="absolute top-20 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert size={32} className="text-orange-400" />
            <h1 className="text-4xl font-bold text-white">Disease Detector</h1>
          </div>
          <p className="text-slate-400">
            Upload a crop image to detect diseases using AI
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Upload Section */}
          <motion.div variants={itemVariants}>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center transition-all cursor-pointer bg-slate-800/20 hover:bg-slate-800/40"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!preview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <div className="p-4 bg-orange-500/20 rounded-2xl">
                      <Upload size={32} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white mb-1">
                        Upload Crop Image
                      </p>
                      <p className="text-sm text-slate-400">
                        Drag and drop or click to select
                      </p>
                    </div>
                  </motion.div>
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative inline-block"
                >
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-96 rounded-xl shadow-lg"
                  />
                  <button
                    onClick={clearSelection}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Action Button */}
          {preview && !prediction && (
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <ShieldAlert size={20} />
                  Detect Disease
                </>
              )}
            </motion.button>
          )}

          {/* Prediction Results */}
          <AnimatePresence>
            {prediction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                variants={itemVariants}
                className="space-y-6"
              >
                {/* Result Card */}
                <div className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8">
                  {(() => {
                    const info = getDiseaseInfo(prediction.disease);
                    const Icon = info.icon;
                    return (
                      <div
                        className={`${info.bgColor} rounded-2xl p-8 text-center`}
                      >
                        <Icon
                          size={48}
                          className={`${info.color} mx-auto mb-4`}
                        />
                        <h2 className={`text-3xl font-bold ${info.color} mb-2`}>
                          {prediction.disease || "Unknown"}
                        </h2>
                        <p
                          className={`text-lg font-semibold ${info.color} mb-4`}
                        >
                          Severity: {info.severity}
                        </p>
                        <p className="text-slate-300">{info.description}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Confidence */}
                {prediction.confidence && (
                  <div className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-6">
                    <p className="text-slate-400 text-sm mb-3">
                      Confidence Score
                    </p>
                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.confidence}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-emerald-400 font-semibold mt-2">
                      {prediction.confidence}% confident
                    </p>
                  </div>
                )}

                {/* Recommendations */}
                {prediction.recommendations && (
                  <div className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {prediction.recommendations.map((rec, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle
                            size={20}
                            className="text-emerald-400 flex-shrink-0 mt-1"
                          />
                          <span className="text-slate-300">{rec}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* New Analysis Button */}
                <button
                  onClick={clearSelection}
                  className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Try Another Image
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info Section */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                Use high-quality, well-lit images for best results
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                Ensure the affected leaf is clearly visible
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                Take photos in natural light when possible
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DiseaseDetector;
