import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useControls } from 'leva'

const Eye = () => {
  const group = useRef()
  const { nodes, materials, scene } = useGLTF('/anatomy_of_the_eye-v1.glb')
  const [nodeList, setNodeList] = useState([])

  // Debug GUI controls
  const { position, rotation, scale } = useControls({
    position: { value: { x: 0, y: 0, z: 0 }, step: 0.1 },
    rotation: { value: { x: 0, y: 0, z: 0 }, step: 0.1 },
    scale: { value: { x: 1, y: 1, z: 1 }, step: 0.1 }
  })

  // Material visibility controls
  const materialControls = useControls(
    'Materials',
    Object.fromEntries(
      Object.entries(materials || {}).map(([name]) => [
        name,
        { value: true }
      ])
    )
  )

  useEffect(() => {
    if (nodes) {
      console.log('Loaded Nodes:', nodes)
      console.log('Materials:', materials)
      
      const meshNodes = Object.entries(nodes)
        .filter(([_, node]) => node.geometry && node.material)
        .map(([name]) => name)
      
      setNodeList(meshNodes)
      console.table(meshNodes.map(name => ({
        name,
        material: nodes[name].material.name,
        vertices: nodes[name].geometry.attributes.position.count
      })))
    }
  }, [nodes, materials])

  const createEyeMeshes = () => {
    if (!nodes) return null

    return Object.entries(nodes).map(([name, node]) => {
      if (!node.geometry || !node.material) return null
      
      const material = node.material.clone()
      material.transparent = true
      material.opacity = materialControls[name] ? 1 : 0

      return (
        <mesh
          key={name}
          geometry={node.geometry}
          material={material}
          visible={materialControls[name]}
        />
      )
    }).filter(Boolean)
  }

  return (
    <group 
      ref={group}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      scale={[scale.x, scale.y, scale.z]}
    >
      {createEyeMeshes()}
    </group>
  )
}

export default Eye