import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Code, Users, Share2, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 md:px-8 py-16">
          {/* Brand Section */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="p-2 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/30 transition-all duration-300">
                <Leaf size={20} className="text-emerald-400" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">
                SoybeanAI
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Advanced AI-powered solutions for soybean crop management, disease
              detection, and yield prediction.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-all duration-300"
                aria-label="GitHub"
              >
                <Code size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Users size={18} />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition-all duration-300"
                aria-label="Share"
              >
                <Share2 size={18} />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-white text-base">Product</h3>
            <nav className="flex flex-col gap-4">
              <Link
                to="/dashboard"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/yield"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Yield Predictor
              </Link>
              <Link
                to="/disease"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Disease Detector
              </Link>
              <Link
                to="/history"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Prediction History
              </Link>
            </nav>
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-white text-base">Resources</h3>
            <nav className="flex flex-col gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Documentation
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                API Reference
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                Support
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                FAQ
              </a>
            </nav>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-6">
            <h3 className="font-semibold text-white text-base">Get in Touch</h3>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:support@soybeanai.com"
                className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                <Mail size={16} />
                <span>support@soybeanai.com</span>
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-3 text-slate-400 hover:text-emerald-400 transition-colors text-sm"
              >
                <Phone size={16} />
                <span>+1 (234) 567-890</span>
              </a>
              <div className="flex items-center gap-3 text-slate-400 text-sm pt-2">
                <MapPin size={16} className="flex-shrink-0" />
                <span>Innovation Hub, Tech City</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 px-6 md:px-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-6 md:px-8 py-8">
          <div className="text-slate-500 text-sm">
            &copy; {currentYear} SoybeanAI. All rights reserved.
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <span className="text-slate-700">•</span>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <span className="text-slate-700">•</span>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
