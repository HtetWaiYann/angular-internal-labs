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
      <h3 class="view-title">Resolved route</h3>
      <p class="view-desc">This route has <code>resolve: &#123; demoData: demoResolver &#125;</code>. ResolveStart and ResolveEnd ran before the component loaded.</p>
      @if (data; as d) {
        <div class="resolved-data">
          <span class="resolved-label">Resolved data:</span>
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
        border: 1px solid var(--border);
        border-radius: 8px;
        margin-top: 1rem;
      }
      .view-title { font-size: 1rem; font-weight: 600; color: var(--text-primary); margin: 0 0 0.5rem 0; }
      .view-desc { font-size: 0.875rem; color: var(--text-secondary); margin: 0 0 0.75rem 0; }
      .view-desc code { font-family: var(--font-mono); font-size: 0.8125rem; color: var(--color-accent); }
      .resolved-data { margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--border); }
      .resolved-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }
      .resolved-json { margin: 0.35rem 0 0 0; font-size: 0.8125rem; font-family: var(--font-mono); color: var(--color-signal); }
    `,
  ],
})
export class RouterResolvedViewComponent {
  private readonly route = inject(ActivatedRoute);
  get data(): DemoResolvedData | undefined {
    return this.route.snapshot.data['demoData'];
  }
}
