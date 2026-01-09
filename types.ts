
export interface PromptSuite {
  midjourney: string;
  stableDiffusion: string;
  veo: string;
}

export interface VideoSegment {
  timestamp: string; // e.g., "00:00 - 00:05"
  description: string;
  visualStyle: string;
  lighting: string;
  cameraWork: string;
  generatedPrompts: PromptSuite;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  videoName: string;
  overallSummary: string;
  segments: VideoSegment[];
}

export type AppView = 'dashboard' | 'workspace' | 'history' | 'settings' | 'pricing';

export interface DashboardStats {
  totalAnalyzed: number;
  promptsGenerated: number;
  storageUsed: string;
  remainingCredits: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'Free' | 'Standard' | 'Pro' | 'Enterprise';
}
