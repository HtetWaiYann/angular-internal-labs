import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  available: boolean;
  description: string;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  private readonly router = inject(Router);

  readonly navDrawerOpen = signal(false);
  readonly conceptsDrawerOpen = signal(false);

  readonly pageTitle = computed(() => {
    const url = this.router.url.split('?')[0];
    const item = this.navItems.find(
      (n) => n.route === url || url.startsWith(n.route + '/')
    );
    return item?.label ?? 'Angular Internals Lab';
  });

  readonly navItems: NavItem[] = [
    {
      label: 'Change Detection',
      route: '/change-detection',
      available: true,
      description: 'Default vs OnPush vs Signal',
    },
    {
      label: 'Signals',
      route: '/signals',
      available: true,
      description: 'Dependency graph',
    },
    {
      label: 'RxJS Lab 1',
      route: '/rxjs',
      available: true,
      description: 'Core concepts + streams',
    },
    {
      label: 'RxJS Lab 2',
      route: '/rxjs-2',
      available: true,
      description: 'Operators + Angular',
    },
    {
      label: 'Router Lifecycle',
      route: '/router',
      available: false,
      description: 'Guards + resolvers',
    },
    {
      label: 'DI Explorer',
      route: '/di',
      available: false,
      description: 'Injector hierarchy',
    },
    {
      label: 'Performance',
      route: '/performance',
      available: false,
      description: 'Profiler + bottleneck detection',
    },
    {
      label: 'Replay Engine',
      route: '/replay',
      available: false,
      description: 'Session recording + playback',
    },
  ];

  toggleNavDrawer(): void {
    this.navDrawerOpen.update((v) => !v);
  }

  closeNavDrawer(): void {
    this.navDrawerOpen.set(false);
  }

  toggleConceptsDrawer(): void {
    this.conceptsDrawerOpen.update((v) => !v);
  }

  closeConceptsDrawer(): void {
    this.conceptsDrawerOpen.set(false);
  }

  constructor() {
    effect(() => {
      const open = this.conceptsDrawerOpen();
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('concepts-drawer-open', open);
      }
    });
  }
}
