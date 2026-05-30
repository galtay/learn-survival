import React from 'react';
import CensoringVisualizer from '../components/CensoringVisualizer';
import RiskSetSweeper from '../components/RiskSetSweeper';

export default function SectionObservables() {
  return (
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
  );
}
