"use client"

import { useState } from "react"
import { X, MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatInterface } from "./chat-interface"

function AnimatedOrb({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-full">
      {/* Animated gradient background */}
      <div 
        className={cn(
          "absolute inset-0 transition-all duration-500",
          isOpen 
            ? "bg-gradient-to-br from-[#4CAF90] via-[#1EC8A5] to-[#2A7FFF]" 
            : "bg-gradient-to-br from-[#2A7FFF] via-[#1EC8A5] to-[#2A7FFF]"
        )}
        style={{
          animation: "spin 4s linear infinite",
        }}
      />
      
      {/* Outer glow ring */}
      <div 
        className="absolute inset-1 rounded-full bg-gradient-to-br from-[#EAF4FF]/50 to-white/50"
        style={{
          animation: "pulse 2s ease-in-out infinite",
        }}
      />
      
      {/* Inner orb */}
      <div className="absolute inset-2 rounded-full bg-white overflow-hidden shadow-inner">
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{
            animation: "shimmer 3s ease-in-out infinite",
            transform: "skewX(-20deg)",
          }}
        />
        
        {/* Core glow */}
        <div 
          className={cn(
            "absolute inset-4 rounded-full transition-colors duration-500",
            isOpen 
              ? "bg-[#4CAF90]/30" 
              : "bg-[#2A7FFF]/30"
          )}
          style={{
            filter: "blur(8px)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  )
}

export function AIAssistantOrb() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Panel Wrapper */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[400px] bg-white rounded-2xl animate-in slide-in-from-bottom-4 fade-in duration-300 shadow-2xl overflow-hidden border border-[#D1E5F9]">
          <ChatInterface />
        </div>
      )}

      {/* Floating Orb Button */}
      <button
        onClick={toggleOpen}
        className={cn(
          "relative w-16 h-16 rounded-full overflow-hidden transition-all duration-300 ml-auto block shadow-[0_0_20px_rgba(42,127,255,0.3)] hover:shadow-[0_0_25px_rgba(42,127,255,0.4)] border border-[#EAF4FF]",
          isOpen && "shadow-[0_0_20px_rgba(76,175,144,0.3)] hover:shadow-[0_0_25px_rgba(76,175,144,0.4)]"
        )}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        <AnimatedOrb isOpen={isOpen} />
        
        {/* Icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          {isOpen ? (
            <X className="w-6 h-6 text-[#1EC8A5] drop-shadow-sm transition-colors" />
          ) : (
            <MessageCircle className="w-6 h-6 text-[#2A7FFF] drop-shadow-sm transition-colors" />
          )}
        </div>
      </button>
    </div>
  )
}
