# Stroke Risk Prediction Tool

A full-stack web app for estimating stroke risk from patient inputs.

The project combines a React frontend with a Flask backend API. Users fill in a medical/demographic form, submit it, and get an immediate risk response with probability output.

## Project Overview

- `frontend/stroke_prediction_tool/`: React + TypeScript + Vite client
- `backend/`: Flask API with CORS enabled
- `ml/`: placeholder folder for model training/inference scripts

## Current Prediction Engine

The backend currently uses a baseline heuristic in `backend/app.py` to return:
- `prediction` (0 or 1)
- `probability` (0.01 to 0.99)
- `model` (`baseline_heuristic`)

This gives a working end-to-end pipeline now, while keeping the structure ready for a trained model later.

## Dynamic Interface Highlights

The frontend is designed as an interactive form-driven workflow:
- Controlled form state for all inputs (no uncontrolled fields)
- Instant UI feedback during API calls (`Predicting...` loading state)
- Inline error handling for failed requests
- Dynamic result rendering only after successful response
- Computed display values such as risk percentage from backend probability
- Responsive centered card layout with clean form styling for readability

## Tech Stack

- Frontend: React 19, TypeScript, Vite
- Backend: Flask, Flask-CORS
- Runtime: Node.js + npm, Python

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+ and npm

### 1. Start backend

From project root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Backend endpoints:
- `GET /health` -> `http://127.0.0.1:5000/health`
- `POST /predict` -> `http://127.0.0.1:5000/predict`

### 2. Start frontend

In a second terminal:

```powershell
cd frontend/stroke_prediction_tool
npm install
npm run dev
```

Frontend URL:
- `http://127.0.0.1:5173`

## Environment Configuration

The frontend uses:
- `VITE_API_BASE_URL` (default: `http://127.0.0.1:5000`)

Optional file:
- `frontend/stroke_prediction_tool/.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
```

## Typical Development Run

Terminal 1:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python app.py
```

Terminal 2:

```powershell
cd frontend/stroke_prediction_tool
npm run dev
```
