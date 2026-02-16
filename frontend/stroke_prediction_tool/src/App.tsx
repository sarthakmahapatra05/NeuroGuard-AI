import './App.css'
import { StrokeForm } from './StrokeForm'

function App() {
  return (
    <main className="app-shell">
      <section className="app-card">
        <h1>Stroke Risk Prediction</h1>
        <p className="subtitle">
          Submit patient details to estimate stroke risk from the backend model.
        </p>
        <StrokeForm />
      </section>
    </main>
  )
}

export default App
