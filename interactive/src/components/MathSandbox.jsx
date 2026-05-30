import React, { useState, useMemo } from 'react';

const MathSandbox = () => {
  const [k, setK] = useState(1.5);
  const [lambda, setLambda] = useState(20);

  const points = 80;
  const tMax = 60;

  // Generate data points
  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= points; i++) {
      const t = (i / points) * tMax;
      
      // Avoid 0^negative for k < 1
      const safeT = t === 0 ? 0.0001 : t;
      
      const s = Math.exp(-Math.pow(safeT / lambda, k));
      const h = (k / lambda) * Math.pow(safeT / lambda, k - 1);
      const f = h * s;
      const F = 1 - s;
      const H = Math.pow(safeT / lambda, k);
      const logS = -H;
      
      pts.push({ t, f, F, s, h, H, logS });
    }
    return pts;
  }, [k, lambda]);

  // SVG dimensions for one panel
  const w = 302;
  const h = 182;
  const mx = 68, my = 52, yMax = 234, xMax = 370;
  
  // Scales
  const scaleX = (t) => mx + (t / tMax) * (xMax - mx);
  
  // Path generators
  const makePath = (data, yFn, yPeak) => {
    return data.map((d, i) => {
      const x = scaleX(d.t);
      const y = yMax - (yFn(d) / yPeak) * (yMax - my);
      // clamp y to prevent weird artifacts if it shoots up
      const clampedY = Math.max(0, Math.min(y, yMax));
      return `${i === 0 ? 'M' : 'L'} ${x} ${clampedY}`;
    }).join(' ');
  };

  const fPath = makePath(data, d => d.f, 0.06);
  const FPath = makePath(data, d => d.F, 1.0);
  const SPath = makePath(data, d => d.s, 1.0);
  const hPath = makePath(data, d => d.h, 0.4);
  const HPath = makePath(data, d => d.H, 12.0);

  // Custom path for log S(t) to map 0 to top, -12 to bottom
  const logSPath = data.map((d, i) => {
    const x = scaleX(d.t);
    const y = yMax - ((d.logS + 12) / 12.0) * (yMax - my);
    const clampedY = Math.max(0, Math.min(y, yMax));
    return `${i === 0 ? 'M' : 'L'} ${x} ${clampedY}`;
  }).join(' ');

  return (
    <div className="interactive-widget">
      <div className="controls">
        <div className="control-group">
          <label>Shape ($k$):</label>
          <input
            type="range"
            min="1" max="2" step="0.1"
            value={k}
            onChange={e => setK(parseFloat(e.target.value))}
            style={{ width: '120px' }}
          />
          <span style={{ width: '30px', textAlign: 'right' }}>{k.toFixed(1)}</span>
        </div>
        <div className="control-group">
          <label>Scale ($\lambda$):</label>
          <input
            type="range"
            min="18" max="30" step="0.5"
            value={lambda}
            onChange={e => setLambda(parseFloat(e.target.value))}
            style={{ width: '120px' }}
          />
          <span style={{ width: '40px', textAlign: 'right' }}>{lambda.toFixed(1)}</span>
        </div>
        <div className="dim" style={{ fontSize: '12.5px', marginLeft: 'auto' }}>
          Weibull Distribution
        </div>
      </div>
      
      <div className="canvas">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 792 872" className="fourfns-svg diagram-svg" role="img" aria-label="Six functions sandbox">
          
          {/* Panel f(t) */}
          <g>
            <text x="68" y="42" className="panel-title">f(t)</text>
            <text x="370" y="42" className="panel-expr" textAnchor="end">density of T</text>
            <path d="M 68 52 L 68 234 L 370 234" className="axis"/>
            <line x1="68" y1="234" x2="370" y2="234" className="grid"/>
            <text x="62" y="237.5" className="tick-label" textAnchor="end">0.00</text>
            <line x1="68" y1="143" x2="370" y2="143" className="grid"/>
            <text x="62" y="146.5" className="tick-label" textAnchor="end">0.03</text>
            <line x1="68" y1="52" x2="370" y2="52" className="grid"/>
            <text x="62" y="55.5" className="tick-label" textAnchor="end">0.06</text>
            
            <text x="68" y="250" className="tick-label" textAnchor="middle">0</text>
            <text x="168.667" y="250" className="tick-label" textAnchor="middle">20</text>
            <text x="269.333" y="250" className="tick-label" textAnchor="middle">40</text>
            <text x="370" y="250" className="tick-label" textAnchor="middle">60</text>
            <text x="219" y="260" className="axis-title" textAnchor="middle">t (duration)</text>
            
            <path d={fPath} className="curve"/>
          </g>

          {/* Panel F(t) */}
          <g transform="translate(384, 0)">
            <text x="68" y="42" className="panel-title">F(t)</text>
            <text x="370" y="42" className="panel-expr" textAnchor="end">P(T &lt; t)</text>
            <path d="M 68 52 L 68 234 L 370 234" className="axis"/>
            <line x1="68" y1="234" x2="370" y2="234" className="grid"/>
            <text x="62" y="237.5" className="tick-label" textAnchor="end">0.00</text>
            <line x1="68" y1="143" x2="370" y2="143" className="grid"/>
            <text x="62" y="146.5" className="tick-label" textAnchor="end">0.50</text>
            <line x1="68" y1="52" x2="370" y2="52" className="grid"/>
            <text x="62" y="55.5" className="tick-label" textAnchor="end">1.00</text>
            
            <text x="68" y="250" className="tick-label" textAnchor="middle">0</text>
            <text x="168.667" y="250" className="tick-label" textAnchor="middle">20</text>
            <text x="269.333" y="250" className="tick-label" textAnchor="middle">40</text>
            <text x="370" y="250" className="tick-label" textAnchor="middle">60</text>
            <text x="219" y="260" className="axis-title" textAnchor="middle">t (duration)</text>
            
            <path d={FPath} className="curve"/>
          </g>

          {/* Panel S(t) */}
          <g transform="translate(0, 264)">
            <text x="68" y="42" className="panel-title">S(t)</text>
            <text x="370" y="42" className="panel-expr" textAnchor="end">P(T &ge; t) = 1 − F(t)</text>
            <path d="M 68 52 L 68 234 L 370 234" className="axis"/>
            <line x1="68" y1="234" x2="370" y2="234" className="grid"/>
            <text x="62" y="237.5" className="tick-label" textAnchor="end">0.00</text>
            <line x1="68" y1="143" x2="370" y2="143" className="grid"/>
            <text x="62" y="146.5" className="tick-label" textAnchor="end">0.50</text>
            <line x1="68" y1="52" x2="370" y2="52" className="grid"/>
            <text x="62" y="55.5" className="tick-label" textAnchor="end">1.00</text>
            
            <text x="68" y="250" className="tick-label" textAnchor="middle">0</text>
            <text x="168.667" y="250" className="tick-label" textAnchor="middle">20</text>
            <text x="269.333" y="250" className="tick-label" textAnchor="middle">40</text>
            <text x="370" y="250" className="tick-label" textAnchor="middle">60</text>
            <text x="219" y="260" className="axis-title" textAnchor="middle">t (duration)</text>
            
            <path d={SPath} className="curve"/>
          </g>

          {/* Panel h(t) */}
          <g transform="translate(384, 264)">
            <text x="68" y="42" className="panel-title">h(t)</text>
            <text x="370" y="42" className="panel-expr" textAnchor="end">f(t) / S(t)</text>
            <path d="M 68 52 L 68 234 L 370 234" className="axis"/>
            <line x1="68" y1="234" x2="370" y2="234" className="grid"/>
            <text x="62" y="237.5" className="tick-label" textAnchor="end">0.0</text>
            <line x1="68" y1="143" x2="370" y2="143" className="grid"/>
            <text x="62" y="146.5" className="tick-label" textAnchor="end">0.2</text>
            <line x1="68" y1="52" x2="370" y2="52" className="grid"/>
            <text x="62" y="55.5" className="tick-label" textAnchor="end">0.4</text>
            
            <text x="68" y="250" className="tick-label" textAnchor="middle">0</text>
            <text x="168.667" y="250" className="tick-label" textAnchor="middle">20</text>
            <text x="269.333" y="250" className="tick-label" textAnchor="middle">40</text>
            <text x="370" y="250" className="tick-label" textAnchor="middle">60</text>
            <text x="219" y="260" className="axis-title" textAnchor="middle">t (duration)</text>
            
            <path d={hPath} className="curve"/>
          </g>
          
          {/* Panel H(t) */}
          <g transform="translate(0, 528)">
            <text x="68" y="42" className="panel-title">H(t)</text>
            <text x="370" y="42" className="panel-expr" textAnchor="end">cumulative hazard</text>
            <path d="M 68 52 L 68 234 L 370 234" className="axis"/>
            <line x1="68" y1="234" x2="370" y2="234" className="grid"/>
            <text x="62" y="237.5" className="tick-label" textAnchor="end">0</text>
            <line x1="68" y1="143" x2="370" y2="143" className="grid"/>
            <text x="62" y="146.5" className="tick-label" textAnchor="end">6</text>
            <line x1="68" y1="52" x2="370" y2="52" className="grid"/>
            <text x="62" y="55.5" className="tick-label" textAnchor="end">12</text>
            
            <text x="68" y="250" className="tick-label" textAnchor="middle">0</text>
            <text x="168.667" y="250" className="tick-label" textAnchor="middle">20</text>
            <text x="269.333" y="250" className="tick-label" textAnchor="middle">40</text>
            <text x="370" y="250" className="tick-label" textAnchor="middle">60</text>
            <text x="219" y="260" className="axis-title" textAnchor="middle">t (duration)</text>
            
            <path d={HPath} className="curve"/>
          </g>

          {/* Panel log S(t) */}
          <g transform="translate(384, 528)">
            <text x="68" y="42" className="panel-title">log S(t)</text>
            <text x="370" y="42" className="panel-expr" textAnchor="end">−H(t)</text>
            <path d="M 68 52 L 68 234 L 370 234" className="axis"/>
            <line x1="68" y1="234" x2="370" y2="234" className="grid"/>
            <text x="62" y="237.5" className="tick-label" textAnchor="end">−12</text>
            <line x1="68" y1="143" x2="370" y2="143" className="grid"/>
            <text x="62" y="146.5" className="tick-label" textAnchor="end">−6</text>
            <line x1="68" y1="52" x2="370" y2="52" className="grid"/>
            <text x="62" y="55.5" className="tick-label" textAnchor="end">0</text>
            
            <text x="68" y="250" className="tick-label" textAnchor="middle">0</text>
            <text x="168.667" y="250" className="tick-label" textAnchor="middle">20</text>
            <text x="269.333" y="250" className="tick-label" textAnchor="middle">40</text>
            <text x="370" y="250" className="tick-label" textAnchor="middle">60</text>
            <text x="219" y="260" className="axis-title" textAnchor="middle">t (duration)</text>
            
            <path d={logSPath} className="curve"/>
          </g>
          
          <text x="396" y="820" className="caption2" style={{fill: 'var(--fg-2)', fontSize: '11.5px', fontFamily: 'var(--sans)'}} textAnchor="middle">
            Interactive: Drag the sliders to see how shape $k$ and scale $\lambda$ alter the continuous functions.
          </text>
        </svg>
      </div>
      <div className="caption">
        The functions $f$, $F$, $S$, $h$, $H$, and $\log S$ linked dynamically. At $k = 1$ the hazard is constant (exponential); for $k &gt; 1$ it accelerates with time.
      </div>
    </div>
  );
};

export default MathSandbox;
