import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Providers
import { AuthProvider } from "./context/AuthContext";

// Components & Layout
import MainLayout from "./components/MainLayout";

// Pages
import Dashboard from "./page/Dashboard";
import YieldPredictor from "./page/YieldPredictor";
import DiseaseDetector from "./page/DiseaseDetector";
import Login from "./page/Login";
import Register from "./page/Register";
import Profile from "./page/Profile";
import Settings from "./page/Settings";
import PredictionHistory from "./page/PredictionHistory";

const AppContent = () => {
  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Routes - With Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/yield" element={<YieldPredictor />} />
        <Route path="/disease" element={<DiseaseDetector />} />
        <Route path="/history" element={<PredictionHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
          <AppContent />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />

          {/* Background Visual Effects */}
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
