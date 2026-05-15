# Stroke Risk Predictor ⚡

A modern, AI-powered web application for early stroke risk detection. Built with React, FastAPI, and Logistic Regression.

## Features

- **AI-Powered Prediction**: Uses Logistic Regression trained on clinical data to assess stroke risk.
- **Modern UI**: Glassmorphism design with React and Tailwind CSS.
- **Detailed Reports**: Generates comprehensive health reports including risk probability and factor analysis.
- **Interactive Visualizations**: Data insights with charts and factor breakdown.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI, Python
- **Machine Learning**: Scikit-learn (Logistic Regression)

## Project Structure

```
stroke-predictor/
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/ # UI Components (Charts, Forms, etc.)
│   │   ├── pages/      # Application Pages (Home, Predict, Results)
│   │   └── App.tsx     # Main App Component
│   └── vite.config.ts  # Vite Configuration
├── backend/            # FastAPI Application
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints.py      # API Endpoints
│   │   │   ├── health_checker.py # Health Checks
│   │   │   └── router.py         # API Router
│   │   ├── models.py           # Pydantic Models
│   │   ├── ml/
│   │   │   ├── model_trainer.py  # Train Model
│   │   │   ├── model.pkl         # Trained Model
│   │   │   └── preprocessor.pkl  # Preprocessor
│   │   ├── main.py             # FastAPI App Entry Point
│   │   └── services/             # Business Logic
│   ├── requirements.txt          # Python Dependencies
│   └── train_model.py          # Script to train model
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- pip (Python package installer)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Train the Machine Learning Model:
   ```bash
   python train_model.py
   ```
   *Note: This will generate `app/ml/model.pkl` and `app/ml/preprocessor.pkl`.*

4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. Go to the **"Predict"** page.
2. Fill in the health details (Age, Hypertension, Heart Disease, etc.).
3. Click **"Predict Risk"**.
4. View the detailed results and health report.

## License

MIT

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
