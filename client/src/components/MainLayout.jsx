import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar - Fixed at top */}
      <Navbar />

      {/* Main Content - Grows to fill space */}
      <main className="flex-1 pt-5 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;
