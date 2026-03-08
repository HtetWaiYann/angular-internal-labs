import { Component, inject, signal, NgZone } from '@angular/core';
import { CdLabStateService } from './services/cd-lab-state.service';
import { DefaultCdComponent } from './components/default-cd/default-cd.component';
import { OnPushCdComponent } from './components/onpush-cd/onpush-cd.component';
import { SignalCdComponent } from './components/signal-cd/signal-cd.component';
import { CdConceptsSidebarComponent } from './components/cd-concepts-sidebar/cd-concepts-sidebar.component';
import { CdTreeComponent, CdTreeState } from './components/cd-tree/cd-tree.component';

export type Tab = 'default' | 'onpush' | 'signal' | 'compare';
type MsgType = 'rendered' | 'skipped';
interface Msg { text: string; type: MsgType }

export type CmpStatusType = 'checked' | 'skipped' | 'targeted';
export interface CmpStatus { type: CmpStatusType; label: string; }
export type CmpAction = 'cd-cycle' | 'change-input' | 'update-signal' | null;

const IDLE_TREE: CdTreeState = { default: 'idle', onpush: 'idle', signal: 'idle' };

@Component({
  selector: 'app-change-detection-lab',
  imports: [
    DefaultCdComponent,
    OnPushCdComponent,
    SignalCdComponent,
    CdConceptsSidebarComponent,
    CdTreeComponent,
  ],
  templateUrl: './change-detection-lab.component.html',
  styleUrl: './change-detection-lab.component.css',
})
export class ChangeDetectionLabComponent {
  private readonly ngZone = inject(NgZone);
  readonly labState = inject(CdLabStateService);

  readonly activeTab = signal<Tab>('default');

  // ── Component Tree visualization ──────────────────────────────────────────
  readonly treeState = signal<CdTreeState>(IDLE_TREE);
  readonly treeTick  = signal(0);

  // ── Default tab ───────────────────────────────────────────────────────────
  readonly defaultRenders = signal(0);
  readonly defaultValue = signal(0);
  readonly defaultFlash = signal(0);
  readonly defaultMsg = signal<Msg | null>(null);
  readonly outsideRuns = signal(0);
  readonly outsideDurationMs = signal(0);
  readonly outsideMsg = signal<string | null>(null);
  readonly outsideCode =
    `// Skip Angular change detection while doing heavy work\n` +
    `this.ngZone.runOutsideAngular(() => {\n` +
    `  heavyWork(); // expensive loop — no CD runs here\n` +
    `  // Re-enter Angular once to update the UI\n` +
    `  this.ngZone.run(() => this.status = 'done');\n` +
    `});`;

  // ── OnPush tab ────────────────────────────────────────────────────────────
  readonly onpushRenders = signal(0);
  readonly onpushValue = signal(0);
  readonly onpushFlash = signal(0);
  readonly onpushMsg = signal<Msg | null>(null);

  // ── Signal tab ────────────────────────────────────────────────────────────
  readonly signalRenders = signal(0);
  readonly signalFlash = signal(0);
  readonly signalMsg = signal<Msg | null>(null);

  // ── Compare tab ───────────────────────────────────────────────────────────
  readonly cmpDefaultRenders = signal(0);
  readonly cmpDefaultFlash = signal(0);
  readonly cmpDefaultStatus = signal<CmpStatus | null>(null);

  readonly cmpOnpushRenders = signal(0);
  readonly cmpOnpushValue = signal(0);
  readonly cmpOnpushFlash = signal(0);
  readonly cmpOnpushStatus = signal<CmpStatus | null>(null);

  readonly cmpSignalRenders = signal(0);
  readonly cmpSignalFlash = signal(0);
  readonly cmpSignalStatus = signal<CmpStatus | null>(null);

  readonly cmpLastAction = signal<CmpAction>(null);

