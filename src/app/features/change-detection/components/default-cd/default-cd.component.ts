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
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="preview-card preview--default" #card>
      <div class="stat">
        <div class="stat-num" style="color: var(--color-default)">{{ renderCount }}</div>
        <div class="stat-label">renders</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <div class="stat-num">{{ value }}</div>
        <div class="stat-label">value</div>
      </div>
    </div>
  `,
})
export class DefaultCdComponent implements OnChanges {
  @Input() renderCount = 0;
  @Input() value = 0;
  @Input() flashTrigger = 0;

  @ViewChild('card') private cardRef!: ElementRef<HTMLElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['flashTrigger'] &&
      !changes['flashTrigger'].isFirstChange() &&
      changes['flashTrigger'].currentValue > changes['flashTrigger'].previousValue
    ) {
      this.flash();
    }
  }

  private flash(): void {
    const el = this.cardRef?.nativeElement;
    if (!el) return;
    el.classList.remove('card--flash');
    void el.offsetWidth;
    el.classList.add('card--flash');
  }
}
