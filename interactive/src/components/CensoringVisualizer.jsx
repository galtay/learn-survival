import React, { useState, useEffect, useRef } from 'react';
import { sharedCohort } from '../cohortData';

const CensoringVisualizer = () => {
  const [showObserved, setShowObserved] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (window.renderMathInElement && textRef.current) {
      window.renderMathInElement(textRef.current, {
        delimiters: [{left: '$', right: '$', display: false}],
        throwOnError: false
      });
    }
  }, [showObserved]);

  // Each patient has a true event time T and a random censoring time C
  // Sort by observed duration Y = min(T, C)
  const cohort = [...sharedCohort].sort((a, b) => Math.min(a.T, a.C) - Math.min(b.T, b.C));

  const w = 800;
  const h = 396;
  const mx = 48;
  const xMax = 768;
  const tMax = 40;

  const scaleX = (t) => mx + (t / tMax) * (xMax - mx);

  return (
    <div className="interactive-widget">
      <div className="controls">
        <button
          className={`toggle ${showObserved ? 'active' : ''}`}
          onClick={() => setShowObserved(!showObserved)}
          style={{ width: '152px' }}
        >
          {showObserved ? 'Show true T' : 'Show observed Y'}
        </button>
        <div ref={textRef} style={{ marginLeft: '1rem', fontFamily: 'var(--sans)', fontSize: '13px', color: 'var(--fg-2)' }}>
          {showObserved
            ? <span>Currently viewing observed durations $Y = \min(T, C)$</span>
            : <span>Currently viewing true event times $T$</span>}
        </div>
      </div>
      
      <div className="canvas">
        <svg viewBox="0 0 800 396" className="diagram-svg" role="img">
          <text x="48" y="18" className="panel-title">Individual Censoring</text>
          <text x="48" y="34" style={{fill: 'var(--fg-2)', fontSize: '11.5px'}}>
            Subjects drop out independently. Toggle to see how the true timeline maps to observables.
          </text>

          {/* Axis */}
          <line x1={mx} y1="350" x2={xMax} y2="350" className="axis"/>
          {[0, 8, 16, 24, 32, 40].map(tick => (
            <g key={tick}>
              <line x1={scaleX(tick)} y1="350" x2={scaleX(tick)} y2="354" className="axis"/>
              <text x={scaleX(tick)} y="368" className="tick-label" textAnchor="middle">{tick}</text>
            </g>
          ))}
          <text x={xMax/2} y="384" className="axis-title" textAnchor="middle">t (duration in months)</text>

          {/* Patients */}
          {cohort.map((p, i) => {
            const isCensored = p.T > p.C;
            const yObs = showObserved ? Math.min(p.T, p.C) : p.T;
            const eventObserved = showObserved ? !isCensored : true;
            const yPos = 68 + i * 28;
            
            return (
              <g key={p.id}>
                <text x={mx - 8} y={yPos + 4} className="row-label" textAnchor="end">P{i+1}</text>
                
                {/* The main solid line */}
                <line 
                  x1={mx} y1={yPos} 
                  x2={scaleX(yObs)} y2={yPos} 
                  className="seg"
                  style={{ transition: 'all 0.3s ease' }}
                />

                {/* The ghost line indicating the unobserved future if censoring is applied */}
                {showObserved && isCensored && (
                  <line 
                    x1={scaleX(yObs)} y1={yPos} 
                    x2={scaleX(p.T)} y2={yPos} 
                    stroke="var(--rule-strong)" strokeWidth="1.2" strokeDasharray="3 3"
                  />
                )}
                {showObserved && isCensored && (
                   <circle cx={scaleX(p.T)} cy={yPos} r="3" fill="var(--rule-strong)" />
                )}

                {/* The censoring marker if not applied yet */}
                {!showObserved && isCensored && (
                  <line 
                    x1={scaleX(p.C)} y1={yPos - 4} 
                    x2={scaleX(p.C)} y2={yPos + 4} 
                    stroke="var(--censor)" strokeWidth="1" strokeDasharray="2 1"
                  />
                )}

                {/* Event or Censor Glyph */}
                <g style={{ transform: `translateX(${scaleX(yObs)}px) translateY(${yPos}px)`, transition: 'transform 0.3s ease' }}>
                  {eventObserved ? (
                    <circle cx="0" cy="0" r="4.5" className="glyph-event"/>
                  ) : (
                    <polyline 
                      points="-4,-6 4,0 -4,6" 
                      className="glyph-cens"
                    />
                  )}
                </g>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="caption">
        <span className="label" style={{color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.13em', marginRight: '0.6em'}}>Interactive 2</span>
        Notice how censoring truncates the line. The unobserved true event times (dashed lines) are completely hidden from our dataset.
      </div>
    </div>
  );
};

export default CensoringVisualizer;
