import { Routes } from '@angular/router';

export const ROUTER_LAZY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/router-lazy-view/router-lazy-view.component').then(
        (m) => m.RouterLazyViewComponent
      ),
  },
];
