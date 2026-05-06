import { useState } from "react";
import { predictStroke, type PredictionResponse } from "./api";

type LegacyFormState = Record<string, number>;
export default function StrokeForm() {
  const [form, setForm] = useState<LegacyFormState>({});
  const [result, setResult] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const submit = async () => {
    const res: PredictionResponse = await predictStroke(form);
    setResult(res.risk_score ?? null);
  };

  return (
    <div>
      <h2>Stroke Prediction</h2>

      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="bmi" placeholder="BMI" onChange={handleChange} />
      <input name="avg_glucose_level" placeholder="Glucose" onChange={handleChange} />

      <button onClick={submit}>Predict</button>

      {result !== null && (
        <h3>{result >= 50 ? "High Stroke Risk" : "Low Stroke Risk"}</h3>
      )}
    </div>
  );
}
