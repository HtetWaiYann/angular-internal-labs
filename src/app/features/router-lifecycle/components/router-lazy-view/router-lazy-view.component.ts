import { Component } from '@angular/core';

@Component({
  selector: 'app-router-lazy-view',
  standalone: true,
  template: `
    <div class="view-card">
      <span class="view-tag">Lazy</span>
      <h3 class="view-title">/router/lazy</h3>
      <p class="view-desc">
        This view was loaded via <code>loadChildren</code>. The first time you visited,
        the router downloaded a separate JS chunk wrapped in
        <code>RouteConfigLoadStart</code> / <code>RouteConfigLoadEnd</code>.
        Subsequent visits use the cached module.
      </p>
    </div>
  `,
  styles: [
    `
      .view-card {
        padding: 1rem 1.25rem;
        background: var(--bg-panel);
        border: 1px solid var(--color-lazy-bg);
        border-radius: 10px;
        box-shadow: var(--shadow-sm);
      }
      .view-tag {
        display: inline-block;
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 0.15rem 0.5rem;
        border-radius: 999px;
        background: var(--color-lazy-bg);
        color: var(--color-lazy);
        margin-bottom: 0.5rem;
      }
      .view-title { font-family: var(--font-mono); font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.4rem 0; }
      .view-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin: 0; }
      .view-desc code { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-lazy); background: var(--color-lazy-bg); padding: 0.05rem 0.3rem; border-radius: 3px; }
    `,
  ],
})
export class RouterLazyViewComponent {}
