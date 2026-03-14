"use client"

import { useState, useRef, useEffect } from "react"
import { Apple, Coffee, Target, AlertTriangle, CheckCircle2, Info } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const dietPlans = {
  "Acne": {
    title: "Anti-Inflammatory Protocol",
    description: "Designed to reduce sebum production and systemic inflammation.",
    recommended: ["Zinc (Pumpkin seeds, Lentils)", "Omega-3 (Salmon, Chia seeds)", "Probiotic foods (Kefir)", "Green tea (EGCG)"],
    avoid: ["High glycemic foods", "Dairy products", "Whey protein", "Processed foods"],
    hydration: "3 Liters daily minimum.",
    aiNote: "DermaVision AI recommends adhering to the 'Avoid' list to reduce sebaceous gland activity."
  },
  "Actinic Keratosis": {
    title: "DNA Repair Support",
    description: "Focuses on providing antioxidants to support skin repair from UV damage.",
    recommended: ["Tomatoes (Lycopene)", "Green Tea (Polyphenols)", "Citrus Fruits (Vitamin C)", "Leafy Greens (Folate)"],
    avoid: ["Excessive alcohol", "Ultra-processed foods", "High-sugar snacks"],
    hydration: "3 Liters daily minimum.",
    aiNote: "Antioxidants support cellular repair, but clinical treatment is strongly advised for AK."
  },
  "Basal Cell Carcinoma": {
    title: "Oncology Support Protocol",
    description: "A nutrient-dense diet to support overall health during clinical interventions.",
    recommended: ["Cruciferous Vegetables (Broccoli)", "Fatty Fish (EPA/DHA)", "Olive Oil", "Berries and Nuts"],
    avoid: ["Processed Meats", "Refined Carbohydrates", "Added Sugars"],
    hydration: "3.5 Liters daily.",
    aiNote: "Nutrition plays a supportive role. This condition requires immediate dermatological treatment."
  },
  "Chickenpox": {
    title: "Immune Boosting Support",
    description: "Focuses on strengthening the immune system against the varicella-zoster virus.",
    recommended: ["Vitamin C rich foods", "Garlic and Ginger", "Bone Broth", "Zinc-fortified foods"],
    avoid: ["Arginine-rich foods (Nuts, Chocolate)", "Sugary drinks", "Acidic foods"],
    hydration: "2.5 - 3 Liters daily (water, clear broths).",
    aiNote: "Hydration and immune support are key. Avoid scratching to prevent secondary infections."
  },
  "Dermato Fibroma": {
    title: "General Skin Health",
    description: "A balanced clinical approach to maintaining healthy skin structure.",
    recommended: ["Lean Proteins", "Complex Carbohydrates", "Healthy Fats (Avocado)", "Mixed Vegetables"],
    avoid: ["Excessive saturated fats", "Highly processed snack foods"],
    hydration: "2.5 Liters daily.",
    aiNote: "Dermatofibromas are benign. This diet supports overall dermal health and elasticity."
  },
  "Dyshidrotic Eczema": {
    title: "Nickel-Restricted Diet",
    description: "Reduces potential dietary triggers like nickel while supporting hydration.",
    recommended: ["Vitamin C to reduce nickel absorption", "Apples and Bananas", "Lean meats", "Dairy alternatives"],
    avoid: ["High-nickel foods (Chocolate, Oatmeal, Legumes)", "Soy products", "Canned foods"],
    hydration: "3.5 Liters daily. Consistent hydration is critical.",
    aiNote: "If flare-ups persist, consider a strict low-nickel elimination diet under clinical supervision."
  },
  "Melanoma": {
    title: "Cellular Defense Support",
    description: "Highly antioxidant diet supporting cellular health alongside clinical treatments.",
    recommended: ["Cruciferous vegetables", "Polyphenol-rich foods", "Green Lip Mussels", "Turmeric"],
    avoid: ["Processed meats", "Charred or burnt meats", "Processed sugars", "Refined grains"],
    hydration: "3.5 Liters daily.",
    aiNote: "WARNING: Nutrition is supportive only. Melanoma requires immediate clinical intervention."
  },
  "Nail Fungus": {
    title: "Anti-Fungal Support",
    description: "Aims to create an inhospitable environment for fungi while strengthening nails.",
    recommended: ["Garlic and Onions", "Probiotic foods", "Biotin-rich foods", "Coconut Oil"],
    avoid: ["Refined sugars (fungal fuel)", "Yeast-based products", "Alcohol"],
    hydration: "3 Liters daily to flush pathogens.",
    aiNote: "Dietary changes support, but do not replace, topical or oral antifungal treatments."
  },
  "Nevus": {
    title: "Baseline Maintenance",
    description: "Standard healthy diet as a nevus requires monitoring but no specific dietary intervention.",
    recommended: ["Fruits and Vegetables", "Whole Grains", "Lean Proteins"],
    avoid: ["General unhealthy components", "Refined sugars"],
    hydration: "2.5 Liters daily.",
    aiNote: "Monitor nevi for changes in size, shape, or color using the DermaVision Smart Mirror."
  },
  "Normal Skin": {
    title: "Optimal Vitality Protocol",
    description: "Designed to maintain healthy skin barrier function, elasticity, and glow.",
    recommended: ["Avocados", "Walnuts", "Sunflower Seeds", "Sweet Potatoes"],
    avoid: ["Excessive refined sugars", "Trans fats"],
    hydration: "3 Liters daily to maintain plumpness.",
    aiNote: "Your skin metrics are optimal. Maintain current lifestyle factors."
  },
  "Benign Keratosis": {
    title: "Skin Turnover Support",
    description: "Supports healthy cell regeneration and general epidermal maintenance.",
    recommended: ["Vitamin A (Carrots, Spinach)", "Vitamin E sources (Almonds)", "Omega-3s"],
    avoid: ["High-sugar foods that cause glycation"],
    hydration: "2.5 - 3 Liters daily.",
    aiNote: "These lesions are generally benign. Focus on anti-aging nutritional support."
  },
  "Ringworm": {
    title: "Immune Targeting Antifungal",
    description: "Focuses on supporting the immune system to clear the dermatophyte infection.",
    recommended: ["Antifungal spices (Oregano, Clove)", "Probiotics", "Vitamin A and C"],
    avoid: ["Simple carbohydrates and sugar", "Refined grains", "Excessive dairy"],
    hydration: "3 Liters daily.",
    aiNote: "Diet assists the immune response, but use prescribed topical antifungals directly on the lesion."
  },
  "Seborrheic Keratosis": {
    title: "Epidermal Maintenance",
    description: "General dietary guidelines for mature skin health.",
    recommended: ["Antioxidant-rich berries", "Leafy green vegetables", "Healthy fats"],
    avoid: ["Pro-inflammatory processed foods"],
    hydration: "2.5 Liters daily to keep skin hydrated.",
    aiNote: "SKs are benign. Diet focuses on general healthy aging and maintaining skin moisture."
  },
  "Squamous Cell Carcinoma": {
    title: "Advanced DNA Protection",
    description: "A targeted approach to provide maximum antioxidant support during medical treatment.",
    recommended: ["High-dose Vitamin C foods", "Green Tea extract", "Lycopene", "Niacinamide-rich foods"],
    avoid: ["Processed meats", "Sugary beverages", "Fried foods"],
    hydration: "3.5 Liters daily.",
    aiNote: "Critical: This diet is an adjunct to, not a replacement for, required surgical or topical chemotherapy."
  },
  "Vascular Lesions": {
    title: "Capillary Strengthening Protocol",
    description: "Focuses on nutrients that improve blood vessel elasticity and reduce redness.",
    recommended: ["Vitamin K rich foods (Kale)", "Bioflavonoids (Citrus)", "Rutin (Apples)", "Omega-3s"],
    avoid: ["Spicy foods", "Alcohol", "Hot beverages (triggers vasodilation)"],
    hydration: "3 Liters daily.",
    aiNote: "Avoid dietary triggers that cause flushing to help minimize the appearance of vascular lesions."
  }
}

