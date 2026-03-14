"use client"

import { useEffect, useState } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  animationDuration: number
  animationDelay: number
  color: string
}

interface Connection {
  id: number
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
}

export function ParticleField() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Generate particles
    const colors = ["#2A7FFF", "#1EC8A5", "#4CAF90"]
    const newParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.1,
      animationDuration: Math.random() * 10 + 10,
      animationDelay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
    setParticles(newParticles)

    // Generate some connections
    const newConnections: Connection[] = []
    for (let i = 0; i < 15; i++) {
      const p1 = newParticles[Math.floor(Math.random() * newParticles.length)]
      const p2 = newParticles[Math.floor(Math.random() * newParticles.length)]
      newConnections.push({
        id: i,
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
        opacity: Math.random() * 0.15 + 0.05,
      })
    }
    setConnections(newConnections)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EAF4FF] via-[#F0F7FF] to-[#EAF4FF]" />
      
      {/* SVG for connections */}
      <svg className="absolute inset-0 w-full h-full">
        {connections.map((conn) => (
          <line
            key={conn.id}
            x1={`${conn.x1}%`}
            y1={`${conn.y1}%`}
            x2={`${conn.x2}%`}
            y2={`${conn.y2}%`}
            stroke="#2A7FFF"
            strokeWidth="0.5"
            opacity={conn.opacity * 0.5}
            className="animate-pulse"
            style={{ animationDelay: `${conn.id * 0.3}s` }}
          />
        ))}
      </svg>

      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full animate-float-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity * 0.4,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            filter: "blur(1px)",
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
    </div>
  )
}
