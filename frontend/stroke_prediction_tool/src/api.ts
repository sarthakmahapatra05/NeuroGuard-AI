const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:5000'

export type ApiPayload = Record<string, unknown>
export type ApiResponse = Record<string, unknown>

export async function predictStroke(payload: ApiPayload): Promise<ApiResponse> {
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

  return (await response.json()) as ApiResponse
}
