"use client"

import { Canvas } from "@react-three/fiber"
import { Preload } from "@react-three/drei"
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing"
import { Suspense, useState, useEffect } from "react"
import { Preloader } from "./preloader"
import { ParticleSystem } from "./three/particle-system"

// We use this wrapper to conditionally render the Canvas only on the client
// and handle the Preloader transition
export function CanvasWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Preloader onComplete={() => setPreloaderDone(true)} />
      
      {/* Global Background Canvas */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: preloaderDone ? 1 : 0 }}
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 45 }}
          dpr={[1, 2]} // Optimize for retinas
          gl={{ antialias: false, powerPreference: "high-performance" }} // Optimized setup
        >
          <ambientLight intensity={0.5} />
          
          <Suspense fallback={null}>
            <ParticleSystem count={1500} />
            <Preload all />
            
            {/* Cinematic Post-Processing */}
            <EffectComposer disableNormalPass>
              <Bloom 
                luminanceThreshold={0.5} 
                luminanceSmoothing={0.9} 
                intensity={1.5} 
                mipmapBlur 
              />
              <DepthOfField 
                focusDistance={0} 
                focalLength={0.02} 
                bokehScale={2} 
                height={480} 
              />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </div>

      {/* Main Pages Content via children */}
      <div 
        className="relative z-10 transition-opacity duration-1000"
        style={{ opacity: preloaderDone ? 1 : 0 }}
      >
        {children}
      </div>
    </>
  )
}
