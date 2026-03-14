"use client"

import { Navbar } from "@/components/navbar"
import { SymptomAIBot } from "@/components/symptom-ai-bot"
import { SkinMesh } from "@/components/three/skin-mesh"
import { Canvas } from "@react-three/fiber"

export default function SymptomAIPage() {
  return (
    <main className="min-h-screen relative pt-24 pb-12 overflow-hidden flex flex-col items-center justify-center bg-[#F2FBF7]">
      {/* Background Gradients Specific to Chat */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#E6F7F2] via-[#E6F7F2]/50 to-transparent z-0 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-[300px] bg-gradient-to-t from-[#1EC8A5]/5 to-transparent z-0 pointer-events-none" />
      
      {/* 3D Skin Disease Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#2A7FFF" />
          <directionalLight position={[-10, -10, -5]} intensity={1} color="#1EC8A5" />
          <SkinMesh />
        </Canvas>
      </div>

      <Navbar />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center mt-8">
        <div className="text-center mb-8 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-[#1F2937]">
            Symptom AI
          </h1>
          <p className="text-[#6B7280] bg-white px-4 py-2 rounded-full border border-[#D1E5F9] shadow-sm font-medium inline-block">
            Our virtual dermatologist is analyzing your biological inputs.
          </p>
        </div>

        <div className="w-full animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <SymptomAIBot />
        </div>
      </div>
    </main>
  )
}
