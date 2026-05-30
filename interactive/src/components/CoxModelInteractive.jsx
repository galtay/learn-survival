import React, { useState, useMemo } from 'react';

const CoxModelInteractive = () => {
  const [beta, setBeta] = useState(-0.7);
  
  // Weibull baseline parameters
  const lambda = 20;
  const k = 1.5;

  // Math functions
  const h0 = (t) => {
    if (t === 0) return 0;
    return (k / lambda) * Math.pow(t / lambda, k - 1);
  };
  
  const H0 = (t) => Math.pow(t / lambda, k);
  const S0 = (t) => Math.exp(-H0(t));

  const h1 = (t) => h0(t) * Math.exp(beta);
  const S1 = (t) => Math.pow(S0(t), Math.exp(beta));

  // Generate path data
  const tMax = 30;
  const steps = 60;
  
  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tMax;
      pts.push({
        t,
        h0: h0(t),
        S0: S0(t),
        h1: h1(t),
        S1: S1(t)
      });
    }
    return pts;
  }, [beta]);

  // Scales for left panel (Hazard)
  const mx = 48, my = 52, yMax = 350, xMax = 370;
  const scaleX = (t) => mx + (t / tMax) * (xMax - mx);
  
  const maxH = 0.5; // Fixed y-axis maximum for hazard
  const scaleH = (h) => yMax - (h / maxH) * (yMax - my);

  // Scales for right panel (Survival)
  const mx2 = 460, xMax2 = 768;
  const scaleX2 = (t) => mx2 + (t / tMax) * (xMax2 - mx2);
  const scaleS = (s) => yMax - s * (yMax - my);

  // Path generators
  const makeLinePath = (data, valKey, scaleXFunc, scaleYFunc) => {
    if (data.length === 0) return "";
    let path = `M ${scaleXFunc(data[0].t)} ${scaleYFunc(data[0][valKey])}`;
    for (let i = 1; i < data.length; i++) {
      path += ` L ${scaleXFunc(data[i].t)} ${scaleYFunc(data[i][valKey])}`;
    }
    return path;
  };

  const pathH0 = makeLinePath(data, 'h0', scaleX, scaleH);
  const pathH1 = makeLinePath(data, 'h1', scaleX, scaleH);
  const pathS0 = makeLinePath(data, 'S0', scaleX2, scaleS);
  const pathS1 = makeLinePath(data, 'S1', scaleX2, scaleS);

  // Calculate Hazard Ratio
  const hr = Math.exp(beta).toFixed(2);

  return (
    <div className="interactive-widget">
      <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--fg)' }}>
          <strong>Covariate Effect ($\beta$):</strong> <span style={{display: 'inline-block', width: '40px'}}>{beta.toFixed(2)}</span>
        </div>
        <input 
          type="range" 
          min="-1.5" 
          max="1.5" 
          step="0.1" 
          value={beta} 
          onChange={(e) => setBeta(parseFloat(e.target.value))}
          style={{ flex: 1, maxWidth: '300px' }}
        />
        <div style={{ fontFamily: 'var(--sans)', fontSize: '14px', color: 'var(--fg)', marginLeft: 'auto' }}>
          <strong>Hazard Ratio:</strong> {hr}
        </div>
      </div>
      
      <div className="canvas">
        <svg viewBox="0 0 800 396" className="diagram-svg" role="img">
          
          {/* LEFT PANEL: Hazard Functions */}
          <g>
            <text x="48" y="18" className="panel-title">Hazard Function h(t|X)</text>
            
            <line x1={mx} y1={yMax} x2={xMax} y2={yMax} className="axis"/>
            <line x1={mx} y1={my} x2={mx} y2={yMax} className="axis"/>
            
            {/* Y-axis labels for Hazard */}
            {[0, 0.25, 0.5].map(tick => (
              <g key={`htick-${tick}`}>
                <line x1={mx} y1={scaleH(tick)} x2={xMax} y2={scaleH(tick)} className="grid" strokeDasharray="4 4" opacity="0.5"/>
                <text x={mx-6} y={scaleH(tick)+4} className="tick-label" textAnchor="end">{tick}</text>
              </g>
            ))}

            {/* X-axis labels */}
            {[0, 10, 20, 30].map(tick => (
              <g key={`x1-${tick}`}>
                <line x1={scaleX(tick)} y1={yMax} x2={scaleX(tick)} y2={yMax+4} className="axis"/>
                <text x={scaleX(tick)} y={yMax+18} className="tick-label" textAnchor="middle">{tick}</text>
              </g>
            ))}
            
            {/* Legend Left */}
            <g transform={`translate(${mx + 20}, ${my + 20})`}>
              <line x1="0" y1="0" x2="20" y2="0" stroke="var(--fg-1)" strokeWidth="2" />
              <text x="28" y="4" className="tick-label" fill="var(--fg-1)">X=0 (Baseline)</text>
              <line x1="0" y1="20" x2="20" y2="20" stroke="var(--fg)" strokeWidth="2" strokeDasharray="5 3" />
              <text x="28" y="24" className="tick-label" fill="var(--fg)">X=1 (Treatment)</text>
            </g>

            <path d={pathH0} fill="none" stroke="var(--fg-1)" strokeWidth="2" />
            <path d={pathH1} fill="none" stroke="var(--fg)" strokeWidth="2" strokeDasharray="5 3" />
          </g>

          {/* RIGHT PANEL: Survival Functions */}
          <g>
            <text x={mx2} y="18" className="panel-title">Survival Function S(t|X)</text>
            
            <line x1={mx2} y1={yMax} x2={xMax2} y2={yMax} className="axis"/>
            <line x1={mx2} y1={my} x2={mx2} y2={yMax} className="axis"/>
            
            {/* Y-axis labels for Survival */}
            {[0, 0.5, 1.0].map(tick => (
              <g key={`stick-${tick}`}>
                <line x1={mx2} y1={scaleS(tick)} x2={xMax2} y2={scaleS(tick)} className="grid" strokeDasharray="4 4" opacity="0.5"/>
                <text x={mx2-6} y={scaleS(tick)+4} className="tick-label" textAnchor="end">{tick}</text>
              </g>
            ))}

            {/* X-axis labels */}
            {[0, 10, 20, 30].map(tick => (
              <g key={`x2-${tick}`}>
                <line x1={scaleX2(tick)} y1={yMax} x2={scaleX2(tick)} y2={yMax+4} className="axis"/>
                <text x={scaleX2(tick)} y={yMax+18} className="tick-label" textAnchor="middle">{tick}</text>
              </g>
            ))}

            <path d={pathS0} fill="none" stroke="var(--fg-1)" strokeWidth="2" />
            <path d={pathS1} fill="none" stroke="var(--fg)" strokeWidth="2" strokeDasharray="5 3" />
          </g>
          
        </svg>
      </div>
      <div className="caption">
        Adjust $\beta$ to see how the hazard function for Group 1 (Treatment) scales proportionally to the Baseline hazard, and how that translates to the survival curve. A positive $\beta$ increases hazard (decreases survival).
      </div>
    </div>
  );
};

export default CoxModelInteractive;
