import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from disease_config import DISEASE_CONFIG
from model_service import ArtifactUnavailableError, ModelService


app = Flask(__name__)
CORS(app)
model_service = ModelService()


@app.route("/predict", methods=["POST"])
def predict_stroke_alias():
    return predict("stroke")


@app.route("/predict/<disease>", methods=["POST"])
def predict(disease: str):
    try:
        payload = request.get_json(silent=True) or {}
        result = model_service.predict(disease, payload)
        return jsonify(result)
    except KeyError:
        return (
            jsonify(
                {
                    "error": f"Unsupported disease '{disease}'",
                    "supported_diseases": list(DISEASE_CONFIG.keys()),
                }
            ),
            404,
        )
    except ArtifactUnavailableError as error:
        return jsonify({"error": str(error)}), 503
    except Exception as error:
        return jsonify({"error": str(error)}), 400


@app.route("/health", methods=["GET"])
def health():
    health_payload = model_service.get_health()
    status_code = 200 if any(health_payload["models"].values()) else 503
    return jsonify(health_payload), status_code


@app.route("/model-metrics", methods=["GET"])
def model_metrics():
    return jsonify(model_service.get_metrics())


@app.route("/supported-diseases", methods=["GET"])
def supported_diseases():
    return jsonify({"diseases": model_service.get_supported_diseases()})


@app.route("/reload-models", methods=["POST"])
def reload_models():
    model_service.reload()
    return jsonify({"status": "reloaded", "models": model_service.get_health()["models"]})


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=int(os.getenv("PORT", "5000")))
