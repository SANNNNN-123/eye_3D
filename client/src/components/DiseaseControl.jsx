import React from 'react';
import { Eye, CircleDot, Activity, EyeOff } from 'lucide-react';

const DiseaseControl = ({ onToggleDisease }) => {
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
      icon: EyeOff,
    },
    {
      id: 'diabetic-retinopathy',
      name: 'Diabetic Retinopathy',
      description: 'Damage to blood vessels in the retina',
      icon: Activity,
    }
  ];

  return (
    <div className="absolute left-4 top-24 z-50">
      <div className="bg-gray-900 p-4 rounded-lg shadow-lg w-72">
        <h3 className="text-white font-medium mb-4">Eye Conditions</h3>
        <div className="space-y-3">
          {diseases.map((disease) => (
            <div
              key={disease.id}
              className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <disease.icon className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-white text-sm font-medium">
                    {disease.name}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {disease.description}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  onChange={(e) => onToggleDisease(disease.id, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:bg-blue-600
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:rounded-full after:h-5 after:w-5 
                            after:transition-all">
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiseaseControl;