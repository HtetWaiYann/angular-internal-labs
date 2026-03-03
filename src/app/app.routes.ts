import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'change-detection', pathMatch: 'full' },
      {
        path: 'change-detection',
        loadComponent: () =>
          import('./features/change-detection/change-detection-lab.component').then(
            (m) => m.ChangeDetectionLabComponent,
          ),
      },
      {
        path: 'signals',
        loadComponent: () =>
          import('./features/signals/signals-playground.component').then(
            (m) => m.SignalsPlaygroundComponent,
          ),
      },
      {
        path: 'rxjs',
        loadComponent: () =>
          import('./features/rxjs-lab/rxjs-lab.component').then(
            (m) => m.RxjsLabComponent,
          ),
      },
      {
        path: 'rxjs-2',
        loadComponent: () =>
          import('./features/rxjs-lab-2/rxjs-lab-2.component').then(
            (m) => m.RxjsLab2Component,
          ),
      },
      {
        path: 'router',
        loadComponent: () =>
          import(
            './features/router-lifecycle/router-lifecycle-placeholder.component'
          ).then((m) => m.RouterLifecyclePlaceholderComponent),
      },
      {
        path: 'di',
        loadComponent: () =>
          import('./features/di-explorer/di-explorer-placeholder.component').then(
            (m) => m.DiExplorerPlaceholderComponent,
          ),
      },
      {
        path: 'performance',
        loadComponent: () =>
          import('./features/performance/performance-placeholder.component').then(
            (m) => m.PerformancePlaceholderComponent,
          ),
      },
      {
        path: 'replay',
        loadComponent: () =>
          import('./features/replay/replay-placeholder.component').then(
            (m) => m.ReplayPlaceholderComponent,
          ),
      },
    ],
  },
];
