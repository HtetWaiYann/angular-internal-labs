import { Component, inject, signal } from '@angular/core';
import { RenderLogEntry, RenderStrategy } from '../../core/models/runtime-event.model';
import { CdLabStateService } from './services/cd-lab-state.service';
import { DefaultCdComponent } from './components/default-cd/default-cd.component';
import { OnPushCdComponent } from './components/onpush-cd/onpush-cd.component';
import { SignalCdComponent } from './components/signal-cd/signal-cd.component';

/** Per-strategy result shown in the "What just happened?" teaching panel. */
interface StrategyResult {
  rendered: boolean;
  /** One-sentence reason shown below the rendered/skipped badge. */
  why: string;
}

/** Full explanation for a single user action. */
interface ActionExplanation {
  title: string;
  /** Plain-English description of what Angular did and why. */
  reason: string;
  /** Code snippet illustrating the Angular rules in play. */
  code: string;
  default: StrategyResult;
  onpush: StrategyResult;
  signal: StrategyResult;
}

@Component({
  selector: 'app-change-detection-lab',
  imports: [DefaultCdComponent, OnPushCdComponent, SignalCdComponent],
  templateUrl: './change-detection-lab.component.html',
  styleUrl: './change-detection-lab.component.css',
})
export class ChangeDetectionLabComponent {
  readonly labState = inject(CdLabStateService);

  // ── Render-count signals ──────────────────────────────────────────────────
  readonly defaultRenders = signal(0);
  readonly onpushRenders = signal(0);
  readonly signalRenders = signal(0);

  // ── Flash-trigger signals ─────────────────────────────────────────────────
  readonly defaultFlash = signal(0);
  readonly onpushFlash = signal(0);
  readonly signalFlash = signal(0);

  // ── Shared input value for Default & OnPush ───────────────────────────────
  primitiveValue = 0;

  // ── Timeline ──────────────────────────────────────────────────────────────
  readonly renderLog = signal<RenderLogEntry[]>([]);

  // ── Teaching panel ────────────────────────────────────────────────────────
  readonly lastExplanation = signal<ActionExplanation | null>(null);

  // ── Actions ───────────────────────────────────────────────────────────────

  /**
   * Trigger a CD cycle without changing any child input or signal.
   * Only Default re-renders — OnPush and Signal stay idle.
   */
  triggerCdCycle(): void {
    this.defaultRenders.update((v) => v + 1);
    this.defaultFlash.update((v) => v + 1);
    this.log('CD Cycle (no data change)', ['default']);

    this.lastExplanation.set({
      title: 'CD Cycle Triggered — no data changed',
      reason:
        'Clicking the button ran inside Zone.js. Zone.js monitors all async operations ' +
        '(DOM events, timers, HTTP calls) and automatically schedules a change detection cycle ' +
        'when any of them complete. Angular then walked the entire component tree. ' +
        'Default was checked as usual. OnPush and Signal were skipped because ' +
        'neither their @Input references nor their signals had changed.',
      code:
        `// Zone.js detects the button click → triggers a CD cycle.\n` +
        `// Angular walks the component tree and decides what to check:\n` +
        `\n` +
        `@Component({ changeDetection: ChangeDetectionStrategy.Default })\n` +
        `class DefaultCd { @Input() value = 0; }\n` +
        `// ✓ re-rendered — Default is ALWAYS checked, no conditions.\n` +
        `\n` +
        `@Component({ changeDetection: ChangeDetectionStrategy.OnPush })\n` +
        `class OnPushCd { @Input() value = 0; }\n` +
        `// ✗ skipped — @Input "value" did not change.\n` +
        `\n` +
        `// Signal template: {{ state.sharedSignal() }}\n` +
        `// ✗ skipped — sharedSignal did not change.`,
      default: { rendered: true, why: 'Always checked on every CD cycle — no conditions needed.' },
      onpush: { rendered: false, why: '@Input "value" did not change this cycle.' },
      signal: { rendered: false, why: 'The signal it reads in the template did not change.' },
    });
  }

