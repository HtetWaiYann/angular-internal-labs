import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  GuardsCheckStart,
  GuardsCheckEnd,
  ResolveStart,
  ResolveEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  RoutesRecognized,
} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// ── Interfaces ──────────────────────────────────────────────────────────────

export interface TimelineEntry {
  id: string;
  /** ms elapsed since NavigationStart (not absolute uptime) */
  elapsed: number;
  label: string;
  type: 'navigation' | 'guard' | 'resolver' | 'lazy' | 'route-recognized';
  url?: string;
  detail?: string;
  /** Only present on "end" events that pair with a "start" */
  duration?: number;
}

export interface GuardPhase {
  navId: number;
  url: string;
  duration: number;
}

export interface ResolverPhase {
  navId: number;
  url: string;
  duration: number;
}

export interface LazyLoadPhase {
  path: string;
  duration: number;
}

export interface NavSummary {
  navId: number;
  url: string;
  totalDuration: number;
  guardDuration: number | null;
  resolverDuration: number | null;
  lazyDuration: number | null;
  outcome: 'complete' | 'cancelled' | 'error';
}

// ── Service ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class RouterLifecycleStateService {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  /** Events for the navigation currently in progress (resets on NavigationStart) */
  readonly currentNavTimeline = signal<TimelineEntry[]>([]);
  readonly guardPhases = signal<GuardPhase[]>([]);
  readonly resolverPhases = signal<ResolverPhase[]>([]);
  readonly lazyLoadPhases = signal<LazyLoadPhase[]>([]);
  readonly currentUrl = signal<string>('');
  readonly lastNavSummary = signal<NavSummary | null>(null);

  private idCounter = 0;
  private navStartPerf = 0;
  private currentNavId = 0;

  private guardStartPerf: number | null = null;
  private guardStartUrl = '';
  private resolveStartPerf: number | null = null;
  private lazyStartPerf: number | null = null;
  private lazyPath: string | null = null;

  private currentGuardDuration: number | null = null;
  private currentResolverDuration: number | null = null;
  private currentLazyDuration: number | null = null;

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(e => this.handleEvent(e));
    this.currentUrl.set(this.router.url);
  }

  private ms(perf: number): number {
    return parseFloat((perf - this.navStartPerf).toFixed(2));
  }

  private dur(start: number, end: number): number {
    return parseFloat((end - start).toFixed(2));
  }

  private handleEvent(e: RouterEvent): void {
    const perf = performance.now();

    if (e instanceof NavigationStart) {
      this.navStartPerf = perf;
      this.currentNavId = e.id;
      this.guardStartPerf = null;
      this.resolveStartPerf = null;
      this.lazyStartPerf = null;
      this.lazyPath = null;
      this.currentGuardDuration = null;
      this.currentResolverDuration = null;
      this.currentLazyDuration = null;
      this.currentNavTimeline.set([]);
      this.addEntry(0, 'NavigationStart', 'navigation', e.url);
    } else if (e instanceof RoutesRecognized) {
      this.addEntry(this.ms(perf), 'RoutesRecognized', 'route-recognized', e.urlAfterRedirects);
    } else if (e instanceof GuardsCheckStart) {
      this.guardStartPerf = perf;
      this.guardStartUrl = e.url;
      this.addEntry(this.ms(perf), 'GuardsCheckStart', 'guard', e.url);
    } else if (e instanceof GuardsCheckEnd) {
      const duration = this.guardStartPerf !== null ? this.dur(this.guardStartPerf, perf) : 0;
      this.currentGuardDuration = duration;
      this.addEntry(this.ms(perf), 'GuardsCheckEnd', 'guard', e.url, undefined, duration);
      if (this.guardStartPerf !== null) {
        this.guardPhases.update(phases =>
          [{ navId: this.currentNavId, url: this.guardStartUrl, duration }, ...phases].slice(0, 20),
        );
        this.guardStartPerf = null;
      }
    } else if (e instanceof ResolveStart) {
      this.resolveStartPerf = perf;
      this.addEntry(this.ms(perf), 'ResolveStart', 'resolver', e.url);
    } else if (e instanceof ResolveEnd) {
      const duration = this.resolveStartPerf !== null ? this.dur(this.resolveStartPerf, perf) : 0;
      this.currentResolverDuration = duration;
      this.addEntry(this.ms(perf), 'ResolveEnd', 'resolver', e.url, undefined, duration);
      if (this.resolveStartPerf !== null) {
        this.resolverPhases.update(phases =>
          [{ navId: this.currentNavId, url: e.url, duration }, ...phases].slice(0, 20),
        );
        this.resolveStartPerf = null;
      }
    } else if (e instanceof RouteConfigLoadStart) {
      const route = (e as unknown as { route?: { path?: string } }).route;
      this.lazyPath = route?.path ?? 'chunk';
      this.lazyStartPerf = perf;
      this.addEntry(this.ms(perf), 'RouteConfigLoadStart', 'lazy', undefined, this.lazyPath);
    } else if (e instanceof RouteConfigLoadEnd) {
      const duration = this.lazyStartPerf !== null ? this.dur(this.lazyStartPerf, perf) : 0;
      this.currentLazyDuration = duration;
      this.addEntry(
        this.ms(perf),
        'RouteConfigLoadEnd',
        'lazy',
        undefined,
        this.lazyPath ?? undefined,
        duration,
      );
      if (this.lazyPath !== null) {
        this.lazyLoadPhases.update(phases =>
          [{ path: this.lazyPath!, duration }, ...phases].slice(0, 20),
        );
        this.lazyPath = null;
        this.lazyStartPerf = null;
      }
    } else if (e instanceof NavigationEnd) {
      const totalDuration = this.dur(this.navStartPerf, perf);
      this.addEntry(this.ms(perf), 'NavigationEnd', 'navigation', e.urlAfterRedirects);
      this.currentUrl.set(e.urlAfterRedirects);
      this.lastNavSummary.set({
        navId: this.currentNavId,
        url: e.urlAfterRedirects,
        totalDuration,
        guardDuration: this.currentGuardDuration,
        resolverDuration: this.currentResolverDuration,
        lazyDuration: this.currentLazyDuration,
        outcome: 'complete',
      });
    } else if (e instanceof NavigationCancel) {
      const totalDuration = this.dur(this.navStartPerf, perf);
      this.addEntry(this.ms(perf), 'NavigationCancel', 'navigation', e.url, e.reason ?? undefined);
      this.lastNavSummary.set({
        navId: this.currentNavId,
        url: e.url,
        totalDuration,
        guardDuration: this.currentGuardDuration,
        resolverDuration: this.currentResolverDuration,
        lazyDuration: this.currentLazyDuration,
        outcome: 'cancelled',
      });
    } else if (e instanceof NavigationError) {
      const totalDuration = this.dur(this.navStartPerf, perf);
      this.addEntry(this.ms(perf), 'NavigationError', 'navigation', e.url, e.error?.message);
      this.lastNavSummary.set({
        navId: this.currentNavId,
        url: e.url,
        totalDuration,
        guardDuration: this.currentGuardDuration,
        resolverDuration: this.currentResolverDuration,
        lazyDuration: this.currentLazyDuration,
        outcome: 'error',
      });
    }
  }

  private addEntry(
    elapsed: number,
    label: string,
    type: TimelineEntry['type'],
    url?: string,
    detail?: string,
    duration?: number,
  ): void {
    const entry: TimelineEntry = {
      id: `e-${++this.idCounter}`,
      elapsed,
      label,
      type,
      url,
      detail,
      duration,
    };
    this.currentNavTimeline.update(entries => [...entries, entry]);
  }

  clearAll(): void {
    this.currentNavTimeline.set([]);
    this.guardPhases.set([]);
    this.resolverPhases.set([]);
    this.lazyLoadPhases.set([]);
    this.lastNavSummary.set(null);
  }
}
