import { Component, signal } from '@angular/core';
import { DiExplorerConceptsSidebarComponent } from './components/di-explorer-concepts-sidebar/di-explorer-concepts-sidebar.component';
import { InjectorHierarchyChartComponent } from './components/injector-hierarchy-chart/injector-hierarchy-chart.component';
import { ProviderScopeViewComponent } from './components/provider-scope-view/provider-scope-view.component';
import { TokenResolutionViewComponent } from './components/token-resolution-view/token-resolution-view.component';
import { InjectionTracingViewComponent } from './components/injection-tracing-view/injection-tracing-view.component';

export type DiExplorerTab = 'hierarchy' | 'scope' | 'resolution' | 'tracing';

@Component({
  selector: 'app-di-explorer-lab',
  imports: [
    DiExplorerConceptsSidebarComponent,
    InjectorHierarchyChartComponent,
    ProviderScopeViewComponent,
    TokenResolutionViewComponent,
    InjectionTracingViewComponent,
  ],
  templateUrl: './di-explorer-lab.component.html',
  styleUrl: './di-explorer-lab.component.css',
})
export class DiExplorerLabComponent {
  readonly activeTab = signal<DiExplorerTab>('hierarchy');
}
