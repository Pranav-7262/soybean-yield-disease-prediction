import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ShieldAlert,
  TrendingUp,
  Clock,
  Loader,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { toast } from "react-toastify";

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
        <p className="text-3xl font-bold text-emerald-400 mb-1">{value}</p>
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
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await api.history.getStats();
        setStats(response.data.data || {});
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, navigate]);
  console.log("user :", user);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-10 pb-15">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
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
            Hello , {user?.user.userName}
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
              label="Total Predictions"
              value={stats?.totalPredictions || 0}
              subtext="All time"
              delay={0.1}
            />
            <StatCard
              icon={ShieldAlert}
              label="Average Yield"
              value={stats?.avgYield || 0}
              subtext="Issues found"
              delay={0.2}
            />
            <StatCard
              icon={TrendingUp}
              label="Max Yield"
              value={stats?.maxYield || 0}
              subtext="Completed"
              delay={0.3}
            />
            <StatCard
              icon={TrendingUp}
              label="Min Yield"
              value={stats?.minYield || 0}
              subtext="Completed"
              delay={0.3}
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
      </div>
    </div>
  );
};

export default Dashboard;
