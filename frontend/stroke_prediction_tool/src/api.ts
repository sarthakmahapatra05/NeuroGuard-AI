const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export type ApiPayload = Record<string, unknown>
export type PredictionResponse = {
  disease?: string
  display_name?: string
  risk_score: number
  risk_level: string
  important_factors?: string[]
  top_factors: string[]
  input_features?: Record<string, unknown>
}

export async function predictDisease(
  disease: string,
  payload: ApiPayload,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict/${disease}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Prediction failed (${response.status}): ${body}`)
  }

  return (await response.json()) as PredictionResponse
}

export async function predictStroke(payload: ApiPayload): Promise<PredictionResponse> {
  return predictDisease('stroke', payload)
}
