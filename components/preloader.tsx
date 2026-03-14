"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"

interface PreloaderProps {
  onComplete?: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate asset loading or neural network initialization
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true)
        if (onComplete) onComplete()
      }
    })

    // Preloader animation sequence
    tl.to(".preloader-text-1", { opacity: 1, duration: 0.8, ease: "power2.inOut" })
      .to(".preloader-progress", { width: "100%", duration: 2.5, ease: "power1.inOut" }, "-=0.5")
      .to(".preloader-text-1", { opacity: 0, duration: 0.5 }, "-=0.8")
      .to(".preloader-text-2", { opacity: 1, duration: 0.5 }, "-=0.2")
      .to(".preloader-container", {
        opacity: 0,
        pointerEvents: "none",
        duration: 1,
        ease: "power2.inOut",
        delay: 0.5
      })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  if (isLoaded) return null

  return (
    <div className="preloader-container fixed inset-0 z-[100] bg-[#0B0E14] flex flex-col items-center justify-center font-sans">
      
      {/* Abstract Animated Centerpiece */}
      <div className="relative w-32 h-32 mb-12">
        <div className="absolute inset-0 border-2 border-[#00F2FF]/20 rounded-full animate-spin-slow"></div>
        <div className="absolute inset-2 border-2 border-transparent border-t-[#7000FF] border-r-[#7000FF] rounded-full animate-spin" style={{ animationDuration: "1.5s" }}></div>
        <div className="absolute inset-4 border-2 border-transparent border-b-[#00FF94] border-l-[#00FF94] rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "2s" }}></div>
        
        {/* Glowing Core */}
        <div className="absolute inset-0 m-auto w-4 h-4 rounded-full bg-[#00F2FF] shadow-[0_0_30px_#00F2FF] animate-pulse"></div>
      </div>

      <div className="w-64 relative mb-4">
        {/* Text Container */}
        <div className="relative h-6 flex justify-center items-center text-[#00F2FF] text-sm tracking-[0.2em] font-medium uppercase">
          <span className="preloader-text-1 absolute opacity-0">Initializing Engine...</span>
          <span className="preloader-text-2 absolute opacity-0 text-[#00FF94]">Neural Links Established</span>
        </div>
      </div>

      {/* Futuristic Progress Bar */}
      <div className="w-64 h-1 bg-muted rounded-full overflow-hidden relative">
        <div className="preloader-progress absolute top-0 left-0 bottom-0 w-0 bg-gradient-to-r from-[#00F2FF] via-[#7000FF] to-[#00FF94]">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-white/30 animate-shimmer" style={{ width: "200%" }}></div>
        </div>
      </div>
      
    </div>
  )
}
