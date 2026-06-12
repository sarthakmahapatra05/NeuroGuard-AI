from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import Any, Dict, List

import pandas as pd

from disease_config import DISEASE_CONFIG


BASE_DIR = Path(__file__).resolve().parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
METRICS_PATH = ARTIFACTS_DIR / "metrics.json"


class ArtifactUnavailableError(RuntimeError):
    pass


def _to_number(value: Any, fallback: float) -> float:
    if value is None or value == "":
        return float(fallback)

    if isinstance(value, str):
        normalized = value.strip()
        if normalized.lower() in {"n/a", "na", "unknown", "none", "?"}:
            return float(fallback)
        value = normalized

    try:
        return float(value)
    except (TypeError, ValueError):
        return float(fallback)


def _to_binary(value: Any, fallback: int = 0) -> int:
    if value is None or value == "":
        return fallback

    if isinstance(value, bool):
        return int(value)

    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in {"1", "true", "yes", "y", "present"}:
            return 1
        if normalized in {"0", "false", "no", "n", "not present"}:
            return 0

    try:
        return int(float(value))
    except (TypeError, ValueError):
        return fallback


def _to_text(value: Any, fallback: str) -> str:
    if value is None:
        return fallback

    text = str(value).strip()
    return text if text else fallback


def _matches_rule(candidate: Any, operator: str, expected: Any) -> bool:
    if operator == "eq":
        return candidate == expected
    if operator == "gte":
        return float(candidate) >= float(expected)
    if operator == "lte":
        return float(candidate) <= float(expected)
    if operator == "gt":
        return float(candidate) > float(expected)
    if operator == "lt":
        return float(candidate) < float(expected)
    return False


def _coerce_payload(disease: str, payload: Dict[str, Any]) -> Dict[str, Any]:
    config = DISEASE_CONFIG[disease]
    normalized: Dict[str, Any] = {}

    for field in config["feature_columns"]:
        fallback = config["defaults"][field]
        raw_value = payload.get(field)

        if field in config["numeric_columns"]:
            if isinstance(fallback, int) and not isinstance(fallback, bool):
                normalized[field] = _to_binary(raw_value, fallback)
            else:
                normalized[field] = _to_number(raw_value, fallback)
        else:
            normalized[field] = _to_text(raw_value, fallback)

    return normalized


def _get_artifact_path(disease: str) -> Path:
    return ARTIFACTS_DIR / f"{disease}_model.pkl"


def _load_metrics() -> Dict[str, Any]:
    if not METRICS_PATH.exists():
        return {}

    with METRICS_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def load_models() -> Dict[str, Any]:
    models: Dict[str, Any] = {}
    for disease in DISEASE_CONFIG:
        artifact_path = _get_artifact_path(disease)
        if artifact_path.exists():
            with artifact_path.open("rb") as handle:
                models[disease] = pickle.load(handle)
        else:
            models[disease] = None
    return models


class ModelService:
    def __init__(self) -> None:
        self.models = load_models()
        self.metrics = _load_metrics()

    def reload(self) -> None:
        self.models = load_models()
        self.metrics = _load_metrics()

    def get_supported_diseases(self) -> List[Dict[str, Any]]:
        supported = []
        for disease, config in DISEASE_CONFIG.items():
            supported.append(
                {
                    "slug": disease,
                    "display_name": config["display_name"],
                    "model_ready": self.models.get(disease) is not None,
                    "fields": config["feature_columns"],
                }
            )
        return supported

    def get_health(self) -> Dict[str, Any]:
        return {
            "status": "ok",
            "models": {
                disease: model is not None for disease, model in self.models.items()
            },
        }

    def get_metrics(self) -> Dict[str, Any]:
        return self.metrics

    def generate_explanations(
        self, disease: str, normalized_payload: Dict[str, Any]
    ) -> List[str]:
        config = DISEASE_CONFIG[disease]
        factors: List[str] = []

        for rule in config["explanation_rules"]:
            value = normalized_payload.get(rule["field"])
            if value is None:
                continue

            if _matches_rule(value, rule["operator"], rule["value"]):
                factors.append(rule["label"])

        if not factors:
            factors.append("No major rule-based abnormal findings were detected.")

        return factors[:4]

    def predict(self, disease: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        if disease not in DISEASE_CONFIG:
            raise KeyError(f"Unsupported disease '{disease}'")

        model = self.models.get(disease)
        if model is None:
            raise ArtifactUnavailableError(
                f"Model artifact for '{disease}' is not available yet."
            )

        normalized_payload = _coerce_payload(disease, payload)
        feature_frame = pd.DataFrame([normalized_payload])

        probabilities = model.predict_proba(feature_frame)[0]
        risk_score = float(probabilities[1]) if len(probabilities) > 1 else float(probabilities[0])
        risk_percent = round(risk_score * 100, 2)

        if risk_percent < 35:
            risk_level = "Low"
        elif risk_percent < 70:
            risk_level = "Moderate"
        else:
            risk_level = "High"

        important_factors = self.generate_explanations(disease, normalized_payload)

        return {
            "disease": disease,
            "display_name": DISEASE_CONFIG[disease]["display_name"],
            "risk_score": risk_percent,
            "risk_level": risk_level,
            "important_factors": important_factors,
            "top_factors": important_factors,
            "input_features": normalized_payload,
        }