  // ── Code samples ──────────────────────────────────────────────────────────
  readonly code: Record<Exclude<Tab, 'compare'>, string> = {
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

  // ── Helpers ───────────────────────────────────────────────────────────────
  private setTree(state: CdTreeState): void {
    this.treeState.set(state);
    this.treeTick.update((v) => v + 1);
  }

  // ── Default actions ───────────────────────────────────────────────────────
  runDefault(): void {
    this.defaultRenders.update((v) => v + 1);
    this.defaultValue.update((v) => v + 1);
    this.defaultFlash.update((v) => v + 1);
    this.defaultMsg.set({ text: 'CD cycle ran → Default always re-renders.', type: 'rendered' });
    this.setTree({ default: 'checked', onpush: 'skipped', signal: 'skipped' });
  }

  resetDefault(): void {
    this.defaultRenders.set(0);
    this.defaultValue.set(0);
    this.defaultFlash.set(0);
    this.defaultMsg.set(null);
    this.outsideRuns.set(0);
    this.outsideDurationMs.set(0);
    this.outsideMsg.set(null);
  }

  runOutsideAngular(): void {
    const started = performance.now();
    this.ngZone.runOutsideAngular(() => {
      const end = started + 40;
      while (performance.now() < end) {
        // simulate heavy work
      }
    });
    const elapsed = Math.round((performance.now() - started) * 100) / 100;
    this.ngZone.run(() => {
      this.outsideRuns.update((v) => v + 1);
      this.outsideDurationMs.set(elapsed);
      this.outsideMsg.set(
        `Ran a ~${elapsed}ms loop outside Angular. Change detection ran only once when re-entering.`,
      );
    });
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
    this.setTree({ default: 'checked', onpush: 'checked', signal: 'skipped' });
  }

  triggerCdOnly(): void {
    this.onpushMsg.set({
      text: 'CD cycle ran — @Input unchanged → OnPush skipped.',
      type: 'skipped',
    });
    this.setTree({ default: 'checked', onpush: 'skipped', signal: 'skipped' });
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
    this.setTree({ default: 'skipped', onpush: 'skipped', signal: 'targeted' });
  }

  resetSignal(): void {
    this.signalRenders.set(0);
    this.signalFlash.set(0);
    this.signalMsg.set(null);
    this.labState.sharedSignal.set(0);
  }

  // ── Compare actions ───────────────────────────────────────────────────────
  compareTriggerCd(): void {
    this.cmpDefaultRenders.update((v) => v + 1);
    this.cmpDefaultFlash.update((v) => v + 1);
    this.cmpDefaultStatus.set({ type: 'checked', label: 'checked' });
    this.cmpOnpushStatus.set({ type: 'skipped', label: 'skipped' });
    this.cmpSignalStatus.set({ type: 'skipped', label: 'skipped' });
    this.cmpLastAction.set('cd-cycle');
    this.setTree({ default: 'checked', onpush: 'skipped', signal: 'skipped' });
  }

  compareChangeInput(): void {
    this.cmpDefaultRenders.update((v) => v + 1);
    this.cmpDefaultFlash.update((v) => v + 1);
    this.cmpDefaultStatus.set({ type: 'checked', label: 'checked' });
    this.cmpOnpushRenders.update((v) => v + 1);
    this.cmpOnpushValue.update((v) => v + 1);
    this.cmpOnpushFlash.update((v) => v + 1);
    this.cmpOnpushStatus.set({ type: 'checked', label: 'checked — @Input changed' });
    this.cmpSignalStatus.set({ type: 'skipped', label: 'skipped' });
    this.cmpLastAction.set('change-input');
    this.setTree({ default: 'checked', onpush: 'checked', signal: 'skipped' });
  }

  compareUpdateSignal(): void {
    this.cmpDefaultStatus.set({ type: 'skipped', label: 'skipped' });
    this.cmpOnpushStatus.set({ type: 'skipped', label: 'skipped' });
    this.labState.sharedSignal.update((v) => v + 1);
    this.cmpSignalRenders.update((v) => v + 1);
    this.cmpSignalFlash.update((v) => v + 1);
    this.cmpSignalStatus.set({ type: 'targeted', label: 'targeted ⚡' });
    this.cmpLastAction.set('update-signal');
    this.setTree({ default: 'skipped', onpush: 'skipped', signal: 'targeted' });
  }

  resetCompare(): void {
    this.cmpDefaultRenders.set(0);
    this.cmpDefaultFlash.set(0);
    this.cmpDefaultStatus.set(null);
    this.cmpOnpushRenders.set(0);
    this.cmpOnpushValue.set(0);
    this.cmpOnpushFlash.set(0);
    this.cmpOnpushStatus.set(null);
    this.cmpSignalRenders.set(0);
    this.cmpSignalFlash.set(0);
    this.cmpSignalStatus.set(null);
    this.labState.sharedSignal.set(0);
    this.cmpLastAction.set(null);
  }
}
