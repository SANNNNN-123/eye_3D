import React, { useState, memo } from 'react';
import { ChevronDown, ChevronUp, Eye, CircleDot, Activity, Droplets, Sun, Triangle, AlertCircle, Heart, Info } from 'lucide-react';

const DiseaseControl = ({ showAnnotations, onToggleAnnotations, onToggleDisease }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  const diseases = [
    {
      id: 'glaucoma',
      name: 'Glaucoma',
      description: 'Increased pressure in the eye',
      icon: Eye,
    },
    {
      id: 'cataract',
      name: 'Cataract',
      description: 'Clouding of the eye\'s lens',
      icon: CircleDot,
    },
    {
      id: 'diabetic-retinopathy',
      name: 'Diabetic Retinopathy',
      description: 'Damage to blood vessels in the retina',
      icon: Activity,
    },
    {
      id: 'blepharitis',
      name: 'Blepharitis',
      description: 'Inflammation of the eyelids',
      icon: Droplets,
    },
    {
      id: 'conjunctivitis',
      name: 'Conjunctivitis',
      description: 'Inflammation of the conjunctiva',
      icon: AlertCircle,
    },
    {
      id: 'dry-amd',
      name: 'Dry AMD',
      description: 'Age-related macular degeneration',
      icon: Sun,
    },
    {
      id: 'keratoconus',
      name: 'Keratoconus',
      description: 'Thinning of the cornea',
      icon: Triangle,
    },
    {
      id: 'floaters',
      name: 'Floaters',
      description: 'Spots in field of vision',
      icon: CircleDot,
    },
    {
      id: 'subconj-haems',
      name: 'Subconj Haems',
      description: 'Bleeding under conjunctiva',
      icon: Heart,
    }
  ];

  return (
    <div className="absolute left-4 top-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-lg w-72">
        {/* Header with toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 flex items-center justify-between text-white hover:bg-blue-900 rounded-t-lg transition-colors"
        >
          <span className="font-medium">Opthal Controls</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {/* Collapsible content */}
        {isOpen && (
          <div className="p-4 border-t border-gray-800">
            {/* Annotations toggle */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Annotations</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showAnnotations}
                  onChange={(e) => onToggleAnnotations(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:bg-blue-600
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 
                            after:transition-all">
                </div>
              </label>
            </div>

            {/* Disease controls */}
            <div className="space-y-2 h-[270px] overflow-y-auto pr-2 
              [&::-webkit-scrollbar]:w-[6px]
              [&::-webkit-scrollbar-track]:bg-gray-800
              [&::-webkit-scrollbar-track]:rounded-[3px]
              [&::-webkit-scrollbar-thumb]:bg-blue-600
              [&::-webkit-scrollbar-thumb]:rounded-[3px]
              [&::-webkit-scrollbar-thumb:hover]:bg-blue-500"
            >
              {diseases.map((disease) => (
                <div
                  key={disease.id}
                  className="flex items-center justify-between bg-gray-800 p-2.5 rounded-lg hover:bg-blue-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <disease.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <div className="text-white text-sm font-medium">
                        {disease.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {disease.description}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      onChange={(e) => onToggleDisease(disease.id, e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer 
                                peer-checked:after:translate-x-full peer-checked:bg-blue-600
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                after:bg-white after:rounded-full after:h-4 after:w-4 
                                after:transition-all">
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseControl;