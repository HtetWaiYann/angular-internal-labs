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
  selector: 'app-default-cd',
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="strategy-panel strategy-default" #panel>
      <div class="strategy-header">
        <span class="strategy-badge badge-default">Default</span>
        <code class="strategy-api">ChangeDetectionStrategy.Default</code>
      </div>

      <div class="render-counter">
        <span class="render-number" style="color: var(--color-default);">{{ renderCount }}</span>
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
        Checked on <strong>every</strong> CD cycle — even when nothing changed
      </div>
    </div>
  `,
})
export class DefaultCdComponent implements OnChanges {
  @Input() value = 0;
  @Input() renderCount = 0;
  @Input() flashTrigger = 0;

  @ViewChild('panel') private panelRef!: ElementRef<HTMLElement>;

  // This string is displayed verbatim in the <pre> block above.
  readonly code =
    `@Component({\n` +
    `  changeDetection:\n` +
    `    ChangeDetectionStrategy.Default\n` +
    `})\n` +
    `class DefaultCdComponent {\n` +
    `  @Input() value = 0;\n` +
    `}\n` +
    `// Angular checks this component\n` +
    `// on EVERY change-detection cycle.`;

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
