import React from 'react';
import CoxModelInteractive from '../components/CoxModelInteractive';

export default function SectionCox() {
  return (
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
  );
}
