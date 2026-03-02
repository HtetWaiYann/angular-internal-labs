import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';

@Component({
  selector: 'app-onpush-cd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="strategy-panel strategy-onpush" #panel>
      <div class="strategy-header">
        <span class="strategy-badge badge-onpush">OnPush</span>
        <code class="strategy-api">ChangeDetectionStrategy.OnPush</code>
      </div>

      <div class="render-counter">
        <span class="render-number" style="color: var(--color-onpush);">{{ renderCount }}</span>
        <span class="render-label">renders</span>
      </div>

      <div class="strategy-data">
        <div class="data-row">
          <span class="data-key">Input value</span>
          <span class="data-val">{{ value }}</span>
        </div>
      </div>

      <!-- Code snippet: shows exactly how this strategy is declared -->
      <div class="code-snippet">
        <span class="snippet-label">Component code</span>
        <pre class="snippet-pre">{{ code }}</pre>
      </div>

      <div class="strategy-rule">
        Checked only when <strong>@Input reference changes</strong>
      </div>
    </div>
  `,
})
export class OnPushCdComponent implements OnChanges {
  @Input() value = 0;
  @Input() renderCount = 0;
  @Input() flashTrigger = 0;

  @ViewChild('panel') private panelRef!: ElementRef<HTMLElement>;

  readonly code =
    `@Component({\n` +
    `  changeDetection:\n` +
    `    ChangeDetectionStrategy.OnPush\n` +
    `})\n` +
    `class OnPushCdComponent {\n` +
    `  @Input() value = 0;\n` +
    `  // ✓ re-renders when value changes\n` +
    `  // ✗ skipped when value is the same\n` +
    `}`;

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
