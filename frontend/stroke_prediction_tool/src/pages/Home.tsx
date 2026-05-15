import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Brain,
  Download,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  BarChart3,
  Mail,
  Cpu,
  CheckCircle2,
  Link2,
} from 'lucide-react';

const inputs = [
  'Age',
  'Hypertension status',
  'Heart disease history',
  'Average glucose level',
  'BMI',
  'Smoking status',
];

const workflow = [
  {
    icon: <Stethoscope size={22} />,
    title: 'Enter core health inputs',
    description:
      'The assessment form captures the six fields currently used by the prediction API.',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Run the Flask prediction model',
    description:
      'A Random Forest model scores the request and returns a percentage risk score, risk level, and explanation factors.',
  },
  {
    icon: <Download size={22} />,
    title: 'Review and export results',
    description:
      'The results page visualizes the score, compares metrics to baselines, and lets you download a PDF summary.',
  },
];

const featureCards = [
  {
    icon: <BarChart3 size={24} />,
    title: 'Clear result dashboard',
    description:
      'Charts and score cards turn the model output into something easier to review at a glance.',
  },
  {
    icon: <Brain size={24} />,
    title: 'Factor-based explanations',
    description:
      'The backend highlights why a result may be elevated using glucose, BMI, age, blood pressure, heart disease, and smoking signals.',
  },
  {
    icon: <ShieldAlert size={24} />,
    title: 'Educational use only',
    description:
      'This project supports awareness and demonstration. It is not a substitute for clinical diagnosis or emergency care.',
  },
];

