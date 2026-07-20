import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  AlertTriangle,
  Loader,
  Check,
  X,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, isAuthenticated, changePassword, resetAccount, logout } =
    useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("security");
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );
      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAccount = async () => {
    if (
      !window.confirm(
        "Are you sure? This will delete your account and all associated data. This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await resetAccount();
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
        <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and security</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 mb-12 border-b border-slate-700"
        >
          {[
            { id: "security", label: "Security", icon: Lock },
            { id: "danger", label: "Danger Zone", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-2 font-medium transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Change Password */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Lock size={24} className="text-emerald-400" />
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          new: !prev.new,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    At least 6 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswords((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Update Password
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Account Info */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Email</span>
                  <span className="text-emerald-400 font-semibold">
                    {user?.email}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Username</span>
                  <span className="text-emerald-400 font-semibold">
                    {user?.userName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Member Since</span>
                  <span className="text-emerald-400 font-semibold">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Danger Zone Tab */}
        {activeTab === "danger" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Delete Account */}
            <motion.div
              variants={itemVariants}
              className="bg-red-500/10 backdrop-blur border border-red-500/30 rounded-2xl p-8"
            >
              <h2 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
                <AlertTriangle size={24} />
                Delete Account
              </h2>
              <p className="text-slate-300 mb-6">
                Permanently delete your account and all associated data. This
                action cannot be undone.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleResetAccount}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader size={18} className="animate-spin" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete My Account
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Logout */}
            <motion.div
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Session</h3>
              <p className="text-slate-400 mb-6">
                Sign out of your account on this device
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Settings;
