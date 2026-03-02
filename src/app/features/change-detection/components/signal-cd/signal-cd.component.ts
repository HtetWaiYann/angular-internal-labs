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
    <div class="preview-card preview--signal" #card>
      <div class="stat">
        <div class="stat-num" style="color: var(--color-signal)">{{ renderCount }}</div>
        <div class="stat-label">renders</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <!-- Reading state.sharedSignal() here creates a reactive dependency.
             Angular auto-schedules a re-render when the signal changes. -->
        <div class="stat-num">{{ state.sharedSignal() }}</div>
        <div class="stat-label">signal value</div>
      </div>
    </div>
  `,
})
export class SignalCdComponent implements OnChanges {
  readonly state = inject(CdLabStateService);

  @Input() renderCount = 0;
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
