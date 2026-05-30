import React from 'react';
import KaplanMeierInteractive from '../components/KaplanMeierInteractive';

export default function SectionKM() {
  return (
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
      </div>

      <KaplanMeierInteractive />

      <p>
        Censoring events drop the denominator $r(t)$, causing larger proportional drops in {String.raw`$\hat{S}(t)$`} for subsequent events.
      </p>
    </section>
  );
}
