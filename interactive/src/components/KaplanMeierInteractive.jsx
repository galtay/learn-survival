import React, { useState, useMemo } from 'react';
import { getObservedCohort } from '../cohortData';

const KaplanMeierInteractive = () => {
  // Initial cohort
  const initialCohort = getObservedCohort();

  const [cohort, setCohort] = useState(initialCohort);

  const toggleStatus = (id) => {
    setCohort(cohort.map(p => p.id === id ? { ...p, d: p.d === 1 ? 0 : 1 } : p));
  };

  // Calculate KM curve
  const kmData = useMemo(() => {
    const sorted = [...cohort].sort((a, b) => a.y - b.y);
    let currentS = 1;
    let n = cohort.length;
    const steps = [{ t: 0, S: 1, n: n, d: 0, c: 0 }];

    let i = 0;
    while (i < sorted.length) {
      const t = sorted[i].y;
      let d_t = 0;
      let c_t = 0;
      
      // Group ties
      while (i < sorted.length && sorted[i].y === t) {
        if (sorted[i].d === 1) d_t++;
        else c_t++;
        i++;
      }

      if (d_t > 0) {
        currentS = currentS * (1 - d_t / n);
      }
      
      steps.push({ t, S: currentS, n, d: d_t, c: c_t });
      n = n - d_t - c_t;
    }
    
    // Add end point to carry step function to max time
    if (steps[steps.length - 1].t < 28) {
      steps.push({ t: 28, S: currentS, n: 0, d: 0, c: 0 });
    }

    return steps;
  }, [cohort]);

  // Make SVG path for KM
  const makeKMPath = (steps, scaleX, scaleY) => {
    let path = `M ${scaleX(0)} ${scaleY(1)}`;
    for (let i = 1; i < steps.length; i++) {
      const prev = steps[i - 1];
      const curr = steps[i];
      // Horizontal line to current t
      path += ` L ${scaleX(curr.t)} ${scaleY(prev.S)}`;
      // Vertical line to current S
      path += ` L ${scaleX(curr.t)} ${scaleY(curr.S)}`;
    }
    return path;
  };

  // Scales
  const mx = 48, my = 52, yMax = 350, xMax = 370;
  const tMax = 28;
  const scaleX1 = (val) => mx + (val / tMax) * (xMax - mx);
  
  // Right panel scales
  const mx2 = 460, xMax2 = 768;
  const scaleX2 = (val) => mx2 + (val / tMax) * (xMax2 - mx2);
  const scaleY2 = (val) => yMax - val * (yMax - my);

  const kmPath = makeKMPath(kmData, scaleX2, scaleY2);

  return (
    <div className="interactive-widget">
      <div className="controls">
        <div style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--fg)' }}>
          Click an event glyph on the left to toggle between <span style={{color: 'var(--accent)'}}>Event</span> and <span style={{color: 'var(--censor)'}}>Censored</span>.
        </div>
        <button 
          className="toggle" 
          onClick={() => setCohort(initialCohort)}
          style={{ marginLeft: 'auto' }}
        >
          Reset
        </button>
      </div>
      
      <div className="canvas">
        <svg viewBox="0 0 800 396" className="diagram-svg" role="img">
          
          {/* LEFT PANEL: Cohort */}
          <g>
            <text x="48" y="18" className="panel-title">Cohort Observations</text>
            
            <line x1={mx} y1="350" x2={xMax} y2="350" className="axis"/>
            {[0, 7, 14, 21, 28].map(tick => (
              <g key={tick}>
                <line x1={scaleX1(tick)} y1="350" x2={scaleX1(tick)} y2="354" className="axis"/>
                <text x={scaleX1(tick)} y="368" className="tick-label" textAnchor="middle">{tick}</text>
              </g>
            ))}
            
            {cohort.map((p, i) => {
              const yPos = 68 + i * 28;
              return (
                <g key={p.id}>
                  <text x={mx - 8} y={yPos + 4} className="row-label" textAnchor="end">P{i+1}</text>
                  <line x1={mx} y1={yPos} x2={scaleX1(p.y)} y2={yPos} className="seg"/>
                  
                  {/* Clickable hit area */}
                  <circle cx={scaleX1(p.y)} cy={yPos} r="12" fill="transparent" style={{cursor: 'pointer'}} onClick={() => toggleStatus(p.id)} />
                  
                  <g style={{pointerEvents: 'none'}}>
                    {p.d === 1 ? (
                      <circle cx={scaleX1(p.y)} cy={yPos} r="4.5" className="glyph-event"/>
                    ) : (
                      <polyline 
                        points={`${scaleX1(p.y)-4},${yPos-6} ${scaleX1(p.y)+4},${yPos} ${scaleX1(p.y)-4},${yPos+6}`} 
                        className="glyph-cens"
                      />
                    )}
                  </g>
                </g>
              );
            })}
          </g>

          {/* RIGHT PANEL: KM Curve */}
          <g>
            <text x={mx2} y="18" className="panel-title">Kaplan-Meier Estimate S(t)</text>
            
            <path d={`M ${mx2} 52 L ${mx2} 350 L ${xMax2} 350`} className="axis"/>
            
            <line x1={mx2} y1={scaleY2(0.5)} x2={xMax2} y2={scaleY2(0.5)} className="grid"/>
            <text x={mx2-6} y={scaleY2(0.5)+4} className="tick-label" textAnchor="end">0.5</text>
            <line x1={mx2} y1={scaleY2(1.0)} x2={xMax2} y2={scaleY2(1.0)} className="grid"/>
            <text x={mx2-6} y={scaleY2(1.0)+4} className="tick-label" textAnchor="end">1.0</text>
            <text x={mx2-6} y={scaleY2(0)+4} className="tick-label" textAnchor="end">0.0</text>

            {[0, 7, 14, 21, 28].map(tick => (
              <g key={`km-${tick}`}>
                <line x1={scaleX2(tick)} y1="350" x2={scaleX2(tick)} y2="354" className="axis"/>
                <text x={scaleX2(tick)} y="368" className="tick-label" textAnchor="middle">{tick}</text>
              </g>
            ))}

            <path d={kmPath} className="km-step"/>

            {/* Markers on KM curve */}
            {kmData.map((step, i) => {
              const markers = [];
              if (step.c > 0 && step.t > 0) {
                markers.push(
                  <line 
                    key={`c-${i}`}
                    x1={scaleX2(step.t)} y1={scaleY2(step.S) - 6}
                    x2={scaleX2(step.t)} y2={scaleY2(step.S) + 6}
                    className="km-tick"
                  />
                );
              }
              if (step.d > 0 && step.t > 0) {
                // To display it at the top of the step before it drops: 
                // the previous S value would be kmData[i-1].S, but standard 
                // is often at the bottom of the drop.
                markers.push(
                  <circle 
                    key={`d-${i}`}
                    cx={scaleX2(step.t)} cy={scaleY2(step.S)} 
                    r="4.5" 
                    className="glyph-event"
                  />
                );
              }
              return markers;
            })}
          </g>
          
        </svg>
      </div>
      <div className="caption">
        <span className="label" style={{color: 'var(--fg)', textTransform: 'uppercase', letterSpacing: '0.13em', marginRight: '0.6em'}}>Interactive 4</span>
        Watch how changing an event to a censored observation prevents the curve from dropping, effectively "lifting" the tail of the estimate.
      </div>
    </div>
  );
};

export default KaplanMeierInteractive;
