"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Upload, X, Scan, Brain, Activity, CheckCircle2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import gsap from "gsap"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "complete"
  progress: number
  stage: string
}

const diseaseClasses = [
  "Acne", "Actinic Keratosis", "Basal Cell Carcinoma", "Chickenpox", 
  "Dermato Fibroma", "Dyshidrotic Eczema", "Melanoma", "Nail Fungus", 
  "Nevus", "Normal Skin", "Benign Keratosis", "Ringworm", 
  "Seborrheic Keratosis", "Squamous Cell Carcinoma", "Vascular Lesions"
]

const riskLevels = {
  "Acne": { risk: "Low", treatability: "Highly Treatable" },
  "Actinic Keratosis": { risk: "Moderate", treatability: "Treatable" },
  "Basal Cell Carcinoma": { risk: "Moderate", treatability: "Requires Clinical Intervention" },
  "Chickenpox": { risk: "Low", treatability: "Highly Treatable" },
  "Dermato Fibroma": { risk: "Low", treatability: "Highly Treatable" },
  "Dyshidrotic Eczema": { risk: "Low", treatability: "Highly Treatable" },
  "Melanoma": { risk: "High", treatability: "Requires Clinical Intervention" },
  "Nail Fungus": { risk: "Low", treatability: "Highly Treatable" },
  "Nevus": { risk: "Low", treatability: "Highly Treatable" },
  "Normal Skin": { risk: "Low", treatability: "Healthy" },
  "Benign Keratosis": { risk: "Low", treatability: "Highly Treatable" },
  "Ringworm": { risk: "Low", treatability: "Highly Treatable" },
  "Seborrheic Keratosis": { risk: "Low", treatability: "Highly Treatable" },
  "Squamous Cell Carcinoma": { risk: "High", treatability: "Requires Clinical Intervention" },
  "Vascular Lesions": { risk: "Low", treatability: "Treatable" },
}

const analysisStages = [
  "Initializing neural network...",
  "Preprocessing image data...",
  "Extracting skin features...",
  "Analyzing pattern anomalies...",
  "Cross-referencing database...",
  "Generating diagnosis report...",
  "Finalizing results...",
]

