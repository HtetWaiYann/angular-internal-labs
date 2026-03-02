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
    <div class="preview-card preview--onpush" #card>
      <div class="stat">
        <div class="stat-num" style="color: var(--color-onpush)">{{ renderCount }}</div>
        <div class="stat-label">renders</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <div class="stat-num">{{ value }}</div>
        <div class="stat-label">&#64;Input value</div>
      </div>
    </div>
  `,
})
export class OnPushCdComponent implements OnChanges {
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
