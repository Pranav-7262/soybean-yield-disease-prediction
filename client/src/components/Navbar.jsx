import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  LogOut,
  Settings,
  User,
  BarChart3,
  ShieldAlert,
  History,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NavLink = ({ to, icon, label, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 group px-3 py-2 rounded-lg hover:bg-slate-800/30 transition-all duration-200"
    >
      <span className="text-slate-400 group-hover:text-emerald-400 transition-colors">
        {icon}
      </span>
      <span className="text-sm font-medium text-slate-300 group-hover:text-emerald-300 transition-colors">
        {label}
      </span>
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-20 flex items-center justify-between mt-4 mb-4 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-all duration-300">
                <Leaf size={20} className="text-emerald-400" />
              </div>
              <span className="font-bold tracking-tight text-lg text-white hidden sm:block">
                SoybeanAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
              <NavLink
                to="/dashboard"
                icon={<BarChart3 size={18} />}
                label="Dashboard"
              />
              <NavLink
                to="/yield"
                icon={<BarChart3 size={18} />}
                label="Yield"
              />
              <NavLink
                to="/disease"
                icon={<ShieldAlert size={18} />}
                label="Disease"
              />
              {user && (
                <NavLink
                  to="/history"
                  icon={<History size={18} />}
                  label="History"
                />
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 sm:gap-4">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">
                        {user.user?.userName?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium hidden sm:block text-slate-200">
                      {user.user?.userName}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-4 border-b border-white/5">
                        <p className="text-xs text-slate-400 uppercase tracking-wide">
                          Signed in as
                        </p>
                        <p className="text-sm font-semibold text-emerald-400 truncate">
                          {user.user?.email}
                        </p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User size={16} />
                        View Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors border-t border-white/5"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>

                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/30"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-32 left-4 right-4 z-30 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 space-y-2 animate-in fade-in zoom-in-95 duration-200">
          <NavLink
            to="/dashboard"
            icon={<BarChart3 size={18} />}
            label="Dashboard"
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavLink
            to="/yield"
            icon={<BarChart3 size={18} />}
            label="Yield Predictor"
            onClick={() => setMobileMenuOpen(false)}
          />
          <NavLink
            to="/disease"
            icon={<ShieldAlert size={18} />}
            label="Disease Detector"
            onClick={() => setMobileMenuOpen(false)}
          />
          {user && (
            <NavLink
              to="/history"
              icon={<History size={18} />}
              label="Prediction History"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
