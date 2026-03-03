import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RouterLabConfigService } from '../services/router-lab-config.service';

export interface DemoResolvedData {
  message: string;
  resolvedAt: number;
  delayMs: number;
}

export const demoResolver: ResolveFn<DemoResolvedData> = () => {
  const config = inject(RouterLabConfigService);
  const delay = config.resolverDelayMs();
  const data: DemoResolvedData = {
    message: delay > 0 ? `Resolved after a ${delay}ms delay` : 'Resolved immediately',
    resolvedAt: Date.now(),
    delayMs: delay,
  };
  if (delay === 0) return data;
  return new Promise<DemoResolvedData>(resolve => setTimeout(() => resolve(data), delay));
};
