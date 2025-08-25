import React from "react";
import { Link } from "react-router-dom";

const FrontPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-gray-900 text-white px-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border border-white/20">
        <div className="flex flex-col items-center">
          <img
            src="/vite.svg"
            alt="Project Logo"
            className="w-20 h-20 mb-6 drop-shadow-lg"
          />
          <h1 className="text-4xl font-extrabold mb-4 text-center tracking-wide">
            NeuroForge AI
          </h1>
    <p className="text-2xl mb-8 text-center font-light tracking-wide leading-relaxed">
  <span className="inline-flex items-center justify-center gap-3 animate-fade-in">
    <span className="relative flex items-center">
      <svg className="w-8 h-8 text-purple-400 drop-shadow-glow animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <polygon points="12,3 14.9,9 22,9.3 16.5,13.7 18.6,20.5 12,16.8 5.4,20.5 7.5,13.7 2,9.3 9.1,9" stroke="currentColor" stroke-width="2" fill="#a78bfa" />
        <path stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8M12 8v8" />
      </svg>
      <span className="absolute inset-0 rounded-full blur-lg opacity-40 bg-purple-400 animate-glow"></span>
    </span>
    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold typewriter">
      Transform your ideas into reality
    </span>
    <span className="text-gray-10">—</span>
  </span>
    
</p>

<p className="text-lg mb-8 text-center text-gray-200 animate-fade-in delay-300">
  <span className="font-bold text-purple-300">Collaborate, create, and manage your projects with AI Developer.</span><br />
  <span className="text-blue-200">Experience real-time teamwork, seamless project management, and powerful tools for developers.</span>
</p>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition"
            >
              Get Started
            </Link>
            
          </div>
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-sm text-center">
        &copy; {new Date().getFullYear()} Edit-AI Developer. All rights reserved.
      </footer>
    </div>
  );
};

export default FrontPage;