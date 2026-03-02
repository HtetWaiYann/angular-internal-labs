export type RenderStrategy = 'default' | 'onpush' | 'signal';

export interface RenderLogEntry {
  id: string;
  trigger: string;
  strategies: RenderStrategy[];
  timestamp: number;
}
