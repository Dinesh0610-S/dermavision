"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"

// Template.tsx creates a wrapper that re-renders on route change
export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!containerRef.current) return

    // Entrance Animation: Similar to flying into the new 3D clinical room
    gsap.fromTo(containerRef.current,
      { 
        opacity: 0, 
        y: 40,
        scale: 0.95,
        filter: "blur(10px)"
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.8, 
        ease: "power3.out" 
      }
    )
  }, [pathname])

  return (
    <div ref={containerRef} className="pt-24 min-h-screen will-change-transform">
      {children}
    </div>
  )
}