type DietPlanKey = keyof typeof dietPlans;

export function NutritionHub() {
  const [activePlan, setActivePlan] = useState<DietPlanKey>("Acne")
  const [hasDiagnosis, setHasDiagnosis] = useState(false)
  const plan = dietPlans[activePlan]
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const lastDiagnosis = localStorage.getItem("derma_last_diagnosis") as DietPlanKey;
    if (lastDiagnosis && dietPlans[lastDiagnosis]) {
      setActivePlan(lastDiagnosis);
      setHasDiagnosis(true);
    }
  }, [])

  useGSAP(() => {
    // 3D Tilt Hover Effect for cards
    const cards = gsap.utils.toArray<HTMLElement>('.nutrition-card')
    
    cards.forEach(card => {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = ((y - centerY) / centerY) * -10 // Max 10deg rotation
        const rotateY = ((x - centerX) / centerX) * 10
        
        gsap.to(card, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          duration: 0.5
        })
      }
      
      const handleMouseLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          ease: "elastic.out(1, 0.3)",
          duration: 1
        })
      }
      
      card.addEventListener("mousemove", handleMouseMove)
      card.addEventListener("mouseleave", handleMouseLeave)
      
      return () => {
        card.removeEventListener("mousemove", handleMouseMove)
        card.removeEventListener("mouseleave", handleMouseLeave)
      }
    })
  }, { scope: containerRef })

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" ref={containerRef}>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4 mb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] flex items-center gap-2">
            <Apple className="w-8 h-8 text-[#4CAF90]" />
            Clinical Nutrition Hub
          </h2>
          <p className="text-[#6B7280] mt-2 max-w-2xl font-medium">
            Personalized dietary protocols synthesized by DermaVision AI based on your specific pathology.
          </p>
        </div>
        
        {/* Profile Selector (Horizontal Scrollable) */}
        {!hasDiagnosis ? (
          <div className="flex bg-[#F2FBF7] rounded-xl p-1 border border-[#B2DFDB] max-w-full overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 min-w-max">
              {(Object.keys(dietPlans) as DietPlanKey[]).map((diseaseKey) => (
                <button 
                  key={diseaseKey}
                  onClick={() => setActivePlan(diseaseKey)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activePlan === diseaseKey 
                    ? diseaseKey === "Melanoma" || diseaseKey === "Basal Cell Carcinoma" || diseaseKey === "Squamous Cell Carcinoma"
                      ? "bg-red-50 text-red-600 shadow-sm border border-red-200" 
                      : "bg-[#E6F7F2] text-[#1EC8A5] shadow-md border border-[#1EC8A5]/30" 
                    : "text-[#6B7280] hover:text-[#1F2937] hover:bg-white/50"
                  }`}
                >
                  {diseaseKey}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex bg-[#F2FBF7] rounded-xl p-1 border border-[#B2DFDB]">
            <div className="px-4 py-2 rounded-lg text-sm font-bold bg-[#E6F7F2] text-[#1EC8A5] shadow-md border border-[#1EC8A5]/30 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Personalized Protocol: {activePlan}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recommended Foods */}
        <div className="lg:col-span-1 space-y-6 flex flex-col perspective-1000">
          <div className="nutrition-card bg-[#F8FCFA] rounded-2xl p-6 border border-[#B2DFDB] border-t-4 border-t-[#4CAF90] h-full transform-style-3d shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-[#4CAF90]" />
              <h3 className="text-xl font-bold text-[#1F2937] transform-translate-z-10">Recommended</h3>
            </div>
            <ul className="space-y-4">
              {plan.recommended.map((item, i) => (
                <li key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF90] mt-2 shrink-0 shadow-sm" />
                  <span className="text-sm font-medium text-[#1F2937] leading-relaxed transform-translate-z-10">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Center Overview & AI Notes */}
        <div className="lg:col-span-1 space-y-6 flex flex-col perspective-1000">
          <div className="nutrition-card bg-[#F8FCFA] rounded-2xl p-6 border border-[#1EC8A5]/30 flex-1 relative overflow-hidden group transform-style-3d shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6F7F2] rounded-full blur-3xl group-hover:bg-[#B2DFDB] transition-all duration-700 pointer-events-none" />
            
            <h3 className="text-xl font-bold mb-2 text-[#1EC8A5] transform-translate-z-20">{plan.title}</h3>
            <p className="text-sm text-[#6B7280] font-medium mb-8 transform-translate-z-10">{plan.description}</p>
            
            <div className="space-y-4 relative z-10 transform-translate-z-30">
              <div className="bg-[#F2FBF7] rounded-xl p-4 border border-[#B2DFDB] flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-white border border-[#1EC8A5]/20 flex items-center justify-center shrink-0 shadow-sm">
                  <Coffee className="w-5 h-5 text-[#1EC8A5]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider font-bold mb-1">Hydration Goal</p>
                  <p className="text-sm font-bold text-[#1F2937]">{plan.hydration}</p>
                </div>
              </div>

              {/* AI Clinical Note */}
              <div className="bg-[#E6F7F2] border border-[#1EC8A5]/20 rounded-xl p-4 mt-4 shadow-sm">
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#1EC8A5] mb-2">
                  <Target className="w-4 h-4" /> AI Correlated Note
                </h4>
                <p className="text-xs font-medium text-[#1F2937] leading-relaxed">
                  {plan.aiNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Foods to Avoid */}
        <div className="lg:col-span-1 space-y-6 flex flex-col perspective-1000">
          <div className="nutrition-card bg-[#F8FCFA] rounded-2xl p-6 border border-[#B2DFDB] border-t-4 border-t-red-400 h-full transform-style-3d shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="text-xl font-bold text-[#1F2937] transform-translate-z-10">Avoid / Limit</h3>
            </div>
            <ul className="space-y-4">
              {plan.avoid.map((item, i) => (
                <li key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4" style={{ animationDelay: `${i * 100}ms` }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0 shadow-sm" />
                  <span className="text-sm font-medium text-[#1F2937] leading-relaxed transform-translate-z-10">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Info Banner */}
      <div className="flex gap-3 items-start p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          These nutritional protocols are supportive measures generated by DermaVision X and should not replace clinical medical advice. Consult with a registered dietitian or your primary care physician before making drastic dietary changes.
        </p>
      </div>
    </div>
  )
}
