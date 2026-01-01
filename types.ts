
export type Sentiment = 'Positive' | 'Neutral' | 'Negative';

export type Category = 'Tech' | 'Finance' | 'Politics' | 'Brands' | 'Other';

export interface RSSSource {
  id: string;
  name: string;
  url: string;
  active: boolean;
}

export interface Article {
  id: string;
  title: string;
  link: string;
  source: string;
  pubDate: string;
  contentSnippet: string;
  // AI Enhanced Fields
  summary?: string;
  sentiment?: Sentiment;
  sentimentScore?: number; // -1 to 1
  category?: Category;
  processed: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  type: 'breaking' | 'digest' | 'system';
}

export interface UserPreferences {
  trackedKeywords: string[];
  sentimentThreshold: number; // 0 to 1
  alertFrequency: 'instant' | 'daily';
  emailEnabled: boolean;
  sources: RSSSource[];
}

export interface SentimentDataPoint {
  date: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}
