import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, 
  Grid,
  Environment,
  PerspectiveCamera
} from '@react-three/drei';
import { useControls, folder } from 'leva';
import { Eye } from './Eye';

const EyeCanvas = () => {
  const cameraControls = useControls({
    Camera: folder({
      fov: { value: 50, min: 10, max: 100, step: 1 },
      near: { value: 0.1, min: 0.1, max: 10, step: 0.1 },
      far: { value: 1000, min: 100, max: 2000, step: 100 },
      position: {
        value: { x: -2, y: 5, z: 12 },
        step: 0.1
      }
    }),
    OrbitControls: folder({
      enableDamping: true,
      dampingFactor: { value: 0.05, min: 0.01, max: 0.1, step: 0.01 },
      enableZoom: true,
      autoRotate: false,
      autoRotateSpeed: { value: 2.0, min: 0.1, max: 10, step: 0.1 }
    })
  });

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        className="w-full h-full"
        camera={{
          fov: cameraControls.fov,
          near: cameraControls.near,
          far: cameraControls.far,
          position: [
            cameraControls.position.x,
            cameraControls.position.y,
            cameraControls.position.z
          ]
        }}
      >
        <color attach="background" args={['#1f2937']} />
        
        <OrbitControls
          enableDamping={cameraControls.enableDamping}
          dampingFactor={cameraControls.dampingFactor}
          enableZoom={cameraControls.enableZoom}
          autoRotate={cameraControls.autoRotate}
          autoRotateSpeed={cameraControls.autoRotateSpeed}
        />

        <Grid 
          args={[30, 30]} 
          cellColor="#6b7280"
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
        />
        
        <Suspense fallback={null}>
          <Eye />
          <Environment preset="studio" />
        </Suspense>

        {/* Loading overlay */}
      </Canvas>

      {/* Optional loading indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Suspense fallback={
          <div className="text-white bg-gray-800 bg-opacity-75 px-4 py-2 rounded-md">
            Loading model...
          </div>
        }>
          <></>
        </Suspense>
      </div>
    </div>
  );
};

export default EyeCanvas;