"use client"

import { useEffect, useState } from "react"

interface ReportData {
  patientName: string
  condition: string
  confidence: number
  severity: string
  treatability: string
  recommendations: string[]
  reportId: string
  date: string
}

const defaultData: ReportData = {
  patientName: "Patient",
  condition: "Seborrheic Keratosis",
  confidence: 94.7,
  severity: "Low",
  treatability: "Highly Treatable",
  recommendations: [
    "Monitor for changes in size or color",
    "Avoid scratching or picking at the lesion",
    "Use a gentle moisturizer daily",
    "Schedule a routine dermatological exam",
  ],
  reportId: `DV-${Math.floor(Math.random() * 1000000)}`,
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
}

export default function ReportPage() {
  const [data, setData] = useState<ReportData>(defaultData)

  useEffect(() => {
    // Load data from localStorage
    try {
      const user = JSON.parse(localStorage.getItem("derma_active_user") || "{}")
      const reportRaw = localStorage.getItem("derma_print_report")
      const report = reportRaw ? JSON.parse(reportRaw) : {}

      const riskMap: Record<string, { severity: string; treatability: string }> = {
        Acne: { severity: "Low", treatability: "Highly Treatable" },
        "Actinic Keratosis": { severity: "Moderate", treatability: "Treatable" },
        "Basal Cell Carcinoma": { severity: "Moderate", treatability: "Requires Clinical Intervention" },
        Chickenpox: { severity: "Low", treatability: "Highly Treatable" },
        "Dermato Fibroma": { severity: "Low", treatability: "Highly Treatable" },
        "Dyshidrotic Eczema": { severity: "Low", treatability: "Highly Treatable" },
        Melanoma: { severity: "High", treatability: "Requires Clinical Intervention" },
        "Nail Fungus": { severity: "Low", treatability: "Highly Treatable" },
        Nevus: { severity: "Low", treatability: "Highly Treatable" },
        "Normal Skin": { severity: "Low", treatability: "Healthy" },
        "Benign Keratosis": { severity: "Low", treatability: "Highly Treatable" },
        Ringworm: { severity: "Low", treatability: "Highly Treatable" },
        "Seborrheic Keratosis": { severity: "Low", treatability: "Highly Treatable" },
        "Squamous Cell Carcinoma": { severity: "High", treatability: "Requires Clinical Intervention" },
        "Vascular Lesions": { severity: "Low", treatability: "Treatable" },
      }

      const condition = report.condition || defaultData.condition
      const riskInfo = riskMap[condition] || { severity: "Moderate", treatability: "Consult a Dermatologist" }

      setData({
        patientName: user.name || "Patient",
        condition,
        confidence: report.confidence ?? defaultData.confidence,
        severity: report.severity || riskInfo.severity,
        treatability: riskInfo.treatability,
        recommendations: [
          "Monitor for changes in size or color",
          "Avoid scratching or picking at the lesion",
          "Use a gentle moisturizer daily",
          "Schedule a routine dermatological exam",
        ],
        reportId: `DV-${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      })
    } catch (e) {
      console.error("Could not load report data", e)
    }

    // Auto-print after sufficient delay so page renders fully and preloader fades
    const timer = setTimeout(() => {
      window.print()
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @page {
          size: A4 portrait;
          margin: 15mm;
        }
        
        html, body {
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1F2937;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .report-page {
          width: 100%;
          max-width: 210mm;
          margin: 0 auto;
          padding: 0;
        }

        @media print {
          /* Hide the preloader (black fullscreen overlay), canvas background, everything except the report */
          .preloader-container,
          canvas,
          [class*="Canvas"],
          [class*="canvas"],
          [class*="particle"],
          [class*="Particle"],
          .print-notice {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
            opacity: 0 !important;
          }

          html, body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            height: 100% !important;
          }

          .report-page {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
        }
        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-bottom: 12px;
          border-bottom: 3px solid #1EC8A5;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 36px;
          font-weight: 800;
          color: #1F2937;
          line-height: 1;
        }
        .header .subtitle {
          font-size: 18px;
          font-weight: 700;
          color: #1EC8A5;
          margin-top: 6px;
        }
        .header .patient-row {
          font-size: 14px;
          color: #1F2937;
          margin-top: 10px;
          border-left: 3px solid #1EC8A5;
          padding-left: 10px;
        }
        .header-right {
          text-align: right;
          font-size: 12px;
          color: #6B7280;
          line-height: 1.8;
        }

        /* Section header */
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1F2937;
          background: #F8FCFA;
          padding: 9px 16px;
          border-radius: 8px;
          border-left: 5px solid #1EC8A5;
          margin-bottom: 14px;
        }

        /* Diagnosis cards grid */
        .diag-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 14px;
        }
        .diag-card {
          padding: 14px;
          border: 1.5px solid #B2DFDB;
          border-radius: 12px;
          background: #F8FCFA;
        }
        .diag-card .label {
          font-size: 11px;
          color: #6B7280;
          font-weight: 700;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .diag-card .value-green { font-size: 20px; font-weight: 800; color: #1EC8A5; }
        .diag-card .value-dark  { font-size: 20px; font-weight: 800; color: #1F2937; }

        /* Overview box */
        .overview-box {
          background: #F9FAFB;
          padding: 14px 16px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          margin-bottom: 20px;
        }
        .overview-box h3 { font-size: 14px; font-weight: 700; color: #374151; margin-bottom: 7px; }
        .overview-box p  { font-size: 13px; line-height: 1.6; color: #4B5563; }

        /* Care section */
        .care-section { margin-bottom: 14px; }
        .care-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 16px;
        }
        .care-label { font-size: 13px; font-weight: 700; color: #1EC8A5; margin-bottom: 8px; }
        .care-item {
          display: flex;
          gap: 8px;
          align-items: flex-start;
          font-size: 12px;
          color: #374151;
          margin-bottom: 6px;
        }
        .care-check { color: #1EC8A5; font-weight: 700; }

        /* Nutrition box */
        .nutrition-box {
          background: #E6F7F2;
          border: 1.5px solid #B2DFDB;
          border-radius: 10px;
          padding: 14px;
        }
        .nutrition-box ul {
          list-style: none;
          font-size: 12px;
          color: #374151;
          line-height: 1.8;
        }
        .nutrition-box ul li::before { content: "• "; color: #1EC8A5; }

        /* Disclaimer */
        .disclaimer {
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: 8px;
          padding: 11px 14px;
          font-size: 10px;
          color: #92400E;
          line-height: 1.5;
          margin-top: 14px;
        }

        /* Footer */
        .footer {
          text-align: center;
          border-top: 1px solid #E5E7EB;
          padding-top: 10px;
          margin-top: 16px;
          font-size: 10px;
          color: #9CA3AF;
        }

        /* Screen: Show a friendly preview */
        @media screen {
          body { background: #f5f5f5; padding: 20px; }
          .report-page {
            background: white;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          .print-notice {
            background: #1EC8A5;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            margin-bottom: 20px;
            max-width: 210mm;
            margin-left: auto;
            margin-right: auto;
          }
        }
        @media print {
          .print-notice { display: none; }
        }
      `}</style>

      <div className="print-notice">
        📄 Preparing your Clinical Report — Print dialog will open automatically...
      </div>

      <div className="report-page">
        {/* Header */}
        <div className="header">
          <div>
            <h1>DermaVision AI</h1>
            <div className="subtitle">Clinical Diagnostic Report</div>
            <div className="patient-row">
              <strong>Patient Care:</strong> {data.patientName}
            </div>
          </div>
          <div className="header-right">
            <div>Date: {data.date}</div>
            <div>Report ID: {data.reportId}</div>
          </div>
        </div>

        {/* Primary Analysis */}
        <div className="section-title">Primary Analysis Results</div>
        <div className="diag-grid">
          <div className="diag-card">
            <div className="label">Detected Condition</div>
            <div className="value-green">{data.condition}</div>
          </div>
          <div className="diag-card">
            <div className="label">AI Confidence Score</div>
            <div className="value-dark">{data.confidence}%</div>
          </div>
        </div>

        {/* Severity row */}
        <div className="diag-grid">
          <div className="diag-card">
            <div className="label">Severity Level</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: data.severity === "High" ? "#EF5350" : data.severity === "Moderate" ? "#FFB74D" : "#4CAF90" }}>
              {data.severity}
            </div>
          </div>
          <div className="diag-card">
            <div className="label">Recommended Action</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{data.treatability}</div>
          </div>
        </div>

        {/* Overview */}
        <div className="overview-box">
          <h3>Condition Overview</h3>
          <p>
            {data.condition} is a commonly diagnosed skin condition identified by our AI. Accurate diagnosis requires reviewing clinical history and potentially consulting a certified dermatologist for confirmation and personalized treatment.
          </p>
        </div>

        {/* Care Protocol */}
        <div className="care-section">
          <div className="section-title">Nutrition &amp; Care Protocol</div>
          <div className="care-grid">
            <div>
              <div className="care-label">Recommended Care:</div>
              {data.recommendations.map((rec, i) => (
                <div key={i} className="care-item">
                  <span className="care-check">✓</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
            <div className="nutrition-box">
              <div className="care-label">Nutrition Focus</div>
              <ul>
                <li>Antioxidant-rich whole foods</li>
                <li>Omega-3 fatty acids</li>
                <li>Vitamin E rich sources</li>
                <li>Hydrating fruits and vegetables</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="disclaimer">
          <strong>Disclaimer:</strong> This automated report is for informational purposes only and does not constitute medical diagnosis. If you notice rapid changes in lesion appearance, consult a certified dermatologist immediately.
        </div>

        {/* Footer */}
        <div className="footer">
          DermaVision AI Pathological Analysis | www.dermavision.ai
        </div>
      </div>
    </>
  )
}
