import { AIScanSection } from "@/components/ai-scan-section"
import { Navbar } from "@/components/navbar"

import { AIAssistantOrb } from "@/components/ai-assistant-orb"

export default function DiagnosisPage() {
  return (
    <main className="relative min-h-screen pb-16 pt-24 bg-[#F0F7FF]">
      <Navbar />
      <div className="mx-auto max-w-7xl pt-12 mb-20 relative z-10 w-full">
        {/* We use the existing AIScanSection but wrap it to act as the main page content */}
        <div className="min-h-[70vh] flex items-center justify-center">
            <AIScanSection />
        </div>
      </div>

      <AIAssistantOrb />
    </main>
  )
}
