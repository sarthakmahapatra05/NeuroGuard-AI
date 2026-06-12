from __future__ import annotations

import json
import pickle
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, f1_score, precision_score, recall_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline as SklearnPipeline
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.combine import SMOTEENN
from sklearn.preprocessing import OneHotEncoder, StandardScaler


PROJECT_ROOT = Path(__file__).resolve().parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
DATA_DIR = PROJECT_ROOT / "ml" / "archive (1)"
ARTIFACTS_DIR = BACKEND_DIR / "artifacts"

sys.path.insert(0, str(BACKEND_DIR))

from disease_config import DISEASE_CONFIG  # noqa: E402


def build_one_hot_encoder() -> OneHotEncoder:
    try:
        return OneHotEncoder(handle_unknown="ignore", sparse_output=False)
    except TypeError:
        return OneHotEncoder(handle_unknown="ignore", sparse=False)


def build_preprocessor(config: Dict[str, Any]) -> ColumnTransformer:
    numeric_pipeline = SklearnPipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )
    categorical_pipeline = SklearnPipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", build_one_hot_encoder()),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("numeric", numeric_pipeline, config["numeric_columns"]),
            ("categorical", categorical_pipeline, config["categorical_columns"]),
        ],
        remainder="drop",
    )


def build_candidate_models(disease: str, scale_pos_weight: float = 1.0) -> List[Tuple[str, Any]]:
    candidates: List[Tuple[str, Any]] = [
        (
            "random_forest",
            RandomForestClassifier(
                n_estimators=200,
                random_state=42,
                class_weight="balanced",
                min_samples_leaf=2,
            ),
        ),
        (
            "logistic_regression",
            LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
            ),
        ),
    ]

    if disease == "stroke":
        candidates.append(
            (
                "gradient_boosting",
                GradientBoostingClassifier(random_state=42),
            )
        )

    try:
        from xgboost import XGBClassifier  # type: ignore

        candidates.insert(
            1,
            (
                "xgboost",
                XGBClassifier(
                    n_estimators=300,
                    max_depth=5,
                    learning_rate=0.05,
                    subsample=0.9,
                    colsample_bytree=0.9,
                    scale_pos_weight=scale_pos_weight,
                    eval_metric="logloss",
                    random_state=42,
                    reg_alpha=0.1,
                    reg_lambda=1.0,
                ),
            ),
        )
    except Exception:
        pass

    return candidates


def load_dataset(config: Dict[str, Any]) -> pd.DataFrame:
    dataset_path = DATA_DIR / config["dataset_filename"]
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found: {dataset_path}")

    df = pd.read_csv(dataset_path, na_values=["N/A", "NA", "?", "Unknown"])
    df = df.drop_duplicates().copy()

    target_column = config["target_column"]
    if "target_negative_values" in config:
        negative_values = {value.lower() for value in config["target_negative_values"]}
        df[target_column] = (
            df[target_column]
            .astype(str)
            .str.strip()
            .str.lower()
            .map(lambda value: 0 if value in negative_values else 1)
        )
    else:
        df[target_column] = pd.to_numeric(df[target_column], errors="coerce")

    for column in config["numeric_columns"]:
        df[column] = pd.to_numeric(df[column], errors="coerce")

    for column in config["categorical_columns"]:
        df[column] = df[column].astype(object)

    feature_columns = config["feature_columns"]
    df = df[feature_columns + [target_column]].dropna(subset=[target_column])

    return df


def evaluate_pipeline(
    disease: str, model_name: str, pipeline: Any, X_test: pd.DataFrame, y_test: pd.Series, threshold: float = 0.5
) -> Dict[str, Any]:
    probabilities = pipeline.predict_proba(X_test)[:, 1]
    predictions = (probabilities >= threshold).astype(int)

    return {
        "disease": disease,
        "model_name": model_name,
        "accuracy": round(float(accuracy_score(y_test, predictions)), 4),
        "precision": round(float(precision_score(y_test, predictions, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, predictions, zero_division=0)), 4),
        "f1_score": round(float(f1_score(y_test, predictions, zero_division=0)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, probabilities)), 4),
        "test_size": int(len(y_test)),
    }


def train_disease_model(disease: str, config: Dict[str, Any]) -> Dict[str, Any]:
    df = load_dataset(config)
    feature_columns = config["feature_columns"]
    target_column = config["target_column"]

    X = df[feature_columns]
    y = df[target_column].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    scale_pos_weight = 1.0
    if len(y_train[y_train == 1]) > 0:
        scale_pos_weight = float(len(y_train[y_train == 0])) / len(y_train[y_train == 1])

    best_pipeline: Any | None = None
    best_metrics: Dict[str, Any] | None = None
    threshold = config.get("classification_threshold", 0.5)

    for model_name, estimator in build_candidate_models(disease, scale_pos_weight):
        try:
            steps: List[Tuple[str, Any]] = [
                ("preprocessor", build_preprocessor(config)),
            ]
            if disease == "stroke":
                steps.append(("smoteenn", SMOTEENN(random_state=42)))
            steps.append(("classifier", estimator))

            pipeline = ImbPipeline(steps=steps)
            pipeline.fit(X_train, y_train)
            metrics = evaluate_pipeline(disease, model_name, pipeline, X_test, y_test, threshold)
        except Exception as error:
            print(f"[candidate-failed] {disease}/{model_name}: {error}")
            continue

        if best_metrics is None or metrics["roc_auc"] > best_metrics["roc_auc"]:
            best_pipeline = pipeline
            best_metrics = metrics

    if best_pipeline is None or best_metrics is None:
        raise RuntimeError(f"Failed to train a model for {disease}")

    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    artifact_path = ARTIFACTS_DIR / f"{disease}_model.pkl"
    with artifact_path.open("wb") as handle:
        pickle.dump(best_pipeline, handle)

    return {
        **best_metrics,
        "artifact_path": str(artifact_path),
        "training_rows": int(len(df)),
        "feature_count": int(len(feature_columns)),
    }


def main() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    all_metrics: Dict[str, Any] = {}
    skipped: Dict[str, str] = {}

    for disease, config in DISEASE_CONFIG.items():
        try:
            metrics = train_disease_model(disease, config)
            all_metrics[disease] = metrics
            print(
                f"[trained] {disease}: {metrics['model_name']} "
                f"(accuracy={metrics['accuracy']}, roc_auc={metrics['roc_auc']})"
            )
        except FileNotFoundError as error:
            skipped[disease] = str(error)
            print(f"[skipped] {disease}: {error}")
        except Exception as error:
            skipped[disease] = str(error)
            print(f"[failed] {disease}: {error}")

    metrics_payload = {
        "generated_at": pd.Timestamp.utcnow().isoformat(),
        "models": all_metrics,
        "skipped": skipped,
    }

    with (ARTIFACTS_DIR / "metrics.json").open("w", encoding="utf-8") as handle:
        json.dump(metrics_payload, handle, indent=2)

    if skipped:
        print("\nSome diseases were skipped or failed:")
        for disease, reason in skipped.items():
            print(f"- {disease}: {reason}")


if __name__ == "__main__":
    np.random.seed(42)
    main()
