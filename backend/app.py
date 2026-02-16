from __future__ import annotations

from typing import Any

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


def _to_float(payload: dict[str, Any], key: str, default: float = 0.0) -> float:
    value = payload.get(key, default)
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_int(payload: dict[str, Any], key: str, default: int = 0) -> int:
    value = payload.get(key, default)
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


@app.get("/health")
def health_check():
    return jsonify({"status": "ok"}), 200


@app.post("/predict")
def predict():
    payload = request.get_json(silent=True) or {}

    age = _to_float(payload, "age")
    glucose = _to_float(payload, "avg_glucose_level")
    bmi = _to_float(payload, "bmi")
    hypertension = _to_int(payload, "hypertension")
    heart_disease = _to_int(payload, "heart_disease")
    smoking_status = str(payload.get("smoking_status", "Unknown"))

    # Simple baseline heuristic until a trained model is wired in.
    risk_score = (
        0.01 * max(age - 30, 0)
        + 0.004 * max(glucose - 90, 0)
        + 0.01 * max(bmi - 25, 0)
        + 0.18 * (1 if hypertension else 0)
        + 0.2 * (1 if heart_disease else 0)
        + (0.08 if smoking_status in {"smokes", "formerly smoked"} else 0.0)
    )

    probability = min(max(risk_score, 0.01), 0.99)
    prediction = 1 if probability >= 0.5 else 0

    return (
        jsonify(
            {
                "prediction": prediction,
                "probability": probability,
                "model": "baseline_heuristic",
            }
        ),
        200,
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
