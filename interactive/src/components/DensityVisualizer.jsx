import React, { useState, useMemo } from 'react';

const DensityVisualizer = () => {
  const [t0, setT0] = useState(10); // initial slider value

  // Fixed distribution parameters
  const k = 2.0;
  const lambda = 8.0;
  const points = 100;
  const tMax = 23;

  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * tMax;
      const safeT = t === 0 ? 0.0001 : t;
      // Weibull density
      const s = Math.exp(-Math.pow(safeT / lambda, k));
      const h = (k / lambda) * Math.pow(safeT / lambda, k - 1);
      const f = h * s;
      pts.push({ t, f });
    }
    return pts;
  }, []);

  // Compute F(t0) and S(t0) exactly for display
  const exactS = Math.exp(-Math.pow((t0===0?0.0001:t0) / lambda, k));
  const exactF = 1 - exactS;

  // SVG Geometry
  const width = 600;
  const height = 260; // increased height to fit labels
  const mx = 80; 
  const my = 35;
  const xMax = 520;
  const yMax = 200;
  const maxF = 0.11; 

  const scaleX = (t) => mx + (t / tMax) * (xMax - mx);
  const scaleY = (f) => yMax - (f / maxF) * (yMax - my);

  // Generate paths
  const fPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(d.t)} ${scaleY(d.f)}`).join(' ');
  
  // Split data into left and right of t0
  const leftData = data.filter(d => d.t <= t0);
  // interpolate exactly at t0
  const safeT0 = t0 === 0 ? 0.0001 : t0;
  const fAtT0 = ((k / lambda) * Math.pow(safeT0 / lambda, k - 1)) * Math.exp(-Math.pow(safeT0 / lambda, k));
  leftData.push({ t: t0, f: fAtT0 });

  const rightData = [{ t: t0, f: fAtT0 }, ...data.filter(d => d.t > t0)];

  const leftArea = `M ${scaleX(0)} ${yMax} ` + 
    leftData.map(d => `L ${scaleX(d.t)} ${scaleY(d.f)}`).join(' ') + 
    ` L ${scaleX(t0)} ${yMax} Z`;

  const rightArea = `M ${scaleX(t0)} ${yMax} ` + 
    rightData.map(d => `L ${scaleX(d.t)} ${scaleY(d.f)}`).join(' ') + 
    ` L ${scaleX(tMax)} ${yMax} Z`;

  return (
    <div className="interactive-widget">
      <div className="controls">
        <div className="control-group">
          <label>Time ($t$):</label>
          <input 
            type="range" 
            min="0" max={tMax} step="0.5" 
            value={t0} 
            onChange={e => setT0(parseFloat(e.target.value))} 
            style={{ width: '200px' }}
          />
          <span style={{ width: '40px', textAlign: 'right' }}>{t0.toFixed(2)}</span>
        </div>
        <div className="dim" style={{ fontSize: '12.5px', marginLeft: 'auto', fontFamily: 'monospace' }}>
          F(t) = {exactF.toFixed(2)} &nbsp;&nbsp;|&nbsp;&nbsp; S(t) = {exactS.toFixed(2)}
        </div>
      </div>
      
      <div className="canvas" style={{ padding: '20px 0' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} className="diagram-svg" role="img" style={{ width: '100%', height: 'auto', display: 'block' }}>
          
          {/* Areas */}
          <path d={leftArea} fill="var(--accent)" fillOpacity="0.25" />
          <path d={rightArea} fill="var(--censor)" fillOpacity="0.25" />

          {/* Axes */}
          <path d={`M ${mx} ${my} L ${mx} ${yMax} L ${xMax} ${yMax}`} className="axis" fill="none" stroke="var(--fg-3)" />
          
          {/* Main Density Curve */}
          <path d={fPath} fill="none" stroke="var(--fg-1)" strokeWidth="2.5" />
          
          {/* Label for f(t) axis */}
          <text x={mx} y={my - 12} fill="var(--fg-1)" fontSize="16" fontStyle="italic" textAnchor="middle">
            f(t)
          </text>

          {/* Vertical line at t0 */}
          <line x1={scaleX(t0)} y1={yMax} x2={scaleX(t0)} y2={scaleY(fAtT0)} stroke="var(--fg-1)" strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Point at t0 */}
          <circle cx={scaleX(t0)} cy={scaleY(fAtT0)} r="4.5" fill="var(--fg-1)" />
          
          {/* t annotation */}
          <text x={scaleX(t0)} y={yMax + 18} className="tick-label" textAnchor="middle" fill="var(--fg-1)" fontWeight="bold">
            t = {t0.toFixed(2)}
          </text>

          {/* Offset F(t) and S(t) annotations below t */}
          <text x={scaleX(t0) - 15} y={yMax + 38} className="tick-label" textAnchor="end" fill="var(--accent)" fontWeight="bold">
            F(t)={exactF.toFixed(2)}
          </text>
          
          <text x={scaleX(t0) + 15} y={yMax + 38} className="tick-label" textAnchor="start" fill="var(--censor)" fontWeight="bold">
            S(t)={exactS.toFixed(2)}
          </text>
          
        </svg>
      </div>
      <div className="caption">
        The probability density function $f(t)$ represents the unconditional rate of events over time. As you move the slider for $t$, the shaded areas complement each other: $F(t)$ is the cumulative probability the event happened before $t$, and $S(t)$ is the probability of surviving past $t$.
      </div>
    </div>
  );
};

export default DensityVisualizer;
