import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BarChart3, ShieldAlert, TrendingUp, Leaf, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { toast } from "react-toastify";

const recordsFrom = (response) => response.data?.data || response.data || [];

const dateLabel = (date) =>
  date
    ? new Date(date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

const StatCard = ({ icon: Icon, label, value, subtext, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-all">
            <Icon size={24} className="text-emerald-400" />
          </div>
        </div>
        <p className="text-slate-400 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-emerald-400 mb-1">
          {typeof value === "number"
            ? Math.max(0, value).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : value || "0"}
        </p>
        {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
      </div>
    </motion.div>
  );
};

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  color,
  delay,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gradient-to-br ${color} rounded-2xl p-6 cursor-pointer group overflow-hidden relative`}
      onClick={onClick}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      </div>
      <div className="relative z-10">
        <Icon
          size={32}
          className="text-white mb-3 group-hover:scale-110 transition-transform"
        />
        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/80">{description}</p>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const [statsResponse, yieldResponse, diseaseResponse] =
          await Promise.all([
            api.history.getStats(),
            api.history.getAll(),
            api.disease.getHistory(),
          ]);
        const yieldRecords = recordsFrom(yieldResponse);
        const diseaseRecords = recordsFrom(diseaseResponse);
        const activity = [
          ...yieldRecords.map((item) => ({ ...item, type: "yield" })),
          ...diseaseRecords.map((item) => ({ ...item, type: "disease" })),
        ]
          .sort(
            (left, right) =>
              new Date(right.createdAt) - new Date(left.createdAt),
          )
          .slice(0, 4);

        setStats({
          ...(statsResponse.data?.data || {}),
          diseasePredictions: diseaseRecords.length,
          totalPredictions:
            (statsResponse.data?.data?.totalPredictions ||
              yieldRecords.length) + diseaseRecords.length,
        });
        setRecentActivity(activity);
      } catch {
        toast.error("Failed to load dashboard insights");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, navigate]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pb-15">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="page-frame relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-emerald-400 text-sm font-semibold mb-2">
            Welcome back!
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Hello, {user?.user.userName}
          </h1>
          <p className="text-slate-400">
            Monitor your crops and get AI-powered insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="w-8 h-8 text-emerald-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <StatCard
              icon={BarChart3}
              label="Total Analyses"
              value={Math.max(0, stats?.totalPredictions || 0)}
              subtext="Disease and yield"
              delay={0.1}
            />
            <StatCard
              icon={ShieldAlert}
              label="Disease Checks"
              value={Math.max(0, stats?.diseasePredictions || 0)}
              subtext="All time"
              delay={0.2}
            />
            <StatCard
              icon={Leaf}
              label="Average Yield (kg/ha)"
              value={Math.max(0, stats?.avgYield || 0)}
              subtext="Rolling average"
              delay={0.3}
            />
            <StatCard
              icon={TrendingUp}
              label="Max Yield (kg/ha)"
              value={Math.max(0, stats?.maxYield || 0)}
              subtext="Observed max"
              delay={0.4}
            />
          </div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <QuickActionCard
              title="Disease Detection"
              description="Upload a crop image to detect diseases"
              icon={ShieldAlert}
              color="from-red-600/20 to-orange-600/20 hover:from-red-600/30 hover:to-orange-600/30"
              delay={0.2}
              onClick={() => navigate("/disease")}
            />
            <QuickActionCard
              title="Yield Prediction"
              description="Predict your harvest yield with AI"
              icon={TrendingUp}
              color="from-emerald-600/20 to-green-600/20 hover:from-emerald-600/30 hover:to-green-600/30"
              delay={0.3}
              onClick={() => navigate("/yield")}
            />
            <QuickActionCard
              title="View History"
              description="Check all your predictions & analysis"
              icon={BarChart3}
              color="from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30"
              delay={0.4}
              onClick={() => navigate("/history")}
            />
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-12 rounded-2xl border border-slate-700/70 bg-slate-800/40 p-6 backdrop-blur"
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent activity</h2>
              <p className="mt-1 text-sm text-slate-400">
                Your latest crop health and yield analyses
              </p>
            </div>
            <button
              onClick={() => navigate("/history")}
              className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              View all
            </button>
          </div>
          {recentActivity.length ? (
            <div className="divide-y divide-slate-700/60">
              {recentActivity.map((item) => {
                const disease = item.type === "disease";
                return (
                  <div
                    key={`${item.type}-${item._id}`}
                    className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        className={`rounded-xl p-2.5 ${disease ? "bg-orange-500/15" : "bg-emerald-500/15"}`}
                      >
                        {disease ? (
                          <ShieldAlert className="text-orange-400" size={19} />
                        ) : (
                          <BarChart3 className="text-emerald-400" size={19} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">
                          {disease
                            ? item.prediction
                            : `${item.predicted_yield} ${item.unit || "kg/hectare"}`}
                        </p>
                        <p className="text-xs text-slate-500">
                          {disease ? "Disease detection" : "Yield prediction"}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-slate-400">
                      {dateLabel(item.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-6 text-center text-sm text-slate-400">
              No analyses recorded yet.
            </p>
          )}
        </motion.section>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                emoji: "🔬",
                title: "Advanced ML Models",
                desc: "Powered by TensorFlow and scikit-learn",
              },
              {
                emoji: "📊",
                title: "Real-time Analytics",
                desc: "Get instant insights on your crops",
              },
              {
                emoji: "🛡️",
                title: "Disease Detection",
                desc: "Identify crop diseases early",
              },
              {
                emoji: "🌾",
                title: "Yield Forecasting",
                desc: "Predict harvest yields accurately",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-start gap-4"
              >
                <span className="text-3xl">{feature.emoji}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights / Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-slate-800/30 backdrop-blur border border-white/6 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Latest Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/40 rounded-lg">
              <p className="text-xs text-slate-400 uppercase mb-2">
                Top Region
              </p>
              <p className="font-semibold text-white">Maharashtra</p>
              <p className="text-sm text-slate-400 mt-2">
                Most predictions and calibration data originate here.
              </p>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-lg">
              <p className="text-xs text-slate-400 uppercase mb-2">
                Model Accuracy
              </p>
              <p className="font-semibold text-emerald-400">
                {stats?.modelAccuracy
                  ? `${Math.max(0, stats.modelAccuracy)}%`
                  : "—"}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Average performance across recent predictions.
              </p>
            </div>

            <div className="p-4 bg-slate-900/40 rounded-lg">
              <p className="text-xs text-slate-400 uppercase mb-2">
                Recommended Action
              </p>
              <p className="font-semibold text-white">Balance NPK</p>
              <p className="text-sm text-slate-400 mt-2">
                Adjust fertilization according to soil test recommendations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