function ScanVisual({ analyzing }: { analyzing: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Neural Network Visualization */}
      <div className="relative w-64 h-64">
        {/* Central brain icon */}
        <div className={cn(
          "absolute inset-0 m-auto w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border border-[#1EC8A5]/20",
          analyzing && "animate-pulse"
        )}>
          <Brain className="w-12 h-12 text-[#2A7FFF]" />
        </div>

        {/* Orbiting nodes */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-4 h-4 rounded-full",
              analyzing ? "animate-spin-slow" : ""
            )}
            style={{
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 45}deg) translateX(100px)`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            <div
              className={cn(
                "w-full h-full rounded-full",
                i % 3 === 0 ? "bg-[#2A7FFF]" : i % 3 === 1 ? "bg-[#1EC8A5]" : "bg-[#4CAF90]",
                analyzing && "animate-pulse"
              )}
              style={{
                boxShadow: `0 0 10px ${i % 3 === 0 ? "#2A7FFF" : i % 3 === 1 ? "#1EC8A5" : "#4CAF90"}`,
                transform: `rotate(-${i * 45}deg)`,
              }}
            />
          </div>
        ))}

        <svg className="absolute inset-0 w-full h-full">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * 45 * Math.PI) / 180
            const x = 128 + Math.cos(angle) * 100
            const y = 128 + Math.sin(angle) * 100
            return (
              <line
                key={i}
                x1="128"
                y1="128"
                x2={x}
                y2={y}
                stroke={i % 3 === 0 ? "#2A7FFF" : i % 3 === 1 ? "#1EC8A5" : "#4CAF90"}
                strokeWidth="1"
                opacity={analyzing ? 0.6 : 0.3}
                className={cn(analyzing && "animate-neural-pulse")}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            )
          })}
        </svg>

        {/* Outer rings */}
        <div className={cn(
          "absolute inset-0 m-auto w-48 h-48 border border-[#2A7FFF]/20 rounded-full",
          analyzing && "animate-spin-slow"
        )} />
        <div className={cn(
          "absolute inset-0 m-auto w-56 h-56 border border-[#1EC8A5]/15 rounded-full",
          analyzing && "animate-spin-slow-reverse"
        )} />
      </div>

      {/* Pulse waves when analyzing */}
      {analyzing && (
        <>
          <div className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-[#2A7FFF]/30 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 m-auto w-40 h-40 rounded-full border border-[#1EC8A5]/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
        </>
      )}
    </div>
  )
}

export function AIScanSection() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: "idle",
    progress: 0,
    stage: "",
  })
  const [analysisTime, setAnalysisTime] = useState<number | null>(null)
  const [detectedDisease, setDetectedDisease] = useState<{name: string, risk: string, treatability: string, confidence: number} | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }, [])

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const startAnalysis = async () => {
    if (!selectedFile) return
    
    setAnalysis({ status: "analyzing", progress: 0, stage: analysisStages[0] })
    
    // GSAP Scanner Beam Animation
    setTimeout(() => {
      gsap.fromTo(".scanner-beam", 
        { y: 0, opacity: 1 },
        { 
          y: 400, // Assuming max height
          duration: 2, 
          repeat: -1, 
          yoyo: true, 
          ease: "sine.inOut" 
        }
      )
    }, 100)
    
    let simulatedProgress = 0
    let stageIndex = 0
    const startTime = performance.now()
    
    // Start a visual progress interval
    const interval = setInterval(() => {
      simulatedProgress += Math.random() * 8 + 2
      if (simulatedProgress > 90) simulatedProgress = 90 // Cap at 90% until API returns
      
      stageIndex = Math.min(Math.floor(simulatedProgress / 15), analysisStages.length - 2)
      
      if (analysis.status === "analyzing") {
        setAnalysis({ 
          status: "analyzing", 
          progress: Math.min(simulatedProgress, 99), 
          stage: analysisStages[stageIndex] 
        })
      }
    }, 400)

    try {
      // Prepare form data
      const formData = new FormData()
      formData.append("file", selectedFile)
      
      let activeUserEmail = "guest@dermavision.ai"
      try {
        const userStr = localStorage.getItem("derma_active_user")
        if (userStr) {
          const user = JSON.parse(userStr)
          if (user.email) activeUserEmail = user.email
        }
      } catch (e) { console.error("Could not parse user", e) }
      
      formData.append("user_email", activeUserEmail) // Dynamic from full auth later

      // Call Python Backend
      const response = await fetch("http://127.0.0.1:5000/api/predict", {
        method: "POST",
        body: formData,
      })
      
      const data = await response.json()
      
      clearInterval(interval)
      gsap.killTweensOf(".scanner-beam")
      
      const endTime = performance.now()
      setAnalysisTime(Number(((endTime - startTime) / 1000).toFixed(2)))
      
      if (data.success) {
        setAnalysis({ status: "complete", progress: 100, stage: "Analysis complete!" })
        
        let localRisk = "Moderate"
        let localTreatability = "Requires Clinical Intervention"
        if (data.result in riskLevels) {
          const matched = riskLevels[data.result as keyof typeof riskLevels]
          localRisk = matched.risk
          localTreatability = matched.treatability
        }
        
        setDetectedDisease({
          name: data.result,
          risk: data.severity || localRisk,
          treatability: localTreatability,
          confidence: Number(data.confidence.toFixed(1))
        })
        
        // Save to local storage for the Nutrition Hub
        localStorage.setItem("derma_last_diagnosis", data.result)
      } else {
        throw new Error(data.error || "Prediction failed")
      }
      
    } catch (error) {
      console.error("Analysis Error:", error)
      clearInterval(interval)
      gsap.killTweensOf(".scanner-beam")
      setAnalysis({ status: "idle", progress: 0, stage: "Error communicating with AI server. Please try again." })
    }
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setAnalysis({ status: "idle", progress: 0, stage: "" })
    setDetectedDisease(null)
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }

  const playVoiceOutput = () => {
    if ('speechSynthesis' in window && detectedDisease) {
      window.speechSynthesis.cancel() // Stop any current speech
      const msg = new SpeechSynthesisUtterance()
      msg.text = `Analysis complete. Detected condition: ${detectedDisease.name}. Confidence score: ${detectedDisease.confidence} percent. Risk level: ${detectedDisease.risk}. Treatability: ${detectedDisease.treatability}.`
      msg.rate = 1.0
      
      msg.onstart = () => setIsSpeaking(true)
      msg.onend = () => setIsSpeaking(false)
      msg.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(msg)
    }
  }

  return (
    <section id="scan" className="relative py-20 lg:py-32">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-[#2A7FFF]/20 mb-6">
            <Scan className="w-4 h-4 text-[#2A7FFF]" />
            <span className="text-sm text-[#2A7FFF] font-medium">AI Diagnostic Scanner</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Upload Your Skin Image
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Our advanced AI analyzes skin conditions using deep learning algorithms trained on millions of dermatological images.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Upload Area */}
          <div className="space-y-6">
            {!selectedImage ? (
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer shadow-sm",
                  dragActive
                    ? "border-[#1EC8A5] bg-[#E6F7F2]"
                    : "border-[#B2DFDB] bg-[#F2FBF7] hover:border-[#1EC8A5]/50 hover:bg-[#E6F7F2]"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-[#EAF4FF] flex items-center justify-center">
                    <Upload className="w-10 h-10 text-[#2A7FFF]" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#1F2937] mb-1">
                      Drop your image here
                    </p>
                    <p className="text-sm text-[#6B7280]">
                      or click to browse (JPG, PNG, HEIC)
                    </p>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#D1E5F9]" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#D1E5F9]" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[#D1E5F9]" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[#D1E5F9]" />
              </div>
            ) : (
              <div className="relative">
                {/* Image Preview */}
                <div className="relative rounded-2xl overflow-hidden bg-[#F2FBF7] shadow-lg border border-[#E6F7F2] scan-container">
                  <img
                    src={selectedImage}
                    alt="Selected skin image"
                    className="w-full h-auto max-h-[400px] object-cover transition-all duration-1000"
                    style={{
                      filter: analysis.status === "complete" ? "contrast(1.05) brightness(0.95)" : "none"
                    }}
                  />
                  
                  {/* GSAP Scanner Overlay */}
                  {analysis.status === "analyzing" && (
                    <div className="absolute inset-0 z-10 pointer-events-none">
                      <div className="scanner-beam absolute top-0 left-0 w-full h-1 bg-[#1EC8A5] shadow-[0_0_15px_#1EC8A5]" />
                      <div className="absolute inset-0 bg-[#2A7FFF]/10" />
                    </div>
                  )}
                  
                  {/* Grad-CAM Results Overlay */}
                  {analysis.status === "complete" && detectedDisease && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-700">
                      
                      {/* Simulated Heatmap */}
                      <div className="absolute inset-0 opacity-20 mix-blend-multiply bg-[radial-gradient(circle_at_center,rgba(30,200,165,0.4)_0%,rgba(76,175,144,0.2)_40%,transparent_70%)] animate-pulse pointer-events-none" />
                      
                      <div className="relative bg-white shadow-xl p-6 rounded-xl flex flex-col items-center gap-4 text-center border border-[#E6F7F2] m-4 w-3/4">
                        <div className="w-12 h-12 rounded-full bg-[#E6F7F2] flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-[#1EC8A5]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#1F2937] mb-1">{detectedDisease.name}</h3>
                          <p className="text-sm font-semibold text-[#1EC8A5]">Confidence: {detectedDisease.confidence}%</p>
                        </div>
                        <div className="w-full flex flex-col gap-2 text-xs mt-2 border-t border-[#F2FBF7] pt-4 text-left">
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Severity Level:</span>
                            <span className={cn("font-medium", detectedDisease.risk === "High" ? "text-red-500" : detectedDisease.risk === "Moderate" ? "text-orange-500" : "text-[#4CAF90]")}>{detectedDisease.risk}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Recommended Action:</span>
                            <span className="text-[#1F2937] font-medium">{detectedDisease.treatability}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Analysis Time:</span>
                            <span className="text-[#1F2937] font-mono">{analysisTime}s</span>
                          </div>
                        </div>

                        {/* Voice Output Button */}
                        <button 
                          onClick={playVoiceOutput}
                          className={cn(
                            "absolute top-4 right-4 p-2 rounded-full transition-colors",
                            isSpeaking ? "bg-[#00F2FF]/20 text-[#00F2FF] animate-pulse" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                          )}
                          title="Read Results Aloud"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Close button */}
                  {analysis.status !== "analyzing" && (
                    <button
                      onClick={resetAnalysis}
                      className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-5 h-5 text-[#1F2937]" />
                    </button>
                  )}
                </div>

                {/* Analysis Progress */}
                {analysis.status !== "idle" && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {analysis.status === "analyzing" ? (
                          <Brain className="w-5 h-5 text-[#2A7FFF] animate-pulse" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-[#4CAF90]" />
                        )}
                        <span className="text-sm text-[#1F2937] font-medium">
                          {analysis.stage}
                        </span>
                      </div>
                      <span className="text-sm text-[#2A7FFF] font-mono font-semibold">
                        {Math.round(analysis.progress)}%
                      </span>
                    </div>
                    <Progress value={analysis.progress} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                {analysis.status === "idle" && (
                  <Button
                    onClick={startAnalysis}
                    className="w-full mt-6 bg-[#1EC8A5] text-white font-semibold py-6 text-lg hover:bg-[#17A589] transition-colors shadow-md"
                  >
                    <Scan className="w-5 h-5 mr-2" />
                    Analyze Skin
                  </Button>
                )}

                {analysis.status === "complete" && (
                  <div className="flex gap-4 mt-6">
                    <Button
                      onClick={resetAnalysis}
                      variant="outline"
                      className="flex-1 border-[#D1E5F9] text-[#2A7FFF] hover:bg-[#EAF4FF] transition-colors"
                    >
                      Scan Another
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-[#1EC8A5] text-white font-semibold hover:bg-[#17A589] shadow-md transition-colors"
                    >
                      <a href="#results">View Results</a>
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Guidelines */}
            <div className="bg-[#F2FBF7] shadow-sm p-6 rounded-xl border border-[#B2DFDB]">
              <h4 className="text-sm font-semibold text-[#1F2937] mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1EC8A5]" />
                Image Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-[#6B7280]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1EC8A5] mt-1.5" />
                  Ensure good lighting and clear focus
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A7FFF] mt-1.5" />
                  Capture the affected area directly
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF90] mt-1.5" />
                  Include surrounding healthy skin for comparison
                </li>
              </ul>
            </div>
          </div>

          {/* CSS Visualization */}
          <div className="relative h-[500px] hidden lg:block">
            <ScanVisual analyzing={analysis.status === "analyzing"} />

            {/* Floating Stats */}
            <div className="absolute top-10 left-0 bg-[#F2FBF7] p-4 rounded-xl animate-float shadow-lg border border-[#E6F7F2]">
              <div className="text-xs text-[#6B7280] font-semibold mb-1">ResNet-50 Parameters</div>
              <div className="text-2xl font-bold text-[#1EC8A5]">25.6M</div>
            </div>

            <div className="absolute bottom-10 right-0 bg-[#F2FBF7] p-4 rounded-xl animate-float shadow-lg border border-[#E6F7F2]" style={{ animationDelay: "0.5s" }}>
              <div className="text-xs text-[#6B7280] font-semibold mb-1">Neural Layers</div>
              <div className="text-2xl font-bold text-[#1EC8A5]">176</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
