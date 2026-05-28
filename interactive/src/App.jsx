import React, { useEffect } from 'react';
import MathSandbox from './components/MathSandbox';
import DensityVisualizer from './components/DensityVisualizer';
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
          According to <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2394262/" target="_blank" rel="noreferrer" style={{color: 'var(--accent)', textDecoration: 'none'}}>Clark et al. (2003)</a>, "Survival analysis is a collection of statistical procedures for data analysis where the outcome variable of interest is time until an event occurs." While we focus on the clinical context in this introduction, these methods are widely applicable across many fields. The defining challenge of survival data is the presence of "censored" observations, which represent a form of partial observability. In these cases, a subject's exact duration between two events is not precisely known, but is instead restricted to a certain range. In right-censoring—the most common type—we only observe a lower bound on a subject's duration. In the clinical context, this often means knowing a patient remained event-free at least up to the time of their last follow-up (such as when they drop out of a study, or when the study ends). This introduction bridges the continuous mathematics of survival durations to the empirical estimators designed to handle such partially observed data.
        </p>

        <div className="reference-callout" style={{marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-2)', borderLeft: '3px solid var(--accent)', borderRadius: '4px'}}>
          <h3 style={{margin: '0 0 1rem 0', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--fg-2)'}}>References & Recommended Reading</h3>
          <p style={{margin: '0 0 1rem 0', fontSize: '15px'}}>
            Much of the material and notation in this interactive explorable is derived from the following comprehensive works:
          </p>
          <ul style={{margin: 0, paddingLeft: '1.5rem', fontSize: '15px', color: 'var(--fg-1)', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <li>
              <a href="https://arxiv.org/abs/1708.04649" target="_blank" rel="noreferrer" style={{color: 'var(--accent)', textDecoration: 'none'}}>Machine Learning for Survival Analysis: A Survey</a> (Wang et al., 2017)
            </li>
            <li>
              <a href="https://arxiv.org/abs/2305.14961" target="_blank" rel="noreferrer" style={{color: 'var(--accent)', textDecoration: 'none'}}>Deep Learning for Survival Analysis: A Review</a> (Wiegrebe et al., 2023)
            </li>
            <li>
              <a href="https://arxiv.org/abs/2410.01086" target="_blank" rel="noreferrer" style={{color: 'var(--accent)', textDecoration: 'none'}}>An Introduction to Deep Survival Analysis Models for Predicting Time-to-Event Outcomes</a> (Chen, 2024)
            </li>
          </ul>
        </div>
      </header>

      {/* SECTION 1: MATH */}
      <section className="sec" id="math">
        <div className="head">
          <span className="id">§ 01</span>
          <h2>The continuous mathematics</h2>
        </div>

        <p>
          We begin our discussion by modeling the duration of a state or subject as a continuous, positive random variable $T &gt; 0$ (noting that discrete-time models also exist). The distribution of $T$ is fundamentally defined by its probability density function (PDF):
        </p>

        <div className="eq-row" style={{marginBottom: '2rem'}}>
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Event density function</div>
          $$ f(t)\,dt \;=\; P(T \in [t, t+dt)) $$
          <div className="ref" style={{marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The unconditional probability that the event occurs in the small interval $[t, t+dt)$. Like any valid PDF, it is non-negative ($f(t) \ge 0$) and its total area is 1 ($\int_0^\infty f(t)\,dt = 1$), meaning the event is guaranteed to happen eventually.
          </div>
        </div>

        <p>
          From this foundational density function, we can derive the other core continuous functions used in survival analysis:
        </p>

        <div className="eq-row" style={{marginBottom: '2rem'}}>
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Cumulative event probability</div>
          {String.raw`$$ F(t) \;=\; \int_0^t f(u)\,du \;=\; P(T < t) $$`}
          <div className="ref" style={{marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The probability that the event occurs strictly before time $t$. It is monotonically increasing with $F(0)=0$ and $F(\infty)=1$.
          </div>
        </div>

        <div className="eq-row">
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Survival probability function</div>
          {String.raw`$$ S(t) \;=\; 1 - F(t) \;=\; \int_t^\infty f(u)\,du \;=\; P(T \ge t) $$`}
          <div className="ref" style={{marginTop: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The probability of surviving past time $t$. It is monotonically decreasing with $S(0)=1$ and $S(\infty)=0$.
          </div>
        </div>

        <DensityVisualizer />

        <p>
          Beyond these three core functions, the <span className="em">hazard function</span> $h(t)$ provides the instantaneous event rate conditional on having survived up to time $t$. We can express this formally as the limit of the probability of an event occurring in the small interval {String.raw`$[t, t + \Delta t)$`}, given survival up to time $t$, per unit time as the interval shrinks to zero:
        </p>

        <div className="eq-row" style={{marginBottom: '2rem'}}>
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Hazard Function Derivation</div>
          {String.raw`$$ h(t) \;=\; \lim_{\Delta t \to 0} \frac{1}{\Delta t} P(t \le T < t + \Delta t \mid T \ge t) $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            To simplify this, we first apply the general definition of conditional probability:
          </div>
          {String.raw`$$ P(A \mid B) \;=\; \frac{P(A \cap B)}{P(B)} $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Here, event $A$ is {String.raw`$t \le T < t + \Delta t$`}, and event $B$ is {String.raw`$T \ge t$`}. Their intersection $A \cap B$ is simply $A$:
          </div>
          {String.raw`$$ P(t \le T < t + \Delta t \mid T \ge t) \;=\; \frac{P(t \le T < t + \Delta t)}{P(T \ge t)} $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Substituting our expanded conditional probability back into the hazard limit:
          </div>
          {String.raw`$$ h(t) \;=\; \lim_{\Delta t \to 0} \frac{1}{\Delta t} \frac{P(t \le T < t + \Delta t)}{P(T \ge t)} $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Because the denominator {String.raw`$P(T \ge t)$`} is the survival probability $S(t)$, and it does not depend on {String.raw`$\Delta t$`}, we can pull it out of the limit entirely:
          </div>
          {String.raw`$$ h(t) \;=\; \frac{1}{S(t)} \lim_{\Delta t \to 0} \frac{P(t \le T < t + \Delta t)}{\Delta t} $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The remaining limit is the precise mathematical definition of the event density function $f(t)$. This gives us the core hazard function:
          </div>
          {String.raw`$$ h(t) \;=\; \frac{f(t)}{S(t)} $$`}
        </div>

        <p>
          We can rewrite the hazard function into a very useful logarithmic form by establishing the relationship between the event density $f(t)$ and the derivative of the survival probability $S'(t)$:
        </p>

        <div className="eq-row">
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Logarithmic Relationship</div>
          <div className="ref" style={{marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Recall that the cumulative probability $F(t)$ is the integral of the event density. By the Fundamental Theorem of Calculus, its derivative is the event density:
          </div>
          {String.raw`$$ F(t) \;=\; \int_0^t f(u)\,du \quad\implies\quad F'(t) \;=\; f(t) $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Since survival probability is the complement of the cumulative probability ({String.raw`$S(t) = 1 - F(t)$`}), its derivative simply flips the sign:
          </div>
          {String.raw`$$ S'(t) \;=\; -F'(t) \;=\; -f(t) $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Substituting $-S'(t)$ for $f(t)$ in our hazard function:
          </div>
          {String.raw`$$ h(t) \;=\; \frac{-S'(t)}{S(t)} \;=\; -\left( \frac{S'(t)}{S(t)} \right) $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Finally, we apply the chain rule for the natural logarithm, {String.raw`$\frac{d}{dt}\log(g(t)) = \frac{g'(t)}{g(t)}$`}. Substituting $g(t) = S(t)$ yields another useful representation:
          </div>
          {String.raw`$$ h(t) \;=\; -\frac{d}{dt}\log S(t) $$`}
          <span className="ref" style={{marginTop: '12px', display: 'block'}}>Eq. 1 — the hazard function definition.</span>
        </div>

        <div className="eq-row">
          <div style={{color: 'var(--fg-2)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px'}}>Cumulative Hazard</div>
          <div className="ref" style={{marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            If we take our logarithmic definition {String.raw`$h(t) = -\frac{d}{dt}\log S(t)$`} and integrate both sides from $0$ to $t$:
          </div>
          {String.raw`$$ \int_0^t h(u)\,du \;=\; -\int_0^t \frac{d}{du} \log S(u)\,du $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            The left side defines the cumulative hazard $H(t)$. By the Fundamental Theorem of Calculus, the right side evaluates to the difference at the boundaries:
          </div>
          {String.raw`$$ H(t) \;=\; -\Big( \log S(t) - \log S(0) \Big) $$`}
          <div className="ref" style={{marginTop: '12px', marginBottom: '12px', textTransform: 'none', color: 'var(--fg-1)', fontSize: '14px', letterSpacing: '0'}}>
            Since survival at time zero is certain ($S(0) = 1$), $\log S(0) = 0$. This simplifies to {String.raw`$H(t) = -\log S(t)$`}. Exponentiating both sides yields our second fundamental relationship:
          </div>
          {String.raw`$$ S(t) \;=\; \exp[-H(t)] $$`}
          <span className="ref" style={{marginTop: '12px', display: 'block'}}>Eq. 2 — survival and cumulative hazard.</span>
        </div>

        <p>
          This equation provides a powerful intuition. The survival probability always follows an exponential decay curve, but it is stretched or compressed according to the total accumulated hazard $H(t)$ rather than pure clock time $t$.
        </p>

        <MathSandbox />
        
      </section>

      {/* SECTION 2: OBSERVABLES AND RISK SET */}
      <section className="sec" id="observables">
        <div className="head">
          <span className="id">§ 02</span>
          <h2>Observables and the risk set</h2>
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
          In our visualizations, we use a solid amber dot to represent a true event ($\Delta_i = 1$) and an open blue vertical hash mark to represent a censoring event ($\Delta_i = 0$).
        </p>

        <p>
          How do we estimate the survival function $S(t)$ when our data is censored like this? We cannot simply calculate the fraction of subjects who have survived past time $t$, because we do not know the fate of the censored subjects. 
        </p>

        <p>
          Instead, we calculate survival <span className="em">conditionally</span>. The fundamental concept required for this is the <span className="em">risk set</span>, denoted $R(t)$. Subjects are considered to be "at risk" at time $t$ if their observed duration $Y_i$ is greater than or equal to $t$. This means they have neither experienced the event nor been censored strictly prior to $t$. Using our observable variables $Y_i$ and $\Delta_i$ for a population of size $N$, we define two counts for any time $t$:
        </p>

        <table className="dat fit">
          <tbody>
            <tr>
              <td className="s">$r(t)$</td>
              <td>{String.raw`$= \sum_{i=1}^N I(Y_i \ge t)$`}</td>
              <td>the number of subjects at risk at time $t$</td>
            </tr>
            <tr>
              <td className="s">$d(t)$</td>
              <td>{String.raw`$= \sum_{i=1}^N I(Y_i = t, \Delta_i = 1)$`}</td>
              <td>the number of events occurring at time $t$</td>
            </tr>
          </tbody>
        </table>

        <RiskSetSweeper />
      </section>

      {/* SECTION 3: KAPLAN-MEIER */}
      <section className="sec" id="km">
        <div className="head">
          <span className="id">§ 03</span>
          <h2>The Kaplan–Meier estimator</h2>
        </div>

        <p>
          We estimate the continuous survival function $S(t)$ non-parametrically using the product limit estimator derived by <a href="https://doi.org/10.1080/01621459.1958.10501452" target="_blank" rel="noreferrer" style={{color: 'var(--accent)', textDecoration: 'none'}}>Kaplan and Meier (1958)</a>.
        </p>

        <p>
          Let $t_1 &lt; t_2 &lt; \dots &lt; t_k$ be the distinct times at which at least one event occurs. At any specific event time $t_j$, there are $r(t_j)$ subjects at risk, and $d(t_j)$ events are observed. The fraction of subjects who successfully survive this specific moment is therefore $(r(t_j) - d(t_j)) / r(t_j)$, which simplifies to $1 - d(t_j)/r(t_j)$. 
        </p>

        <p>
          To survive past some later time $t$, a subject must successfully survive the first event time $t_1$, <span className="em">and</span> the second event time $t_2$, and so on, up to $t$. Because these conditional survival probabilities represent sequential steps, we multiply them together to find the overall probability of surviving past time $t$:
        </p>

        <div className="eq-row">
          {String.raw`$$ \hat{S}(t) \;=\; \prod_{j:\, t_j \le t} \left( 1 - \frac{d(t_j)}{r(t_j)} \right) $$`}
          <span className="ref">Eq. 3 — The Kaplan–Meier estimator.</span>
        </div>

        <KaplanMeierInteractive />
        
        <p>
          Censoring events drop the denominator $r(t)$, causing larger proportional drops in {String.raw`$\hat{S}(t)$`} for subsequent events.
        </p>
      </section>

      {/* SECTION 4: COX MODEL */}
      <section className="sec" id="cox">
        <div className="head">
          <span className="id">§ 04</span>
          <h2>The Cox Proportional Hazards model</h2>
        </div>

        <p>
          While the Kaplan–Meier estimator is excellent for estimating survival for a single group, we often want to understand how different variables (covariates) influence survival time. The most common approach is the Cox Proportional Hazards model, introduced by Sir David Cox in 1972.
        </p>

        <p>
          Instead of modeling the survival time directly, the Cox model focuses on the hazard function. It splits the hazard into two parts: a <span className="em">baseline hazard</span> $h_0(t)$ that depends only on time, and an exponential multiplier that depends only on the covariates $X$:
        </p>

        <div className="eq-row">
          {String.raw`$$ h(t|X) \;=\; h_0(t) \exp\left(\sum_{i=1}^p \beta_i X_i\right) $$`}
          <span className="ref">Eq. 5 — The Cox Proportional Hazards model.</span>
        </div>

        <p>
          A key feature of this model is the <span className="em">proportional hazards assumption</span>. Notice that if we take the ratio of hazards for two individuals with different covariate values, say $X$ and $X'$, the baseline hazard $h_0(t)$ cancels out completely:
        </p>

        <div className="eq-row">
          {String.raw`$$ \frac{h(t|X)}{h(t|X')} \;=\; \frac{h_0(t) \exp(\beta X)}{h_0(t) \exp(\beta X')} \;=\; \exp[\beta (X - X')] $$`}
        </div>

        <p>
          This hazard ratio is a constant over time! If treatment reduces the hazard by half relative to control at day 10, it also reduces it by half at day 100.
        </p>

        <p>
          We can trace this back to the survival function {String.raw`$S(t) = \exp[-H(t)]$`}. Because the hazard is multiplied by a constant {String.raw`$e^{\beta X}$`}, the cumulative hazard is also multiplied by that constant. This means the survival function for a given covariate profile is simply the baseline survival function raised to a power:
        </p>

        <div className="eq-row">
          {String.raw`$$ S(t|X) \;=\; S_0(t)^{\exp(\beta X)} $$`}
        </div>

        <CoxModelInteractive />

      </section>

    </main>
  );
}

export default App;
