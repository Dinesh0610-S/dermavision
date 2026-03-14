"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function ParticleSystem({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Generate random positions, speeds, and colors for particles
  const particles = useMemo(() => {
    const temp = []
    const colors = []
    const colorOptions = [
      new THREE.Color("#00F2FF"), // Cyan
      new THREE.Color("#7000FF"), // Purple
      new THREE.Color("#00FF94"), // Green
      new THREE.Color("#0B0E14"), // Dark Space
    ]

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
      
      const col = colorOptions[Math.floor(Math.random() * colorOptions.length)]
      colors.push(col.r, col.g, col.b)
    }
    return { data: temp, colors: new Float32Array(colors) }
  }, [count])

  useFrame((state) => {
    // Only animate if the mesh exists
    if (!mesh.current) return
    
    // Slight camera drift based on mouse
    const mouseX = (state.pointer.x * state.viewport.width) / 10
    const mouseY = (state.pointer.y * state.viewport.height) / 10

    particles.data.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle
      
      // Update time
      t = particle.t += speed / 2
      
      // Calculate complex organic movement (simulating neural/cellular drift)
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.cos(t)
      
      // Apply mouse interaction with dampening
      particle.mx += (mouseX - particle.mx) * 0.01
      particle.my += (mouseY * -1 - particle.my) * 0.01
      
      // Update dummy coordinates
      dummy.position.set(
        (particle.mx / 10) + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      )
      
      dummy.scale.set(s, s, s)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()
      
      // Apply to instanced mesh
      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <instancedMesh ref={mesh} args={[null as any, null as any, count]}>
        <sphereGeometry args={[0.08, 16, 16]}>
           <instancedBufferAttribute
            attach="attributes-color"
            args={[particles.colors, 3]}
          />
        </sphereGeometry>
        <meshStandardMaterial 
          vertexColors={true}
          toneMapped={false}
          transparent
          opacity={0.8}
        />
      </instancedMesh>
    </>
  )
}
