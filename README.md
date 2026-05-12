# NeuroGuard AI
<img src="https://raw.githubusercontent.com/sarthakmahapatra05/NeuroGuard-AI/main/frontend/stroke_prediction_tool/public/logo.png" alt="NeuroGuard AI Logo" width="100%" />
NeuroGuard AI is a full-stack stroke risk prediction project built with a React frontend and a Flask backend. The application collects a small set of health inputs, sends them to a trained prediction model, and returns a stroke risk score, risk level, explanation factors, charts, and PDF export support.

This project is for educational and portfolio use only. It is not a medical diagnosis tool.

## Project Structure

- `frontend/stroke_prediction_tool` - React + TypeScript + Vite frontend
- `backend` - Flask API, trained model files, and inference logic
- `docker-compose.yml` - Runs the frontend and backend together with Docker

## Features

- Stroke risk prediction through a Flask API
- Explanation factors based on the submitted health data
- Interactive frontend with results dashboard
- PDF report generation
- Dockerized full-stack setup

## Tech Stack

- Frontend: React, TypeScript, Vite, Recharts, jsPDF
- Backend: Flask, NumPy, Pandas, Scikit-learn, Gunicorn
- Containerization: Docker, Docker Compose, Nginx

## Prerequisites

### For Docker setup

- Docker Desktop
- Docker Compose

### For local non-Docker setup

- Python 3.11 or later recommended
- Node.js 20 or later recommended
- npm

## Run With Docker

This is the easiest way to run the whole project on your device.

### 1. Open a terminal in the project root

```bash
cd "C:\Users\sarth\Desktop\Stroke Predictor"
```

### 2. Build and start both containers

```bash
docker compose up --build
```

### 3. Open the app

- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`
- Backend health check: `http://localhost:5000/health`

### 4. Stop the containers

Press `Ctrl + C` in the running terminal, then clean up with:

```bash
docker compose down
```

## Deploy To Render And Vercel

Recommended deployment split:

- Backend API on Render
- Frontend on Vercel

This project is now configured for that setup.

### 1. Deploy the backend to Render

Use the root-level `render.yaml`. It points Render to the `backend` folder, installs dependencies, starts Gunicorn, and exposes the `/health` endpoint.

Steps:

1. Push the repository to GitHub.
2. In Render, create a new Blueprint or Web Service from the repository.
3. If you use the Blueprint flow, Render will read `render.yaml` from the repo root.
4. Deploy the `stroke-predictor-api` service.
5. After deploy, copy the generated Render URL.

Expected backend URL shape:

- `https://your-render-service.onrender.com`

Health check:

- `https://your-render-service.onrender.com/health`

### 2. Deploy the frontend to Vercel

The Vercel app should use `frontend/stroke_prediction_tool` as the project root directory.

Before deploying, add this environment variable in the Vercel dashboard:

- `VITE_API_BASE_URL=https://your-render-service.onrender.com`

An example is included in `frontend/stroke_prediction_tool/.env.example`.

Steps:

1. In Vercel, import the same GitHub repository.
2. Set the Root Directory to `frontend/stroke_prediction_tool`.
3. Confirm the build command is `npm run build`.
4. Confirm the output directory is `dist`.
5. Add `VITE_API_BASE_URL` with your Render backend URL.
6. Deploy.

The frontend SPA rewrite is already configured in `frontend/stroke_prediction_tool/vercel.json`.

### 3. Test the deployed app

After both deploys finish:

1. Open the Vercel frontend URL.
2. Submit the stroke prediction form.
3. Confirm the frontend successfully calls the Render backend.
4. Confirm the backend health endpoint returns a success JSON response.

### Useful Docker commands

```bash
docker compose up --build
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

## How Docker Is Set Up

The project uses two services:

1. `backend`
   Runs the Flask application with Gunicorn on port `5000`.

2. `frontend`
   Builds the Vite app and serves it through Nginx on port `8080`.

The frontend sends requests to `/api`, and Nginx forwards those requests internally to the backend container.

## Run Locally Without Docker

If you want to run the frontend and backend directly on your own machine, follow these steps.

### 1. Start the backend

Open a terminal in the project root and run:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The backend will start on:

- `http://localhost:5000`

You can confirm it is healthy at:

- `http://localhost:5000/health`

### 2. Start the frontend

Open a second terminal and run:

```bash
cd frontend/stroke_prediction_tool
npm install
npm run dev
```

The Vite development server will start on:

- `http://localhost:5173`

### 3. Use the app

Open the frontend URL in your browser and submit the form. During local development, Vite proxies `/api` requests to the Flask backend on port `5000`, so no extra API URL setup is needed.

## Local Development Notes

- The frontend defaults to `/api` for prediction requests.
- In local development, Vite proxies `/api` to `http://localhost:5000`.
- In Docker, Nginx proxies `/api` to the backend container.
- The backend loads `stroke_model.pkl` and `label_encoder.pkl` from the `backend` folder.

## Verification Checklist

After setup, you should be able to confirm:

- Frontend opens in the browser
- Backend `/health` returns a JSON response
- Submitting the prediction form returns a result page

## Troubleshooting

### Port already in use

If `5000` or `8080` is already occupied, stop the conflicting process or change the port mapping in `docker-compose.yml`.

### Docker build issues

Try rebuilding without cache:

```bash
docker compose build --no-cache
```

### Python environment issues

Make sure the virtual environment is activated before running:

```bash
pip install -r requirements.txt
python app.py
```

### Frontend dependency issues

If npm install fails, delete `node_modules` and reinstall:

```bash
cd frontend/stroke_prediction_tool
npm install
```

## Current Endpoints

- `GET /health` - backend health status
- `POST /predict` - stroke risk prediction endpoint
