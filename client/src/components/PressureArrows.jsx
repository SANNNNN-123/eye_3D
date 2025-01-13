import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PressureArrow = ({ position, rotation, scale = 1, moveDistance = 0.5 }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const initialX = position[0];
  
  // Create arrow shape
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.5, -1);
  shape.lineTo(0.2, -1);
  shape.lineTo(0.2, -2);
  shape.lineTo(-0.2, -2);
  shape.lineTo(-0.2, -1);
  shape.lineTo(-0.5, -1);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 0.2,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 3
  };

  useFrame((state) => {
    if (meshRef.current) {
      // Pulsing opacity animation
      const opacity = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2 * 0.75 + 0.25;
      materialRef.current.opacity = opacity;

      // Slight movement animation
      const movement = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.position.x = position[0] + movement;
      meshRef.current.position.y = position[1] + movement;
      meshRef.current.position.z = position[2];

    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial 
        ref={materialRef}
        color="#ff4444"
        transparent={true}
        opacity={0.8}
        side={THREE.DoubleSide}
        emissive="#ff0000"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

const PressureArrows = ({ visible }) => {
  const arrowsData = [
    { position: [0.65, 3.5, 2.5], rotation: [0, -0.5, 0], scale: 0.2, moveDistance: 0.4 },
    { position: [1, 3.3, 3], rotation: [0, -0.5, -Math.PI * 0.25], scale: 0.2, moveDistance: 0.5 },
    { position: [1, 2.5, 3], rotation: [0, -0.5, -Math.PI * 0.5], scale: 0.2, moveDistance: 0.6 },
    { position: [1, 2, 3], rotation: [0, -0.5, -Math.PI * 0.75], scale: 0.2, moveDistance: 0.5 },
    { position: [0.5, 1.8, 2.8], rotation: [0, -0.5, 3], scale: 0.2, moveDistance: 0.4 },
    { position: [0, 2, 2.5], rotation: [0, -0.5, Math.PI * 0.75], scale: 0.2, moveDistance: 0.5 },
    { position: [-0.1, 2.5, 2.5], rotation: [0, -0.5, Math.PI / 2], scale: 0.2, moveDistance: 0.6 },
    { position: [0.1, 3, 2.3], rotation: [0, -0.5, Math.PI / 4], scale: 0.2, moveDistance: 0.4 },
  ]; 

  if (!visible) return null;

  return (
    <group>
      {arrowsData.map((arrow, index) => (
        <PressureArrow 
          key={index}
          position={arrow.position}
          rotation={arrow.rotation}
          scale={arrow.scale}
          moveDistance={arrow.moveDistance}
        />
      ))}
    </group>
  );
};

export default PressureArrows;