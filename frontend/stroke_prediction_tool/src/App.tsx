import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Home from './pages/Home';
import PredictionForm from './pages/PredictionForm';
import ResultDashboard from './pages/ResultDashboard';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="app-container">
        {showSplash ? (
          <SplashScreen />
        ) : (
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<PredictionForm />} />
              <Route path="/results" element={<ResultDashboard />} />
            </Routes>
          </main>
        )}
      </div>
    </Router>
  );
}

export default App;
