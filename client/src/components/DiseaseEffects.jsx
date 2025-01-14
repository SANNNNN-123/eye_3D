import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// PressureArrow subcomponent
const PressureArrow = ({ position, rotation, scale = 1, moveDistance = 0.5 }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      const opacity = (Math.sin(state.clock.elapsedTime * 2) + 1) / 2 * 0.75 + 0.25;
      materialRef.current.opacity = opacity;

      const movement = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.position.x = position[0] + movement;
      meshRef.current.position.y = position[1] + movement;
      meshRef.current.position.z = position[2];
    }
  });

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

// BloodSpot component for diabetic retinopathy
const BloodSpot = ({ position, scale = 1 }) => {
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      const opacity = (Math.sin(state.clock.elapsedTime + position[0]) * 0.2) + 0.8;
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <mesh position={position} scale={[scale, scale, scale]}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#ff0000"
        transparent={true}
        opacity={0.8}
        emissive="#ff0000"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Pressure arrows group component
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

// Blood spots group for diabetic retinopathy
const BloodSpots = ({ visible }) => {
  const spotsData = [
    { position: [-0.24, 2.1, 2.5], scale: 0.8 },
    { position: [-0.4, 2.3, 2.7], scale: 1 },
    { position: [-0.1, 2.4, 2.6], scale: 0.9 },
    { position: [-0.28, 3.0, 2.28], scale: 1.2 },
    { position: [-0.5, 2.2, 2.5], scale: 0.7 },
    { position: [-0.2, 1.9, 2.6], scale: 1.1 },
    { position: [-0.4, 1.8, 2.8], scale: 0.8 },
    { position: [-0.1, 2.2, 2.5], scale: 1 },
    { position: [-0.3, 2.5, 2.7], scale: 0.9 },
    { position: [-0.5, 2.3, 2.6], scale: 1.2 }
  ];

  if (!visible) return null;

  return (
    <group>
      {spotsData.map((spot, index) => (
        <BloodSpot
          key={index}
          position={spot.position}
          scale={spot.scale}
        />
      ))}
    </group>
  );
};

// Main DiseaseEffects component
const DiseaseEffects = ({ modelScene, activeConditions }) => {
  // Handle cataract effect
  useEffect(() => {
    if (modelScene) {
      modelScene.traverse((node) => {
        if (node.name === 'Lens_Lens_0') {
          if (activeConditions?.cataract) {
            node.material = new THREE.MeshStandardMaterial({
              color: '#CD853F',
              roughness: 0.7,
              metalness: 0.3,
              transparent: true,
              opacity: 0.8
            });
          } else {
            node.material = new THREE.MeshStandardMaterial({
              color: '#FFFFFF',
              roughness: 0.2,
              metalness: 0.1,
              transparent: true,
              opacity: 0.6
            });
          }
        }
      });
    }
  }, [activeConditions?.cataract, modelScene]);

  return (
    <>
      <PressureArrows visible={activeConditions?.glaucoma} />
      <BloodSpots visible={activeConditions?.['diabetic-retinopathy']} />
    </>
  );
};

export default DiseaseEffects;