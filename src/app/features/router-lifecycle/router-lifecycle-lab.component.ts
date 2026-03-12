import { Component, OnDestroy, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TooltipDirective } from '../../shared/directives/tooltip';
import {
  RouterLifecycleStateService,
  PhaseStatus,
  RouterPipelineStatus,
} from './services/router-lifecycle-state.service';
import { RouterLabConfigService } from './services/router-lab-config.service';
import { RouterLifecycleConceptsSidebarComponent } from './components/router-lifecycle-concepts-sidebar/router-lifecycle-concepts-sidebar.component';
import { NavGanttComponent } from './components/nav-gantt/nav-gantt.component';

type RouterLabTab = 'timeline' | 'guards' | 'resolvers' | 'lazy';

const IDLE_PIPELINE: RouterPipelineStatus = {
  start: 'idle', recognized: 'idle', guards: 'idle', resolve: 'idle', end: 'idle',
};

const STEP_DELAY = 2000; // ms between each pipeline step lighting up

@Component({
  selector: 'app-router-lifecycle-lab',
  imports: [RouterOutlet, RouterLink, RouterLifecycleConceptsSidebarComponent, NavGanttComponent, TooltipDirective],
  templateUrl: './router-lifecycle-lab.component.html',
  styleUrl: './router-lifecycle-lab.component.css',
})
export class RouterLifecycleLabComponent implements OnDestroy {
  readonly state  = inject(RouterLifecycleStateService);
  readonly config = inject(RouterLabConfigService);
  readonly activeTab = signal<RouterLabTab>('timeline');

  readonly delayOptions = [0, 300, 1000, 2000] as const;

  // ── Animated pipeline display ─────────────────────────────────────────────
  // Mirrors the real pipelineStatus but plays back with STEP_DELAY between steps.
  readonly displayPipeline = signal<RouterPipelineStatus>({ ...IDLE_PIPELINE });

  private replayTimers: ReturnType<typeof setTimeout>[] = [];
  private prevEnd: PhaseStatus = 'idle';

  constructor() {
    effect(() => {
      const real = this.state.pipelineStatus();
      // Use untracked to read prevEnd — it's a plain field, but avoids lint confusion
      const wasIdle = untracked(() => this.prevEnd === 'idle');

      // New navigation started: cancel any in-flight animation, reset display
      if (real.end === 'idle' && !wasIdle) {
        this.clearTimers();
        this.displayPipeline.set({ ...IDLE_PIPELINE });
      }

      // Navigation just completed: replay the full pipeline visually
      if (real.end !== 'idle' && wasIdle) {
        this.replayAnimation({ ...real });
      }

      this.prevEnd = real.end;
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private replayAnimation(final: RouterPipelineStatus): void {
    this.clearTimers();
    this.displayPipeline.set({ ...IDLE_PIPELINE });

    let t = 0;
    const step = (update: Partial<RouterPipelineStatus>) => {
      this.replayTimers.push(
        setTimeout(() => this.displayPipeline.update(s => ({ ...s, ...update })), t)
      );
      t += STEP_DELAY;
    };

    step({ start: 'done' });
    step({ recognized: 'done' });
    step({ guards: final.guards });
    step({ resolve: final.resolve });
    step({ end: final.end });
  }

  private clearTimers(): void {
    this.replayTimers.forEach(id => clearTimeout(id));
    this.replayTimers = [];
  }

  // ── Guards / Resolvers ────────────────────────────────────────────────────
  setGuardDelay(ms: number): void    { this.config.guardDelayMs.set(ms); }
  setResolverDelay(ms: number): void { this.config.resolverDelayMs.set(ms); }

  clearAll(): void {
    this.state.clearAll();
    this.clearTimers();
    this.displayPipeline.set({ ...IDLE_PIPELINE });
    this.prevEnd = 'idle';
  }

  // ── Pipeline stepper CSS helpers ──────────────────────────────────────────
  stepClass(status: PhaseStatus, extra?: string): string {
    const state = status === 'done'  ? 'pipeline-step--hit'
                : status === 'idle'  ? ''
                : `pipeline-step--${status}`;
    return ['pipeline-step', extra, state].filter(Boolean).join(' ');
  }

  lineClass(prev: PhaseStatus): string {
    return prev === 'done' ? 'pipeline-line pipeline-line--hit' : 'pipeline-line';
  }
}
