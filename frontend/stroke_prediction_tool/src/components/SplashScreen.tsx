import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="splash-screen" role="status" aria-live="polite" aria-label="Loading NeuroGuard">
      <div className="splash-orb splash-orb-left" />
      <div className="splash-orb splash-orb-right" />
      <div className="splash-card">
        <div className="splash-logo-wrap">
          <img src="/logo.png" alt="NeuroGuard logo" className="splash-logo" />
        </div>
        <p className="splash-kicker">NeuroGuard AI</p>
        <h1 className="splash-title">Preparing your workspace</h1>
        <p className="splash-copy">
          Loading the healthcare intelligence interface and assessment modules.
        </p>
        <div className="splash-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
