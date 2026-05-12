<div align="center">

# 🧠 NeuroGuard AI

<img src="https://raw.githubusercontent.com/sarthakmahapatra05/NeuroGuard-AI/main/frontend/stroke_prediction_tool/public/logo.png" alt="NeuroGuard AI Banner" width="50%" />

<br/>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&size=32&pause=1000&color=8A2BE2&center=true&vCenter=true&width=800&lines=AI-Powered+Stroke+Risk+Prediction;React+%7C+Flask+%7C+Machine+Learning;Full+Stack+Healthcare+AI+Platform" />
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask" />
  <img src="https://img.shields.io/badge/Machine%20Learning-Scikit--Learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Render-8A2BE2?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Containerized-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=react,typescript,flask,python,docker,nginx,git,vscode" />
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=sarthakmahapatra05&label=Project+Views&color=blueviolet&style=for-the-badge" />
</p>

<br/>

# 🌍 Live Demo

### 🚀 https://neuroguard-sable.vercel.app/

</div>

---

# ✨ About The Project

**NeuroGuard AI** is a modern full-stack healthcare AI platform that predicts stroke risk using machine learning.

The application collects important healthcare parameters from users, sends them to a trained ML model through a Flask API, and generates intelligent stroke risk analysis with visual insights and downloadable reports.

---

# 🚀 Features

✨ Modern responsive UI  
🧠 AI-powered stroke risk prediction  
📊 Interactive analytics dashboard  
📈 Stroke risk score visualization  
📄 PDF report generation  
⚡ Fast Flask REST API  
🐳 Dockerized full-stack architecture  
☁️ Render + Vercel deployment ready  
📱 Mobile responsive design  
🔍 Health factor explanation system  

---

# 📚 Machine Learning Dataset

The machine learning model was trained using a healthcare dataset sourced from **Kaggle**.

### 🩺 Dataset Includes

- Age
- BMI
- Glucose Level
- Hypertension
- Heart Disease
- Smoking Status
- Work Type
- Residence Type
- Marital Status
- Other medical indicators

> ⚠️ Dataset used only for educational and machine learning experimentation purposes.

---

# 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | React, TypeScript, Vite, Recharts, jsPDF |
| **Backend** | Flask, NumPy, Pandas, Scikit-learn, Gunicorn |
| **Containerization** | Docker, Docker Compose, Nginx |
| **Deployment** | Vercel, Render |

---

# 🏗️ Project Structure

```bash
NeuroGuard-AI/
│
├── frontend/
│   └── stroke_prediction_tool/
│
├── backend/
│
├── docker-compose.yml
│
├── render.yaml
│
└── README.md
```

---

# 🐳 Run With Docker

## 1️⃣ Clone Repository

```bash
git clone https://github.com/sarthakmahapatra05/NeuroGuard-AI.git
```

---

## 2️⃣ Navigate To Project

```bash
cd NeuroGuard-AI
```

---

## 3️⃣ Build & Start Containers

```bash
docker compose up --build
```

---

## 4️⃣ Open Application

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Backend API | http://localhost:5000 |
| Health Check | http://localhost:5000/health |

---

## 5️⃣ Stop Containers

```bash
docker compose down
```

---

# 💻 Run Locally Without Docker

# 🔹 Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python app.py
```

Backend runs on:

```bash
http://localhost:5000
```

---

# 🔹 Frontend Setup

```bash
cd frontend/stroke_prediction_tool

npm install

npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 🌐 Deployment Guide

## 🚀 Recommended Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |

---

# ☁️ Backend Deployment (Render)

The backend deployment is configured using `render.yaml`.

### Steps

1. Push repository to GitHub
2. Create a new Web Service in Render
3. Connect GitHub repository
4. Deploy backend service

Expected Backend URL:

```bash
https://your-render-service.onrender.com
```

Health Endpoint:

```bash
https://your-render-service.onrender.com/health
```

---

# ▲ Frontend Deployment (Vercel)

Set project root directory:

```bash
frontend/stroke_prediction_tool
```

Add environment variable:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

### Deployment Steps

1. Import repository into Vercel
2. Set root directory
3. Add environment variable
4. Deploy 🚀

---

# 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Backend health status |
| POST | `/predict` | Stroke risk prediction |

---

# 🧪 Verification Checklist

- [x] Frontend opens successfully
- [x] Backend health endpoint works
- [x] Prediction API returns response
- [x] Charts render correctly
- [x] PDF export works

---

# 🐳 Useful Docker Commands

```bash
docker compose up --build
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

---

# 🔧 Troubleshooting

## Docker Build Issues

```bash
docker compose build --no-cache
```

---

## Python Dependency Issues

```bash
pip install -r requirements.txt
```

---

## Frontend Dependency Issues

```bash
cd frontend/stroke_prediction_tool

npm install
```

---

# 🌟 Future Improvements

- 🧠 Deep Learning Integration
- 📱 Mobile Application
- 🔐 Authentication System
- ☁️ Database Integration
- 📊 Advanced Analytics Dashboard
- 🩺 Doctor Monitoring Panel

---

# 👨‍💻 Author

## Sarthak Mahapatra

Full Stack Developer • AI Enthusiast • Machine Learning Explorer

---

<div align="center">

# ⭐ If You Like This Project, Give It A Star ⭐

Made with ❤️ using React, Flask & Machine Learning

</div>
