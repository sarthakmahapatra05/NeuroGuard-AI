import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Activity, ArrowLeft, HeartPulse, Info, Loader2 } from 'lucide-react'
import { predictDisease } from '../api'
import {
  createInitialFormState,
  diseaseDefinitionMap,
  diseaseDefinitions,
  getAllFieldsForDisease,
  type DiseaseDefinition,
  type DiseaseField,
} from '../diseaseConfig'

const defaultDisease = 'stroke'

const PredictionForm: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const disease = searchParams.get('disease') ?? defaultDisease
  const definition = diseaseDefinitionMap[disease] ?? diseaseDefinitionMap[defaultDisease]

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Record<string, string>>(() =>
    createInitialFormState(definition.slug),
  )

  useEffect(() => {
    setFormData(createInitialFormState(definition.slug))
  }, [definition.slug])

  const readyDiseases = useMemo(
    () => diseaseDefinitions.filter((item) => item.endpointReady),
    [],
  )
  const allFields = useMemo(() => getAllFieldsForDisease(definition.slug), [definition.slug])
  const groupedFields = useMemo(() => {
    return allFields.reduce<Record<string, DiseaseField[]>>((acc, field) => {
      const section = field.section ?? 'Assessment Inputs'
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(field)
      return acc
    }, {})
  }, [allFields])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDiseaseSelect = (nextDisease: DiseaseDefinition) => {
    setSearchParams({ disease: nextDisease.slug })
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!definition.endpointReady) {
      return
    }

    setLoading(true)

    try {
      const result = await predictDisease(definition.slug, formData)
      navigate('/results', {
        state: {
          disease: definition.slug,
          result,
          inputData: formData,
        },
      })
    } catch (error) {
      console.error(error)
      alert('Error connecting to NeuroGuard Engine. Please ensure the backend server is active.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-fade-in" style={{ paddingBottom: '60px' }}>
      <div
        className="page-header-shell"
        style={{
          background: 'var(--surface-strong)',
          borderBottom: '1px solid var(--border-color)',
          padding: '16px 0',
          marginBottom: '32px',
        }}
      >
        <div className="container page-header-row">
          <div className="page-brand-row" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" style={{ height: '30px' }} />
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                fontFamily: 'Space Grotesk, sans-serif',
                color: 'var(--primary-color)',
              }}
            >
              NeuroGuard
            </span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary page-header-btn"
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> Cancel
          </button>
        </div>
      </div>

      <div className="container">
        <div
          className="glass-panel"
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            padding: '0',
            overflow: 'hidden',
            background: 'var(--surface-strong)',
          }}
        >
          <div className="assessment-grid">
            <div className="assessment-sidebar">
              <Activity size={40} style={{ marginBottom: '24px' }} />
              <h2 style={{ color: 'white', marginBottom: '16px' }}>{definition.title}</h2>
              <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6 }}>
                {definition.intro}
              </p>

              <div className="disease-chip-list">
                {diseaseDefinitions.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    className={`disease-chip ${item.slug === definition.slug ? 'disease-chip-active' : ''}`}
                    onClick={() => item.endpointReady && handleDiseaseSelect(item)}
                    disabled={!item.endpointReady}
                  >
                    <span>{item.title}</span>
                    <small>{item.badge}</small>
                  </button>
                ))}
              </div>

              <div style={{ marginTop: '40px', display: 'grid', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="assessment-step-badge">1</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Select the condition you want to review.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="assessment-step-badge">2</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Enter patient details, supporting history, and assessment values.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="assessment-step-badge">3</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Generate a report with risk summary, inputs, and guidance.</p>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                <div className="assessment-note">
                  <Info size={20} />
                  <span>
                    Active assessments: {readyDiseases.map((item) => item.title).join(', ')}. Heart
                    disease will be enabled in a future release once the required dataset is available.
                  </span>
                </div>
              </div>
            </div>

            <div className="assessment-form-pane">
              <div className="assessment-pane-header">
                <div>
                  <div className="result-pill" style={{ marginBottom: '12px' }}>
                    <HeartPulse size={18} /> {definition.badge}
                  </div>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{definition.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{definition.shortDescription}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {Object.entries(groupedFields).map(([section, fields]) => (
                  <section key={section} className="assessment-section">
                    <div className="assessment-section-header">
                      <h4>{section}</h4>
                      <p>
                        {section === 'Patient Information'
                          ? 'Capture the patient profile to personalize the report.'
                          : section === 'Lifestyle and History'
                            ? 'Add supporting lifestyle and clinical context for the report.'
                            : 'Provide the disease-specific values used in the current assessment.'}
                      </p>
                    </div>

                    <div className="assessment-form-grid">
                      {fields.map((field) => (
                        <div
                          key={field.key}
                          className={`form-group ${field.type === 'textarea' ? 'form-group-full' : ''}`}
                        >
                          <label className="form-label">{field.label}</label>
                          {field.type === 'select' ? (
                            <select
                              name={field.key}
                              className="form-control"
                              value={formData[field.key] ?? ''}
                              onChange={handleChange}
                              required={field.required}
                            >
                              {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              name={field.key}
                              className="form-control form-textarea"
                              placeholder={field.placeholder}
                              required={field.required}
                              value={formData[field.key] ?? ''}
                              onChange={handleChange}
                            />
                          ) : (
                            <input
                              type={field.type === 'number' ? 'number' : 'text'}
                              step={field.step}
                              name={field.key}
                              className="form-control"
                              placeholder={field.placeholder}
                              required={field.required}
                              value={formData[field.key] ?? ''}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '40px', padding: '16px' }}
                  disabled={loading || !definition.endpointReady}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Processing {definition.title} Assessment...
                    </>
                  ) : (
                    `Generate ${definition.title} Report`
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictionForm
