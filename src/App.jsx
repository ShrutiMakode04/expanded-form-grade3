import { useState, useEffect } from 'react';
import './index.css';

import Welcome from './components/Welcome';
import Wonder from './components/Wonder';
import Story from './components/Story';
import Simulate from './components/Simulate';
import Play from './components/Play'; // Keep file name Play, but component represents Practice
import Reflect from './components/Reflect';
import { Home, Volume2, VolumeX } from 'lucide-react';
import { getMuted, setMuted } from './utils/elevenlabs';

function App() {
  const [currentPhase, setCurrentPhase] = useState('welcome');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(getMuted());
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setMuted(newMuted);
  };

  const navigateTo = (phase) => {
    setCurrentPhase(phase);
  };

  const steps = [
    { id: 'wonder', label: 'Wonder' },
    { id: 'story', label: 'Story' },
    { id: 'simulate', label: 'Simulate' },
    { id: 'play', label: 'Practice' },
    { id: 'reflect', label: 'Reflect' }
  ];

  const currentIndex = steps.findIndex(s => s.id === currentPhase);

  return (
    <div className="app-container">
      {/* Global Audio Controller */}
      <button className="global-mute-btn" onClick={toggleMute} aria-label="Toggle Audio">
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      <div className="floating-numbers">
        <div className="floating-number" style={{ top: '10%', left: '5%', animationDelay: '0s' }}>1000</div>
        <div className="floating-number" style={{ top: '20%', right: '10%', animationDelay: '2s' }}>400</div>
        <div className="floating-number" style={{ top: '60%', left: '15%', animationDelay: '4s' }}>50</div>
        <div className="floating-number" style={{ top: '80%', right: '20%', animationDelay: '6s' }}>+</div>
      </div>

      {currentPhase !== 'welcome' && (
        <>
          <div className="journey-bar">
            {steps.map((step, index) => {
              let stepClass = "journey-step";
              if (index === currentIndex) stepClass += " active";
              if (index < currentIndex) stepClass += " completed";

              return (
                <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className={stepClass} onClick={() => index <= currentIndex && navigateTo(step.id)} style={{ cursor: index <= currentIndex ? 'pointer' : 'default' }}>
                    <div className="journey-step-dot">{index + 1}</div>
                    <div className="journey-step-label">{step.label}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`journey-connector ${index < currentIndex ? 'filled' : ''}`}></div>
                  )}
                </div>
              );
            })}
          </div>

          <button className="home-btn" onClick={() => navigateTo('welcome')}>
            <Home size={16} /> Home
          </button>
        </>
      )}

      {currentPhase === 'welcome' && <Welcome onNext={() => navigateTo('wonder')} />}
      {currentPhase === 'wonder' && <Wonder onNext={() => navigateTo('story')} />}
      {currentPhase === 'story' && <Story onNext={() => navigateTo('simulate')} />}
      {currentPhase === 'simulate' && <Simulate onNext={() => navigateTo('play')} />}
      {currentPhase === 'play' && <Play onNext={() => navigateTo('reflect')} />}
      {currentPhase === 'reflect' && <Reflect onHome={() => navigateTo('welcome')} />}
    </div>
  );
}

export default App;
