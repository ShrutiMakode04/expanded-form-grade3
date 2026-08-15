import { useState } from 'react';
import { Rocket, ArrowRight, PlayCircle } from 'lucide-react';
import { playTTS } from '../utils/elevenlabs';

export default function Welcome({ onNext }) {
  const [isStarted, setIsStarted] = useState(false);

  const handleStartLearning = () => {
    setIsStarted(true);
    playTTS("Welcome to Expanded and Standard Form! Ready to stretch out some numbers? Let's go!");
  };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ New Module</div>
      <h1 className="intro-title" style={{ color: 'var(--gold)' }}>Expanded &amp;</h1>
      <h1 className="intro-title">Standard Form</h1>

      <p className="intro-desc" style={{ marginTop: '20px', minHeight: '60px' }}>
        {isStarted
          ? 'Join us on an adventure to learn all about how big numbers are built! We will stretch them out into expanded form and squish them back into standard form.'
          : 'Click Start Learning to begin your adventure with numbers!'}
      </p>

      {!isStarted ? (
        <button
          className="btn btn-primary btn-lg intro-start-btn"
          onClick={handleStartLearning}
          style={{ marginTop: '32px', fontSize: '1.5rem', padding: '20px 44px' }}
        >
          <PlayCircle size={28} /> Start Learning!
        </button>
      ) : (
        <div style={{ animation: 'fadeIn 0.5s' }}>
          <div className="intro-journey-map" style={{ marginTop: '24px' }}>
            <h3 className="intro-journey-title">Your Journey</h3>
            <div className="intro-journey-steps">
              {[
                { icon: '💡', label: 'Wonder' },
                { icon: '📖', label: 'Story' },
                { icon: '🎯', label: 'Simulate' },
                { icon: '🎮', label: 'Practice' },
                { icon: '🌟', label: 'Reflect' },
              ].map((step, i, arr) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div className="intro-journey-step">
                    <div className="intro-journey-icon">{step.icon}</div>
                    <div className="intro-journey-info">
                      <div className="intro-journey-label">{step.label}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && <ArrowRight className="intro-journey-arrow" size={16} />}
                </span>
              ))}
            </div>
          </div>

          <button
            className="btn btn-green btn-lg intro-start-btn"
            onClick={onNext}
            style={{ marginTop: '28px' }}
          >
            <Rocket size={24} /> Begin Your Journey
          </button>
        </div>
      )}
    </div>
  );
}