  /**
   * Change the shared primitive input value.
   * Default always re-renders. OnPush re-renders because its @Input changed.
   */
  changeInput(): void {
    this.primitiveValue++;
    this.defaultRenders.update((v) => v + 1);
    this.onpushRenders.update((v) => v + 1);
    this.defaultFlash.update((v) => v + 1);
    this.onpushFlash.update((v) => v + 1);
    this.log('Input Changed', ['default', 'onpush']);

    this.lastExplanation.set({
      title: `Input Changed — primitiveValue is now ${this.primitiveValue}`,
      reason:
        `primitiveValue was incremented from ${this.primitiveValue - 1} to ${this.primitiveValue} ` +
        'and passed as @Input to both Default and OnPush. ' +
        'Since the number is now different, Angular detected the @Input reference change ' +
        'and marked OnPush as "dirty" — meaning it will be checked in this CD cycle. ' +
        'Signal was skipped because it reads no @Input and its signal was not updated.',
      code:
        `// Parent increments the value and passes it down:\n` +
        `this.primitiveValue++;  // was ${this.primitiveValue - 1}, now ${this.primitiveValue}\n` +
        `\n` +
        `// Parent template:\n` +
        `<app-default-cd [value]="primitiveValue" />  // ✓ always checked\n` +
        `<app-onpush-cd  [value]="primitiveValue" />  // ✓ @Input changed → dirty!\n` +
        `<app-signal-cd  />                           // ✗ no signal changed\n` +
        `\n` +
        `// OnPush rule:\n` +
        `// When an @Input reference changes, Angular marks the component\n` +
        `// "dirty". It is checked this cycle, then the flag is cleared.`,
      default: { rendered: true, why: 'Always checked — regardless of what changed.' },
      onpush: {
        rendered: true,
        why: `@Input "value" changed: ${this.primitiveValue - 1} → ${this.primitiveValue}.`,
      },
      signal: { rendered: false, why: 'Has no @Input and its signal did not change.' },
    });
  }

  /**
   * Update the shared signal.
   * Signal re-renders (reads the signal). Default re-renders (click triggered CD).
   * OnPush stays idle — no @Input change, no signal read.
   */
  updateSignal(): void {
    this.labState.sharedSignal.update((v) => v + 1);
    this.defaultRenders.update((v) => v + 1);
    this.signalRenders.update((v) => v + 1);
    this.defaultFlash.update((v) => v + 1);
    this.signalFlash.update((v) => v + 1);
    this.log('Signal Updated', ['default', 'signal']);

    this.lastExplanation.set({
      title: `Signal Updated — sharedSignal is now ${this.labState.sharedSignal()}`,
      reason:
        "sharedSignal was incremented. Angular's reactive graph automatically tracks every " +
        'signal() call made inside a component template. The Signal component reads ' +
        '{{ state.sharedSignal() }} — so Angular knows to re-render it when the signal changes. ' +
        'OnPush has no signal reads and got no @Input change, so it stayed idle. ' +
        'Default re-rendered because the button click itself triggers a CD cycle.',
      code:
        `// 1. Signal is stored in a shared service:\n` +
        `class CdLabStateService {\n` +
        `  sharedSignal = signal(0);\n` +
        `}\n` +
        `\n` +
        `// 2. Update the signal from the parent:\n` +
        `this.labState.sharedSignal.update(v => v + 1);\n` +
        `\n` +
        `// 3. SignalCd reads it in its template:\n` +
        `// {{ state.sharedSignal() }}  ← reactive read\n` +
        `// Angular tracked this read. Signal changed → ✓ re-render.\n` +
        `\n` +
        `// OnPush never reads sharedSignal → ✗ stays idle.`,
      default: { rendered: true, why: 'Click triggered a CD cycle — Default is always checked.' },
      onpush: { rendered: false, why: 'Reads no signals and its @Input did not change.' },
      signal: {
        rendered: true,
        why: 'Reads sharedSignal() in template — Angular auto-scheduled it.',
      },
    });
  }

  reset(): void {
    this.defaultRenders.set(0);
    this.onpushRenders.set(0);
    this.signalRenders.set(0);
    this.defaultFlash.set(0);
    this.onpushFlash.set(0);
    this.signalFlash.set(0);
    this.primitiveValue = 0;
    this.labState.sharedSignal.set(0);
    this.renderLog.set([]);
    this.lastExplanation.set(null);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private log(trigger: string, strategies: RenderStrategy[]): void {
    this.renderLog.update((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        trigger,
        strategies,
        timestamp: Date.now(),
      },
      ...prev,
    ]);
  }

  formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('en', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    } as Intl.DateTimeFormatOptions);
  }
}
