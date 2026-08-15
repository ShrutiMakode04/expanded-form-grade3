import { useState, useEffect } from 'react';
import { playTTS, stopTTS } from '../utils/elevenlabs';
import { Home } from 'lucide-react';

export default function Reflect({ onHome }) {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    playTTS("Amazing Job! You have successfully mastered expanded and standard forms. You are a Number Master!");
    return () => stopTTS();
  }, []);

  const handleSelect = (idx) => {
    setSelected(idx);
    setTimeout(onHome, 1500);
  };

  return (
    <div className="reflect-phase">
      <div className="reflect-header">
        <div className="reflect-label">Phase 5</div>
        <h2>Reflection Time</h2>
      </div>

      <div className="reflect-card">
        <h3 className="reflect-card-title">How confident do you feel about Expanded and Standard Form?</h3>
        
        <div className="confidence-grid" style={{ marginTop: '24px' }}>
          <button 
            className={`confidence-btn ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
            style={{ '--conf-color': 'var(--green)' }}
          >
            <span className="confidence-emoji">🤩</span>
            <span className="confidence-label">I'm a master! I can teach others.</span>
          </button>
          
          <button 
            className={`confidence-btn ${selected === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
            style={{ '--conf-color': 'var(--gold)' }}
          >
            <span className="confidence-emoji">😊</span>
            <span className="confidence-label">I get it, but I might need a little practice.</span>
          </button>
          
          <button 
            className={`confidence-btn ${selected === 2 ? 'selected' : ''}`}
            onClick={() => handleSelect(2)}
            style={{ '--conf-color': 'var(--coral)' }}
          >
            <span className="confidence-emoji">🤔</span>
            <span className="confidence-label">I'm still learning. I need more help.</span>
          </button>
        </div>
      </div>
    </div>
  );
}
