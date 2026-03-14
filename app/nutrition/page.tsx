import { NutritionHub } from "@/components/nutrition-hub"
import { Navbar } from "@/components/navbar"

import { AIAssistantOrb } from "@/components/ai-assistant-orb"

export default function NutritionPage() {
  return (
    <main className="relative min-h-screen pb-16 pt-24">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 mb-20 relative z-10">
        <NutritionHub />
      </div>

      <AIAssistantOrb />
    </main>
  )
}
