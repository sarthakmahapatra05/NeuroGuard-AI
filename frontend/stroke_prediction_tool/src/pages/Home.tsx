import React from 'react';

import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Download,
  HeartPulse,
  ShieldAlert,
  Stethoscope,
  BarChart3,
  Cpu,
  CheckCircle2,
} from 'lucide-react';
import { diseaseDefinitions } from '../diseaseConfig';

const inputs = [
  'Age',
  'Blood pressure status',
  'Glucose and HbA1c values',
  'Kidney function markers',
  'BMI',
  'Smoking or lifestyle status',
];

const workflow = [
  {
    icon: <Stethoscope size={22} />,
    title: 'Select an assessment',
    description:
      'Choose a supported clinical workflow based on the condition you want to review.',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Submit structured inputs',
    description:
      'Enter the requested health and laboratory values through a guided, disease-specific form.',
  },
  {
    icon: <Download size={22} />,
    title: 'Review the report',
    description:
      'Receive a clear risk summary, supporting factors, visual comparisons, and a downloadable PDF report.',
  },
];

const featureCards = [
  {
    icon: <BarChart3 size={24} />,
    title: 'Unified reporting experience',
    description:
      'A consistent dashboard presents risk status, supporting inputs, and visual summaries across supported conditions.',
  },
  {
    icon: <Brain size={24} />,
    title: 'Explainable outputs',
    description:
      'Each assessment includes important contributing factors to help users interpret the result more clearly.',
  },
  {
    icon: <ShieldAlert size={24} />,
    title: 'Clinical caution',
    description:
      'The platform supports early awareness and structured review, but it does not replace medical diagnosis or treatment.',
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const panelEl = panelRef.current;
      const hamburgerEl = hamburgerRef.current;

      if (panelEl && panelEl.contains(target)) return;
      if (hamburgerEl && hamburgerEl.contains(target)) return;

      setIsMenuOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('touchstart', onPointerDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('touchstart', onPointerDown);
    };
  }, [isMenuOpen]);

  return (
    <div className="landing-page page-fade-in">
      <nav className="landing-nav">
        <div className="container landing-nav-inner">
          <a
            href="#top"
            className="brand-mark"
            aria-label="NeuroGuard home"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src="/logo.png" alt="NeuroGuard logo" className="brand-logo" />
            <div>
              <span className="brand-title">NeuroGuard</span>
              <span className="brand-subtitle">Healthcare intelligence platform</span>
            </div>
          </a>

          <div className="landing-nav-links">
            <a href="#workflow" onClick={() => setIsMenuOpen(false)}>Workflow</a>
            <a href="#inputs" onClick={() => setIsMenuOpen(false)}>Inputs</a>
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          </div>

          <button
            ref={hamburgerRef}
            type="button"
            className="landing-nav-hamburger"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="landing-nav-actions">
            <a
              href="https://symptocare-sable.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              Book Appointments
            </a>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate('/predict?disease=stroke');
              }}
              className="btn btn-primary"
            >
              Start Review <ArrowRight size={18} />
            </button>
          </div>

          {isMenuOpen && (
            <div
              ref={panelRef}
              className="landing-nav-mobile-panel"
              role="dialog"
              aria-label="Mobile navigation"
            >
              <div className="landing-nav-mobile-links">
                <a href="#workflow" onClick={() => setIsMenuOpen(false)}>
                  Workflow
                </a>
                <a href="#inputs" onClick={() => setIsMenuOpen(false)}>
                  Inputs
                </a>
                <a href="#about" onClick={() => setIsMenuOpen(false)}>
                  About
                </a>
              </div>

              <div className="landing-nav-mobile-actions">
                <a
                  href="https://symptocare-sable.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Appointments
                </a>

                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/predict?disease=stroke');
                  }}
                >
                  Start Review <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <header id="top" className="landing-hero">
        <div className="container landing-hero-grid">
          <div className="slide-up">
            <h1 className="landing-title">
              Signals Over Symptoms
            </h1>

            <p className="landing-copy">
              NeuroGuard transforms clinical data into actionable health insights. Analyze risk factors, assess disease likelihood, and receive clear, AI-powered health intelligence.
            </p>

            <div className="landing-actions">
              <button onClick={() => navigate('/predict?disease=stroke')} className="btn btn-primary landing-primary">
                Open Platform <ArrowRight size={18} />
              </button>
              <a href="#workflow" className="btn btn-secondary landing-secondary">
                View Workflow
              </a>
            </div>

            <div className="hero-notes">
              <div className="hero-note-card">
                <span className="hero-note-label">Platform</span>
                <strong>Structured assessment workspace</strong>
              </div>
              <div className="hero-note-card">
                <span className="hero-note-label">Coverage</span>
                <strong>Stroke, diabetes, kidney</strong>
              </div>
              <div className="hero-note-card">
                <span className="hero-note-label">Output</span>
                <strong>Risk summary and PDF report</strong>
              </div>
            </div>
          </div>

        </div>
      </header>

      <section className="landing-section landing-section-dark">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Supported Diseases</span>
            <h2>Current assessment coverage</h2>
          </div>

          <div className="workflow-grid">
            {diseaseDefinitions.map((item) => (
              <article key={item.slug} className="workflow-card">
                <div className="workflow-icon">
                  <HeartPulse size={24} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.shortDescription}</p>
                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '18px', width: '100%' }}
                  onClick={() => item.endpointReady && navigate(`/predict?disease=${item.slug}`)}
                  disabled={!item.endpointReady}
                >
                  {item.endpointReady ? 'Open Assessment' : 'Coming Soon'}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="landing-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">Workflow</span>
            <h2>How the platform works</h2>
            <p>
              NeuroGuard is designed to present a focused product journey with clear input, analysis,
              and reporting steps.
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
            <h2>Built around structured clinical inputs</h2>
            <p className="section-copy">
              Each assessment is aligned to its underlying model requirements, ensuring that the form
              reflects the inputs needed for that specific review.
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

        </div>
      </section>

      <section id="about" className="landing-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-kicker">About The Build</span>
            <h2>Designed for clarity, consistency, and trust</h2>
            <p>
              The interface is intentionally simple and formal. It is designed to communicate
              healthcare information with restraint, clarity, and a product-oriented structure.
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
          <div className="landing-footer-top landing-footer-grid">
            <div className="footer-brand-block">
              <div className="brand-mark footer-brand">
                <img
                  src="/logo.png"
                  alt="NeuroGuard logo"
                  className="brand-logo footer-brand-logo"
                />
                <div>
                  <span className="brand-title footer-brand-title">NeuroGuard</span>
                  <span className="brand-subtitle footer-brand-subtitle">
                    AI-assisted health risk assessment
                  </span>
                </div>
              </div>

              <p className="footer-copy footer-copy-lead">
                Structured input → transparent risk summary → exportable PDF report. Designed to help you review
                health information clearly and professionally.
              </p>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">Quick links</h4>
              <div className="footer-links">
                {footerLinks.map((link) => (
                  <a key={link.label} href={link.href} className="footer-link">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="footer-column">
              <h4 className="footer-heading">What you get</h4>
              <div className="footer-meta footer-bullets">
                <span className="footer-bullet">
                  <CheckCircle2 size={16} /> Risk summary + key indicators
                </span>
                <span className="footer-bullet">
                  <CheckCircle2 size={16} /> Structured input review
                </span>
                <span className="footer-bullet">
                  <CheckCircle2 size={16} /> Downloadable PDF report
                </span>
              </div>
            </div>
          </div>

          <div className="landing-footer-bottom footer-bottom-row">
            <p className="footer-bottom-left">
              © {new Date().getFullYear()} NeuroGuard. All rights reserved.
            </p>
            <p className="footer-bottom-right">
              Disclaimer: model-based risk estimates for informational use only. Not medical diagnosis,
              prescription, or emergency guidance.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
