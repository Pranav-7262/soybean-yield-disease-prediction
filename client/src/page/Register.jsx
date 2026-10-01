import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Loader,
  Eye,
  EyeOff,
  Sprout,
  ScanEye,
  TrendingUp,
} from "lucide-react";
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
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanUsername || !cleanEmail || !password.trim() || !confirmPassword) {
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
      await register(cleanUsername, cleanEmail, password);
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

  const inputClassName =
    "w-full rounded-xl border border-slate-700/80 bg-slate-950/50 py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-emerald-400/70 focus:ring-4 focus:ring-emerald-500/10";

  return (
    <main className="relative isolate flex min-h-[calc(100vh-6rem)] items-center overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 pb-12 pt-8 sm:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)] lg:gap-16"
      >
        <motion.section
          variants={itemVariants}
          className="mx-auto max-w-xl lg:mx-0"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
            <Sprout size={15} aria-hidden="true" />
            Field intelligence
          </div>
          <h1 className="max-w-lg text-4xl font-bold leading-tight text-white sm:text-5xl">
            Better decisions start with a healthier view of your fields.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            Bring crop health checks and Maharashtra-focused yield estimates
            together in one place.
          </p>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            <div className="flex gap-4 py-5">
              <ScanEye
                className="mt-0.5 shrink-0 text-emerald-300"
                size={21}
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Check crop health
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Review soybean leaf images for common disease signals.
                </p>
              </div>
            </div>
            <div className="flex gap-4 py-5">
              <TrendingUp
                className="mt-0.5 shrink-0 text-emerald-300"
                size={21}
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Plan with yield estimates
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Explore forecasts informed by soil and weather conditions.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          variants={itemVariants}
          className="w-full rounded-2xl border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8"
        >
          <motion.div variants={itemVariants} className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-300">
              Create an account
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white">
              Get started with SoybeanAI
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Set up your account to save and review your analyses.
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div variants={itemVariants}>
              <label
                htmlFor="register-username"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Username
              </label>
              <div className="relative">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClassName}
                  autoComplete="username"
                  placeholder="Your name"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="register-email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClassName}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="register-password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  id="register-password"
                  name="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClassName.replace("pr-4", "pr-12")}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                At least 6 characters
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label
                htmlFor="register-confirm-password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                />
                <input
                  id="register-confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClassName.replace("pr-4", "pr-12")}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  aria-invalid={Boolean(
                    confirmPassword && password !== confirmPassword,
                  )}
                  aria-describedby="confirm-password-message"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmation password"
                      : "Show confirmation password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-emerald-300 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              <p
                id="confirm-password-message"
                aria-live="polite"
                className={`mt-1.5 min-h-4 text-xs ${confirmPassword && password !== confirmPassword ? "text-rose-300" : "text-transparent"}`}
              >
                {confirmPassword && password !== confirmPassword
                  ? "Passwords do not match"
                  : " "}
              </p>
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
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

          <motion.div
            variants={itemVariants}
            className="my-6 flex items-center gap-4"
          >
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="flex-1 h-px bg-slate-700" />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-slate-400"
          >
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-300 transition-colors hover:text-emerald-200"
            >
              Sign in here
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Register;
