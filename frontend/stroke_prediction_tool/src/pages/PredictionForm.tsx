import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowLeft, Loader2, Info } from 'lucide-react';
import { predictStroke } from '../api';

const PredictionForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    hypertension: '0',
    heart_disease: '0',
    avg_glucose_level: '',
    bmi: '',
    smoking_status: 'never smoked',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await predictStroke(formData);
      navigate('/results', { state: { result, inputData: formData } });
    } catch (error) {
      console.error(error);
      alert('Error connecting to NeuroGuard Engine. Please ensure the backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade-in" style={{ paddingBottom: '80px' }}>
      <div
        style={{
          background: 'var(--surface-strong)',
          borderBottom: '1px solid var(--border-color)',
          padding: '20px 0',
          marginBottom: '40px',
        }}
      >
        <div
          className="container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
            <span
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                fontFamily: 'Space Grotesk, sans-serif',
                color: 'var(--primary-color)',
              }}
            >
              NeuroGuard
            </span>
          </div>
          <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
            <ArrowLeft size={18} /> Cancel
          </button>
        </div>
      </div>

      <div className="container">
        <div
          className="glass-panel"
          style={{ maxWidth: '900px', margin: '0 auto', padding: '0', overflow: 'hidden', background: 'var(--surface-strong)' }}
        >
          <div className="assessment-grid">
            <div className="assessment-sidebar">
              <Activity size={40} style={{ marginBottom: '24px' }} />
              <h2 style={{ color: 'white', marginBottom: '16px' }}>Health Assessment</h2>
              <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6 }}>
                Our AI engine analyzes physiological markers to determine statistical probability of
                stroke risk.
              </p>

              <div style={{ marginTop: '40px', display: 'grid', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="assessment-step-badge">1</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Fill in your accurate biometric data.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="assessment-step-badge">2</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>AI processes metrics against clinical datasets.</p>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="assessment-step-badge">3</div>
                  <p style={{ fontSize: '0.9rem', margin: 0 }}>Get instant probability and risk factors.</p>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '60px' }}>
                <div className="assessment-note">
                  <Info size={20} />
                  <span>Your data is encrypted and used only for this one-time assessment.</span>
                </div>
              </div>
            </div>

            <div className="assessment-form-pane">
              <form onSubmit={handleSubmit}>
                <div className="assessment-form-grid">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      placeholder="e.g. 45"
                      required
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Smoking Status</label>
                    <select
                      name="smoking_status"
                      className="form-control"
                      value={formData.smoking_status}
                      onChange={handleChange}
                    >
                      <option value="never smoked">Never Smoked</option>
                      <option value="formerly smoked">Formerly Smoked</option>
                      <option value="smokes">Smokes</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Hypertension</label>
                    <select
                      name="hypertension"
                      className="form-control"
                      value={formData.hypertension}
                      onChange={handleChange}
                    >
                      <option value="0">No / Normal</option>
                      <option value="1">Yes / High BP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Heart Disease</label>
                    <select
                      name="heart_disease"
                      className="form-control"
                      value={formData.heart_disease}
                      onChange={handleChange}
                    >
                      <option value="0">No History</option>
                      <option value="1">History of Disease</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Avg Glucose (mg/dL)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="avg_glucose_level"
                      className="form-control"
                      placeholder="e.g. 95.5"
                      required
                      value={formData.avg_glucose_level}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">BMI</label>
                    <input
                      type="number"
                      step="0.1"
                      name="bmi"
                      className="form-control"
                      placeholder="e.g. 24.5"
                      required
                      value={formData.bmi}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '40px', padding: '16px' }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Analyzing Biometrics...
                    </>
                  ) : (
                    'Get Risk Assessment'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionForm;
