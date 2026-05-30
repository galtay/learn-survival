import React from 'react';
import MathSandbox from '../components/MathSandbox';
import DensityVisualizer from '../components/DensityVisualizer';

const refStyle = {marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'};
const refStyleNoTop = {textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0', marginBottom: '12px'};
const refStyleMid = {marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'};
const labelStyle = {color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'};

export default function SectionMath() {
  return (
    <section className="sec" id="math">
      <div className="head">
        <span className="id">§ 01</span>
        <h2>The continuous mathematics</h2>
      </div>

      <p>
        We begin our discussion by modeling the duration of a state or subject as a continuous, positive random variable $T &gt; 0$ (noting that discrete-time models also exist). The distribution of $T$ is fundamentally defined by its probability density function (PDF):
      </p>

      <div className="eq-row" style={{marginBottom: '2rem'}}>
        <div style={labelStyle}>Event density function</div>
        $$ f(t)\,dt \;=\; P(T \in [t, t+dt)) $$
        <div className="ref" style={refStyle}>
          The unconditional probability that the event occurs in the small interval $[t, t+dt)$. Like any valid PDF, it is non-negative ($f(t) \ge 0$) and its total area is 1 ($\int_0^\infty f(t)\,dt = 1$), meaning the event is guaranteed to happen eventually.
        </div>
      </div>

      <p>
        From this foundational density function, we can derive the other core continuous functions used in survival analysis:
      </p>

      <div className="eq-row" style={{marginBottom: '2rem'}}>
        <div style={labelStyle}>Cumulative event probability</div>
        {String.raw`$$ F(t) \;=\; \int_0^t f(u)\,du \;=\; P(T < t) $$`}
        <div className="ref" style={refStyle}>
          The probability that the event occurs strictly before time $t$. It is monotonically increasing with $F(0)=0$ and $F(\infty)=1$.
        </div>
      </div>

      <div className="eq-row">
        <div style={labelStyle}>Survival probability function</div>
        {String.raw`$$ S(t) \;=\; 1 - F(t) \;=\; \int_t^\infty f(u)\,du \;=\; P(T \ge t) $$`}
        <div className="ref" style={refStyle}>
          The probability of surviving past time $t$. It is monotonically decreasing with $S(0)=1$ and $S(\infty)=0$.
        </div>
      </div>

      <DensityVisualizer />

      <p>
        Beyond these three core functions, the <span className="em">hazard function</span> $h(t)$ provides the instantaneous event rate conditional on having survived up to time $t$. We can express this formally as the limit of the probability of an event occurring in the small interval {String.raw`$[t, t + \Delta t)$`}, given survival up to time $t$, per unit time as the interval shrinks to zero:
      </p>

      <div className="eq-row" style={{marginBottom: '2rem'}}>
        <div style={labelStyle}>Hazard Function Derivation</div>
        {String.raw`$$ h(t) \;=\; \lim_{\Delta t \to 0} \frac{1}{\Delta t} P(t \le T < t + \Delta t \mid T \ge t) $$`}
        <div className="ref" style={refStyleMid}>
          To simplify this, we first apply the general definition of conditional probability:
        </div>
        {String.raw`$$ P(A \mid B) \;=\; \frac{P(A \cap B)}{P(B)} $$`}
        <div className="ref" style={refStyleMid}>
          Here, event $A$ is {String.raw`$t \le T < t + \Delta t$`}, and event $B$ is {String.raw`$T \ge t$`}. Their intersection $A \cap B$ is simply $A$:
        </div>
        {String.raw`$$ P(t \le T < t + \Delta t \mid T \ge t) \;=\; \frac{P(t \le T < t + \Delta t)}{P(T \ge t)} $$`}
        <div className="ref" style={refStyleMid}>
          Substituting our expanded conditional probability back into the hazard limit:
        </div>
        {String.raw`$$ h(t) \;=\; \lim_{\Delta t \to 0} \frac{1}{\Delta t} \frac{P(t \le T < t + \Delta t)}{P(T \ge t)} $$`}
        <div className="ref" style={refStyleMid}>
          Because the denominator {String.raw`$P(T \ge t)$`} is the survival probability $S(t)$, and it does not depend on {String.raw`$\Delta t$`}, we can pull it out of the limit entirely:
        </div>
        {String.raw`$$ h(t) \;=\; \frac{1}{S(t)} \lim_{\Delta t \to 0} \frac{P(t \le T < t + \Delta t)}{\Delta t} $$`}
        <div className="ref" style={refStyleMid}>
          The remaining limit is the precise mathematical definition of the event density function $f(t)$. This gives us the core hazard function:
        </div>
        {String.raw`$$ h(t) \;=\; \frac{f(t)}{S(t)} $$`}
      </div>

      <p>
        We can rewrite the hazard function into a very useful logarithmic form by establishing the relationship between the event density $f(t)$ and the derivative of the survival probability $S'(t)$:
      </p>

      <div className="eq-row">
        <div style={labelStyle}>Logarithmic Relationship</div>
        <div className="ref" style={refStyleNoTop}>
          Recall that the cumulative probability $F(t)$ is the integral of the event density. By the Fundamental Theorem of Calculus, its derivative is the event density:
        </div>
        {String.raw`$$ F(t) \;=\; \int_0^t f(u)\,du \quad\implies\quad F'(t) \;=\; f(t) $$`}
        <div className="ref" style={refStyleMid}>
          Since survival probability is the complement of the cumulative probability ({String.raw`$S(t) = 1 - F(t)$`}), its derivative simply flips the sign:
        </div>
        {String.raw`$$ S'(t) \;=\; -F'(t) \;=\; -f(t) $$`}
        <div className="ref" style={refStyleMid}>
          Substituting $-S'(t)$ for $f(t)$ in our hazard function:
        </div>
        {String.raw`$$ h(t) \;=\; \frac{-S'(t)}{S(t)} \;=\; -\left( \frac{S'(t)}{S(t)} \right) $$`}
        <div className="ref" style={refStyleMid}>
          Finally, we apply the chain rule for the natural logarithm, {String.raw`$\frac{d}{dt}\log(g(t)) = \frac{g'(t)}{g(t)}$`}. Substituting $g(t) = S(t)$ yields another useful representation:
        </div>
        {String.raw`$$ h(t) \;=\; -\frac{d}{dt}\log S(t) $$`}
      </div>

      <div className="eq-row">
        <div style={labelStyle}>Cumulative Hazard</div>
        <div className="ref" style={refStyleNoTop}>
          If we take our logarithmic definition {String.raw`$h(t) = -\frac{d}{dt}\log S(t)$`} and integrate both sides from $0$ to $t$:
        </div>
        {String.raw`$$ \int_0^t h(u)\,du \;=\; -\int_0^t \frac{d}{du} \log S(u)\,du $$`}
        <div className="ref" style={refStyleMid}>
          The left side defines the cumulative hazard $H(t)$. By the Fundamental Theorem of Calculus, the right side evaluates to the difference at the boundaries:
        </div>
        {String.raw`$$ H(t) \;=\; -\Big( \log S(t) - \log S(0) \Big) $$`}
        <div className="ref" style={refStyleMid}>
          Since survival at time zero is certain ($S(0) = 1$), $\log S(0) = 0$. This simplifies to {String.raw`$H(t) = -\log S(t)$`}. Exponentiating both sides yields our second fundamental relationship:
        </div>
        {String.raw`$$ S(t) \;=\; \exp[-H(t)] $$`}
      </div>

      <p>
        This equation provides a powerful intuition. The survival probability always follows an exponential decay curve, but it is stretched or compressed according to the total accumulated hazard $H(t)$ rather than pure clock time $t$.
      </p>

      <MathSandbox />
    </section>
  );
}
