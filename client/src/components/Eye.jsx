import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

// Define annotation interface
const annotations = {
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
    lookAt: new THREE.Vector3(-1.5, 4, 5)
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
    lookAt: new THREE.Vector3(-1.5, 4, 5)
  },
  choroid: {
    title: "Choroid",
    number : 6,
    description: "Light-sensitive layer at the back of the eye",
    position: new THREE.Vector3(-0.36, 2, 2.7),
    lookAt: new THREE.Vector3(-1, 4, 6)
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
        <div class="pin">
          <span class="number">${annotation.number || ''}</span>
        </div>
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
  
  useEffect(() => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);
    setLabelRenderer(renderer);
  
    return () => {
      document.body.removeChild(renderer.domElement);
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