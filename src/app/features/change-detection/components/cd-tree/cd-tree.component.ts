import { Component, effect, input, signal, untracked, OnDestroy } from '@angular/core';

export type NodeState = 'idle' | 'checked' | 'skipped' | 'targeted';

export interface CdTreeState {
  default: NodeState;
  onpush: NodeState;
  signal: NodeState;
}

@Component({
  selector: 'app-cd-tree',
  templateUrl: './cd-tree.component.html',
  styleUrl: './cd-tree.component.css',
})
export class CdTreeComponent implements OnDestroy {
  readonly state = input.required<CdTreeState>();
  readonly tick = input<number>(0);

  // ── Animated node states ──────────────────────────────────────────────────
  // Root and CDLab pulse briefly during propagation, then return to idle.
  // Child nodes settle into their final state and stay there.
  readonly rootAnim  = signal<'idle' | 'active'>('idle');
  readonly labAnim   = signal<'idle' | 'active'>('idle');
  readonly defaultAnim = signal<NodeState>('idle');
  readonly onpushAnim  = signal<NodeState>('idle');
  readonly signalAnim  = signal<NodeState>('idle');

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    // Watch tick; read state untracked so state changes don't re-fire the effect.
    effect(() => {
      const t = this.tick();
      const s = untracked(() => this.state());
      if (t === 0) return;

      // Clear any in-flight animation timers
      this.clearTimers();

      // Reset all nodes to idle immediately (transitions animate them back)
      this.rootAnim.set('idle');
      this.labAnim.set('idle');
      this.defaultAnim.set('idle');
      this.onpushAnim.set('idle');
      this.signalAnim.set('idle');

      // Staggered wave: root → CDLab → children (left to right)
      this.timers.push(setTimeout(() => this.rootAnim.set('active'),  80));
      this.timers.push(setTimeout(() => { this.rootAnim.set('idle'); this.labAnim.set('active'); }, 260));
      this.timers.push(setTimeout(() => { this.labAnim.set('idle');  this.defaultAnim.set(s.default); }, 430));
      this.timers.push(setTimeout(() => this.onpushAnim.set(s.onpush), 570));
      this.timers.push(setTimeout(() => this.signalAnim.set(s.signal),  710));
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private clearTimers(): void {
    this.timers.forEach(id => clearTimeout(id));
    this.timers = [];
  }
}
