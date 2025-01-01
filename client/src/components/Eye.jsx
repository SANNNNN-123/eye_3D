import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const Eye = ({ clippingPlanes = [] }) => {
  const group = useRef()
  const { nodes, materials } = useGLTF('/3d-vh-f-eye-r.glb')

  const createEyeMeshes = () => {
    if (!nodes) return null

    return Object.entries(nodes).map(([name, node]) => {
      if (!node.geometry || !node.material) return null
      
      // Clone the original material
      const material = node.material.clone()

      // Preserve original properties
      Object.keys(node.material).forEach(prop => {
        if (prop !== 'uuid' && prop !== 'id' && !prop.startsWith('_')) {
          material[prop] = node.material[prop]
        }
      })

      // Enable clipping for the material
      material.clippingPlanes = clippingPlanes
      material.clipIntersection = false
      material.clipShadows = true
      material.needsUpdate = true
      
      // Show both sides of the geometry when clipped
      material.side = THREE.DoubleSide

      return (
        <mesh
          key={name}
          name={name}
          geometry={node.geometry}
          material={material}
          position={node.position || [0, 0, 0]}
          rotation={node.rotation || [0, 0, 0]}
          scale={node.scale || [1, 1, 1]}
          castShadow
          receiveShadow
        />
      )
    }).filter(Boolean)
  }

  return (
    <group 
      ref={group} 
      scale={[2, 2, 2]}
      position={[0.12, 0.02, 0]}
    >
      {createEyeMeshes()}
    </group>
  )
}

useGLTF.preload('/3d-vh-f-eye-r.glb')

export default Eye