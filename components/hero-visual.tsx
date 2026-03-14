"use client"

import { useEffect, useState } from "react"

export function HeroVisual() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main Glowing Orb */}
      <div className="relative">
        {/* Core sphere */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-br from-[#00F2FF] via-[#7000FF] to-[#00FF94] animate-pulse-glow relative">
          {/* Inner glow */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#00F2FF]/50 to-transparent backdrop-blur-sm" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
          </div>
          
          {/* Surface pattern */}
          <div className="absolute inset-0 rounded-full opacity-30" 
            style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, transparent 0%, transparent 40%, rgba(0, 242, 255, 0.3) 50%, transparent 60%),
                               radial-gradient(circle at 70% 60%, transparent 0%, transparent 40%, rgba(112, 0, 255, 0.3) 50%, transparent 60%)`
            }}
          />
        </div>

        {/* Rotating rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[120%] h-[120%] border border-[#00F2FF]/30 rounded-full animate-spin-slow" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[140%] h-[140%] border border-[#7000FF]/20 rounded-full animate-spin-slow-reverse" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[160%] h-[160%] border border-[#00FF94]/10 rounded-full animate-spin-slow" style={{ animationDuration: "30s" }} />
        </div>

        {/* Orbital dots */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
          <div className="absolute w-3 h-3 bg-[#00F2FF] rounded-full shadow-[0_0_20px_rgba(0,229,255,0.8)]" style={{ transform: "translateX(180px)" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow-reverse">
          <div className="absolute w-2 h-2 bg-[#7000FF] rounded-full shadow-[0_0_15px_rgba(124,77,255,0.8)]" style={{ transform: "translateX(220px)" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow" style={{ animationDuration: "25s" }}>
          <div className="absolute w-2 h-2 bg-[#00FF94] rounded-full shadow-[0_0_15px_rgba(0,255,179,0.8)]" style={{ transform: "translateX(260px)" }} />
        </div>
      </div>

      {/* DNA Helix visualization */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 hidden lg:block">
        <div className="relative w-full h-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 flex justify-between items-center"
              style={{
                top: `${(i / 12) * 100}%`,
                transform: `rotateY(${i * 30}deg)`,
                perspective: "1000px",
              }}
            >
              <div 
                className="w-3 h-3 rounded-full bg-[#00F2FF] shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                style={{
                  transform: `translateX(${Math.sin(i * 0.5) * 30}px)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
              <div className="flex-1 h-px bg-gradient-to-r from-[#00F2FF]/50 via-[#7000FF]/30 to-[#7000FF]/50 mx-2" />
              <div 
                className="w-3 h-3 rounded-full bg-[#7000FF] shadow-[0_0_10px_rgba(124,77,255,0.8)]"
                style={{
                  transform: `translateX(${-Math.sin(i * 0.5) * 30}px)`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00F2FF] rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
              opacity: 0.3 + Math.random() * 0.4,
            }}
          />
        ))}
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F2FF]/10 to-transparent h-8 animate-scan-line" />
      </div>
    </div>
  )
}
