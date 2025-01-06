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

// Annotation Marker Component
const AnnotationMarker = ({ annotation, onClick, camera }) => {
  const markerRef = useRef();
  const labelRef = useRef();
  
  useEffect(() => {
    if (markerRef.current) {
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
      
      const label = new CSS2DObject(labelDiv);
      label.position.copy(annotation.position);
      labelRef.current = label;
      markerRef.current.add(label);

      labelDiv.addEventListener('click', () => onClick(annotation));
      
      return () => {
        markerRef.current.remove(label);
        labelDiv.remove();
      };
    }
  }, [annotation, onClick]);

  // Update label scale based on camera distance
  useFrame(() => {
    if (labelRef.current && camera) {
      const distance = camera.position.distanceTo(annotation.position);
      const scale = Math.max(distance / 10, 1); // Adjust divisor to control scaling
      labelRef.current.element.style.transform = `scale(${1/scale})`;
    }
  });

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

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
  
    return () => {
      document.body.removeChild(renderer.domElement);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleAnnotationClick = (annotation) => {
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
          camera={camera}
        />
      ))}
    </group>
  );
}

useGLTF.preload('/anatomy_of_the_eye-v1.glb');