import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const Eye = () => {
  const group = useRef()
  const { nodes, materials } = useGLTF('/3d-vh-f-eye-r.glb')

  const getCustomMaterial = (name) => {
    let color = '#ffffff'
    let opacity = 1
    
    if (name.includes('sclera')) color = '#ffffff'
    else if (name.includes('iris')) color = '#4b7be5'
    else if (name.includes('pupil')) color = '#000000'
    else if (name.includes('cornea')) {
      color = '#e0f2f4'
      opacity = 0.3
    }
    else if (name.includes('humor')) {
      color = '#e0f2f4'
      opacity = 0.2
    }
    else if (name.includes('lens')) {
      color = '#e0f2f4'
      opacity = 0.4
    }
    else if (name.includes('retina')) color = '#ff9e80'
    
    const isTransparent = opacity < 1

    return new THREE.MeshPhysicalMaterial({
      color: color,
      transparent: isTransparent,
      opacity: opacity,
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3
    })
  }

  const createEyeMeshes = () => {
    if (!nodes) return null

    return Object.entries(nodes).map(([name, node]) => {
      if (!node.geometry) return null
      
      const material = getCustomMaterial(name)
      
      return (
        <mesh
          key={name}
          name={name}
          geometry={node.geometry}
          material={material}
          position={node.position}
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
      position={[0, 0, 0]}
    >
      {createEyeMeshes()}
    </group>
  )
}

export default Eye