export interface ActivityType {
  sessionId: string;
  timestamp: number;
  type: 'typing' | 'paste' | 'copy' | 'tabLeave' | 'tabReturn';
  data: string;
}

export interface SimilarityReport {
  sessionId: string;
  timestamp: number;
  similarityScore: number;
  algorithm: string;
  suspiciousLines: number[];
  matchedWith?: string;
  details?: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}