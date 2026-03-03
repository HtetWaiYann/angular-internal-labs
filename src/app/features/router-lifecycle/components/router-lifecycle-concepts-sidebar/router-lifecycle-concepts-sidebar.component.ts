import { Component, input, computed } from '@angular/core';

export type RouterLabTab = 'timeline' | 'guards' | 'resolvers' | 'lazy';

@Component({
  selector: 'app-router-lifecycle-concepts-sidebar',
  standalone: true,
  templateUrl: './router-lifecycle-concepts-sidebar.component.html',
  styleUrl: './router-lifecycle-concepts-sidebar.component.css',
})
export class RouterLifecycleConceptsSidebarComponent {
  readonly activeTab = input<RouterLabTab>('timeline');

  readonly tabLabel = computed(() => {
    const labels: Record<RouterLabTab, string> = {
      timeline: 'Navigation timeline',
      guards: 'Guards',
      resolvers: 'Resolvers',
      lazy: 'Lazy loading',
    };
    return labels[this.activeTab()];
  });
}
