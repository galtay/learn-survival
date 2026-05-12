import React, { useState, useEffect } from 'react';
import { Play, Square } from 'lucide-react';
import { getObservedCohort } from '../cohortData';

const RiskSetSweeper = () => {
  const [t, setT] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // The cohort from the previous section
  const cohort = getObservedCohort();

  const tMax = 28;
  const mx = 48;
  const xMax = 768;
  const scaleX = (val) => mx + (val / tMax) * (xMax - mx);

  // Animation loop
  useEffect(() => {
    let frame;
    if (isPlaying) {
      const start = performance.now();
      const startT = t;
      const duration = 5000; // 5 seconds to sweep 0 -> 28

      const animate = (now) => {
        const elapsed = now - start;
        const progress = elapsed / duration;
        let nextT = startT + progress * tMax;
        if (nextT >= tMax) {
          nextT = tMax;
          setIsPlaying(false);
        }
        setT(nextT);
        if (nextT < tMax) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, t]);

  const togglePlay = () => {
    if (t >= tMax) setT(0);
    setIsPlaying(!isPlaying);
  };

  const n_t = cohort.filter(p => p.y >= t).length;

  return (
    <div className="interactive-widget">
      <div className="controls">
        <button className={`toggle ${isPlaying ? 'active' : ''}`} onClick={togglePlay} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isPlaying ? <Square size={14} /> : <Play size={14} />} 
          {isPlaying ? 'Stop' : 'Sweep Time'}
        </button>
        <div className="control-group" style={{ marginLeft: '1rem' }}>
          <label style={{ width: 'auto', marginRight: '8px' }}>Time $t$:</label>
          <input 
            type="range" 
            min="0" max={tMax} step="0.1" 
            value={t} 
            onChange={e => { setT(parseFloat(e.target.value)); setIsPlaying(false); }} 
            style={{ width: '300px' }}
          />
          <span style={{ width: '40px', textAlign: 'right' }}>{t.toFixed(1)}</span>
        </div>
        
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: '15px', color: 'var(--accent)' }}>
          n({t.toFixed(1)}) = {n_t}
        </div>
      </div>
      
      <div className="canvas">
        <svg viewBox="0 0 800 396" className="diagram-svg" role="img">
          <text x="48" y="18" className="panel-title">The Risk Set R(t)</text>
          
          {/* Axis */}
          <line x1={mx} y1="350" x2={xMax} y2="350" className="axis"/>
          {[0, 4, 8, 12, 16, 20, 24, 28].map(tick => (
            <g key={tick}>
              <line x1={scaleX(tick)} y1="350" x2={scaleX(tick)} y2="354" className="axis"/>
              <text x={scaleX(tick)} y="368" className="tick-label" textAnchor="middle">{tick}</text>
            </g>
          ))}

          {/* Patients */}
          {cohort.map((p, i) => {
            const isActive = p.y >= t;
            const yPos = 68 + i * 28;
            
            return (
              <g key={i} style={{ opacity: isActive ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                <text x={mx - 8} y={yPos + 4} className="row-label" textAnchor="end">P{i+1}</text>
                <line x1={mx} y1={yPos} x2={scaleX(p.y)} y2={yPos} className="seg" style={{ stroke: isActive ? 'var(--fg)' : 'var(--fg-3)' }}/>
                {p.d === 1 ? (
                  <circle cx={scaleX(p.y)} cy={yPos} r="4.5" className="glyph-event" style={{ fill: isActive ? 'var(--accent)' : 'var(--fg-3)' }}/>
                ) : (
                  <polyline 
                    points={`${scaleX(p.y)-4},${yPos-6} ${scaleX(p.y)+4},${yPos} ${scaleX(p.y)-4},${yPos+6}`} 
                    className="glyph-cens"
                    style={{ stroke: isActive ? 'var(--censor)' : 'var(--fg-3)' }}
                  />
                )}
              </g>
            );
          })}

          {/* Sweeper Line */}
          <line x1={scaleX(t)} y1="40" x2={scaleX(t)} y2="350" stroke="var(--fg)" strokeWidth="2" />
          <polygon points={`${scaleX(t)-6},40 ${scaleX(t)+6},40 ${scaleX(t)},48`} fill="var(--fg)" />
        </svg>
      </div>
    </div>
  );
};

export default RiskSetSweeper;
