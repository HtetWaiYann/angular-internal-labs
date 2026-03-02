import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { CdLabStateService } from '../../services/cd-lab-state.service';

@Component({
  selector: 'app-signal-cd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="strategy-panel strategy-signal" #panel>
      <div class="strategy-header">
        <span class="strategy-badge badge-signal">Signal</span>
        <code class="strategy-api">signal() + OnPush</code>
      </div>

      <div class="render-counter">
        <span class="render-number" style="color: var(--color-signal);">{{ renderCount }}</span>
        <span class="render-label">renders</span>
      </div>

      <div class="strategy-data">
        <div class="data-row">
          <span class="data-key">Signal value</span>
          <!-- Reading state.sharedSignal() here creates a reactive dependency.
               Angular automatically re-renders this component when the signal changes. -->
          <span class="data-val">{{ state.sharedSignal() }}</span>
        </div>
      </div>

      <!-- Code snippet: shows the reactive signal read in the template -->
      <div class="code-snippet">
        <span class="snippet-label">Component code</span>
        <pre class="snippet-pre">{{ code }}</pre>
      </div>

      <div class="strategy-rule">
        Checked only when <strong>signal value changes</strong>
      </div>
    </div>
  `,
})
export class SignalCdComponent implements OnChanges {
  readonly state = inject(CdLabStateService);

  @Input() renderCount = 0;
  @Input() flashTrigger = 0;

  @ViewChild('panel') private panelRef!: ElementRef<HTMLElement>;

  readonly code =
    `// Service holds the signal:\n` +
    `class CdLabStateService {\n` +
    `  sharedSignal = signal(0);\n` +
    `}\n` +
    `\n` +
    `// Template reads the signal:\n` +
    `// {{ state.sharedSignal() }}\n` +
    `//\n` +
    `// Angular tracks this read.\n` +
    `// When the signal changes → re-render. ✓`;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flashTrigger'] && !changes['flashTrigger'].isFirstChange()) {
      this.triggerFlash();
    }
  }

  private triggerFlash(): void {
    const el = this.panelRef?.nativeElement;
    if (!el) return;
    el.classList.remove('strategy-flash');
    void el.offsetWidth;
    el.classList.add('strategy-flash');
  }
}
