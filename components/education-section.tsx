"use client"

import { useState } from "react"
import { BookOpen, Layers, Microscope, Brain, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const skinLayers = [
  {
    id: "epidermis",
    name: "Epidermis",
    description: "The outermost layer that provides waterproof barrier and creates skin tone",
    depth: "0.5-1.5mm",
    color: "#FFE4C4",
    functions: ["Protection", "Melanin Production", "Barrier Function"],
  },
  {
    id: "dermis",
    name: "Dermis",
    description: "Contains tough connective tissue, hair follicles, and sweat glands",
    depth: "1.5-4mm",
    color: "#FFA07A",
    functions: ["Structural Support", "Blood Supply", "Sensation"],
  },
  {
    id: "subcutaneous",
    name: "Subcutaneous",
    description: "Made of fat and connective tissue, provides insulation and cushioning",
    depth: "Variable",
    color: "#FFD700",
    functions: ["Fat Storage", "Temperature Regulation", "Shock Absorption"],
  },
]

const commonConditions = [
  {
    name: "Acne",
    prevalence: "85%",
    description: "A common skin condition that occurs when hair follicles become plugged with oil and dead skin cells.",
    severity: "Varies",
  },
  {
    name: "Actinic Keratosis",
    prevalence: "40M",
    description: "A rough, scaly patch on the skin that develops from years of exposure to the sun.",
    severity: "Precancerous",
  },
  {
    name: "Basal Cell Carcinoma",
    prevalence: "3.6M",
    description: "The most common form of skin cancer, often appearing as a slightly transparent bump on the skin.",
    severity: "Cancerous",
  },
  {
    name: "Chickenpox",
    prevalence: "Common",
    description: "A highly contagious viral infection that causes an itchy, blister-like rash across the body.",
    severity: "Moderate",
  },
  {
    name: "Dermato Fibroma",
    prevalence: "Common",
    description: "Benign skin growths that usually occur on the lower legs, appearing as small, firm bumps.",
    severity: "Benign",
  },
  {
    name: "Dyshidrotic Eczema",
    prevalence: "Common",
    description: "A chronic condition causing tiny, severely itchy, fluid-filled blisters to appear on palms and fingers.",
    severity: "Chronic",
  },
  {
    name: "Melanoma",
    prevalence: "100k+",
    description: "The most serious type of skin cancer, developing in the cells (melanocytes) that produce melanin.",
    severity: "High Risk",
  },
  {
    name: "Nail Fungus",
    prevalence: "3M+",
    description: "A common infection that begins as a white or yellow spot under the tip of a fingernail or toenail.",
    severity: "Moderate",
  },
  {
    name: "Nevus",
    prevalence: "10-40 avg",
    description: "A common pigmented skin lesion, commonly known as a mole, which usually remains benign.",
    severity: "Low Risk",
  },
  {
    name: "Normal Skin",
    prevalence: "N/A",
    description: "Healthy skin indicating optimal barrier function and cellular turnover with no active pathology.",
    severity: "Optimal",
  },
  {
    name: "Benign Keratosis",
    prevalence: "Common",
    description: "Refers to safe, noncancerous skin growths that form as skin matures over time.",
    severity: "Benign",
  },
  {
    name: "Ringworm",
    prevalence: "Common",
    description: "A highly contagious fungal infection of the skin or scalp characterized by a ring-shaped rash.",
    severity: "Treatable",
  },
  {
    name: "Seborrheic Keratosis",
    prevalence: "83M",
    description: "One of the most common noncancerous skin growths in older adults, appearing as a waxy or raised bump.",
    severity: "Benign",
  },
  {
    name: "Squamous Cell Carcinoma",
    prevalence: "1.8M",
    description: "A common form of skin cancer that develops in the squamous cells that make up the middle and outer layers of the skin.",
    severity: "Cancerous",
  },
  {
    name: "Vascular Lesions",
    prevalence: "Varies",
    description: "Abnormalities of blood vessels beneath the skin, including spider angiomas or port-wine stains.",
    severity: "Varies",
  },
]

function SkinLayersVisual({ activeLayer }: { activeLayer: string | null }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Skin cross-section visualization */}
      <div className="relative w-64 h-80">
        {/* Epidermis */}
        <div 
          className={cn(
            "absolute top-0 left-0 right-0 h-16 rounded-t-3xl transition-all duration-300",
            activeLayer === "epidermis" ? "scale-105 shadow-lg" : ""
          )}
          style={{ 
            backgroundColor: "#FFE4C4",
            boxShadow: activeLayer === "epidermis" ? "0 0 30px rgba(255, 228, 196, 0.5)" : undefined
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-xs font-bold text-[#1F2937] transition-opacity",
              activeLayer === "epidermis" ? "opacity-100" : "opacity-60"
            )}>
              Epidermis
            </span>
          </div>
          {/* Cell-like pattern */}
          <div className="absolute inset-2 opacity-30">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full border border-[#1F2937]/20"
                style={{
                  left: `${(i % 5) * 25}%`,
                  top: `${Math.floor(i / 5) * 33}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Dermis */}
        <div 
          className={cn(
            "absolute top-16 left-0 right-0 h-32 transition-all duration-300",
            activeLayer === "dermis" ? "scale-105 shadow-lg" : ""
          )}
          style={{ 
            backgroundColor: "#FFA07A",
            boxShadow: activeLayer === "dermis" ? "0 0 30px rgba(255, 160, 122, 0.5)" : undefined
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-xs font-bold text-[#1F2937] transition-opacity",
              activeLayer === "dermis" ? "opacity-100" : "opacity-60"
            )}>
              Dermis
            </span>
          </div>
          {/* Blood vessel pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <path
              d="M 20 20 Q 50 40, 80 20 T 140 30 Q 170 50, 200 30"
              stroke="#8B0000"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M 30 60 Q 60 80, 90 60 T 150 70 Q 180 90, 220 70"
              stroke="#8B0000"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        {/* Subcutaneous */}
        <div 
          className={cn(
            "absolute top-48 left-0 right-0 h-32 rounded-b-3xl transition-all duration-300",
            activeLayer === "subcutaneous" ? "scale-105 shadow-lg" : ""
          )}
          style={{ 
            backgroundColor: "#FFD700",
            boxShadow: activeLayer === "subcutaneous" ? "0 0 30px rgba(255, 215, 0, 0.5)" : undefined
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn(
              "text-xs font-bold text-[#1F2937] transition-opacity",
              activeLayer === "subcutaneous" ? "opacity-100" : "opacity-60"
            )}>
              Subcutaneous
            </span>
          </div>
          {/* Fat cell pattern */}
          <div className="absolute inset-2 opacity-30">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-6 h-6 rounded-full bg-[#1F2937]/10"
                style={{
                  left: `${(i % 4) * 28 + 5}%`,
                  top: `${Math.floor(i / 4) * 35 + 10}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {skinLayers.map((layer, i) => (
            <div
              key={layer.id}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                activeLayer === layer.id ? "scale-150" : ""
              )}
              style={{ 
                backgroundColor: layer.color,
                boxShadow: activeLayer === layer.id ? `0 0 10px ${layer.color}` : undefined
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function AIBrainVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Neural network visualization */}
      <div className="relative w-48 h-48">
        {/* Central brain */}
        <div className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#1EC8A5] to-[#2A7FFF] flex items-center justify-center shadow-lg animate-pulse">
          <Brain className="w-10 h-10 text-white" />
        </div>

        {/* Orbiting elements */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-spin-slow"
            style={{
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 60}deg) translateX(70px)`,
              animationDuration: `${10 + i * 2}s`,
            }}
          >
            <div
              className={cn(
                "w-full h-full rounded-full",
                i % 3 === 0 ? "bg-[#2A7FFF]" : i % 3 === 1 ? "bg-[#1EC8A5]" : "bg-[#4CAF90]"
              )}
              style={{
                boxShadow: `0 0 10px ${i % 3 === 0 ? "#2A7FFF" : i % 3 === 1 ? "#1EC8A5" : "#4CAF90"}`,
                transform: `rotate(-${i * 60}deg)`,
              }}
            />
          </div>
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full animate-spin-slow" style={{ animationDuration: "30s" }}>
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i * 60 * Math.PI) / 180
            const x = 96 + Math.cos(angle) * 70
            const y = 96 + Math.sin(angle) * 70
            return (
              <line
                key={i}
                x1="96"
                y1="96"
                x2={x}
                y2={y}
                stroke={i % 3 === 0 ? "#2A7FFF" : i % 3 === 1 ? "#1EC8A5" : "#4CAF90"}
                strokeWidth="1"
                opacity="0.5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            )
          })}
        </svg>

        {/* Outer rings */}
        <div className="absolute inset-0 m-auto w-36 h-36 border border-[#2A7FFF]/20 rounded-full animate-spin-slow" style={{ animationDuration: "15s" }} />
        <div className="absolute inset-0 m-auto w-44 h-44 border border-[#1EC8A5]/10 rounded-full animate-spin-slow-reverse" style={{ animationDuration: "20s" }} />
      </div>
    </div>
  )
}

export function EducationSection() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null)
  const [activeCondition, setActiveCondition] = useState(0)

  return (
    <section id="education" className="relative py-20 lg:py-32">
      <div className="absolute inset-0 bg-[#F0F7FF]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#2A7FFF]/30 shadow-sm mb-6">
            <BookOpen className="w-4 h-4 text-[#2A7FFF]" />
            <span className="text-sm text-[#2A7FFF] font-bold">Dermatology Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4 text-balance">
            Understanding Your Skin
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto text-pretty font-medium">
            Explore the complex structure of human skin and learn about common conditions that affect millions worldwide.
          </p>
        </div>

        {/* Skin Layers Interactive */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Visualization */}
          <div className="relative h-[400px] lg:h-[500px] order-2 lg:order-1">
            <SkinLayersVisual activeLayer={activeLayer} />

            {/* Layer indicators */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
              {skinLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={cn(
                    "w-3 h-3 rounded-full border-2 transition-all cursor-pointer",
                    activeLayer === layer.id
                      ? "border-[#2A7FFF] bg-[#2A7FFF]"
                      : "border-[#2A7FFF]/50 hover:border-[#2A7FFF]"
                  )}
                  onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                />
              ))}
            </div>
          </div>

          {/* Layer Info */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#EAF4FF] flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#2A7FFF]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1F2937]">Skin Layers</h3>
                <p className="text-sm text-[#6B7280] font-medium">Interactive exploration</p>
              </div>
            </div>

            <div className="space-y-4">
              {skinLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={cn(
                    "bg-white rounded-xl p-5 cursor-pointer transition-all duration-300 border shadow-sm",
                    activeLayer === layer.id
                      ? "border-[#2A7FFF] shadow-md ring-1 ring-[#2A7FFF]/20"
                      : "border-[#D1E5F9] hover:border-[#2A7FFF]/50 hover:shadow-md"
                  )}
                  onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full shadow-sm border border-black/5"
                          style={{ backgroundColor: layer.color }}
                        />
                        <h4 className="font-bold text-[#1F2937]">{layer.name}</h4>
                        <span className="text-xs text-[#2A7FFF] font-bold px-2 py-0.5 bg-[#EAF4FF] rounded-full">
                          {layer.depth}
                        </span>
                      </div>
                      <p className="text-sm text-[#6B7280] mb-3 font-medium">
                        {layer.description}
                      </p>
                      {activeLayer === layer.id && (
                        <div className="flex flex-wrap gap-2">
                          {layer.functions.map((func) => (
                            <span
                              key={func}
                              className="text-xs px-3 py-1 rounded-full bg-[#EAF4FF] text-[#2A7FFF] font-semibold"
                            >
                              {func}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform",
                        activeLayer === layer.id && "rotate-90"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Conditions */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] flex items-center justify-center">
              <Microscope className="w-6 h-6 text-[#4CAF90]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#1F2937]">Common Skin Conditions</h3>
              <p className="text-sm text-[#6B7280] font-medium">Click to learn more about each condition</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {commonConditions.map((condition, index) => (
              <div
                key={condition.name}
                className={cn(
                  "bg-white rounded-xl p-5 cursor-pointer transition-all duration-300 border shadow-sm",
                  activeCondition === index
                    ? "border-[#1EC8A5] shadow-md ring-1 ring-[#1EC8A5]/20 bg-[#F4FCFA]"
                    : "border-[#D1E5F9] hover:border-[#1EC8A5]/50 hover:shadow-md"
                )}
                onClick={() => setActiveCondition(index)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-[#1F2937]">{condition.name}</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-white border border-[#D1E5F9] text-[#2A7FFF] font-bold shadow-sm text-center">
                    {condition.severity}
                  </span>
                </div>
                <div className="text-2xl font-bold text-[#1EC8A5] mb-2">
                  {condition.prevalence}
                </div>
                <p className="text-xs text-[#6B7280] font-semibold">
                  {condition.prevalence.includes("M") ? "Americans affected" : "of teenagers affected"}
                </p>
                {activeCondition === index && (
                  <p className="text-sm text-[#1F2937] mt-4 pt-4 border-t border-[#D1E5F9] font-medium leading-relaxed">
                    {condition.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Capabilities */}
        <div className="mt-20 bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-[#D1E5F9]">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#EAF4FF] flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#2A7FFF]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1F2937]">AI-Powered Analysis</h3>
              </div>
              <p className="text-[#6B7280] font-medium mb-6 leading-relaxed">
                Our neural network has been trained on over 2 million dermatological images, 
                enabling accurate identification of 100+ skin conditions with clinical-grade precision.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#D1E5F9]">
                  <div className="text-3xl font-bold text-[#2A7FFF] mb-1">100+</div>
                  <div className="text-sm text-[#6B7280] font-semibold">Conditions Detected</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#D1E5F9]">
                  <div className="text-3xl font-bold text-[#1EC8A5] mb-1">2M+</div>
                  <div className="text-sm text-[#6B7280] font-semibold">Training Images</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#D1E5F9]">
                  <div className="text-3xl font-bold text-[#4CAF90] mb-1">98%</div>
                  <div className="text-sm text-[#6B7280] font-semibold">Accuracy Rate</div>
                </div>
                <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#D1E5F9]">
                  <div className="text-3xl font-bold text-[#1F2937] mb-1">{"<"}30s</div>
                  <div className="text-sm text-[#6B7280] font-semibold">Analysis Time</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block h-[300px]">
              <AIBrainVisual />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
