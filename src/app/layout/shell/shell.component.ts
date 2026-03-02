import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
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
  readonly navItems: NavItem[] = [
    {
      label: 'Change Detection',
      icon: '⚡',
      route: '/change-detection',
      available: true,
      description: 'Default vs OnPush vs Signal',
    },
    {
      label: 'Signals Playground',
      icon: '〽',
      route: '/signals',
      available: false,
      description: 'Dependency graph + effects',
    },
    {
      label: 'RxJS Lab',
      icon: '〰',
      route: '/rxjs',
      available: false,
      description: 'Stream builder + timeline',
    },
    {
      label: 'Router Lifecycle',
      icon: '🔀',
      route: '/router',
      available: false,
      description: 'Guards + resolvers',
    },
    {
      label: 'DI Explorer',
      icon: '💉',
      route: '/di',
      available: false,
      description: 'Injector hierarchy',
    },
    {
      label: 'Performance',
      icon: '📊',
      route: '/performance',
      available: false,
      description: 'Profiler + bottleneck detection',
    },
    {
      label: 'Replay Engine',
      icon: '⏮',
      route: '/replay',
      available: false,
      description: 'Session recording + playback',
    },
  ];
}
