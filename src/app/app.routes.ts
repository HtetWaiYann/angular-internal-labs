import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { demoGuard } from './features/router-lifecycle/guards/demo.guard';
import { demoResolver } from './features/router-lifecycle/resolvers/demo.resolver';

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
            './features/router-lifecycle/router-lifecycle-lab.component'
          ).then((m) => m.RouterLifecycleLabComponent),
        canActivate: [demoGuard],
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'timeline' },
          {
            path: 'timeline',
            loadComponent: () =>
              import(
                './features/router-lifecycle/components/router-timeline-view/router-timeline-view.component'
              ).then((m) => m.RouterTimelineViewComponent),
          },
          {
            path: 'guarded',
            canActivate: [demoGuard],
            loadComponent: () =>
              import(
                './features/router-lifecycle/components/router-guarded-view/router-guarded-view.component'
              ).then((m) => m.RouterGuardedViewComponent),
          },
          {
            path: 'resolved',
            resolve: { demoData: demoResolver },
            loadComponent: () =>
              import(
                './features/router-lifecycle/components/router-resolved-view/router-resolved-view.component'
              ).then((m) => m.RouterResolvedViewComponent),
          },
          {
            path: 'lazy',
            loadChildren: () =>
              import('./features/router-lifecycle/router-lazy.routes').then(
                (m) => m.ROUTER_LAZY_ROUTES,
              ),
          },
        ],
      },
      {
        path: 'di',
        loadComponent: () =>
          import('./features/di-explorer/di-explorer-lab.component').then(
            (m) => m.DiExplorerLabComponent,
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
