import { HealingTimeline } from "@/components/healing-timeline"
import { Navbar } from "@/components/navbar"

import { AIAssistantOrb } from "@/components/ai-assistant-orb"

export default function TimelinePage() {
  return (
    <main className="relative min-h-screen pb-16 pt-24">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 mb-20 relative z-10">
        <HealingTimeline />
      </div>

      <AIAssistantOrb />
    </main>
  )
}
