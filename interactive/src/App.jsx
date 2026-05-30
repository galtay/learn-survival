import React, { useEffect } from 'react';
import SectionMath from './sections/SectionMath';
import SectionObservables from './sections/SectionObservables';
import SectionKM from './sections/SectionKM';
import SectionCox from './sections/SectionCox';

const TOC = [
  { id: 'math',        label: 'The continuous mathematics' },
  { id: 'observables', label: 'Observables & the risk set' },
  { id: 'km',          label: 'The Kaplan–Meier estimator' },
  { id: 'cox',         label: 'The Cox proportional hazards model' },
];

function App() {
  // Render static math once after mount. KaTeX is loaded via defer scripts
  // in index.html; interactives that need to re-render do so locally.
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
  }, []);

  return (
    <div className="page">
      <div className="crumb-strip">
        <div>
          <span>learn-survival</span>
          <span className="sep">/</span>
          <span className="here">interactive</span>
        </div>
        <div>Survival Analysis · Interactive Explorable</div>
      </div>

      <aside className="toc-rail">
        <div className="eyebrow">Contents</div>
        <ol>
          {TOC.map(item => (
            <li key={item.id}>
              <a href={`#${item.id}`}>
                <span className="t">{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
        <div className="foot">
          An interactive primer<br/>
          galtay / 2026
        </div>
      </aside>

      <main className="content">
        <header className="masthead">
          <div className="meta-row">
            <span>A primer in four parts</span>
            <span>2026</span>
          </div>

          <h1 className="title">Survival Analysis</h1>

          <p className="subtitle">
            According to <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2394262/" target="_blank" rel="noreferrer">Clark et al. (2003)</a>, "Survival analysis is a collection of statistical procedures for data analysis where the outcome variable of interest is time until an event occurs." While we focus on the clinical context in this introduction, these methods are widely applicable across many fields. The defining challenge of survival data is the presence of "censored" observations, which represent a form of partial observability. In these cases, a subject's exact duration between two events is not precisely known, but is instead restricted to a certain range. In right-censoring—the most common type—we only observe a lower bound on a subject's duration. In the clinical context, this often means knowing a patient remained event-free at least up to the time of their last follow-up. This introduction bridges the continuous mathematics of survival durations to the empirical estimators designed to handle such partially observed data.
          </p>

          <div className="reference-callout">
            <h3>References & Recommended Reading</h3>
            <p>
              Much of the material and notation in this interactive explorable is derived from the following comprehensive works:
            </p>
            <ul>
              <li>
                <a href="https://arxiv.org/abs/1708.04649" target="_blank" rel="noreferrer">Machine Learning for Survival Analysis: A Survey</a> (Wang et al., 2017)
              </li>
              <li>
                <a href="https://arxiv.org/abs/2305.14961" target="_blank" rel="noreferrer">Deep Learning for Survival Analysis: A Review</a> (Wiegrebe et al., 2023)
              </li>
              <li>
                <a href="https://arxiv.org/abs/2410.01086" target="_blank" rel="noreferrer">An Introduction to Deep Survival Analysis Models for Predicting Time-to-Event Outcomes</a> (Chen, 2024)
              </li>
            </ul>
          </div>
        </header>

        <SectionMath />
        <SectionObservables />
        <SectionKM />
        <SectionCox />
      </main>
    </div>
  );
}

export default App;
