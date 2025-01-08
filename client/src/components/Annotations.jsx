import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define annotations
export const annotations = {
    retina: {
        title: "Retina",
        number : 6,
        description: "Light-sensitive layer at the back of the eye",
        position: new THREE.Vector3(-0.36, 2, 2.7),
        lookAt: new THREE.Vector3(-1, 4, 6)
      },
      cornea: {
        title: "Cornea",
        number : 1,
        description: "Clear front layer of the eye",
        position: new THREE.Vector3(1.64, 2.7, 3.6),
        lookAt: new THREE.Vector3(-1.5, 5, 9)
      },
      lens: {
        title: "Lens",
        number : 3,
        description: "Focuses light onto the retina",
        position: new THREE.Vector3(1, 2.4, 3.2),
        lookAt: new THREE.Vector3(-2, 4, 5)
      },
      conjuctiva: {
        title: "Conjuctiva",
        number : 4,
        description: "Do something",
        position: new THREE.Vector3(1.5, 1.7, 3.5),
        lookAt: new THREE.Vector3(-1.5, 4, 5)
      },
      sclera: {
        title: "Sclera",
        number : 5,
        description: "Do something",
        position: new THREE.Vector3(1, 3.50, 2.8),
        lookAt: new THREE.Vector3(-1.5, 5, 5)
      },
      choroid: {
        title: "Choroid",
        number : 7,
        description: "Light-sensitive layer at the back of the eye",
        position: new THREE.Vector3(-0.45, 2.87, 2.4),
        lookAt: new THREE.Vector3(-2, 5, 5)
      },
      iris: {
        title: "Iris",
        number : 8,
        description: "Do something",
        position: new THREE.Vector3(1.43, 2.6, 3.3),
        lookAt: new THREE.Vector3(-1.5, 4, 5)
      },
      opticnerve: {
        title: "Optic Nerve",
        number : 9,
        description: "Do something",
        position: new THREE.Vector3(-0.66, 2.2, 1.6),
        lookAt: new THREE.Vector3(-1, 4, 6)
      }
    
};

const NavigationControls = ({ onAnnotationSelect, onAnnotationFocus, activeAnnotation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const annotationArray = Object.values(annotations).sort((a, b) => a.number - b.number);

    // Update currentIndex when activeAnnotation changes
    useEffect(() => {
        if (activeAnnotation) {
        const newIndex = annotationArray.findIndex(
            annotation => annotation.number === activeAnnotation.number
        );
        if (newIndex !== -1) {
            setCurrentIndex(newIndex);
        }
        }
    }, [activeAnnotation]);
    
    const navigateAnnotation = (direction) => {
      const newIndex = direction === 'next' 
        ? (currentIndex + 1) % annotationArray.length
        : (currentIndex - 1 + annotationArray.length) % annotationArray.length;
      setCurrentIndex(newIndex);
      const selectedAnnotation = annotationArray[newIndex];
      onAnnotationSelect(selectedAnnotation);
      onAnnotationFocus(selectedAnnotation); // Trigger the annotation focus/display
    };
  
    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.key === 'ArrowLeft') {
          navigateAnnotation('prev');
        } else if (e.key === 'ArrowRight') {
          navigateAnnotation('next');
        }
      };
  
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentIndex]);
  
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-gray-900 py-2 px-3 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigateAnnotation('prev')}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-blue-500"
              aria-label="Previous annotation"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="px-3 text-white font-medium min-w-[160px] text-center">
              {annotationArray[currentIndex]?.title || 'Loading...'}
            </div>
            
            <button 
              onClick={() => navigateAnnotation('next')}
              className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-blue-500"
              aria-label="Next annotation"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default NavigationControls;