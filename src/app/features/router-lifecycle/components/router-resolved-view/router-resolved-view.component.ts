import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DemoResolvedData } from '../../resolvers/demo.resolver';

@Component({
  selector: 'app-router-resolved-view',
  standalone: true,
  imports: [JsonPipe],
  template: `
    <div class="view-card">
      <span class="view-tag">Resolved</span>
      <h3 class="view-title">/router/resolved</h3>
      <p class="view-desc">
        This route has <code>resolve: &#123; demoData: demoResolver &#125;</code>.
        The resolver finished before the view activated, so the data is already in
        <code>route.snapshot.data</code> when the component renders.
      </p>
      @if (data; as d) {
        <div class="resolved-data">
          <span class="resolved-label">Resolved data</span>
          <pre class="resolved-json">{{ d | json }}</pre>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .view-card {
        padding: 1rem 1.25rem;
        background: var(--bg-panel);
        border: 1px solid var(--color-resolve-bg);
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
        background: var(--color-resolve-bg);
        color: var(--color-resolve);
        margin-bottom: 0.5rem;
      }
      .view-title { font-family: var(--font-mono); font-size: 0.9375rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.4rem 0; }
      .view-desc { font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 0.75rem 0; }
      .view-desc code { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-resolve); background: var(--color-resolve-bg); padding: 0.05rem 0.3rem; border-radius: 3px; }
      .resolved-data { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle); }
      .resolved-label { font-size: 0.6875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
      .resolved-json { margin: 0.4rem 0 0 0; padding: 0.625rem 0.875rem; font-size: 0.8125rem; font-family: var(--font-mono); color: var(--text-primary); background: var(--bg-sunken); border-radius: 6px; }
    `,
  ],
})
export class RouterResolvedViewComponent {
  private readonly route = inject(ActivatedRoute);
  get data(): DemoResolvedData | undefined {
    return this.route.snapshot.data['demoData'];
  }
}
