import { Star, Award } from 'lucide-react';

export default function TopBar({ stars, xp, currentPhase }) {
  return (
    <header className="top-bar">
      <div className="font-bold text-xl tracking-wider">INTELLIA</div>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div className="stat-pill" style={{ color: '#fbbf24' }}>
          <Star size={20} fill="currentColor" />
          <span>{stars}</span>
        </div>
        
        <div className="stat-pill" style={{ color: '#60a5fa' }}>
          <Award size={20} fill="currentColor" />
          <span>{xp} XP</span>
        </div>
      </div>
    </header>
  );
}
