import { Component } from '@angular/core';

@Component({
  selector: 'app-router-timeline-view',
  standalone: true,
  template: `
    <div class="view-card">
      <p class="view-desc">Current child route: <strong>timeline</strong>. Use the links above to navigate to guarded, resolved, or lazy routes and watch the timeline.</p>
    </div>
  `,
  styles: [
    `
      .view-card { padding: 1rem 1.25rem; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 8px; margin-top: 1rem; }
      .view-desc { font-size: 0.875rem; color: var(--text-secondary); margin: 0; }
    `,
  ],
})
export class RouterTimelineViewComponent {}
