"use client"

import { useState } from "react"
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  Activity,
  FileText,
  Share2,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const analysisResults = {
  condition: "Seborrheic Keratosis",
  confidence: 94.7,
  severity: "Moderate",
  riskLevel: "Low",
  recommendations: [
    "Monitor for changes in size or color",
    "Avoid scratching or picking at the lesion",
    "Use a gentle moisturizer daily",
    "Schedule a routine dermatological exam"
  ],
  relatedConditions: [
    { name: "Nevus", probability: 12.3 },
    { name: "Benign Keratosis", probability: 8.7 },
    { name: "Melanoma", probability: 5.2 },
    { name: "Actinic Keratosis", probability: 3.1 }
  ]
}

function ConfidenceRing({ confidence }: { confidence: number }) {
  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (confidence / 100) * circumference

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-48 h-48 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="96"
          cy="96"
          r="70"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-[#EAF4FF]"
        />
        {/* Progress circle */}
        <circle
          cx="96"
          cy="96"
          r="70"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transition: "stroke-dashoffset 1s ease-in-out"
          }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1EC8A5" />
            <stop offset="100%" stopColor="#4CAF90" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-[#1F2937]">{confidence}%</span>
        <span className="text-sm text-[#6B7280]">Confidence</span>
      </div>
    </div>
  )
}

function SeverityIndicator({ severity }: { severity: string }) {
  const severityConfig = {
    Low: { color: "#4CAF90", icon: CheckCircle2, bg: "bg-[#E8F5E9]" },
    Moderate: { color: "#FFB74D", icon: AlertTriangle, bg: "bg-[#FFF3E0]" },
    High: { color: "#EF5350", icon: AlertTriangle, bg: "bg-[#FFEBEE]" },
  }

  const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.Low
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-full", config.bg)}>
      <Icon className="w-4 h-4" style={{ color: config.color }} />
      <span className="text-sm font-bold" style={{ color: config.color }}>
        {severity}
      </span>
    </div>
  )
}

