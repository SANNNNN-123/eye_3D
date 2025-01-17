// EyeCanvas.jsx
import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid,
  Environment,
  PerspectiveCamera
} from '@react-three/drei';
import { useControls, folder } from 'leva';
import { Eye } from './Eye';
import NavigationControls, { annotations } from './Annotations';
import DiseaseControl from './DiseaseControl';
import { Info } from 'lucide-react';

const Disclaimer = () => (
  <div className="absolute bottom-4 right-4 z-50">
    <div className="bg-gray-900 p-3 rounded-lg shadow-lg flex items-center gap-2">
      <Info className="w-4 h-4 text-blue-600" />
      <div className="text-xs">
        <span className="text-gray-400">Made by </span>
        <span className="text-white font-medium">ZUHAIR</span>
        <span className="text-gray-400 ml-2">v1.10</span>
      </div>
    </div>
  </div>
);

const CameraInstructions = () => (
  <div className="absolute bottom-4 left-4 z-50">
    <div className="bg-gray-900 p-3 rounded-lg shadow-lg">
      <div className="text-xs space-y-1">
        <div className="text-gray-400 flex items-center gap-1.5">
          <span className="text-white font-medium">Drag</span>
           to move camera</div>
        <div className="text-gray-400 flex items-center gap-1.5">
          <span className="text-white font-medium">Scroll</span>
           to zoom in and out</div>
      </div>
    </div>
  </div>
);

const EyeCanvas = () => {
  const eyeRef = useRef();
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeConditions, setActiveConditions] = useState({
    glaucoma: false,
    cataract: false,
    'diabetic-retinopathy': false,
    blepharitis: false,
    conjunctivitis: false,
    'dry-amd': false,
    keratoconus: false,
    floaters: false,
    'subconj-haems': false
  });

  const handleAnnotationClick = (annotation) => {
    setActiveAnnotation(annotation);
    eyeRef.current = annotation;
  };

  const handleAnnotationSelect = (annotation) => {
    setActiveAnnotation(annotation);
    if (eyeRef.current?.handleAnnotationClick) {
      eyeRef.current.handleAnnotationClick(annotation);
    }
  };

  const handleDiseaseToggle = (diseaseId, isActive) => {
    setActiveConditions(prev => ({
      ...prev,
      [diseaseId]: isActive
    }));
  };

  return (
    <div className="w-full h-full relative">
      <DiseaseControl 
        showAnnotations={showAnnotations}
        onToggleAnnotations={setShowAnnotations}
        onToggleDisease={handleDiseaseToggle}
      />

      <Canvas
        gl={{ antialias: true }}
        shadows
        className="w-full h-full"
        camera={{
          fov: 34,
          near: 0.1,
          far: 1000,
          position: [-1,7,11]
        }}
      >
        <color attach="background" args={['#AECDFE']} />
        
          {/* //1f2937 */}

        <OrbitControls
          enableDamping={true}
          dampingFactor={0.05}
          enableZoom={true}
          autoRotate={false}
          autoRotateSpeed={2.0}
          maxDistance={14}
          minDistance={6}
          target={[0, 0, 0]}
        />

        {/* <Grid 
          args={[30, 30]} 
          cellColor="#6b7280"
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
        /> */}
        
        <Suspense fallback={null}>
          <Eye 
            ref={eyeRef}
            onAnnotationClick={handleAnnotationClick} 
            showAnnotations={showAnnotations}
            activeConditions={activeConditions}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
      
      <NavigationControls 
        onAnnotationSelect={handleAnnotationSelect}
        onAnnotationFocus={handleAnnotationClick}
        activeAnnotation={activeAnnotation}
        activeConditions={activeConditions}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Suspense fallback={
          <div className="text-white bg-gray-800 bg-opacity-75 px-4 py-2 rounded-md">
            Loading model...
          </div>
        }>
          <></>
        </Suspense>
      </div>
      <CameraInstructions />
      <Disclaimer />
    </div>
  );
};

export default EyeCanvas;