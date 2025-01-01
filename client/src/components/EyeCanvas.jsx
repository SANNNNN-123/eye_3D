import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Eye from './Eye'

const Fallback = () => (
  <mesh>
    <sphereGeometry args={[1, 32, 32]} />
    <meshStandardMaterial color="red" />
  </mesh>
)

const EyeCanvas = () => {
  return (
    <Canvas
      shadows
      camera={{ 
        position: [-213.125, 53.504, 1091.956],
        fov: 0.1,
        near: 0.1,
        far: 1000
      }}
      style={{
        width: '100%',
        height: '100%',
        background: '#151515'
      }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.8} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow
      />
      
      <Environment preset="studio" intensity={0.8} />

      <Suspense fallback={<Fallback />}>
        <Eye />
      </Suspense>

      <OrbitControls 
        enableZoom={true}
        maxDistance={10}
        minDistance={5}
        target={[0, 1.5, 0]}
        makeDefault
      />
    </Canvas>
  )
}

export default EyeCanvas