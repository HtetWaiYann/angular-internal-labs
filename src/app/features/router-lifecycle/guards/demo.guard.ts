import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { RouterLabConfigService } from '../services/router-lab-config.service';

export const demoGuard: CanActivateFn = () => {
  const config = inject(RouterLabConfigService);
  const delay = config.guardDelayMs();
  if (delay === 0) return true;
  return new Promise<boolean>(resolve => setTimeout(() => resolve(true), delay));
};
