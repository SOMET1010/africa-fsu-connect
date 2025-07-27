export interface DemoStep {
  id: string;
  title: string;
  duration: number; // en minutes
  description: string;
  route: string;
  actions: string[];
  keyPoints: string[];
  assistantMessage: string;
  icon: any;
}