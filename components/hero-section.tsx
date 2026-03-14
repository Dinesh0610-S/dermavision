"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scan, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { SkinMesh } from "./three/skin-mesh"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: Scan,
    title: "AI Analysis",
    description: "Advanced neural networks analyze skin conditions with 98% accuracy",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive diagnosis in under 30 seconds",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your data is encrypted and protected to medical standards",
  },
]

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null)
  const panelsRef = useRef<HTMLDivElement[]>([])

  useGSAP(() => {
    // Parallax and fade-in for holographic panels
    panelsRef.current.forEach((panel, i) => {
      gsap.fromTo(panel, 
        { y: 50, opacity: 0 },
        {
          y: i % 2 === 0 ? -20 : 20,
          opacity: 1,
          duration: 2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          }
        }
      )
    })
    
    // Animate features cards staggered
    gsap.fromTo(".feature-card", 
      { y: 50, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        stagger: 0.2, 
        duration: 1, 
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
        }
      }
    )
  }, { scope: container })

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-[#1EC8A5] to-[#4CAF90] text-white" ref={container}>
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8 z-10 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#4CAF90] animate-pulse" />
              <span className="text-sm font-medium text-white">Advanced Medical Intelligence</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-balance text-white">
              AI-Powered Skin
              <br />
              Health Analysis
            </h1>
            
            <p className="text-lg text-white/90 max-w-xl text-pretty font-medium">
              Advanced dermatology intelligence that helps you understand your skin health. 
              Get instant, reliable insights directly from anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                asChild
                size="lg"
                className="relative overflow-hidden bg-white text-[#1EC8A5] font-semibold px-8 py-6 text-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                <Link href="/diagnosis" className="flex items-center gap-2">
                  Start Diagnosis
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/20 hover:text-white px-8 py-6 text-lg transition-colors bg-transparent"
              >
                <Link href="#education">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20 mt-8">
              <div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-sm text-white/80">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">2M+</div>
                <div className="text-sm text-white/80">Scans Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{"<"}30s</div>
                <div className="text-sm text-white/80">Analysis Time</div>
              </div>
            </div>
          </div>

          {/* 3D Visual */}
          <div className="relative h-[400px] lg:h-[600px] w-full">
            
            {/* 3D Skin Mesh Canvas */}
            <div className="absolute inset-0 z-0 drop-shadow-2xl">
               <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={1.5} color="#ffffff" />
                  <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                  <directionalLight position={[-10, -10, -5]} intensity={1} color="#E6F7F2" />
                  <SkinMesh />
               </Canvas>
            </div>
            
            {/* GSAP Floating UI Panels */}
            <div 
              ref={(el) => { if (el) panelsRef.current[0] = el }}
              className="absolute top-10 right-0 bg-white/90 backdrop-blur-md shadow-lg p-4 rounded-xl hidden lg:block z-10 will-change-transform border border-white/50"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#4CAF90]" />
                <span className="text-sm font-semibold text-[#1F2937]">AI System Active</span>
              </div>
            </div>
            
            <div 
              ref={(el) => { if (el) panelsRef.current[1] = el }}
              className="absolute bottom-20 left-0 bg-white/90 backdrop-blur-md shadow-lg p-4 rounded-xl hidden lg:block z-10 will-change-transform border border-white/50"
            >
              <div className="text-sm text-[#6B7280] font-medium mb-1">Processing Power</div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-[#E6F7F2] rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-[#1EC8A5] rounded-full" />
                </div>
                <span className="text-sm font-semibold text-[#1EC8A5]">87%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="features-grid grid md:grid-cols-3 gap-6 mt-20 relative z-10 text-left">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 group opacity-0 shadow-lg text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 transition-all">
                <feature.icon className="w-6 h-6 text-[#1EC8A5]" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-white/90 font-medium">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

