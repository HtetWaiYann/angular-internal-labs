import { Component } from '@angular/core';

@Component({
  selector: 'app-rxjs-lab-placeholder',
  template: `
    <div class="coming-soon">
      <span class="cs-icon">〰</span>
      <h2 class="cs-title">RxJS Execution Lab</h2>
      <p class="cs-desc">
        Stream builder UI · operator chain visualization · emission timeline ·
        subscription lifecycle graph · cold vs hot comparison
      </p>
      <span class="cs-badge">Coming Soon</span>
    </div>
  `,
  styles: [
    `
      .coming-soon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: 4rem 2rem;
        text-align: center;
      }
      .cs-icon { font-size: 4rem; margin-bottom: 1.25rem; opacity: 0.6; }
      .cs-title { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
      .cs-desc { font-size: 0.875rem; color: var(--text-secondary); max-width: 420px; line-height: 1.7; margin-bottom: 1.5rem; }
      .cs-badge { font-size: 0.7rem; padding: 0.25rem 0.75rem; border-radius: 999px; border: 1px solid var(--border); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
    `,
  ],
})
export class RxjsLabPlaceholderComponent {}
