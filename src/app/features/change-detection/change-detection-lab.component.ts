import { Component, inject, signal } from '@angular/core';
import { CdLabStateService } from './services/cd-lab-state.service';
import { DefaultCdComponent } from './components/default-cd/default-cd.component';
import { OnPushCdComponent } from './components/onpush-cd/onpush-cd.component';
import { SignalCdComponent } from './components/signal-cd/signal-cd.component';

type Tab = 'default' | 'onpush' | 'signal';
type MsgType = 'rendered' | 'skipped';
interface Msg { text: string; type: MsgType }

@Component({
  selector: 'app-change-detection-lab',
  imports: [DefaultCdComponent, OnPushCdComponent, SignalCdComponent],
  templateUrl: './change-detection-lab.component.html',
  styleUrl: './change-detection-lab.component.css',
})
export class ChangeDetectionLabComponent {
  readonly labState = inject(CdLabStateService);

  readonly activeTab = signal<Tab>('default');

  // ── Default tab ───────────────────────────────────────────────────────────
  readonly defaultRenders = signal(0);
  readonly defaultValue = signal(0);
  readonly defaultFlash = signal(0);
  readonly defaultMsg = signal<Msg | null>(null);

  // ── OnPush tab ────────────────────────────────────────────────────────────
  readonly onpushRenders = signal(0);
  readonly onpushValue = signal(0);
  readonly onpushFlash = signal(0);
  readonly onpushMsg = signal<Msg | null>(null);

  // ── Signal tab ────────────────────────────────────────────────────────────
  readonly signalRenders = signal(0);
  readonly signalFlash = signal(0);
  readonly signalMsg = signal<Msg | null>(null);

  // ── Code samples ──────────────────────────────────────────────────────────
  readonly code: Record<Tab, string> = {
    default:
      `@Component({\n` +
      `  changeDetection: ChangeDetectionStrategy.Default\n` +
      `})\n` +
      `export class MyComponent {\n` +
      `  @Input() value = 0;\n` +
      `\n` +
      `  // Angular visits this component on EVERY\n` +
      `  // change detection cycle — no conditions.\n` +
      `}`,

    onpush:
      `@Component({\n` +
      `  changeDetection: ChangeDetectionStrategy.OnPush\n` +
      `})\n` +
      `export class MyComponent {\n` +
      `  @Input() value = 0;\n` +
      `\n` +
      `  // Angular SKIPS this component unless an\n` +
      `  // @Input reference changes (checked by ===).\n` +
      `}`,

    signal:
      `@Component({\n` +
      `  changeDetection: ChangeDetectionStrategy.OnPush\n` +
      `})\n` +
      `export class MyComponent {\n` +
      `  readonly count = inject(CounterService).count;\n` +
      `  //                                      ↑ signal\n` +
      `\n` +
      `  // Template: {{ count() }}\n` +
      `  // Angular tracks signal reads inside templates.\n` +
      `  // When count changes → only this view re-renders.\n` +
      `}`,
  };

  // ── Default actions ───────────────────────────────────────────────────────
  runDefault(): void {
    this.defaultRenders.update((v) => v + 1);
    this.defaultValue.update((v) => v + 1);
    this.defaultFlash.update((v) => v + 1);
    this.defaultMsg.set({ text: 'CD cycle ran → Default always re-renders.', type: 'rendered' });
  }

  resetDefault(): void {
    this.defaultRenders.set(0);
    this.defaultValue.set(0);
    this.defaultFlash.set(0);
    this.defaultMsg.set(null);
  }

  // ── OnPush actions ────────────────────────────────────────────────────────
  changeInput(): void {
    this.onpushValue.update((v) => v + 1);
    this.onpushRenders.update((v) => v + 1);
    this.onpushFlash.update((v) => v + 1);
    this.onpushMsg.set({
      text: `@Input changed to ${this.onpushValue()} → OnPush re-rendered.`,
      type: 'rendered',
    });
  }

  triggerCdOnly(): void {
    this.onpushMsg.set({
      text: 'CD cycle ran — @Input unchanged → OnPush skipped.',
      type: 'skipped',
    });
  }

  resetOnpush(): void {
    this.onpushRenders.set(0);
    this.onpushValue.set(0);
    this.onpushFlash.set(0);
    this.onpushMsg.set(null);
  }

  // ── Signal actions ────────────────────────────────────────────────────────
  updateSignal(): void {
    this.labState.sharedSignal.update((v) => v + 1);
    this.signalRenders.update((v) => v + 1);
    this.signalFlash.update((v) => v + 1);
    this.signalMsg.set({
      text: `signal() → ${this.labState.sharedSignal()} — Angular auto re-rendered.`,
      type: 'rendered',
    });
  }

  resetSignal(): void {
    this.signalRenders.set(0);
    this.signalFlash.set(0);
    this.signalMsg.set(null);
    this.labState.sharedSignal.set(0);
  }
}
