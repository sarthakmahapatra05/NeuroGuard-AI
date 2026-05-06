const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export type ApiPayload = Record<string, unknown>
export type PredictionResponse = {
  risk_score: number
  risk_level: string
  top_factors: string[]
}

export async function predictStroke(payload: ApiPayload): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
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
