import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useControls, folder } from 'leva';
import { Html } from '@react-three/drei';

// Annotation Bubble Component
const AnnotationBubble = ({ number, name, position }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} occlude>
      <div 
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Bubble */}
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer transform transition-transform hover:scale-110">
          <span className="text-white text-sm font-bold">{number}</span>
        </div>
        
        {/* Tooltip */}
        {hovered && (
          <div className="absolute left-8 top-0 bg-gray-900 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            {name}
          </div>
        )}
      </div>
    </Html>
  );
};

export function Eye() {
  const groupRef = useRef();
  const { nodes, materials, scene } = useGLTF('/anatomy_of_the_eye-v1.glb');
  const [annotations, setAnnotations] = useState([]);

  // Model controls
  const modelControls = useControls({
    Transform: folder({
      position: { 
        value: { x: 3, y: 18, z: -150 }, 
        step: 0.1,
        render: () => false // Hide from GUI since we want fixed values
      },
      rotation: { 
        value: { x: 0, y: 0, z: 0 }, 
        step: 0.1 
      },
      scale: { 
        value: 0.1, 
        min: 0.1, 
        max: 10, 
        step: 0.1,
        render: () => false // Hide from GUI since we want fixed values
      }
    })
  });

  // Light controls
  const lightControls = useControls({
    Lighting: folder({
      ambientIntensity: { value: 0.8, min: 0, max: 2, step: 0.1 },
      directionalIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
      directionalPosition: { 
        value: { x: 10, y: 11, z: 7 },
        step: 0.1
      }
    })
  });

  // Generate annotations from nodes
  useEffect(() => {
    if (nodes) {
      console.log('Available nodes:', nodes);
      const nodeAnnotations = Object.entries(nodes)
        .filter(([name, node]) => {
          const hasGeometryAndMaterial = node.geometry && node.material;
          console.log(`Node ${name}:`, {
            hasGeometry: !!node.geometry,
            hasMaterial: !!node.material,
            position: node.position,
            willBeAnnotated: hasGeometryAndMaterial
          });
          return hasGeometryAndMaterial;
        })
        .map(([name, node], index) => {
          const annotation = {
            id: index + 1,
            name: name,
            position: [
              (node.position?.x || 0) * modelControls.scale,
              (node.position?.y || 0) * modelControls.scale,
              (node.position?.z || 0) * modelControls.scale
            ]
          };
          console.log(`Created annotation for ${name}:`, annotation);
          return annotation;
        });
  
      console.log('Final annotations:', nodeAnnotations);
      setAnnotations(nodeAnnotations);
    }
  }, [nodes, modelControls.scale]);

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={lightControls.ambientIntensity} />
      <directionalLight 
        intensity={lightControls.directionalIntensity}
        position={[
          lightControls.directionalPosition.x,
          lightControls.directionalPosition.y,
          lightControls.directionalPosition.z
        ]}
        castShadow
      />

      {/* Model */}
      <primitive 
        ref={groupRef}
        object={scene} 
        position={[
          modelControls.position.x,
          modelControls.position.y,
          modelControls.position.z
        ]}
        rotation={[
          modelControls.rotation.x,
          modelControls.rotation.y,
          modelControls.rotation.z
        ]}
        scale={modelControls.scale}
      />

      {/* Annotations */}
      {annotations.map((annotation) => {
      console.log(`Rendering annotation ${annotation.id}:`, annotation);
      return (
        <AnnotationBubble
          key={annotation.id}
          number={annotation.id}
          name={annotation.name}
          position={annotation.position}
        />
      );
    })}
    </>
  );
}

useGLTF.preload('/anatomy_of_the_eye-v1.glb');