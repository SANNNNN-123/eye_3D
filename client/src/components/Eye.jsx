// Eye.jsx
import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, Html } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import NavigationControls, { annotations } from './Annotations';
import PressureArrows from './PressureArrows';
import * as THREE from 'three';

// Annotation Marker Component
const AnnotationMarker = ({ annotation, onClick, camera, isActive, visible }) => {
  const markerRef = useRef();
  const labelRef = useRef();
  
  useEffect(() => {
    if (markerRef.current && visible) {
      const labelDiv = document.createElement('div');
      labelDiv.className = 'annotation-label';
      labelDiv.innerHTML = `
        <div class="marker ${isActive ? 'active' : ''}">
          <div class="pin">
            <span class="number">${annotation.number || ''}</span>
          </div>
          <div class="pulse"></div>
        </div>
        <div class="content ${isActive ? 'show' : ''}">
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
  }, [annotation, onClick, isActive, visible]);

  useFrame(() => {
    if (labelRef.current && camera) {
      const distance = camera.position.distanceTo(annotation.position);
      const scale = Math.max(distance / 10, 1);
      labelRef.current.element.style.transform = `scale(${1/scale})`;
      
      // Update visibility
      if (labelRef.current.element) {
        labelRef.current.element.style.display = visible ? 'block' : 'none';
      }
    }
  });

  return <group ref={markerRef} />;
};

export const Eye = forwardRef(({ onAnnotationClick, showAnnotations = true, activeConditions }, ref) => {
  const groupRef = useRef();
  const { scene, camera, gl } = useThree();
  const { scene: modelScene } = useGLTF('/output.glb');
  const [labelRenderer, setLabelRenderer] = useState(null);
  const [activeAnnotation, setActiveAnnotation] = useState(null);

  // Add useEffect to handle material changes
  useEffect(() => {
    if (modelScene) {
      modelScene.traverse((node) => {
        if (node.name === 'Lens_Lens_0') {
          // Create a new material if cataract is active
          if (activeConditions?.cataract) {
            node.material = new THREE.MeshStandardMaterial({
              color: '#CD853F', //yellowish-brown
              roughness: 0.7,
              metalness: 0.3,
              transparent: true,
              opacity: 0.8
            });
          } else {
            node.material = new THREE.MeshStandardMaterial({
              color: '#FFFFFF', // Original color
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


  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleAnnotationClick: handleAnnotationClick
  }));

  useEffect(() => {
    const renderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.pointerEvents = 'none';
    document.body.appendChild(renderer.domElement);
    setLabelRenderer(renderer);

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
    if (!showAnnotations) return; // Prevent interaction when annotations are hidden
    
    setActiveAnnotation(annotation);
    if (!annotation) return;

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
      camera.lookAt(annotation.position);
    };

    animate();
    
    if (onAnnotationClick) {
      onAnnotationClick(annotation);
    }
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
      
      <PressureArrows visible={activeConditions?.glaucoma} />
      
      {Object.entries(annotations).map(([key, annotation]) => (
        <AnnotationMarker
          key={key}
          annotation={annotation}
          onClick={handleAnnotationClick}
          camera={camera}
          isActive={activeAnnotation?.number === annotation.number}
          visible={showAnnotations}
        />
      ))}
    </group>
  );
});

// useGLTF.preload('/anatomy_of_the_eye-v1.glb');