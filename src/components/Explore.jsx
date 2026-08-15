import React, { useState } from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';

export default function Explore({ onNext }) {
  const [thousands, setThousands] = useState(0);
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);

  const standardForm = thousands * 1000 + hundreds * 100 + tens * 10 + ones;

  const handleReset = () => {
    setThousands(0);
    setHundreds(0);
    setTens(0);
    setOnes(0);
  };

  return (
    <div className="phase-container">
      <h2 style={{ color: 'var(--secondary)', fontSize: '2.5rem', marginBottom: '1rem' }}>
        Explore Place Values
      </h2>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', marginBottom: '2rem' }}>
        Click the buttons to add blocks and see the number grow!
      </p>

      <div style={{
        display: 'flex',
        gap: '2rem',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={() => setThousands(prev => prev < 9 ? prev + 1 : 0)}>
            +1000 (Thousands)
          </button>
          <h3 style={{ marginTop: '1rem', fontSize: '2rem', color: 'var(--accent)' }}>{thousands * 1000}</h3>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => setHundreds(prev => prev < 9 ? prev + 1 : 0)}>
            +100 (Hundreds)
          </button>
          <h3 style={{ marginTop: '1rem', fontSize: '2rem', color: 'var(--primary)' }}>{hundreds * 100}</h3>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-secondary" onClick={() => setTens(prev => prev < 9 ? prev + 1 : 0)} style={{ background: '#48BB78', borderColor: 'rgba(255,255,255,0.3)' }}>
            +10 (Tens)
          </button>
          <h3 style={{ marginTop: '1rem', fontSize: '2rem', color: '#48BB78' }}>{tens * 10}</h3>
        </div>
        <div style={{ textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => setOnes(prev => prev < 9 ? prev + 1 : 0)} style={{ background: '#9F7AEA', borderColor: 'rgba(255,255,255,0.3)' }}>
            +1 (Ones)
          </button>
          <h3 style={{ marginTop: '1rem', fontSize: '2rem', color: '#9F7AEA' }}>{ones}</h3>
        </div>
      </div>

      <div style={{
        background: '#fff',
        padding: '2rem 4rem',
        borderRadius: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        textAlign: 'center',
        marginBottom: '2rem',
        width: '100%',
        maxWidth: '800px'
      }}>
        <div style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Expanded Form
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text)', marginBottom: '2rem' }}>
          {thousands * 1000} + {hundreds * 100} + {tens * 10} + {ones}
        </div>
        
        <div style={{ height: '2px', background: '#EDF2F7', width: '100%', margin: '2rem 0' }}></div>
        
        <div style={{ fontSize: '1.5rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Standard Form
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          {standardForm}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <button className="btn" style={{ background: '#EDF2F7', color: 'var(--text)' }} onClick={handleReset}>
          <RefreshCw size={20} /> Reset
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Let's Play! <ArrowRight />
        </button>
      </div>
    </div>
  );
}
