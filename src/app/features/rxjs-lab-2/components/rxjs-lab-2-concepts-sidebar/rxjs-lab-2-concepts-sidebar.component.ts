import { Component, input, computed } from '@angular/core';

export type RxjsLab2Tab =
  | 'filter-distinct'
  | 'search'
  | 'catch-error'
  | 'take'
  | 'combine'
  | 'angular';

@Component({
  selector: 'app-rxjs-lab-2-concepts-sidebar',
  standalone: true,
  templateUrl: './rxjs-lab-2-concepts-sidebar.component.html',
  styleUrl: './rxjs-lab-2-concepts-sidebar.component.css',
})
export class RxjsLab2ConceptsSidebarComponent {
  readonly activeTab = input<RxjsLab2Tab>('filter-distinct');

  readonly tabLabel = computed(() => {
    const t = this.activeTab();
    const labels: Record<RxjsLab2Tab, string> = {
      'filter-distinct': 'distinctUntilChanged',
      search: 'switchMap + debounceTime',
      'catch-error': 'catchError',
      take: 'takeUntil / take(1)',
      combine: 'combineLatest',
      angular: 'Angular',
    };
    return labels[t];
  });
}
