"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, Mail, Lock, ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getApiUrl } from "@/lib/api-config"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")

  const [emailError, setEmailError] = useState("")
  const [isHandlingAuth, setIsHandlingAuth] = useState(false)

  const validateEmail = (email: string) => {
    // Strict email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.")
      return
    }
    
    setEmailError("")
    setIsHandlingAuth(true)
    
    try {
      const response = await fetch(getApiUrl("/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone }),
      })
      
      const data = await response.json()
      setIsHandlingAuth(false)
      
      if (data.success) {
        // Successfully authenticated
        const activeUser = { 
          name: data.user?.username || email.split("@")[0], 
          email, 
          id: data.user_id,
          phone: phone
        }
        localStorage.setItem("derma_active_user", JSON.stringify(activeUser))
        alert(`Welcome back, ${activeUser.name}!`)
        router.push("/")
      } else {
        setEmailError(data.error || "Incorrect email or password.")
      }
    } catch (err) {
      setIsHandlingAuth(false)
      setEmailError("Could not connect to server.")
    }
  }



  return (
    <main className="min-h-screen relative flex items-center justify-center pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[#F0F7FF]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2A7FFF]/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#1EC8A5]/10 rounded-full blur-[128px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-3 group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-[#2A7FFF] blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#1EC8A5] to-[#2A7FFF] p-0.5 shadow-sm">
                <div className="flex items-center justify-center w-full h-full rounded-[10px] bg-white">
                  <Activity className="w-6 h-6 text-[#2A7FFF]" />
                </div>
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-[#1F2937] mb-2">Welcome Back</h1>
          <p className="text-[#6B7280] font-medium">Log in to access your DermaVision AI portal</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white border border-[#D1E5F9] rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError("")
                    }}
                    className={`w-full bg-[#F0F7FF] border ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-[#D1E5F9] focus:ring-[#1EC8A5]'} rounded-xl py-3 pl-12 pr-4 text-[#1F2937] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:border-[#1EC8A5] transition-all`}
                    placeholder="Email address"
                  />
                </div>
                {emailError && (
                  <p className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">{emailError}</p>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#F0F7FF] border border-[#D1E5F9] rounded-xl py-3 pl-12 pr-4 text-[#1F2937] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#1EC8A5] focus:border-[#1EC8A5] transition-all"
                    placeholder="Mobile Number (Optional)"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#6B7280]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F0F7FF] border border-[#D1E5F9] rounded-xl py-3 pl-12 pr-4 text-[#1F2937] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#4CAF90] focus:border-[#4CAF90] transition-all"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#D1E5F9] bg-white text-[#2A7FFF] focus:ring-[#2A7FFF]" />
                  <span className="text-[#6B7280] font-medium">Remember me</span>
                </label>
                <Link href="#" className="font-semibold text-[#2A7FFF] hover:text-[#1e60cc] transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit"
                disabled={isHandlingAuth}
                className="w-full bg-[#2A7FFF] text-white font-semibold py-6 text-lg hover:bg-[#1e60cc] shadow-md transition-all disabled:opacity-50"
              >
                {isHandlingAuth ? "Authenticating..." : (
                  <>Sign In <ArrowRight className="ml-2 w-5 h-5" /></>
                )}
              </Button>
            </form>


          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[#6B7280]">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-[#1EC8A5] hover:text-[#17A589] transition-colors cursor-pointer">
            Create a free account
          </Link>
        </p>
      </div>
    </main>
  )
}
