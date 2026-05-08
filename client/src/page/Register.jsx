import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Loader, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 flex items-center justify-center px-4 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">🌱</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Get Started</h1>
            <p className="text-slate-400">Create your SoybeanAI account</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400/50 pointer-events-none"
                  size={18}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="john_doe"
                />
              </div>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400/50 pointer-events-none"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400/50 pointer-events-none"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                At least 6 characters
              </p>
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400/50 pointer-events-none"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            variants={itemVariants}
            className="my-6 flex items-center gap-4"
          >
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </motion.div>

          {/* Sign In Link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-slate-400"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Sign in here
            </Link>
          </motion.p>
        </motion.div>

        {/* Benefits */}
        <motion.div variants={itemVariants} className="mt-12 space-y-3">
          {[
            "🎯 Accurate crop predictions",
            "🛡️ Detect crop diseases early",
            "📊 Track your farming data",
          ].map((benefit, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 10 }}
              className="flex items-center gap-3 text-sm text-slate-400"
            >
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              {benefit}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
