import { Component } from '@angular/core';

interface ScopeItem {
  scope: string;
  where: string;
  whoSees: string;
  color: string;
}

@Component({
  selector: 'app-provider-scope-view',
  templateUrl: './provider-scope-view.component.html',
  styleUrl: './provider-scope-view.component.css',
})
export class ProviderScopeViewComponent {
  readonly scopes: ScopeItem[] = [
    {
      scope: 'providedIn: "root"',
      where: 'RootInjector',
      whoSees: 'Entire app — one instance shared by all',
      color: 'root',
    },
    {
      scope: 'providedIn: SomeModule',
      where: 'Module\'s EnvironmentInjector',
      whoSees: 'That module and its imports — lazy chunks get their own',
      color: 'module',
    },
    {
      scope: 'providers: [MyService]',
      where: 'Component\'s injector',
      whoSees: 'That component + its template children only',
      color: 'component',
    },
  ];
}
