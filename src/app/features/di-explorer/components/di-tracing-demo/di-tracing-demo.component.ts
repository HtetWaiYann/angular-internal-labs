import { Component, inject } from '@angular/core';
import { DiTraceService } from '../../services/di-trace.service';
import { DemoLoggerService } from '../../services/demo-logger.service';
import { TooltipDirective } from '../../../../shared/directives/tooltip';

@Component({
  selector: 'app-di-tracing-demo',
  standalone: true,
  imports: [TooltipDirective],
  template: `
    <div class="demo-box">
      <p class="demo-msg">{{ logger.message }}</p>
      <button class="demo-btn" (click)="logAgain()" appTooltip="Call the injected logger again. Watch the trace to see the same instance is used.">Log again</button>
    </div>
  `,
  styles: [
    `
      .demo-box {
        padding: 1rem 1.25rem;
        background: var(--bg-panel);
        border: 1px solid var(--border);
        border-radius: 10px;
      }
      .demo-msg {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin-bottom: 0.75rem;
      }
      .demo-btn {
        padding: 0.35rem 0.875rem;
        font-size: 0.8125rem;
        font-weight: 600;
        background: color-mix(in srgb, var(--color-signal) 15%, transparent);
        border: 1px solid color-mix(in srgb, var(--color-signal) 35%, transparent);
        color: var(--color-signal);
        border-radius: 6px;
        cursor: pointer;
        font-family: inherit;
      }
      .demo-btn:hover {
        background: color-mix(in srgb, var(--color-signal) 25%, transparent);
      }
    `,
  ],
})
export class DiTracingDemoComponent {
  private readonly trace = inject(DiTraceService);
  readonly logger = inject(DemoLoggerService);

  constructor() {
    this.trace.log('Component requested DemoLoggerService via inject()', 'request');
    this.logger.log('Hello from DI!');
  }

  logAgain(): void {
    this.logger.log('User clicked "Log again"');
  }
}
