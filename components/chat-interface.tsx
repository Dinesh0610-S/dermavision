"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Loader2, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getApiUrl } from "@/lib/api-config"

interface Message {
  id: string
  role: "assistant" | "user"
  content: string
  timestamp: Date
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Welcome to DermaVision AI. I am your specialized digital dermatology assistant. You may upload a skin scan or ask me anything regarding skin health, specific pathologies, or routine care. How can I assist you today?",
    timestamp: new Date(),
  },
]

export function ChatInterface({ fullScreen = false }: { fullScreen?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(fullScreen)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      let activeUserId = 1
      try {
        const userStr = localStorage.getItem("derma_active_user")
        if (userStr) {
          const user = JSON.parse(userStr)
          if (user.id) activeUserId = user.id
        }
      } catch (e) { console.error(e) }

      // Send the entire message history to context-aware Llama backend
      const response = await fetch(getApiUrl("/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          user_id: activeUserId
        }),
      })
      
      const data = await response.json()
      
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "I didn't receive a response from the server.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (e) {
      console.error("Backend error:", e)
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting to my Llama backend. Please try again later.",
        timestamp: new Date(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className={cn(
      "flex flex-col overflow-hidden transition-all duration-300",
      isExpanded ? "fixed inset-4 z-[60] bg-white rounded-2xl shadow-2xl border border-[#D1E5F9]" : "h-[450px] w-full bg-white"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#D1E5F9] bg-[#EAF4FF] z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1EC8A5] to-[#2A7FFF] flex items-center justify-center relative overflow-hidden group shadow-sm">
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
            <Sparkles className="w-5 h-5 text-white relative z-10" />
          </div>
          <div>
            <h3 className="font-bold text-[#1F2937] text-sm tracking-wide">DermaVision Assistant</h3>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CAF90] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CAF90]"></span>
              </span>
              <span className="text-xs text-[#6B7280] font-semibold">Llama AI Online</span>
            </div>
          </div>
        </div>
        {!fullScreen && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[#D1E5F9]/50 rounded-lg transition-colors text-[#6B7280] hover:text-[#2A7FFF]"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-[#F8FAFC]"
      >
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={cn(
              "flex gap-3 max-w-[85%] animate-in slide-in-from-bottom-2 fade-in duration-300",
              message.role === "user" ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
              message.role === "assistant" 
                ? "bg-white border-[#1EC8A5]/30 text-[#1EC8A5]" 
                : "bg-white border-[#2A7FFF]/30 text-[#2A7FFF]"
            )}>
              {message.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>
            
            <div className={cn(
              "rounded-2xl px-4 py-3 shadow-sm",
              message.role === "user"
                ? "bg-[#2A7FFF] text-white"
                : "bg-white border border-[#D1E5F9] text-[#1F2937]"
            )}>
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
              <span className={cn(
                "text-[10px] mt-2 block font-semibold",
                message.role === "user" ? "text-right text-[#EAF4FF]" : "text-left text-[#6B7280]"
              )}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm bg-white border-[#1EC8A5]/30 text-[#1EC8A5]">
              <Loader2 className="w-4 h-4 animate-spin outline-none" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 border border-[#D1E5F9] shadow-sm flex items-center">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#D1E5F9] bg-[#F8FAFC] shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your diagnosis or skin health..."
            className="w-full bg-white border border-[#D1E5F9] text-[#1F2937] rounded-full pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7FFF]/30 focus:border-[#2A7FFF] transition-all placeholder:text-[#6B7280]"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 rounded-full bg-[#2A7FFF] text-white hover:bg-[#1e60cc] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#2A7FFF] shadow-md"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-[#6B7280] mt-3 font-semibold">
          DermaVision AI Assistant should not replace professional medical diagnosis.
        </p>
      </div>
    </div>
  )
}