const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Inputs', href: '#inputs' },
  { label: 'Disclaimer', href: '#footer' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page page-fade-in">
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <a href="#top" className="brand-mark" aria-label="NeuroGuard home">
            <img src="/logo.png" alt="NeuroGuard logo" className="brand-logo" />
            <div>
              <span className="brand-title">NeuroGuard</span>
              <span className="brand-subtitle">Stroke risk assessment interface</span>
            </div>
          </a>

          <div className="landing-nav-links">
            <a href="#workflow">Workflow</a>
            <a href="#inputs">Inputs</a>
            <a href="#about">About</a>
          </div>

          <button onClick={() => navigate('/predict')} className="btn btn-primary">
            Start Assessment <ArrowRight size={18} />
          </button>
        </div>
      </nav>

      <header id="top" className="landing-hero">
        <div className="container landing-hero-grid">
          <div className="slide-up">
            <div className="eyebrow">
              <Activity size={16} />
              React frontend for a Flask-based stroke prediction workflow
            </div>

            <h1 className="landing-title">
              A sharper landing page for a real stroke risk prediction project.
            </h1>

            <p className="landing-copy">
              NeuroGuard is a full-stack educational app that collects six health inputs, sends them
              to a machine learning API, and returns a risk score, level, explanations, charts, and a
              downloadable PDF report.
            </p>

            <div className="landing-actions">
              <button onClick={() => navigate('/predict')} className="btn btn-primary landing-primary">
                Open Assessment <ArrowRight size={18} />
              </button>
              <a href="#workflow" className="btn btn-secondary landing-secondary">
                See How It Works
              </a>
            </div>

            <div className="hero-notes">
              <div className="hero-note-card">
                <span className="hero-note-label">Frontend</span>
                <strong>React + TypeScript + Vite</strong>
              </div>
              <div className="hero-note-card">
                <span className="hero-note-label">Backend</span>
                <strong>Flask prediction API</strong>
              </div>
              <div className="hero-note-card">
                <span className="hero-note-label">Output</span>
                <strong>Score, factors, charts, PDF</strong>
              </div>
            </div>
          </div>

          <div className="slide-up hero-panel" style={{ animationDelay: '0.15s' }}>
            <div className="hero-panel-top">
              <span className="hero-chip">Current assessment flow</span>
              <span className="hero-chip hero-chip-muted">6 inputs</span>
            </div>

            <div className="hero-diagram">
              <div className="hero-stage">
                <span className="hero-stage-number">01</span>
                <div>
                  <h3>Input form</h3>
                  <p>Age, BMI, glucose, hypertension, heart disease, and smoking status.</p>
                </div>
              </div>

              <div className="hero-stage-connector" />

              <div className="hero-stage">
                <span className="hero-stage-number">02</span>
                <div>
                  <h3>Prediction request</h3>
                  <p>Frontend sends a POST request to the Flask `/predict` endpoint.</p>
                </div>
              </div>

              <div className="hero-stage-connector" />

              <div className="hero-stage">
                <span className="hero-stage-number">03</span>
                <div>
                  <h3>Risk report</h3>
                  <p>Users see their score, highlighted factors, chart comparisons, and PDF export.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="workflow" className="landing-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Workflow</span>
            <h2>What this application actually does</h2>
            <p>
              The landing page now describes the implemented product flow instead of generic
              AI-health marketing.
            </p>
          </div>

          <div className="workflow-grid">
            {workflow.map((item) => (
              <article key={item.title} className="workflow-card">
                <div className="workflow-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="inputs" className="landing-section landing-section-alt">
        <div className="container landing-split">
          <div>
            <span className="section-kicker">Assessment Inputs</span>
            <h2>Built around the six fields the backend already expects</h2>
            <p className="section-copy">
              The form experience in this project is focused and practical. It collects only the
              variables currently used by the trained model and explanation layer.
            </p>

            <div className="input-list">
              {inputs.map((item) => (
                <div key={item} className="input-pill">
                  <CheckCircle2 size={18} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className="project-facts">
            <div className="project-facts-header">
              <HeartPulse size={22} />
              <h3>Project facts</h3>
            </div>

            <div className="project-facts-grid">
              <div>
                <span>Prediction route</span>
                <strong>`POST /predict`</strong>
              </div>
              <div>
                <span>Returned values</span>
                <strong>Risk score, level, factors</strong>
              </div>
              <div>
                <span>Charts used</span>
                <strong>Bar + pie dashboards</strong>
              </div>
              <div>
                <span>Export</span>
                <strong>PDF report generation</strong>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">About The Build</span>
            <h2>Designed to feel more trustworthy, specific, and product-focused</h2>
            <p>
              The old page mixed strong visuals with made-up metrics and generic company sections.
              This version keeps the energy but anchors the copy in the codebase you actually have.
            </p>
          </div>

          <div className="feature-grid">
            {featureCards.map((card) => (
              <article key={card.title} className="feature-card">
                <div className="feature-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="footer" className="landing-footer">
        <div className="container">
          <div className="landing-footer-top">
            <div className="footer-brand-block">
              <div className="brand-mark footer-brand">
                <img src="/logo.png" alt="NeuroGuard logo" className="brand-logo footer-brand-logo" />
                <div>
                  <span className="brand-title footer-brand-title">NeuroGuard</span>
                  <span className="brand-subtitle footer-brand-subtitle">
                    Educational stroke risk prediction project
                  </span>
                </div>
              </div>

              <p className="footer-copy">
                This frontend is part of a full-stack project that connects a React interface to a
                Flask machine learning backend for stroke risk estimation and report generation.
              </p>
            </div>

            <div className="footer-column">
              <h4>Navigation</h4>
              <div className="footer-links">
                {footerLinks.map((link) => (
                  <a key={link.label} href={link.href}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-column">
              <h4>Tech Stack</h4>
              <div className="footer-meta">
                <span>Frontend: React, TypeScript, Vite, Recharts, jsPDF</span>
                <span>Backend: Flask, NumPy, pickle model loading</span>
                <span>Model output: score, level, factor explanations</span>
              </div>
            </div>

            <div className="footer-column">
              <h4>Project Contact</h4>
              <div className="footer-contact-card">
                <div className="footer-contact-row">
                  <Mail size={16} />
                  <a href="mailto:sarthakmahapatra303@gmail.com">sarthakmahapatra303@gmail.com</a>
                </div>
                <div className="footer-contact-row">
                  <Link2 size={16} />
                  <a
                    href="https://github.com/sarthakmahapatra05/NeuroGuard-AI"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/sarthakmahapatra05/NeuroGuard-AI
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <p>Built in India for educational and portfolio use.</p>
            <p>
              Disclaimer: this application provides a statistical estimate based on entered values and
              should not be used as medical diagnosis or emergency guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
