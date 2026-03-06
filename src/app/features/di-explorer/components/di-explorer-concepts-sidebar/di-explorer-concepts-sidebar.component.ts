import { Component, input, computed } from '@angular/core';
import type { DiExplorerTab } from '../../di-explorer-lab.component';

@Component({
  selector: 'app-di-explorer-concepts-sidebar',
  standalone: true,
  templateUrl: './di-explorer-concepts-sidebar.component.html',
  styleUrl: './di-explorer-concepts-sidebar.component.css',
})
export class DiExplorerConceptsSidebarComponent {
  readonly activeTab = input<DiExplorerTab>('hierarchy');

  readonly tabLabel = computed(() => {
    const labels: Record<DiExplorerTab, string> = {
      hierarchy: 'Injector hierarchy',
      scope: 'Provider scope',
      resolution: 'Token resolution',
      tracing: 'Injection tracing',
    };
    return labels[this.activeTab()];
  });
}
