"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, RefreshCw, Layers, Droplet, Activity, ScanLine, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getApiUrl } from "@/lib/api-config"

export function SmartMirrorView() {
  const [isActive, setIsActive] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  
  // Real-time metrics simulation
  const [metrics, setMetrics] = useState({
    hydration: 68,
    texture: 82,
    redness: 12,
  })

  // Real-time AI Model Connection
  const [prediction, setPrediction] = useState({
    disease: "Scanning...",
    confidence: 0
  })

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive) {
      interval = setInterval(async () => {
        setMetrics({
          hydration: 60 + Math.floor(Math.random() * 20),
          texture: 75 + Math.floor(Math.random() * 15),
          redness: 5 + Math.floor(Math.random() * 15),
        })

        // Fetch the raw real-time detection from the Python backend
        try {
          const res = await fetch(getApiUrl("/api/latest_prediction"))
          const data = await res.json()
          setPrediction({
            disease: data.disease,
            confidence: data.confidence
          })
        } catch (error) {
          console.error("Failed to fetch live prediction", error)
        }
      }, 1000) // Polling every second for visual snappiness
    }
    return () => clearInterval(interval)
  }, [isActive])

  useEffect(() => {
    if (isActive && scanProgress < 100) {
      const timer = setInterval(() => {
        setScanProgress((prev) => Math.min(prev + 5, 100))
      }, 100)
      return () => clearInterval(timer)
    }
    if (!isActive) {
      setScanProgress(0)
    }
  }, [isActive, scanProgress])

  const toggleCamera = async () => {
    if (isActive) {
      try {
        await fetch(getApiUrl("/api/stop_camera"), { method: "POST" })
        
        // Save scan results
        let activeUserId = 1
        try {
          const userStr = localStorage.getItem("derma_active_user")
          if (userStr) {
            const user = JSON.parse(userStr)
            if (user.id) activeUserId = user.id
          }
        } catch (e) { console.error(e) }

        await fetch(getApiUrl("/api/save_smart_mirror"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: activeUserId,
                image_path: "/static/uploads/mirror_cap_" + Date.now() + ".jpg", 
                redness_score: metrics.redness,
                hydration_level: metrics.hydration,
                pore_score: metrics.texture,
                acne_score: prediction.confidence,
                analysis_summary: prediction.disease
            })
        })
      } catch (error) {
        console.error("Failed to stop and save camera data:", error)
      }
    }
    setIsActive(!isActive)
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1F2937] flex items-center gap-2">
            <ScanLine className="w-8 h-8 text-[#1EC8A5]" />
            DermaVision Smart Mirror
          </h2>
          <p className="text-[#6B7280] mt-2 max-w-2xl font-medium">
            Live AI stream for real-time skin texture, hydration monitoring, and early anomaly detection.
          </p>
        </div>
        <button
          onClick={toggleCamera}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all shadow-md",
            isActive 
              ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200" 
              : "bg-[#1EC8A5] text-white hover:bg-[#17A589]"
          )}
        >
          {isActive ? (
            <>
              <XCircle className="w-5 h-5" />
              End Session
            </>
          ) : (
            <>
              <Camera className="w-5 h-5" />
              Activate Mirror
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Mirror View */}
        <div className="lg:col-span-2 relative aspect-video bg-white shadow-xl rounded-2xl overflow-hidden border border-[#B2DFDB]">
          {!isActive ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#6B7280] bg-[#F2FBF7]">
              <Camera className="w-16 h-16 mb-4 opacity-30 text-[#1EC8A5]" />
              <p className="font-semibold text-[#1F2937]">Camera inactive</p>
              <p className="text-sm">Click "Activate Mirror" to begin real-time analysis</p>
            </div>
          ) : (
            <>
              {/* Actual Video Feed from Python Backend */}
              {isActive && (
                <img
                  src={getApiUrl("/video_feed")}
                  alt="Live AI Stream"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }} // Mirror effect
                />
              )}
              
              {/* Scanning Overlay Effect */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#1EC8A5]/30 to-transparent animate-scan-line h-1/2 mix-blend-overlay" />
              
              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none grid-pattern opacity-20 mix-blend-overlay" />

              {/* AR HUD Elements Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#4CAF90]/30 text-[#4CAF90] text-xs font-mono font-bold flex items-center gap-2 shadow-md">
                    <span className="w-2 h-2 rounded-full bg-[#4CAF90] animate-pulse" />
                    LIVE ANALYSIS ACTIVE
                  </div>
                </div>

                {/* Main Facial Tracking Reticle */}
                {scanProgress > 10 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border border-[#1EC8A5]/40 rounded-full animate-in zoom-in duration-1000 flex items-center justify-center">
                    <div className="w-[102%] h-[102%] border-[3px] border-transparent border-t-[#1EC8A5]/60 border-b-[#1EC8A5]/60 rounded-full animate-spin-slow shadow-[0_0_20px_rgba(30,200,165,0.2)]" />
                  </div>
                )}

                {/* Dynamic Facial Nodes (Simulated) */}
                {scanProgress > 30 && (
                  <>
                    <div className="absolute top-[40%] text-center left-[60%] w-16 h-16 border-2 border-[#4CAF90]/70 rounded-lg pointer-events-none flex items-center justify-center bg-white/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-[20px] duration-500 shadow-sm">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#4CAF90] -translate-x-0.5 -translate-y-0.5" />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#4CAF90] translate-x-0.5 -translate-y-0.5" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#4CAF90] -translate-x-0.5 translate-y-0.5" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#4CAF90] translate-x-0.5 translate-y-0.5" />
                      <span className="absolute -bottom-7 text-[10px] text-[#4CAF90] font-mono font-bold bg-white px-2 py-0.5 border border-[#4CAF90]/30 rounded shadow-md whitespace-nowrap">Texture: Healthy</span>
                    </div>

                    <div className="absolute top-[55%] text-center left-[35%] w-12 h-12 border-2 border-[#1EC8A5]/70 rounded-full pointer-events-none flex items-center justify-center bg-white/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-[20px] duration-700 delay-300 shadow-sm">
                      <span className="absolute -left-28 text-[10px] text-[#1EC8A5] font-mono font-bold bg-white px-2 py-0.5 border border-[#1EC8A5]/30 rounded shadow-md whitespace-nowrap flex items-center gap-1">
                        <Droplet className="w-3 h-3" /> Hydration: Normal
                      </span>
                      {/* Line connecting label to node */}
                      <div className="absolute -left-6 top-1/2 w-6 h-[2px] bg-[#1EC8A5]/50" />
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Real-time Metrics Panel */}
        <div className="bg-[#F8FCFA] rounded-2xl p-6 border border-[#B2DFDB] shadow-lg flex flex-col gap-6 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#E6F7F2] rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-xl font-bold text-[#1F2937] flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#1EC8A5]" />
            Live Diagnostics
          </h3>

          <div className="space-y-6 flex-1">
            {/* Metric 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-[#6B7280] font-medium">
                  <Droplet className="w-4 h-4 text-[#1EC8A5]" />
                  Hydration Level
                </div>
                <span className="font-mono text-lg font-bold text-[#1EC8A5]">{isActive ? metrics.hydration : '--'}%</span>
              </div>
              <div className="h-2 w-full bg-[#E6F7F2] rounded-full overflow-hidden border border-[#B2DFDB]">
                <div 
                  className="h-full bg-[#1EC8A5] transition-all duration-1000 ease-out relative"
                  style={{ width: `${isActive ? metrics.hydration : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-[#6B7280] font-medium">
                  <Layers className="w-4 h-4 text-[#4CAF90]" />
                  Surface Texture
                </div>
                <span className="font-mono text-lg font-bold text-[#4CAF90]">{isActive ? metrics.texture : '--'}%</span>
              </div>
              <div className="h-2 w-full bg-[#F2FBF7] rounded-full overflow-hidden border border-[#B2DFDB]">
                <div 
                  className="h-full bg-[#4CAF90] transition-all duration-1000 ease-out relative"
                  style={{ width: `${isActive ? metrics.texture : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-[#6B7280] font-medium">
                  <RefreshCw className="w-4 h-4 text-[#FFB74D]" />
                  Erythema (Redness)
                </div>
                <span className="font-mono text-lg font-bold text-[#FFB74D]">{isActive ? metrics.redness : '--'}%</span>
              </div>
              <div className="h-2 w-full bg-[#F2FBF7] rounded-full overflow-hidden border border-[#B2DFDB]">
                <div 
                  className="h-full bg-[#FFB74D] transition-all duration-1000 ease-out relative"
                  style={{ width: `${isActive ? metrics.redness : 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" />
                </div>
              </div>
            </div>

            {/* AI Detect Component */}
            <div className="space-y-2 pt-4 border-t border-[#B2DFDB]">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-sm text-[#1F2937] font-semibold">
                  <Activity className="w-4 h-4 text-[#FF7043]" />
                  Differential Diagnosis
                </div>
                <span className="font-mono text-xl font-bold text-[#FF7043]">
                  {isActive ? prediction.disease : '--'}
                </span>
              </div>
              <div className="flex justify-between text-xs text-[#6B7280] font-medium mt-1">
                <span>Confidence Score</span>
                <span>{isActive ? prediction.confidence.toFixed(1) : 0}%</span>
              </div>
            </div>
          </div>

          {/* Assistant Note */}
          <div className="p-4 rounded-xl bg-[#E6F7F2] border border-[#1EC8A5]/20 text-sm">
            {!isActive ? (
              <span className="text-[#6B7280]">System standing by. Please activate the mirror to begin scanning.</span>
            ) : (
              <p className="text-[#1F2937] leading-relaxed animate-in fade-in duration-500 font-medium">
                <span className="text-[#1EC8A5] font-bold">AI Note:</span> Overall hydration looks good. Slight texture variation detected in the T-zone. Recommended to ask DermaVision Assistant about a tailored evening routine.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
