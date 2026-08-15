import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { playTTS, stopTTS } from '../utils/elevenlabs';

export default function Wonder({ onNext }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    playTTS("How do we show what a really big number is made of? Like all the thousands, hundreds, tens, and ones hiding inside it? Is the number 4523 just a 4, a 5, a 2, and a 3 pushed together?");
  }, []);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        <div className="wonder-particle" style={{ top: '20%', left: '10%', animationDelay: '0s' }}>✨</div>
        <div className="wonder-particle" style={{ top: '70%', left: '80%', animationDelay: '2s' }}>✨</div>
        <div className="wonder-particle" style={{ top: '40%', left: '90%', animationDelay: '4s' }}>✨</div>
      </div>

      <div className="wonder-content">
        <div className={`wonder-qmark ${step >= 0 ? 'revealed' : ''}`}>
          <div className="wonder-qmark-glow"></div>
          <div className="wonder-qmark-icon">?</div>
        </div>

        <div className={`wonder-mascot ${step >= 0 ? 'visible' : ''}`}>
          <div className="mascot thinking">🤔</div>
          <div className="speech-bubble wonder-bubble">
            Have you ever wondered...
          </div>
        </div>

        <div className={`wonder-question-card ${step >= 0 ? 'visible' : ''}`}>
          <div className="wonder-emoji">🔢</div>
          <h2 className="wonder-question-text">
            How do we show what a really big number is made of? Like all the thousands, hundreds, tens, and ones hiding inside it?
          </h2>
          <p className="wonder-subtext">
            Is the number 4523 just a 4, a 5, a 2, and a 3 pushed together?
          </p>
        </div>

        <button 
          className={`btn-wonder ${step >= 0 ? 'visible' : ''}`}
          onClick={onNext}
        >
          Discover Expanded Form! <Sparkles className="wonder-btn-sparkle" size={20} />
        </button>
      </div>
    </div>
  );
}
