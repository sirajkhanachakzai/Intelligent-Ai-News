
import { Category, Sentiment, RSSSource } from './types';

export const INITIAL_SOURCES: RSSSource[] = [
  { id: '1', name: 'Google News', url: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en', active: true },
  { id: '2', name: 'TechCrunch', url: 'https://techcrunch.com/feed/', active: true },
  { id: '3', name: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', active: true },
  { id: '4', name: 'Engadget', url: 'https://www.engadget.com/rss.xml', active: true },
  { id: '5', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', active: true }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Tech: 'bg-blue-100 text-blue-800',
  Finance: 'bg-emerald-100 text-emerald-800',
  Politics: 'bg-purple-100 text-purple-800',
  Brands: 'bg-orange-100 text-orange-800',
  Other: 'bg-slate-100 text-slate-800',
};

export const SENTIMENT_COLORS: Record<Sentiment, string> = {
  Positive: 'text-emerald-600',
  Neutral: 'text-amber-500',
  Negative: 'text-rose-600',
};

export const SENTIMENT_BG: Record<Sentiment, string> = {
  Positive: 'bg-emerald-50 border-emerald-100',
  Neutral: 'bg-amber-50 border-amber-100',
  Negative: 'bg-rose-50 border-rose-100',
};

export const INITIAL_PREFERENCES = {
  trackedKeywords: ['AI', 'NVIDIA', 'Apple', 'Recession', 'Climate'],
  sentimentThreshold: 0.6,
  alertFrequency: 'instant' as const,
  emailEnabled: true,
  sources: INITIAL_SOURCES
};
