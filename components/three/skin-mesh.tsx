"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial, Float, MeshWobbleMaterial } from "@react-three/drei"
import * as THREE from "three"

export function SkinMesh() {
  const coreRef = useRef<THREE.Mesh>(null)
  const nodesRef = useRef<THREE.Group>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  
  // Create anomalous cell/tumor nodes spread across the surface
  const anomalousNodes = useMemo(() => {
    return Array.from({ length: 15 }).map(() => {
      const radius = 1.3 + Math.random() * 0.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      const scale = 0.15 + Math.random() * 0.35

      return { x, y, z, scale }
    })
  }, [])

  useFrame((state) => {
    if (!coreRef.current || !nodesRef.current || !wireRef.current) return
    
    const time = state.clock.getElapsedTime()
    
    // Animate the core pathogen (Melanoma/Carcinoma representation)
    coreRef.current.rotation.x = Math.sin(time / 3) * 0.5
    coreRef.current.rotation.y = time * 0.2
    
    // Animate the outer cluster/nodes
    nodesRef.current.rotation.x = time * 0.15
    nodesRef.current.rotation.y = time * 0.25
    nodesRef.current.position.y = Math.sin(time) * 0.1

    // Wireframe counter-rotation (AI Scanning effect)
    wireRef.current.rotation.z = -time * 0.05
    wireRef.current.rotation.x = -time * 0.1
  })

  return (
    <Float
      speed={1.5} 
      rotationIntensity={0.8} 
      floatIntensity={2} 
    >
      <group>
        {/* Pathogen Core - Highly distorted, irregular mutating mass */}
        <Sphere args={[1.5, 64, 64]} ref={coreRef}>
          <MeshDistortMaterial
            color="#FF3366" // Inflamed/Pathogenic root color
            emissive="#7000FF" // Sci-fi mapping purple glow
            emissiveIntensity={0.4}
            clearcoat={1}
            clearcoatRoughness={0.5}
            metalness={0.6}
            roughness={0.3}
            distort={0.65} // High distortion for organic, diseased mass
            speed={2.5} // Fast pulsing mutation
          />
        </Sphere>

        {/* AI Tracking Cage - Sci-fi targeting wireframe */}
        <Sphere args={[2.2, 32, 32]} ref={wireRef}>
          <meshBasicMaterial 
            color="#00F2FF"
            wireframe
            transparent
            opacity={0.15}
          />
        </Sphere>

        {/* Viral/Fungal Spores or Keratosis Nodes */}
        <group ref={nodesRef}>
          {anomalousNodes.map((node, i) => (
            <Sphere 
              key={i} 
              args={[node.scale, 32, 32]} 
              position={[node.x, node.y, node.z]}
            >
              <MeshWobbleMaterial
                color="#00FF94" // Toxic/medic tracking green
                emissive="#00FF94"
                emissiveIntensity={0.6}
                factor={1.2} // Wobble factor for organic jiggle
                speed={3 + Math.random() * 2} // Variable speeds
                transparent
                opacity={0.9}
              />
            </Sphere>
          ))}
        </group>
      </group>
    </Float>
  )
}
