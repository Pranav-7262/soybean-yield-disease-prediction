import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Loader, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, isAuthenticated, updateUsername, updateEmail } = useAuth();
  const navigate = useNavigate();
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateUsername(newUsername);
      toast.success("Username updated successfully");
      setEditingUsername(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.error("Email cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await updateEmail(newEmail);
      toast.success("Email updated successfully");
      setEditingEmail(false);
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
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">Manage your account information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Avatar Section */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-4xl font-bold text-white">
                {user.user.userName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Account Status</p>
                <p className="text-2xl font-bold text-emerald-400">Active</p>
                <p className="text-lg text-slate-600 mt-2 font-bold">
                  Member since{" "}
                  {new Date(user?.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Username */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <User size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Username</p>
                  {!editingUsername ? (
                    <p className="text-lg font-semibold text-white">
                      {user?.user.userName}
                    </p>
                  ) : null}
                </div>
              </div>
              {!editingUsername && (
                <button
                  onClick={() => {
                    setEditingUsername(true);
                    setNewUsername(user?.user.userName);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editingUsername && (
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={handleUpdateUsername}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                </button>
                <button
                  onClick={() => setEditingUsername(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </motion.div>

          {/* Email */}
          <motion.div
            variants={itemVariants}
            className="bg-slate-800/40 backdrop-blur border border-emerald-500/20 rounded-2xl p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <Mail size={20} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Email Address</p>
                  {!editingEmail ? (
                    <p className="text-lg font-semibold text-white">
                      {user.user.email}
                    </p>
                  ) : null}
                </div>
              </div>
              {!editingEmail && (
                <button
                  onClick={() => {
                    setEditingEmail(true);
                    setNewEmail(user?.user.email);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editingEmail && (
              <div className="flex gap-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  disabled={loading}
                />
                <button
                  onClick={handleUpdateEmail}
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                </button>
                <button
                  onClick={() => setEditingEmail(false)}
                  disabled={loading}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
