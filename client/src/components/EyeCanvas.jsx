import React, { Suspense, useState, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import * as THREE from 'three'
import Eye from './Eye'

const Scene = ({ clippingDistance }) => {
  const { gl } = useThree()
  
  // Enable clipping in the renderer
  React.useEffect(() => {
    gl.localClippingEnabled = true
  }, [gl])

  // Create clipping plane
  const clippingPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), clippingDistance)

  return (
    <Stage
      environment="studio"
      intensity={1}
      preset="rembrandt"
      adjustCamera={false}
    >
      <Eye clippingPlanes={[clippingPlane]} />
    </Stage>
  )
}

const EyeCanvas = () => {
  const [clippingDistance, setClippingDistance] = useState(0)

  const handleCameraChange = useCallback((e) => {
    const distance = e.target.getDistance();

    // No clipping when zoomed out (distance >= 3)
    if (distance >= 2) {
      setClippingDistance(0);
    } else {
      // Start clipping as you zoom in (distance < 3)
      const clipAmount = ((3 - distance) / 2.5) * 1; // Map [3, 0.5] to [0, 2]
      setClippingDistance(clipAmount);
    }
  }, []);


  return (
    <Canvas
      shadows
      camera={{ 
        position: [-4, 4, 4],
        fov: 1.2,
        near: 0.1,
        far: 1000
      }}
      style={{
        width: '100%',
        height: '100%',
        background: '#151515'
      }}
    >
      <Suspense fallback={null}>
        <Scene clippingDistance={clippingDistance} />
      </Suspense>

      <OrbitControls 
        enableZoom={true}
        maxDistance={10}
        minDistance={0.5}
        target={[0, 0, 0]}
        makeDefault
        onChange={handleCameraChange}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </Canvas>
  )
}

export default EyeCanvas