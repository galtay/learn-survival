import React, { useEffect } from 'react';
import SectionMath from './sections/SectionMath';
import SectionObservables from './sections/SectionObservables';
import SectionKM from './sections/SectionKM';
import SectionCox from './sections/SectionCox';

function App() {
  // Render static math once after mount. KaTeX is loaded via defer scripts
  // in index.html, so window.renderMathInElement is available by the time
  // React mounts. Interactives that need to re-render math (like the
  // CensoringVisualizer toggle text) do so locally with their own refs.
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
    <main>
      <nav className="appbar">
        <div className="crumbs">
          <span>learn-survival</span><span className="sep">/</span><span className="here">interactive</span>
        </div>
        <div className="nav">
          <a href="#math">§1 mathematics</a>
          <a href="#observables">§2 observables</a>
          <a href="#km">§3 kaplan-meier</a>
          <a href="#cox">§4 cox model</a>
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

      <SectionMath />
      <SectionObservables />
      <SectionKM />
      <SectionCox />
    </main>
  );
}

export default App;
