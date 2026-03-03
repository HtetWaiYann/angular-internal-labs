import { Component } from '@angular/core';

@Component({
  selector: 'app-router-guarded-view',
  standalone: true,
  template: `
    <div class="view-card">
      <h3 class="view-title">Guarded route</h3>
      <p class="view-desc">This route has <code>canActivate: [demoGuard]</code>. GuardsCheckStart and GuardsCheckEnd were emitted before activation.</p>
    </div>
  `,
  styles: [
    `
      .view-card {
        padding: 1rem 1.25rem;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 8px;
        margin-top: 1rem;
      }
      .view-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.5rem 0; }
      .view-desc { font-size: 0.875rem; color: var(--text-secondary); margin: 0; }
      .view-desc code { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-accent); }
    `,
  ],
})
export class RouterGuardedViewComponent {}
