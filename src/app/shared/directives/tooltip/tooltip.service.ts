import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const SHOW_DELAY_MS = 350;
const HIDE_DELAY_MS = 100;
const TOOLTIP_OFFSET = 8;

@Injectable({ providedIn: 'root' })
export class TooltipService {
  private readonly platformId = inject(PLATFORM_ID);
  private container: HTMLDivElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private currentHost: HTMLElement | null = null;

  show(host: HTMLElement, text: string): void {
    if (!isPlatformBrowser(this.platformId) || !text?.trim()) return;

    this.cancelTimers();
    this.hideImmediate();

    this.showTimer = setTimeout(() => {
      this.showTimer = null;
      this.currentHost = host;
      this.createOrUpdate(text);
      this.position(host);
      requestAnimationFrame(() => {
        this.container?.classList.add('tooltip-visible');
      });
    }, SHOW_DELAY_MS);
  }

  hide(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.cancelTimers();
    this.hideTimer = setTimeout(() => {
      this.hideTimer = null;
      this.container?.classList.remove('tooltip-visible');
      this.currentHost = null;
    }, HIDE_DELAY_MS);
  }

  hideImmediate(): void {
    this.cancelTimers();
    this.container?.classList.remove('tooltip-visible');
    this.currentHost = null;
  }

  isShowingFor(host: HTMLElement): boolean {
    return this.currentHost === host;
  }

  private cancelTimers(): void {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private createOrUpdate(text: string): void {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'app-tooltip';
      this.container.setAttribute('role', 'tooltip');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
    this.container.textContent = text;
  }

  private position(host: HTMLElement): void {
    if (!this.container) return;

    const rect = host.getBoundingClientRect();
    const tooltipRect = this.container.getBoundingClientRect();
    const viewport = { w: window.innerWidth, h: window.innerHeight };

    let x = rect.left + rect.width / 2 - tooltipRect.width / 2;
    let y = rect.top - tooltipRect.height - TOOLTIP_OFFSET;

    const padding = 12;
    if (x < padding) x = padding;
    if (x + tooltipRect.width > viewport.w - padding) x = viewport.w - tooltipRect.width - padding;
    if (y < padding) {
      y = rect.bottom + TOOLTIP_OFFSET;
      this.container.classList.add('tooltip-below');
    } else {
      this.container.classList.remove('tooltip-below');
    }
    if (y + tooltipRect.height > viewport.h - padding) y = viewport.h - tooltipRect.height - padding;

    this.container.style.position = 'fixed';
    this.container.style.left = `${x}px`;
    this.container.style.top = `${y}px`;
  }
}
