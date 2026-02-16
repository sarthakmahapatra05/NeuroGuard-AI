import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { predictStroke } from './api'

type StrokePayload = {
  age: number
  hypertension: number
  heart_disease: number
  avg_glucose_level: number
  bmi: number
  gender: 'Male' | 'Female' | 'Other'
  ever_married: 'Yes' | 'No'
  work_type: 'Private' | 'Self-employed' | 'Govt_job' | 'children' | 'Never_worked'
  Residence_type: 'Urban' | 'Rural'
  smoking_status: 'formerly smoked' | 'never smoked' | 'smokes' | 'Unknown'
}

type PredictionResponse = {
  stroke?: number
  prediction?: number
  probability?: number
  risk_probability?: number
  [key: string]: unknown
}

const initialForm: StrokePayload = {
  age: 45,
  hypertension: 0,
  heart_disease: 0,
  avg_glucose_level: 95,
  bmi: 24,
  gender: 'Male',
  ever_married: 'Yes',
  work_type: 'Private',
  Residence_type: 'Urban',
  smoking_status: 'never smoked',
}

export function StrokeForm() {
  const [form, setForm] = useState<StrokePayload>(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PredictionResponse | null>(null)

  const riskPercent = useMemo(() => {
    if (!result) {
      return null
    }
    const value = result.probability ?? result.risk_probability
    if (typeof value === 'number') {
      return Math.round(value * 100)
    }
    return null
  }, [result])

  const predictedClass = useMemo(() => {
    if (!result) {
      return null
    }
    const value = result.stroke ?? result.prediction
    return typeof value === 'number' ? value : null
  }, [result])

  const updateNumber = (field: keyof StrokePayload) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: Number(value) }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const response = await predictStroke(form)
      setResult(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="stroke-form" onSubmit={submit}>
      <label>
        Age
        <input
          type="number"
          min={0}
          max={120}
          value={form.age}
          onChange={(e) => updateNumber('age')(e.target.value)}
          required
        />
      </label>

      <label>
        Average Glucose Level
        <input
          type="number"
          min={0}
          step="0.1"
          value={form.avg_glucose_level}
          onChange={(e) => updateNumber('avg_glucose_level')(e.target.value)}
          required
        />
      </label>

      <label>
        BMI
        <input
          type="number"
          min={0}
          step="0.1"
          value={form.bmi}
          onChange={(e) => updateNumber('bmi')(e.target.value)}
          required
        />
      </label>

      <label>
        Hypertension
        <select
          value={form.hypertension}
          onChange={(e) => updateNumber('hypertension')(e.target.value)}
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </label>

      <label>
        Heart Disease
        <select
          value={form.heart_disease}
          onChange={(e) => updateNumber('heart_disease')(e.target.value)}
        >
          <option value={0}>No</option>
          <option value={1}>Yes</option>
        </select>
      </label>

      <label>
        Gender
        <select
          value={form.gender}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              gender: e.target.value as StrokePayload['gender'],
            }))
          }
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        Ever Married
        <select
          value={form.ever_married}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              ever_married: e.target.value as StrokePayload['ever_married'],
            }))
          }
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>

      <label>
        Work Type
        <select
          value={form.work_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              work_type: e.target.value as StrokePayload['work_type'],
            }))
          }
        >
          <option value="Private">Private</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Govt_job">Govt_job</option>
          <option value="children">children</option>
          <option value="Never_worked">Never_worked</option>
        </select>
      </label>

      <label>
        Residence Type
        <select
          value={form.Residence_type}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              Residence_type: e.target.value as StrokePayload['Residence_type'],
            }))
          }
        >
          <option value="Urban">Urban</option>
          <option value="Rural">Rural</option>
        </select>
      </label>

      <label>
        Smoking Status
        <select
          value={form.smoking_status}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              smoking_status: e.target.value as StrokePayload['smoking_status'],
            }))
          }
        >
          <option value="never smoked">never smoked</option>
          <option value="formerly smoked">formerly smoked</option>
          <option value="smokes">smokes</option>
          <option value="Unknown">Unknown</option>
        </select>
      </label>

      <button type="submit" disabled={loading}>
        {loading ? 'Predicting...' : 'Predict Stroke Risk'}
      </button>

      {error && <p className="error">{error}</p>}
      {result && (
        <section className="result">
          <h2>Prediction Result</h2>
          {predictedClass !== null && (
            <p>
              Predicted Class: <strong>{predictedClass}</strong>
            </p>
          )}
          {riskPercent !== null && (
            <p>
              Risk Probability: <strong>{riskPercent}%</strong>
            </p>
          )}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </form>
  )
}
