import React, { useEffect } from 'react';
import MathSandbox from './components/MathSandbox';
import CensoringVisualizer from './components/CensoringVisualizer';
import RiskSetSweeper from './components/RiskSetSweeper';
import KaplanMeierInteractive from './components/KaplanMeierInteractive';
import CoxModelInteractive from './components/CoxModelInteractive';

function App() {
  // Re-render math when component mounts/updates
  useEffect(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '\\[', right: '\\]', display: true},
          {left: '$', right: '$', display: false},
          {left: '\\(', right: '\\)', display: false}
        ],
        throwOnError: false
      });
    }
  });

  return (
    <main>
      <nav className="appbar">
        <div className="crumbs">
          <span>learn-survival</span><span className="sep">/</span><span className="here">interactive</span>
        </div>
        <div className="nav" style={{display: 'flex', gap: '1rem'}}>
          <a href="#math" style={{color: 'var(--fg-2)', textDecoration: 'none'}}>§1 mathematics</a>
          <a href="#censoring" style={{color: 'var(--fg-2)', textDecoration: 'none'}}>§2 censoring</a>
          <a href="#risk" style={{color: 'var(--fg-2)', textDecoration: 'none'}}>§3 risk set</a>
          <a href="#km" style={{color: 'var(--fg-2)', textDecoration: 'none'}}>§4 kaplan-meier</a>
          <a href="#cox" style={{color: 'var(--fg-2)', textDecoration: 'none'}}>§5 cox model</a>
        </div>
      </nav>

      <header className="masthead">
        <div className="meta-row">
          <span>Survival Analysis · Interactive Explorable</span>
          <span>page 01 / —</span>
        </div>

        <h1 className="title">Survival<span className="accent"> /</span> Analysis</h1>

        <p className="subtitle">
          Survival analysis models the time until an event of interest occurs. The field gets its name from its origins in medical research—studying how long patients survive—but its methods are widely applied across many domains, such as mechanical failure in engineering or particle decay in physics. Across all these domains, analysts must frequently address incomplete observations: the reality that subjects are often "censored" before the event of interest can be observed. This introduction bridges the continuous mathematics of survival times to the empirical estimation of survival in the presence of censored data.
        </p>
      </header>

      {/* SECTION 1: MATH */}
      <section className="sec" id="math">
        <div className="head">
          <span className="id">§ 01</span>
          <h2>The continuous mathematics</h2>
        </div>

        <p>
          We begin our discussion by modeling the duration of a state or subject as a continuous, positive random variable $T &gt; 0$ (noting that discrete-time models also exist). The distribution of $T$ can be fully specified by any of these related functions:
        </p>

        <div className="eq-row" style={{marginBottom: '2rem'}}>
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Event density function</div>
          $$ f(t)\,dt \;=\; P(T \in [t, t+dt)) $$
          <div className="ref" style={{marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The unconditional probability that the event occurs in $[t, t+dt)$.
          </div>
        </div>

        <div className="eq-row" style={{marginBottom: '2rem'}}>
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Cumulative event probability</div>
          $$ F(t) \;=\; \int_0^t f(u)\,du \;=\; P(T \le t) $$
          <div className="ref" style={{marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The probability that the event has occurred by time $t$. It is monotonically increasing with $F(0)=0$ and $F(\infty)=1$.
          </div>
        </div>

        <div className="eq-row">
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Survival probability function</div>
          $$ S(t) \;=\; 1 - F(t) \;=\; P(T &gt; t) $$
          <div className="ref" style={{marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The probability of surviving past time $t$. It is monotonically decreasing with $S(0)=1$ and $S(\infty)=0$.
          </div>
        </div>

        <p>
          Beyond these three core functions, the <span className="em">hazard function</span> $h(t)$ provides the instantaneous event rate conditional on having survived to time $t$. It is formally defined as a limit of a conditional probability, which simplifies to the ratio of the event density to the survival probability:
        </p>

        <div className="eq-row">
          $$ h(t) \;=\; \frac&#123;f(t)&#125;&#123;S(t)&#125; \;=\; -\frac&#123;d&#125;&#123;dt&#125;\log S(t) $$
          <span className="ref">Eq. 1 — the hazard function definition.</span>
        </div>

        <p>
          Integrating both sides of this equation yields the cumulative hazard function $H(t)$, which rearranges to a familiar exponential relationship:
        </p>

        <div className="eq-row">
          $$ S(t) \;=\; \exp\!\big(-H(t)\big) $$
          <span className="ref">Eq. 2 — survival and cumulative hazard.</span>
        </div>

        <p>
          This equation provides a powerful intuition. The survival probability always follows an exponential decay curve, but it is stretched or compressed according to the total accumulated hazard $H(t)$ rather than pure clock time $t$.
        </p>

        <MathSandbox />
        
      </section>

      {/* SECTION 2: CENSORING */}
      <section className="sec" id="censoring">
        <div className="head">
          <span className="id">§ 02</span>
          <h2>Observables and censoring</h2>
        </div>

        <p>
          In an ideal scenario, we can measure $T$ directly for every subject. In clinical studies, however, our observation window is finite, and subjects may drop out or withdraw. To account for this, we introduce the <span className="em">censoring time</span> $C$, a second random variable which is typically assumed to be independent of $T$ (known as non-informative censoring). 
        </p>

        <p>
          For any given subject $i$, we cannot observe $T_i$ and $C_i$ simultaneously. We only observe the time at which the <span className="em">first</span> of these two events occurs. We therefore define a lossy observation map consisting of two new variables:
        </p>

        <table className="dat fit">
          <tbody>
            <tr>
              <td className="s">$Y_i$</td>
              <td>$= \min(T_i, C_i)$</td>
              <td>the observed duration</td>
            </tr>
            <tr>
              <td className="s">$\Delta_i$</td>
              <td>$= I(T_i \le C_i)$</td>
              <td>the event indicator ($1$ if the event was observed, $0$ if censored)</td>
            </tr>
          </tbody>
        </table>

        <CensoringVisualizer />

        <p>
          In our visualizations, we use a solid glowing dot to represent a true event ($\Delta_i = 1$) and an open blue vertical hash mark to represent a censoring event ($\Delta_i = 0$).
        </p>
      </section>

      {/* SECTION 3: RISK SET */}
      <section className="sec" id="risk">
        <div className="head">
          <span className="id">§ 03</span>
          <h2>The risk set</h2>
        </div>

        <p>
          How do we estimate the survival function $S(t)$ when our data is censored? We cannot simply calculate the fraction of subjects who have survived past time $t$, because we do not know the fate of the censored subjects. 
        </p>

        <p>
          Instead, we calculate survival <span className="em">conditionally</span>. The fundamental concept required for this is the <span className="em">risk set</span>, denoted $R(t)$. The risk set is the collection of all subjects who are still under observation and have not yet experienced the event just prior to time $t$. We define two counts for any time $t$:
        </p>

        <table className="dat fit">
          <tbody>
            <tr>
              <td className="s">$n(t)$</td>
              <td>$= |R(t)|$</td>
              <td>the number of subjects at risk just before time $t$</td>
            </tr>
            <tr>
              <td className="s">$d(t)$</td>
              <td></td>
              <td>the number of events occurring exactly at time $t$</td>
            </tr>
          </tbody>
        </table>

        <RiskSetSweeper />
      </section>

      {/* SECTION 4: KAPLAN-MEIER */}
      <section className="sec" id="km">
        <div className="head">
          <span className="id">§ 04</span>
          <h2>The Kaplan–Meier estimator</h2>
        </div>

        <p>
          We can estimate the continuous survival function $S(t)$ non-parametrically using the product limit estimator derived by Kaplan and Meier in 1958.
        </p>

        <p>
          Let $t_1 &lt; t_2 &lt; \dots &lt; t_k$ be the distinct times at which at least one event occurs. For a given event time $t_j$, the probability of surviving past $t_j$, given that the subject survived up to $t_j$, is estimated by $(n(t_j) - d(t_j)) / n(t_j)$, which simplifies to $1 - d(t_j)/n(t_j)$. 
        </p>

        <p>
          Because surviving past time $t$ requires surviving past all preceding event times, we multiply these conditional probabilities together:
        </p>

        <div className="eq-row">
          $$ \hat&#123;S&#125;(t) \;=\; \prod_&#123;j:\, t_j \le t&#125; \left( 1 - \frac&#123;d(t_j)&#125;&#123;n(t_j)&#125; \right) $$
          <span className="ref">Eq. 4 — The Kaplan–Meier estimator.</span>
        </div>

        <KaplanMeierInteractive />
        
        <p>
          Note that censoring events do not contribute directly to the product (they are not $t_j$ times), but they do drop the denominator $n(t)$ for all subsequent event times. This means that a subsequent event will cause a larger proportional drop in the survival curve than it would have if the censoring had not occurred. This is visually evident in the interactives above when you toggle a point from an event to being censored!
        </p>
      </section>

      {/* SECTION 5: COX MODEL */}
      <section className="sec" id="cox">
        <div className="head">
          <span className="id">§ 05</span>
          <h2>The Cox Proportional Hazards model</h2>
        </div>

        <p>
          While the Kaplan–Meier estimator is excellent for estimating survival for a single group, we often want to understand how different variables (covariates) influence survival time. The most common approach is the Cox Proportional Hazards model, introduced by Sir David Cox in 1972.
        </p>

        <p>
          Instead of modeling the survival time directly, the Cox model focuses on the hazard function. It splits the hazard into two parts: a <span className="em">baseline hazard</span> $h_0(t)$ that depends only on time, and an exponential multiplier that depends only on the covariates $X$:
        </p>

        <div className="eq-row">
          $$ h(t|X) \;=\; h_0(t) \exp\left(\sum_&#123;i=1&#125;^p \beta_i X_i\right) $$
          <span className="ref">Eq. 5 — The Cox Proportional Hazards model.</span>
        </div>

        <p>
          A key feature of this model is the <span className="em">proportional hazards assumption</span>. Notice that if we take the ratio of hazards for two individuals with different covariate values, say $X$ and $X'$, the baseline hazard $h_0(t)$ cancels out completely:
        </p>

        <div className="eq-row">
          $$ \frac&#123;h(t|X)&#125;&#123;h(t|X')&#125; \;=\; \frac&#123;h_0(t) \exp(\beta X)&#125;&#123;h_0(t) \exp(\beta X')&#125; \;=\; \exp\big(\beta (X - X')\big) $$
        </div>

        <p>
          This hazard ratio is a constant over time! If treatment reduces the hazard by half relative to control at day 10, it also reduces it by half at day 100.
        </p>

        <p>
          We can trace this back to the survival function $S(t) = \exp(-H(t))$. Because the hazard is multiplied by a constant $e^&#123;\beta X&#125;$, the cumulative hazard is also multiplied by that constant. This means the survival function for a given covariate profile is simply the baseline survival function raised to a power:
        </p>

        <div className="eq-row">
          $$ S(t|X) \;=\; S_0(t)^&#123;\exp(\beta X)&#125; $$
        </div>

        <CoxModelInteractive />

      </section>

    </main>
  );
}

export default App;
