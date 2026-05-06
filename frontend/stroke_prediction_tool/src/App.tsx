import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PredictionForm from './pages/PredictionForm';
import ResultDashboard from './pages/ResultDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<PredictionForm />} />
            <Route path="/results" element={<ResultDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
