import React, { useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'
import {
  Download,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Info,
  ShieldCheck,
  Home,
} from 'lucide-react'
import type { PredictionResponse } from '../api'
import { diseaseDefinitionMap, type DiseaseDefinition } from '../diseaseConfig'
import { generatePDF } from '../utils/pdfGenerator'

type ResultLocationState = {
  disease?: string
  result: PredictionResponse
  inputData: Record<string, string>
}

const fallbackState: ResultLocationState = {
  disease: 'stroke',
  result: { risk_score: 0, risk_level: 'Unknown', top_factors: [] },
  inputData: {},
}

const formatLabel = (value: string) =>
  value
    .replaceAll('_', ' ')
    .replaceAll('(', ' (')
    .trim()

const ResultDashboard: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const reportRef = useRef<HTMLDivElement>(null)

  const { result, inputData, disease } =
    (location.state as ResultLocationState | null) ?? fallbackState

  const definition: DiseaseDefinition =
    diseaseDefinitionMap[disease ?? result.disease ?? 'stroke'] ?? diseaseDefinitionMap.stroke

  if (!location.state) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>No report data is available.</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Return to Home
        </button>
      </div>
    )
  }

  const riskColor =
    result.risk_level === 'High'
      ? 'var(--danger-color)'
      : result.risk_level === 'Moderate'
        ? 'var(--warning-color)'
        : 'var(--success-color)'

  const metricData = useMemo(
    () =>
      definition.metrics
        .map((metric) => ({
          name: metric.label,
          value: Number(inputData[metric.key] ?? 0),
          normal: metric.baseline,
        }))
        .filter((metric) => !Number.isNaN(metric.value)),
    [definition.metrics, inputData],
  )

  const patientData = useMemo(
    () =>
      Object.entries(inputData)
        .filter(([, value]) => value !== '')
        .map(([key, value]) => ({
          label: formatLabel(key),
          value,
        })),
    [inputData],
  )

  const pieData = [
    { name: 'Risk', value: result.risk_score },
    { name: 'Safe', value: 100 - result.risk_score },
  ]

  const handleDownload = () => {
    generatePDF(result, inputData, definition)
  }

  return (
    <div className="page-fade-in" style={{ paddingBottom: '100px' }}>
      <div
        className="page-header-shell"
        style={{
          background: 'var(--surface-strong)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 0',
          marginBottom: '40px',
        }}
      >
        <div className="container page-header-row">
          <div className="page-brand-row" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                fontFamily: 'Space Grotesk, sans-serif',
                color: 'var(--primary-color)',
              }}
            >
              NeuroGuard
            </span>
          </div>
          <div className="page-header-actions">
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary page-header-btn"
              style={{ padding: '8px 16px' }}
            >
              <Home size={18} /> Home
            </button>
            <button
              onClick={() => navigate(`/predict?disease=${definition.slug}`)}
              className="btn btn-secondary page-header-btn"
              style={{ padding: '8px 16px' }}
            >
              <RefreshCcw size={18} /> New Review
            </button>
            <button
              onClick={handleDownload}
              className="btn btn-primary page-header-btn"
              style={{ padding: '8px 20px' }}
            >
              <Download size={18} /> Download Report
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="result-pill">
            <ShieldCheck size={18} /> Report Ready
          </div>
          <h2 className="results-title" style={{ fontSize: '2.5rem' }}>
            {definition.title} Report
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Generated from the submitted clinical inputs for {definition.title.toLowerCase()} review
          </p>
        </div>

        <div ref={reportRef} className="results-grid">
          <div className="glass-panel result-score-card">
            <h3 className="result-section-label">Risk Summary</h3>

            <div className="result-chart-wrap" style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 32px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={riskColor} />
                    <Cell fill="var(--surface-hover)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {Math.round(result.risk_score)}
                  <span style={{ fontSize: '1.25rem', opacity: 0.6 }}>%</span>
                </div>
              </div>
            </div>

            <div
              style={{
                padding: '12px 32px',
                borderRadius: '100px',
                backgroundColor: `${riskColor}15`,
                color: riskColor,
                fontWeight: 700,
                display: 'inline-block',
                margin: '0 auto 40px',
                fontSize: '1.1rem',
                border: `1px solid ${riskColor}30`,
              }}
            >
              {result.risk_level} Risk Level
            </div>

            <div style={{ textAlign: 'left', marginTop: '16px' }}>
              <h4 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
                <Info size={18} color="var(--primary-color)" /> Risk Factors Detected
              </h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                {result.top_factors.map((factor: string, i: number) => (
                  <div key={i} className="result-factor-card">
                    {result.risk_level === 'High' ? (
                      <AlertTriangle size={18} color="var(--danger-color)" />
                    ) : (
                      <CheckCircle size={18} color="var(--success-color)" />
                    )}
                    <span style={{ lineHeight: 1.4 }}>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div className="glass-panel result-panel">
              <h3 style={{ marginBottom: '32px', fontSize: '1.25rem' }}>Indicator Comparison</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metricData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-hover)" horizontal={false} />
                    <XAxis type="number" stroke="var(--text-secondary)" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="var(--text-primary)" fontSize={12} fontWeight={600} />
                    <Tooltip
                      cursor={{ fill: 'var(--surface-hover)' }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-md)',
                      }}
                    />
                    <Bar dataKey="value" fill="var(--primary-color)" radius={[0, 6, 6, 0]} name="Submitted Value" barSize={32} />
                    <Bar dataKey="normal" fill="var(--chart-neutral)" radius={[0, 6, 6, 0]} name="Reference Value" barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '24px', fontStyle: 'italic' }}>
                * Reference values are displayed for visual context within the selected assessment.
              </p>
            </div>

            <div className="glass-panel result-panel">
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Interpretation</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.7 }}>
                The submitted profile is currently classified within the{' '}
                <strong>{result.risk_level.toLowerCase()}</strong> risk range for{' '}
                {definition.title.toLowerCase()}. This summary should be interpreted together with
                clinical context and professional review.
              </p>
              <div className="result-guidance-card">
                <h4 style={{ color: 'var(--primary-color)', marginBottom: '12px' }}>Recommended Next Steps:</h4>
                <ul style={{ paddingLeft: '20px', color: 'var(--text-primary)', fontSize: '0.95rem', display: 'grid', gap: '10px' }}>
                  {definition.recommendations.map((recommendation) => (
                    <li key={recommendation}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="glass-panel result-panel">
              <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Submitted Information</h3>
              <div className="submitted-input-grid">
                {patientData.map((item) => (
                  <div key={item.label} className="submitted-input-card">
                    <span>{item.label}</span>
                    <strong>{String(item.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultDashboard
