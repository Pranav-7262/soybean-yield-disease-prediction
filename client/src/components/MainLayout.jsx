import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const MainLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col">
      {/* Main Content - Grows to fill space */}
      <main className="flex-1 pt-4 pb-12">
        <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-12 2xl:px-16">
          <Outlet />
        </div>
      </main>

      {/* Footer - Always at bottom */}
      <Footer />
    </div>
  );
};

export default MainLayout;
