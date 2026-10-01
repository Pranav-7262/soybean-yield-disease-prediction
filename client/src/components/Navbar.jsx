import React, { useState, useRef, useEffect } from "react";
import {
  Link,
  NavLink as RouterNavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
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
  const location = useLocation();

  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 group px-3 py-2.5 rounded-lg transition-colors duration-200 ${
          isActive || (to === "/dashboard" && location.pathname === "/")
            ? "bg-emerald-500/10 [&_.nav-icon]:text-emerald-400 [&_.nav-label]:text-emerald-200"
            : "hover:bg-white/5"
        }`
      }
    >
      <span className="nav-icon text-slate-400 group-hover:text-emerald-400 transition-colors">
        {icon}
      </span>
      <span className="nav-label text-sm font-medium text-slate-300 group-hover:text-emerald-300 transition-colors">
        {label}
      </span>
    </RouterNavLink>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpenPath, setProfileOpenPath] = useState(null);
  const [mobileMenuOpenPath, setMobileMenuOpenPath] = useState(null);
  const profileOpen = profileOpenPath === location.pathname;
  const mobileMenuOpen = mobileMenuOpenPath === location.pathname;
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpenPath(null);
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
      <nav
        aria-label="Main navigation"
        className="sticky top-0 z-50 w-full px-5 pb-3 pt-3 sm:px-8 lg:px-12 2xl:px-16"
      >
        <div className="page-frame relative">
          <div className="h-18 flex items-center justify-between bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl px-4 sm:px-6 shadow-[0_16px_44px_rgba(0,0,0,0.35)]">
            <Link
              to="/"
              aria-label="SoybeanAI home"
              className="flex items-center gap-2 group shrink-0"
            >
              <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-all duration-300">
                <Leaf size={20} className="text-emerald-400" />
              </div>
              <span className="font-bold tracking-tight text-lg text-white hidden sm:block">
                SoybeanAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
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
                    onClick={() =>
                      setProfileOpenPath(profileOpen ? null : location.pathname)
                    }
                    aria-expanded={profileOpen}
                    aria-label="Open account menu"
                    className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0">
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
                        onClick={() => setProfileOpenPath(null)}
                      >
                        <User size={16} />
                        View Profile
                      </Link>

                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors border-t border-white/5"
                        onClick={() => setProfileOpenPath(null)}
                      >
                        <Settings size={16} />
                        Settings
                      </Link>

                      <button
                        onClick={() => {
                          setProfileOpenPath(null);
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
                    aria-current={
                      location.pathname === "/login" ? "page" : undefined
                    }
                    onClick={() => setMobileMenuOpenPath(null)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                      location.pathname === "/login"
                        ? "bg-white/10 text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    aria-current={
                      location.pathname === "/register" ? "page" : undefined
                    }
                    onClick={() => setMobileMenuOpenPath(null)}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold text-slate-950 transition-colors sm:px-4 sm:text-sm ${
                      location.pathname === "/register"
                        ? "bg-emerald-400 ring-2 ring-emerald-200/30"
                        : "bg-emerald-500 hover:bg-emerald-400"
                    }`}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden text-slate-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/30"
                onClick={() =>
                  setMobileMenuOpenPath(
                    mobileMenuOpen ? null : location.pathname,
                  )
                }
                aria-expanded={mobileMenuOpen}
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          {mobileMenuOpen && (
            <div className="absolute inset-x-0 top-full mt-2 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 lg:hidden">
              <NavLink
                to="/dashboard"
                icon={<BarChart3 size={18} />}
                label="Dashboard"
                onClick={() => setMobileMenuOpenPath(null)}
              />
              <NavLink
                to="/yield"
                icon={<BarChart3 size={18} />}
                label="Yield Predictor"
                onClick={() => setMobileMenuOpenPath(null)}
              />
              <NavLink
                to="/disease"
                icon={<ShieldAlert size={18} />}
                label="Disease Detector"
                onClick={() => setMobileMenuOpenPath(null)}
              />
              {user && (
                <NavLink
                  to="/history"
                  icon={<History size={18} />}
                  label="Prediction History"
                  onClick={() => setMobileMenuOpenPath(null)}
                />
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
