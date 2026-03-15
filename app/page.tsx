"use client"

import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { AIScanSection } from "@/components/ai-scan-section"
import { ResultsDashboard } from "@/components/results-dashboard"
import { EducationSection } from "@/components/education-section"

import { AIAssistantOrb } from "@/components/ai-assistant-orb"

function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-[#F0F7FF] flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          {/* DNA Helix Loading Animation */}
          <div className="w-16 h-16 relative animate-rotate-slow">
            <div className="absolute inset-0 rounded-full border-2 border-[#2A7FFF]/30" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#2A7FFF] animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#1EC8A5] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
            <div className="absolute inset-4 rounded-full border-2 border-transparent border-t-[#4CAF90] animate-spin" style={{ animationDuration: "2s" }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-[#2A7FFF] font-bold mb-1">Initializing DermaVision</p>
          <p className="text-sm text-[#6B7280]">Loading medical protocols...</p>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">

      <div className="no-print">
        <Navbar />
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <div className="no-print">
          <HeroSection />
          <AIScanSection />
        </div>
        
        <ResultsDashboard />
        
        <div className="no-print">
          <EducationSection />
        </div>
      </Suspense>

      {/* AI Assistant Orb */}
      <div className="no-print">
        <AIAssistantOrb />
      </div>

      {/* Gradient overlays for depth */}
      <div className="fixed top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#EAF4FF] to-transparent pointer-events-none z-40 no-print" />
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F0F7FF] to-transparent pointer-events-none z-0 no-print" />
    </main>
  )
}