export function ResultsDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "recommendations">("overview")

  const handleDownload = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        /* Screen-only utility to hide report from web view */
        @media screen {
          .print-only-report { display: none !important; }
        }

        @media print {
          /* 200% LOCK: Total Layout Reset */
          @page {
            margin: 0 !important;
            size: portrait;
          }

          /* Reset ALL ancestors to prevent ghost heights/margins */
          html, body, #__next, main {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            position: relative !important;
            -webkit-print-color-adjust: exact;
          }

          /* FORCE HIDE all web-only elements - INCLUDING PRELOADER & 3D CANVAS */
          .no-print,
          .preloader-container,
          #navbar, #hero, #analysis, #education, #results, #scan,
          header, footer, nav, aside,
          canvas, [class*="canvas"], [class*="Canvas"],
          .HeroVisual, [class*="ConfidenceRing"], [class*="Visualization"],
          [class*="Stats"], [class*="Orb"], [class*="ParticleSystem"] {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }

          /* Viewport-Locked Clinical Report */
          #clinical-pdf-root {
            display: block !important;
            visibility: visible !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 98vh !important;
            background: white !important;
            color: black !important;
            padding: 10mm 15mm !important;
            margin: 0 !important;
            z-index: 9999999 !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
          }

          /* Restore content visibility inside report */
          #clinical-pdf-root * {
            color: black !important;
            visibility: visible !important;
            background-color: transparent !important;
          }

          /* Layout preservation */
          #clinical-pdf-root .report-grid { display: grid !important; }
          #clinical-pdf-root .text-brand { color: #1EC8A5 !important; }
        }
      `}</style>

      {/* Print Only Medical Report - Viewport Anchored Wrapper */}
      <div id="clinical-pdf-root" className="print-only-report">
        {/* Header - Restored High-Quality Style */}
        <div style={{ padding: '0 0 10px 0', borderBottom: '3px solid #1EC8A5', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1F2937', margin: 0 }}>DermaVision AI</h1>
            <p className="text-brand" style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px 0 0 0' }}>Clinical Diagnostic Report</p>
            <p style={{ fontSize: '14px', color: '#1F2937', marginTop: '8px', borderLeft: '3px solid #1EC8A5', paddingLeft: '10px' }}>
              <strong>Patient Care:</strong> {typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('derma_active_user') || '{}').name || 'John Doe') : 'John Doe'}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>Report ID: DV-{Math.floor(Math.random() * 1000000)}</p>
          </div>
        </div>

        {/* Diagnosis Results */}
        <div style={{ marginBottom: '20px', display: 'block', width: '100%' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px', backgroundColor: '#F8FCFA', padding: '8px 15px', borderRadius: '8px', borderLeft: '5px solid #1EC8A5', width: '100%' }}>
            Primary Analysis Results
          </h2>
          <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '15px', width: '100%' }}>
            <div style={{ padding: '12px', border: '1px solid #B2DFDB', borderRadius: '12px', background: '#F8FCFA' }}>
              <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', fontWeight: 'bold' }}>Detected Condition</p>
              <p className="text-brand" style={{ fontSize: '18px', fontWeight: 'bold' }}>{analysisResults.condition}</p>
            </div>
            <div style={{ padding: '12px', border: '1px solid #B2DFDB', borderRadius: '12px', background: '#F8FCFA' }}>
              <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', fontWeight: 'bold' }}>AI Confidence Score</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF90' }}>{analysisResults.confidence}%</p>
            </div>
          </div>
          
          <div style={{ background: '#F9FAFB', padding: '15px', borderRadius: '12px', border: '1px solid #E5E7EB', width: '100%', display: 'block' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>Condition Overview</h3>
            <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#4B5563', margin: 0 }}>
              Seborrheic keratosis is a common benign skin growth. It typically appears as a waxy, scaly, slightly elevated growth on the face, chest, shoulders or back. These are non-cancerous and not contagious. 
            </p>
          </div>
        </div>

        {/* Consolidated Care Protocol */}
        <div style={{ display: 'block', width: '100%' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937', marginBottom: '12px', backgroundColor: '#F8FCFA', padding: '8px 15px', borderRadius: '8px', borderLeft: '5px solid #1EC8A5', width: '100%' }}>
            Nutrition & Care Protocol
          </h2>
          
          <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', width: '100%' }}>
            {/* Care Steps */}
            <div>
              <p className="text-brand" style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>Recommended Care:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {analysisResults.recommendations.map((rec, index) => (
                  <div key={index} style={{ fontSize: '12px', color: '#374151', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <span className="text-brand" style={{ fontWeight: 'bold' }}>✓</span>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Guidelines */}
            <div style={{ padding: '12px', background: '#E6F7F2', borderRadius: '10px', border: '1px solid #B2DFDB' }}>
              <p className="text-brand" style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>Nutrition Focus</p>
              <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '11px', color: '#374151', lineHeight: '1.5' }}>
                <li>Antioxidant-rich whole foods</li>
                <li>Omega-3 fatty acids</li>
                <li>Vitamin E rich sources</li>
                <li>Hydrating fruits and vegetables</li>
              </ul>
            </div>
          </div>

          <div style={{ marginTop: '15px', padding: '12px', background: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A', width: '100%' }}>
            <p style={{ fontSize: '10px', color: '#92400E', lineHeight: '1.4', margin: 0 }}>
              <strong>Disclaimer:</strong> This automated report is for informational purposes. If you notice rapid changes in lesion appearance, please consult a dermatologist immediately.
            </p>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '10px', width: '100%' }}>
            <p style={{ fontSize: '10px', color: '#9CA3AF', margin: 0 }}>DermaVision AI Pathological Analysis | www.dermavision.ai</p>
          </div>
        </div>
      </div>

      <section id="results" className="relative py-20 lg:py-32 no-print">

      <div className="absolute inset-0 bg-[#F2FBF7]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#1EC8A5]/30 shadow-sm mb-6">
            <Activity className="w-4 h-4 text-[#1EC8A5]" />
            <span className="text-sm text-[#1EC8A5] font-bold">AI Analysis Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2937] mb-4 text-balance">
            Diagnostic Report
          </h2>
          <p className="text-lg text-[#6B7280] max-w-2xl mx-auto text-pretty font-medium">
            Comprehensive analysis powered by our neural network with over 2 million training samples.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Results Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Diagnosis */}
            <div className="bg-[#F8FCFA] rounded-2xl p-6 lg:p-8 border border-[#B2DFDB] shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm text-[#6B7280] font-semibold mb-2">Primary Diagnosis</div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[#1EC8A5]">
                    {analysisResults.condition}
                  </h3>
                </div>
                <SeverityIndicator severity={analysisResults.severity} />
              </div>

              {/* Confidence Bar */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280] font-semibold">AI Confidence Score</span>
                  <span className="text-lg font-bold text-[#4CAF90]">
                    {analysisResults.confidence}%
                  </span>
                </div>
                <div className="relative h-3 bg-[#E6F7F2] rounded-full overflow-hidden border border-[#B2DFDB]">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#1EC8A5] to-[#4CAF90] rounded-full transition-all duration-1000"
                    style={{ width: `${analysisResults.confidence}%` }}
                  />
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(["overview", "details", "recommendations"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                      activeTab === tab
                        ? "bg-[#E6F7F2] text-[#1EC8A5] border border-[#1EC8A5]/20"
                        : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#E6F7F2] border border-transparent"
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <p className="text-[#6B7280] font-medium leading-relaxed">
                    Seborrheic keratosis is one of the most common noncancerous skin growths in older adults. 
                    It typically appears as a brown, black or light tan growth on the face, chest, shoulders or back. 
                    The growth has a waxy, scaly, slightly elevated appearance. They are completely harmless and not contagious.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#E6F7F2] border border-[#B2DFDB]">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-[#1EC8A5]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#6B7280] font-semibold">Risk Level</div>
                        <div className="font-bold text-[#1F2937]">{analysisResults.riskLevel}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-[#E6F7F2] border border-[#B2DFDB]">
                      <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#4CAF90]" />
                      </div>
                      <div>
                        <div className="text-sm text-[#6B7280] font-semibold">Treatability</div>
                        <div className="font-bold text-[#1F2937]">Highly Treatable</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-[#1F2937]">Differential Diagnosis</h4>
                  <div className="space-y-3">
                    {analysisResults.relatedConditions.map((condition, index) => (
                      <div key={condition.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-[#E6F7F2] flex items-center justify-center text-xs text-[#1EC8A5] font-bold border border-[#B2DFDB]">
                            {index + 1}
                          </span>
                          <span className="text-[#1F2937] font-medium">{condition.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-[#E6F7F2] rounded-full overflow-hidden border border-[#B2DFDB]">
                            <div 
                              className="h-full bg-gradient-to-r from-[#1EC8A5] to-[#4CAF90] rounded-full"
                              style={{ width: `${condition.probability * 4}%` }}
                            />
                          </div>
                          <span className="text-sm text-[#6B7280] font-semibold w-12 text-right">
                            {condition.probability}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="space-y-4">
                  <h4 className="font-bold text-[#1F2937]">Treatment Recommendations</h4>
                  <ul className="space-y-3">
                    {analysisResults.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E6F7F2] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#1EC8A5]/20">
                          <CheckCircle2 className="w-4 h-4 text-[#1EC8A5]" />
                        </div>
                        <span className="text-[#1F2937] font-medium">{rec}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 p-4 rounded-xl bg-[#FFF3E0] border border-[#FFB74D]/30">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#FFB74D] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[#1F2937] font-medium">
                        <span className="font-bold text-[#FFB74D]">Important:</span> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult a dermatologist for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[#B2DFDB] mt-6 no-print">
                <Button 
                  onClick={handleDownload}
                  className="flex-1 bg-[#1EC8A5] hover:bg-[#17A589] text-white shadow-md font-semibold"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </div>

          {/* Visualization & Stats */}
          <div className="space-y-6">
            {/* Confidence Ring */}
            <div className="bg-[#F8FCFA] rounded-2xl p-6 h-[300px] border border-[#B2DFDB] shadow-lg">
              <h4 className="text-sm font-bold text-[#1F2937] mb-4">Confidence Visualization</h4>
              <ConfidenceRing confidence={analysisResults.confidence} />
            </div>

            {/* Quick Stats */}
            <div className="bg-[#F8FCFA] rounded-2xl p-6 border border-[#B2DFDB] shadow-lg">
              <h4 className="text-sm font-bold text-[#1F2937] mb-4">Analysis Metrics</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280] font-semibold">Processing Time</span>
                  <span className="text-sm font-bold text-[#1EC8A5]">24.3s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280] font-semibold">Images Analyzed</span>
                  <span className="text-sm font-bold text-[#1EC8A5]">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280] font-semibold">Neural Layers Used</span>
                  <span className="text-sm font-bold text-[#4CAF90]">176</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280] font-semibold">Database Matches</span>
                  <span className="text-sm font-bold text-[#1F2937]">2,847</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
    </>
  )
}
