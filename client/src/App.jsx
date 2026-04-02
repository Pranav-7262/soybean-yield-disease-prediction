import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ShieldAlert, LayoutDashboard, Leaf } from "lucide-react";

// Pages
import DashboardHome from "./page/DashboardHome";
import YieldPredictor from "./page/YieldPredictor";
import DiseaseDetector from "./page/DiseaseDetector";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-slate-100 selection:bg-emerald-500/30 font-sans">
        {/* Floating Glass Navbar */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg">
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl px-6 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-all">
                <Leaf size={20} className="text-emerald-400" />
              </div>
              <span className="font-bold tracking-tight text-white hidden sm:block">
                SoybeanAI
              </span>
            </Link>

            <div className="flex items-center gap-8">
              <NavLink to="/yield" icon={<Sprout size={20} />} label="Yield" />
              <NavLink
                to="/disease"
                icon={<ShieldAlert size={20} />}
                label="Disease"
              />
            </div>
          </div>
        </nav>

        {/* Content Area with Page Transitions */}
        <main className="pt-32 pb-20 container mx-auto px-6">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/yield" element={<YieldPredictor />} />
              <Route path="/disease" element={<DiseaseDetector />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Background Visual Effects */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>
      </div>
    </Router>
  );
};

const NavLink = ({ to, icon, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className="relative flex flex-col items-center gap-1 group">
      <span
        className={`transition-colors duration-300 ${active ? "text-emerald-400" : "text-slate-400 group-hover:text-white"}`}
      >
        {icon}
      </span>
      <span
        className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${active ? "text-emerald-400" : "text-slate-500 group-hover:text-white"}`}
      >
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="nav-glow"
          className="absolute -bottom-6 w-12 h-4 bg-emerald-400/20 blur-md rounded-full"
        />
      )}
    </Link>
  );
};

export default App;
