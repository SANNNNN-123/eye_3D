import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen relative">
      {/* Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/edit_2.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center h-screen text-white px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            OCULARIS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl text-center">
            Explore the intricate world of human eye anatomy through our interactive 3D visualization
          </p>
          <button 
            onClick={() => navigate('/model')}
            className="group bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-300 flex items-center gap-3 hover:scale-105"
          >
            Launch 3D Model
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;