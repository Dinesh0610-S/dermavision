"use client"

import { useRef, useEffect, useState } from "react"
import { Send, Bot, User, Activity, ShieldCheck, Sparkles, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { useChat } from "@ai-sdk/react"

export function SymptomAIBot() {
  const [activeUserId, setActiveUserId] = useState(1);
  useEffect(() => {
    try {
      const userStr = localStorage.getItem("derma_active_user")
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.id) setActiveUserId(user.id)
      }
    } catch (e) {}
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    body: { user_id: activeUserId },
    initialMessages: [
      {
        id: "init-1",
        role: "assistant",
        content: "Hello! I am the DermaVision Symptom AI. I'm trained like a dermatologist to help you understand your skin concerns. Can you describe what you're experiencing? (e.g., 'I have a red, itchy patch on my arm that started two days ago.') Please note: I provide informational insights, not a formal medical diagnosis."
      }
    ]
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  useEffect(() => {
    if (chatContainerRef.current) {
      gsap.fromTo(chatContainerRef.current, 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      )
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[700px] flex flex-col rounded-2xl overflow-hidden bg-[#F2FBF7] border border-[#B2DFDB] shadow-xl" ref={chatContainerRef}>
      
      {/* Abstract Background Elements inside chat */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#E6F7F2] blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#B2DFDB] blur-[80px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-6 border-b border-[#B2DFDB] bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#1EC8A5] blur-md opacity-20 animate-pulse" />
            <div className="relative w-12 h-12 rounded-xl bg-[#E6F7F2] border border-[#1EC8A5]/20 p-0.5 shadow-sm">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                <Bot className="w-6 h-6 text-[#1EC8A5]" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
              Symptom AI <Sparkles className="w-4 h-4 text-[#4CAF90]" />
            </h2>
            <p className="text-sm text-[#2A7FFF] flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#4CAF90] animate-pulse" />
              Dermatologist Core Online
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F7F2] border border-[#1EC8A5]/20">
          <ShieldCheck className="w-4 h-4 text-[#1EC8A5]" />
          <span className="text-xs text-[#1EC8A5] font-semibold">HIPAA Compliant Session</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#B2DFDB] scrollbar-track-transparent">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 mt-1">
              {msg.role !== "user" ? (
                <div className="w-8 h-8 rounded-full bg-white border border-[#1EC8A5]/30 flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4 text-[#1EC8A5]" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#E6F7F2] flex items-center justify-center border border-[#1EC8A5]/20 shadow-sm">
                  <User className="w-4 h-4 text-[#1EC8A5]" />
                </div>
              )}
            </div>

            {/* Bubble */}
            <div className="flex flex-col gap-1">
              <div
                className={cn(
                  "px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === "user" 
                    ? "bg-[#4CAF90] text-white border border-[#4CAF90]/20 rounded-tr-sm" 
                    : "bg-[#F8FCFA] text-[#1F2937] border border-[#1EC8A5]/20 rounded-tl-sm whitespace-pre-wrap font-medium"
                )}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {/* Typing Indicator */}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-4 max-w-[85%] mr-auto">
             <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-white border border-[#1EC8A5]/30 flex items-center justify-center shadow-sm">
                  <Activity className="w-4 h-4 text-[#1EC8A5] animate-spin-slow" />
                </div>
            </div>
            <div className="bg-white shadow-sm px-5 py-4 rounded-2xl rounded-tl-sm border border-[#1EC8A5]/20 flex items-center gap-1.5 w-16 h-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#2A7FFF] animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF90] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative z-10 p-4 border-t border-[#B2DFDB] bg-white/90 backdrop-blur-md">
        <div className="relative flex items-center">
          <textarea
            value={input || ""}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your skin symptoms..."
            className="w-full bg-[#F8FCFA] border border-[#B2DFDB] rounded-xl py-4 pl-5 pr-14 text-sm text-[#1F2937] placeholder:text-[#6B7280] focus:outline-none focus:border-[#1EC8A5] focus:ring-1 focus:ring-[#1EC8A5] resize-none min-h-[56px] max-h-[120px] scrollbar-thin overflow-y-auto"
            rows={1}
          />
          <Button
            type="submit"
            disabled={!input?.trim() || isLoading}
            size="icon"
            className="absolute right-2 bottom-2 bg-[#1EC8A5] hover:bg-[#17A589] transition-colors text-white rounded-lg h-10 w-10 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-center">
             <MessageSquare className="w-3 h-3 text-[#6B7280]" />
            <p className="text-[10px] text-[#6B7280] font-medium">
              This AI assistant provides informational guidance and should not replace professional medical advice.
            </p>
        </div>
      </form>
    </div>
  )
}
