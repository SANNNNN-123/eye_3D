import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

const ModelViewer = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const guiRef = useRef(null);
  const lightsRef = useRef({});

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xA3A3A3);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // Grid
    const grid = new THREE.GridHelper(30, 30);
    scene.add(grid);

    // Lights setup
    const lights = {
      ambient: new THREE.AmbientLight(0xededed, 0.8),
      directional: new THREE.DirectionalLight(0xFFFFFF, 1),
      point: new THREE.PointLight(0xFFFFFF, 1),
      spot: new THREE.SpotLight(0xFFFFFF, 1)
    };

    lights.directional.position.set(10, 11, 7);
    lights.directional.castShadow = true;
    lights.point.position.set(-5, 5, 5);
    lights.spot.position.set(0, 10, 0);
    lights.spot.angle = Math.PI / 4;
    lights.spot.castShadow = true;

    // Store lights in ref for GUI access
    lightsRef.current = lights;

    // Add lights to scene
    Object.values(lights).forEach(light => scene.add(light));

    // GUI setup
    const gui = new dat.GUI();
    guiRef.current = gui;

    // Model loading
    const assetLoader = new GLTFLoader();
    assetLoader.load(
      '/anatomy_of_the_eye-v1.glb',
      function(gltf) {
        const model = gltf.scene;
        model.traverse(function(child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        scene.add(model);
        
        // Model position controls
        const modelControls = {
          positionX: 0,
          positionY: 0,
          positionZ: 0,
          rotationY: 0,
          scale: 1
        };

        const modelFolder = gui.addFolder('Model Transform');
        modelFolder.add(modelControls, 'positionX', -100, 100).onChange((value) => {
          model.position.x = value;
        });
        modelFolder.add(modelControls, 'positionY', -100, 100).onChange((value) => {
          model.position.y = value;
        });
        modelFolder.add(modelControls, 'positionZ', -1000, 1000).onChange((value) => {
          model.position.z = value;
        });
        modelFolder.add(modelControls, 'scale', 0.1, 10).onChange((value) => {
          model.scale.set(value, value, value);
        });
        modelFolder.open();

        // Lighting controls
        const lightingFolder = gui.addFolder('Lighting');
        
        // Ambient Light
        const ambientFolder = lightingFolder.addFolder('Ambient Light');
        ambientFolder.add(lights.ambient, 'intensity', 0, 2).name('Intensity');
        ambientFolder.addColor({ color: lights.ambient.color.getHex() }, 'color')
          .onChange(value => lights.ambient.color.setHex(value));
        
        // Directional Light
        const directionalFolder = lightingFolder.addFolder('Directional Light');
        directionalFolder.add(lights.directional, 'intensity', 0, 2).name('Intensity');
        directionalFolder.add(lights.directional.position, 'x', -20, 20);
        directionalFolder.add(lights.directional.position, 'y', -20, 20);
        directionalFolder.add(lights.directional.position, 'z', -20, 20);
        directionalFolder.add(lights.directional, 'castShadow');
        directionalFolder.addColor({ color: lights.directional.color.getHex() }, 'color')
          .onChange(value => lights.directional.color.setHex(value));

        // Point Light
        const pointFolder = lightingFolder.addFolder('Point Light');
        pointFolder.add(lights.point, 'intensity', 0, 2).name('Intensity');
        pointFolder.add(lights.point.position, 'x', -20, 20);
        pointFolder.add(lights.point.position, 'y', -20, 20);
        pointFolder.add(lights.point.position, 'z', -20, 20);
        pointFolder.add(lights.point, 'decay', 0, 2);
        pointFolder.addColor({ color: lights.point.color.getHex() }, 'color')
          .onChange(value => lights.point.color.setHex(value));

        // Spot Light
        const spotFolder = lightingFolder.addFolder('Spot Light');
        spotFolder.add(lights.spot, 'intensity', 0, 2).name('Intensity');
        spotFolder.add(lights.spot.position, 'x', -20, 20);
        spotFolder.add(lights.spot.position, 'y', -20, 20);
        spotFolder.add(lights.spot.position, 'z', -20, 20);
        spotFolder.add(lights.spot, 'angle', 0, Math.PI / 2);
        spotFolder.add(lights.spot, 'penumbra', 0, 1);
        spotFolder.add(lights.spot, 'decay', 0, 2);
        spotFolder.add(lights.spot, 'castShadow');
        spotFolder.addColor({ color: lights.spot.color.getHex() }, 'color')
          .onChange(value => lights.spot.color.setHex(value));

        lightingFolder.open();

        // Camera controls
        const cameraFolder = gui.addFolder('Camera');
        const cameraControls = {
          fov: 45,
          near: 0.1,
          far: 1000,
          reset: () => {
            camera.position.set(10, 10, 10);
            camera.lookAt(0, 0, 0);
            controls.reset();
          }
        };

        cameraFolder.add(cameraControls, 'fov', 10, 100).onChange((value) => {
          camera.fov = value;
          camera.updateProjectionMatrix();
        });
        cameraFolder.add(cameraControls, 'near', 0.1, 10).onChange((value) => {
          camera.near = value;
          camera.updateProjectionMatrix();
        });
        cameraFolder.add(cameraControls, 'far', 100, 2000).onChange((value) => {
          camera.far = value;
          camera.updateProjectionMatrix();
        });
        cameraFolder.add(cameraControls, 'reset');
        cameraFolder.open();

        // Orbit controls folder
        const orbitFolder = gui.addFolder('Orbit Controls');
        const orbitControls = {
          enableDamping: true,
          dampingFactor: 0.05,
          enableZoom: true,
          autoRotate: false,
          autoRotateSpeed: 2.0
        };

        orbitFolder.add(orbitControls, 'enableDamping').onChange((value) => {
          controls.enableDamping = value;
        });
        orbitFolder.add(orbitControls, 'dampingFactor', 0.01, 0.1).onChange((value) => {
          controls.dampingFactor = value;
        });
        orbitFolder.add(orbitControls, 'enableZoom').onChange((value) => {
          controls.enableZoom = value;
        });
        orbitFolder.add(orbitControls, 'autoRotate').onChange((value) => {
          controls.autoRotate = value;
        });
        orbitFolder.add(orbitControls, 'autoRotateSpeed', 0.1, 10).onChange((value) => {
          controls.autoRotateSpeed = value;
        });
        orbitFolder.open();
      },
      undefined,
      function(error) {
        console.error('Error loading model:', error);
      }
    );

    // Animation loop
    function animate() {
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
    renderer.setAnimationLoop(animate);

    // Window resize handler
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      gui.destroy();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ModelViewer;