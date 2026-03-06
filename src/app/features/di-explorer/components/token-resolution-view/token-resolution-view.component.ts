import { Component, signal, computed } from '@angular/core';

interface ResolutionStep {
  injector: string;
  found: boolean;
  detail: string;
}

@Component({
  selector: 'app-token-resolution-view',
  templateUrl: './token-resolution-view.component.html',
  styleUrl: './token-resolution-view.component.css',
})
export class TokenResolutionViewComponent {
  readonly isResolving = signal(false);
  readonly currentStep = signal(0);
  readonly resolutionComplete = signal(false);

  private readonly steps: ResolutionStep[] = [
    { injector: 'ComponentInjector', found: false, detail: 'No provider for LoggerService' },
    { injector: 'EnvironmentInjector', found: false, detail: 'No provider for LoggerService' },
    { injector: 'RootInjector', found: true, detail: 'Found! providedIn: "root"' },
  ];

  readonly displaySteps = computed(() => {
    const step = this.currentStep();
    const complete = this.resolutionComplete();
    return this.steps.map((s, i) => ({
      ...s,
      isActive: complete ? i === 2 : i === step,
      isPast: complete && i < 2,
      isCurrent: !complete && i === step,
    }));
  });

  readonly STEP_DELAY = 800;

  resolve(): void {
    this.isResolving.set(true);
    this.currentStep.set(0);
    this.resolutionComplete.set(false);

    let t = 0;
    for (let i = 0; i < this.steps.length; i++) {
      const step = i;
      setTimeout(() => this.currentStep.set(step), t);
      t += this.STEP_DELAY;
    }
    setTimeout(() => {
      this.resolutionComplete.set(true);
      this.isResolving.set(false);
    }, t);
  }

  reset(): void {
    this.isResolving.set(false);
    this.currentStep.set(0);
    this.resolutionComplete.set(false);
  }
}
