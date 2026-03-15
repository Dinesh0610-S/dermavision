"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar, TrendingUp, ChevronRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { getApiUrl } from "@/lib/api-config"

const timelineData = [
  { day: 1, title: "Initial Scan", change: 0, status: "baseline", notes: "Severe inflammation detected. Assigned clinical plan." },
  { day: 30, title: "Current Status", change: 0, status: "excellent", notes: "Awaiting analysis of your current skin condition." },
]

export function HealingTimeline() {
  const [timelineState, setTimelineState] = useState(timelineData)
  const [selectedDay, setSelectedDay] = useState(timelineState[timelineState.length - 1])
  const container = useRef<HTMLDivElement>(null)

  const [day1File, setDay1File] = useState<File | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [day1Preview, setDay1Preview] = useState<string | null>(null)
  const [currentPreview, setCurrentPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any | null>(null)

  useGSAP(() => {
    // Animate the timeline connecting line growing downward
    gsap.fromTo(".timeline-line", 
      { height: "0%" }, 
      { height: "100%", duration: 2, ease: "power2.inOut" }
    )
    
    // Animate the timeline points popping in
    gsap.fromTo(".timeline-point",
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, stagger: 0.2, duration: 0.8, ease: "back.out(1.7)", delay: 0.2 }
    )
    
    // Animate the Regeneration Progress Bar
    const changeVal = result ? result.healing_percentage : selectedDay.change;
    gsap.fromTo(".regeneration-bar",
      { width: "0%" },
      { width: `${changeVal}%`, duration: 1.5, ease: "power3.out" }
    )
  }, { scope: container, dependencies: [selectedDay, result] })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'day1' | 'current') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'day1') {
        setDay1File(file)
        setDay1Preview(URL.createObjectURL(file))
      } else {
        setCurrentFile(file)
        setCurrentPreview(URL.createObjectURL(file))
        // Assuming user usually selects Day 1 first, picking Current means they are ready
      }
    }
  }

  // Auto-trigger analysis when both files are selected
  useEffect(() => {
    const triggerAnalysis = async () => {
      if (!day1File || !currentFile) return
      
      setLoading(true)
      const formData = new FormData()
      formData.append("day1_image", day1File)
      formData.append("current_image", currentFile)

      try {
        const response = await fetch(getApiUrl("/api/compare_healing"), {
          method: "POST",
          body: formData,
        })
        const data = await response.json()
        if (data.success) {
          setResult(data)
          // Update timeline state dynamically
          setTimelineState(prev => prev.map(pt => 
            pt.day === 30 ? { ...pt, change: data.healing_percentage, notes: data.clinical_note } : pt
          ))
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    triggerAnalysis()
  }, [day1File, currentFile])

  const displayChange = result ? result.healing_percentage : selectedDay.change
  const displayNotes = result ? result.clinical_note : selectedDay.notes
  
  // Dynamic labels for comparison
  const day1Label = "Day 1 Baseline"
  const currentLabel = result ? (result.healing_percentage > 0 ? "Improving Stage" : "Current Checkup") : "Target Day"
  const displayDayLabel = selectedDay.day === 30 ? "Current" : `Day ${selectedDay.day}`

  return (
    <div className="w-full max-w-5xl mx-auto" ref={container}>
      <div className="mb-8 pl-4">
        <h2 className="text-3xl font-bold tracking-tight text-[#111827] flex items-center gap-2 mb-2">
          <TrendingUp className="w-8 h-8 text-[#1EC8A5]" strokeWidth={2.5} />
          Healing Journey
        </h2>
        <p className="text-[#6B7280] max-w-2xl font-medium">
          Track your progress from Day 1 to recovery. The AI calculates healing velocity based on visual markers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Timeline Path (Left Sidebar) */}
        <div className="md:col-span-4 border-r border-[#E5E7EB] pr-8 relative">
          <div className="timeline-line absolute top-0 bottom-0 left-[23px] w-[1px] bg-[#1EC8A5]" />
          
          <div className="space-y-12 relative py-4">
            {timelineState.map((point) => (
              <div 
                key={point.day}
                onClick={() => setSelectedDay(point)}
                className={`timeline-point flex gap-5 cursor-pointer rounded-xl transition-all group`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 bg-[#F8FCFA] transition-all duration-300 ${
                  selectedDay.day === point.day 
                    ? "border-2 border-[#1EC8A5] text-[#111827] shadow-[0_0_15px_rgba(30,200,165,0.2)]" 
                    : "border border-[#E5E7EB] text-[#6B7280] group-hover:border-[#1EC8A5]/50 group-hover:text-[#111827]"
                }`}>
                  <span className="font-semibold text-xs">{point.day === 30 ? "Now" : point.day}</span>
                </div>
                <div className="pt-2">
                  <h4 className="font-bold text-[#111827] text-sm">{point.title}</h4>
                  <div className="flex items-center mt-1">
                    {(point.day === 1) ? (
                      <span className="text-[13px] text-[#6B7280] font-medium">Baseline Scan</span>
                    ) : (result || point.change > 0) ? (
                      <span className="text-[13px] text-[#1EC8A5] font-bold flex gap-1 items-center">
                        <TrendingUp className="w-3.5 h-3.5" /> +{point.day === 30 ? (result?.healing_percentage ?? point.change) : point.change}% improved
                      </span>
                    ) : (
                      <span className="text-[13px] text-[#6B7280] font-medium">Awaiting Analysis...</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison View (Right Sidebar) */}
        <div className="md:col-span-8">
          <div className="bg-[#Fdfefa] rounded-[24px] p-8 border border-[#F3F4F6] shadow-xl relative overflow-hidden">
             
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[1.35rem] font-bold text-[#111827] flex items-center gap-2 tracking-tight">
                <Calendar className="w-5 h-5 text-[#1EC8A5]" strokeWidth={2.5}/>
                {displayDayLabel} Analysis
              </h3>
              {selectedDay.day === 30 && (
                <span className="px-3.5 py-1.5 rounded-full bg-[#E6F7F2] border border-[#1EC8A5]/20 text-[#1EC8A5] text-xs font-bold tracking-wide">
                  Current Stage
                </span>
              )}
            </div>
            
            <div className="flex justify-between px-10 mb-3">
               <span className="text-xs text-[#6B7280] font-bold uppercase tracking-widest">{day1Label}</span>
               <span className="text-xs text-[#1EC8A5] font-bold uppercase tracking-widest absolute right-[23.5%] md:static md:right-auto">{displayDayLabel === "Current" ? "Current Day" : displayDayLabel}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-10 relative items-center">
              {/* Day 1 baseline */}
              <label className="aspect-[4/5] bg-[#FaFbFc] rounded-[24px] border border-[#E5E7EB] hover:border-[#B2DFDB] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all shadow-sm">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'day1')} />
                {day1Preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={day1Preview} alt="Day 1" className="absolute inset-0 w-full h-full object-cover rounded-[24px]" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                     <AlertCircle className="w-8 h-8 text-[#FCA5A5] mb-2 stroke-[2px]" />
                  </div>
                )}
              </label>

              {/* Arrow indicator between them */}
              <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-sm">
                <ChevronRight className="w-4 h-4 text-[#9CA3AF]" strokeWidth={2.5}/>
              </div>

              {/* Selected Day */}
              <label className="aspect-[4/5] bg-[#FaFbFc] rounded-[24px] border border-[#1EC8A5]/40 hover:border-[#1EC8A5] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer transition-all shadow-sm">
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'current')} />
                {currentPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={currentPreview} alt="Current" className="absolute inset-0 w-full h-full object-cover rounded-[24px]" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                     <CheckCircle2 className="w-9 h-9 text-[#86EFAC] mb-2 stroke-[2.5px]" />
                  </div>
                )}
              </label>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 text-[#1EC8A5] font-bold mb-6 animate-pulse text-sm tracking-wide">
                 <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Mathematical Dynamics...
              </div>
            )}

            <div className="mb-6 space-y-2.5">
              <div className="flex justify-between items-end">
                <span className="text-[13.5px] text-[#374151] font-bold tracking-tight">Healing Velocity</span>
                <span className="text-[14.5px] text-[#1EC8A5] font-bold font-mono">{displayChange}%</span>
              </div>
              <div className="h-[8px] w-full bg-[#E5E7EB] rounded-full overflow-hidden">
                <div 
                  className="regeneration-bar h-full bg-[#1EC8A5] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${displayChange}%` }}
                />
              </div>
            </div>

            {/* AI Notes */}
            <div className="bg-[#f0faf7] rounded-[24px] p-6 mt-4">
              <p className="font-bold text-[11px] text-[#374151] mb-2 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1EC8A5]" /> AI Clinical Note
              </p>
              <p className="text-[14px] text-[#374151] font-medium leading-[1.6]">
                {displayNotes}
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
