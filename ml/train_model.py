import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import os

# Load dataset
df = pd.read_csv("C:/Users/sarth/Desktop/Stroke Predictor/ml/archive (1)/healthcare-dataset-stroke-data.csv")

# Select requested features
features = ["age", "hypertension", "heart_disease", "avg_glucose_level", "bmi", "smoking_status"]
X = df[features].copy()
y = df["stroke"]

# Handle missing values
X["bmi"].fillna(X["bmi"].mean(), inplace=True)

# Encode categorical feature 'smoking_status'
# We will save this encoder to use in app.py
le = LabelEncoder()
X["smoking_status"] = le.fit_transform(X["smoking_status"])

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
model.fit(X_train, y_train)

# Evaluate model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model and encoder to backend directory
backend_dir = "../backend"
if not os.path.exists(backend_dir):
    os.makedirs(backend_dir)

pickle.dump(model, open(os.path.join(backend_dir, "stroke_model.pkl"), "wb"))
pickle.dump(le, open(os.path.join(backend_dir, "label_encoder.pkl"), "wb"))

print("Model and encoder saved to backend directory.")
