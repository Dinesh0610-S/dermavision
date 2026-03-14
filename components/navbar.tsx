"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Menu, X, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import gsap from "gsap"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diagnosis", label: "AI Diagnosis" },
  { href: "/symptom-ai", label: "Symptom AI Bot" },
  { href: "/mirror", label: "Smart Mirror" },
  { href: "/timeline", label: "Healing Timeline" },
  { href: "/nutrition", label: "Nutrition Hub" },
]

function MagneticLink({ href, label, isActive }: { href: string, label: string, isActive: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { height, width, left, top } = el.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: "power3.out" })
    }

    const handleMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" })
    }

    el.addEventListener("mousemove", handleMouseMove)
    el.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      el.removeEventListener("mousemove", handleMouseMove)
      el.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg inline-block",
        isActive
          ? "text-[#1EC8A5]"
          : "text-muted-foreground hover:text-[#1EC8A5] transition-colors"
      )}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1EC8A5] rounded-full" />
      )}
    </Link>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [activeUser, setActiveUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("derma_active_user")
    if (userStr) {
      setActiveUser(JSON.parse(userStr))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("derma_active_user")
    setActiveUser(null)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = navLinks.map(link => link.href.replace("#", ""))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#F8FCFA]/90 backdrop-blur-md border-b border-[#B2DFDB]",
        isScrolled ? "shadow-md py-3" : "py-6"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="#home" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#1EC8A5] p-0.5 shadow-sm">
                <div className="flex items-center justify-center w-full h-full rounded-[10px] bg-white">
                  <Activity className="w-5 h-5 text-[#1EC8A5]" />
                </div>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1F2937]">
              DermaVision AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <MagneticLink key={link.href} href={link.href} label={link.label} isActive={activeSection === link.href.replace("#", "")} />
            ))}
          </div>

          {/* Action Area */}
          <div className="hidden md:flex items-center gap-4">

            {activeUser ? (
              <div className="flex items-center gap-4 hidden lg:flex border border-[#B2DFDB] bg-[#E6F7F2] px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-[#1F2937] max-w-[150px] truncate">{activeUser.email}</span>
                <button 
                  onClick={handleSignOut} 
                  className="text-xs font-medium text-[#6B7280] hover:text-red-500 transition-colors border-l border-[#B2DFDB] pl-4"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="text-sm font-medium text-[#1F2937] hover:text-[#1EC8A5] transition-colors hidden lg:block"
              >
                Sign In
              </Link>
            )}

            <Button
              asChild
              className="relative overflow-hidden bg-[#1EC8A5] text-white font-semibold px-6 hover:bg-[#17A589] transition-colors"
            >
              <Link href="/diagnosis">
                Start Skin Analysis
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#1F2937]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white shadow-lg rounded-xl p-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeSection === link.href.replace("#", "")
                      ? "bg-[#E6F7F2] text-[#1EC8A5]"
                      : "text-muted-foreground hover:bg-[#F2FBF7] hover:text-[#1EC8A5]"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              {activeUser ? (
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-[#F2FBF7] transition-colors mt-2 border-t border-[#B2DFDB]"
                >
                  Sign Out ({activeUser.email})
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-[#F2FBF7] hover:text-[#1EC8A5] transition-colors mt-2 border-t border-[#B2DFDB]"
                >
                  Sign In
                </Link>
              )}
              
              <Button
                asChild
                className="mt-2 bg-[#1EC8A5] text-white font-semibold hover:bg-[#17A589] transition-colors"
              >
                <Link href="/diagnosis" onClick={() => setIsMobileMenuOpen(false)}>
                  Start Skin Analysis
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
