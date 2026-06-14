export type FeedbackType = 'bug' | 'feature' | 'ui' | 'other';

export interface FeedbackPayload {
  anonymousUserId: string;
  toolSlug?: string;
  pageUrl: string;
  type: FeedbackType;
  message: string;
  email?: string;
}

export interface FeedbackResponse {
  id: number;
  status: string;
  message: string;
}
