import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Define annotation interface
const annotations = {
  retina: {
    title: "Retina",
    number : 1,
    description: "Light-sensitive layer at the back of the eye",
    position: new THREE.Vector3(-0.5, 2, 2.7),
    lookAt: new THREE.Vector3(3, 18, -150)
  },
  cornea: {
    title: "Cornea",
    description: "Clear front layer of the eye",
    position: new THREE.Vector3(1.64, 2.7, 3.6),
    lookAt: new THREE.Vector3(3, 18, -150)
  },
  lens: {
    title: "Lens",
    description: "Focuses light onto the retina",
    position: new THREE.Vector3(1, 2.4, 3.2),
    lookAt: new THREE.Vector3(3, 18, -150)
  }
};

// Annotation Marker Component
const AnnotationMarker = ({ annotation, onClick }) => {
  const markerRef = useRef();
  
  useEffect(() => {
    if (markerRef.current) {
      // Create label element
      const labelDiv = document.createElement('div');
      labelDiv.className = 'annotation-label';
      labelDiv.innerHTML = `
        <div class="marker">
          <div class="pin"></div>
          <div class="pulse"></div>
        </div>
        <div class="content">
          <h3>${annotation.title}</h3>
          <p>${annotation.description}</p>
        </div>
      `;
      
      // Create CSS2D object
      const label = new CSS2DObject(labelDiv);
      label.position.copy(annotation.position);
      markerRef.current.add(label);

      // Add click handler
      labelDiv.addEventListener('click', () => onClick(annotation));
      
      return () => {
        markerRef.current.remove(label);
        labelDiv.remove();
      };
    }
  }, [annotation, onClick]);

  return <group ref={markerRef} />;
};

export function Eye() {
  const groupRef = useRef();
  const { scene, camera, gl } = useThree();
  const { scene: modelScene } = useGLTF('/anatomy_of_the_eye-v1.glb');
  const [labelRenderer, setLabelRenderer] = useState(null);
  
  // Initialize CSS2DRenderer
  useEffect(() => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);
    setLabelRenderer(renderer);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .annotation-label {
        pointer-events: auto;
        cursor: pointer;
      }
      .marker {
        position: relative;
        width: 24px;
        height: 24px;
      }
      .pin {
        width: 12px;
        height: 12px;
        background: #4a90e2;
        border: 2px solid white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .pulse {
        width: 24px;
        height: 24px;
        background: rgba(74, 144, 226, 0.3);
        border-radius: 50%;
        position: absolute;
        animation: pulse 2s infinite;
      }
      .content {
        display: none;
        position: absolute;
        left: 30px;
        top: -10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        width: max-content;
        max-width: 200px;
      }
      .annotation-label:hover .content {
        display: block;
      }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.3; }
        70% { transform: scale(2); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(renderer.domElement);
      document.head.removeChild(style);
    };
  }, []);

  // Handle annotation click
  const handleAnnotationClick = (annotation) => {
    // Animate camera to look at annotation
    const targetPosition = annotation.lookAt.clone();
    const startPosition = camera.position.clone();
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
      
      camera.position.lerpVectors(startPosition, targetPosition, progress);
      camera.lookAt(annotation.lookAt);
    };

    animate();
  };

  // Render labels
  useFrame(() => {
    if (labelRenderer) {
      labelRenderer.render(scene, camera);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={modelScene} 
        position={[3, 18, -150]}
        scale={0.1}
      />
      
      {Object.entries(annotations).map(([key, annotation]) => (
        <AnnotationMarker
          key={key}
          annotation={annotation}
          onClick={handleAnnotationClick}
        />
      ))}
    </group>
  );
}

useGLTF.preload('/anatomy_of_the_eye-v1.glb');