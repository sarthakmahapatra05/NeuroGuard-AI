from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS
from pathlib import Path
import os

app = Flask(__name__)
CORS(app)
BASE_DIR = Path(__file__).resolve().parent

# Load model and encoder
try:
    model = pickle.load(open(BASE_DIR / "stroke_model.pkl", "rb"))
    label_encoder = pickle.load(open(BASE_DIR / "label_encoder.pkl", "rb"))
except Exception as e:
    print(f"Error loading model or encoder: {e}")
    model, label_encoder = None, None

def generate_explanations(data):
    factors = []
    
    if float(data.get("avg_glucose_level", 0)) > 140:
        factors.append("High glucose increases stroke risk")
    
    if float(data.get("bmi", 0)) > 30:
        factors.append("Obesity is a major factor")
        
    if float(data.get("age", 0)) > 65:
        factors.append("Advanced age is a natural risk factor")
        
    if int(data.get("hypertension", 0)) == 1:
        factors.append("High blood pressure significantly increases risk")
        
    if int(data.get("heart_disease", 0)) == 1:
        factors.append("Heart disease history is a major risk contributor")
        
    smoking = data.get("smoking_status", "").lower()
    if smoking in ["smokes", "formerly smoked"]:
        factors.append("Smoking history elevates stroke risk")
        
    if not factors:
        factors.append("No major critical risk thresholds exceeded, but maintain a healthy lifestyle.")
        
    return factors

@app.route("/predict", methods=["POST"])
def predict():
    if not model or not label_encoder:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.json
    
    try:
        # Expected features: age, hypertension, heart_disease, avg_glucose_level, bmi, smoking_status
        age = float(data.get("age", 0))
        hypertension = int(data.get("hypertension", 0))
        heart_disease = int(data.get("heart_disease", 0))
        avg_glucose_level = float(data.get("avg_glucose_level", 0))
        bmi = float(data.get("bmi", 0))
        smoking_status_str = data.get("smoking_status", "Unknown")
        
        # Encode smoking status
        # If the input isn't in classes, we fallback to a known class like 'Unknown'
        if smoking_status_str not in label_encoder.classes_:
            smoking_status_str = "Unknown"
            
        smoking_status = label_encoder.transform([smoking_status_str])[0]
        
        features = np.array([[
            age,
            hypertension,
            heart_disease,
            avg_glucose_level,
            bmi,
            smoking_status
        ]])
        
        # Get probability of class 1 (stroke)
        # Random forest predict_proba returns probabilities for [class_0, class_1]
        probabilities = model.predict_proba(features)[0]
        risk_score = float(probabilities[1])
        
        # Determine risk level
        if risk_score < 0.2:
            risk_level = "Low"
        elif risk_score < 0.5:
            risk_level = "Moderate"
        else:
            risk_level = "High"
            
        # Get explanations
        top_factors = generate_explanations(data)
        
        return jsonify({
            "risk_score": round(risk_score * 100, 2),  # Return as percentage
            "risk_level": risk_level,
            "top_factors": top_factors
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/health", methods=["GET"])
def health():
    model_ready = model is not None and label_encoder is not None
    status_code = 200 if model_ready else 503
    return jsonify({
        "status": "ok" if model_ready else "degraded",
        "model_loaded": model is not None,
        "label_encoder_loaded": label_encoder is not None
    }), status_code

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=int(os.getenv("PORT", "5000")))
