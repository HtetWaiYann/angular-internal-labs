import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TooltipDirective } from '../../shared/directives/tooltip';
import {
  RouterLifecycleStateService,
  NavSummary,
} from './services/router-lifecycle-state.service';
import { RouterLabConfigService } from './services/router-lab-config.service';
import { RouterLifecycleConceptsSidebarComponent } from './components/router-lifecycle-concepts-sidebar/router-lifecycle-concepts-sidebar.component';
import { NavGanttComponent } from './components/nav-gantt/nav-gantt.component';

type RouterLabTab = 'timeline' | 'guards' | 'resolvers' | 'lazy';

@Component({
  selector: 'app-router-lifecycle-lab',
  imports: [RouterOutlet, RouterLink, RouterLifecycleConceptsSidebarComponent, NavGanttComponent, TooltipDirective],
  templateUrl: './router-lifecycle-lab.component.html',
  styleUrl: './router-lifecycle-lab.component.css',
})
export class RouterLifecycleLabComponent {
  readonly state  = inject(RouterLifecycleStateService);
  readonly config = inject(RouterLabConfigService);
  readonly activeTab = signal<RouterLabTab>('timeline');

  readonly delayOptions = [0, 300, 1000, 2000] as const;

  setGuardDelay(ms: number): void    { this.config.guardDelayMs.set(ms); }
  setResolverDelay(ms: number): void { this.config.resolverDelayMs.set(ms); }

  clearAll(): void { this.state.clearAll(); }

  outcomeLabel(outcome: NavSummary['outcome']): string {
    switch (outcome) {
      case 'cancelled': return 'Cancelled';
      case 'error':     return 'Error';
      default:          return 'Completed';
    }
  }
}
