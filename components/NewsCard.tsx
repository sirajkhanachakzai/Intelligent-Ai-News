
import React from 'react';
import { ExternalLink, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { Article } from '../types';
import { CATEGORY_COLORS, SENTIMENT_COLORS, SENTIMENT_BG } from '../constants';

interface NewsCardProps {
  article: Article;
  onSelect: () => void;
  isActive?: boolean;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, onSelect, isActive }) => {
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMin = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMin / 60);

    if (diffInHours > 24) return `${Math.floor(diffInHours / 24)}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    return `${diffInMin}m ago`;
  };

  return (
    <div 
      onClick={onSelect}
      className={`group relative bg-white rounded-3xl p-6 shadow-sm border transition-all hover:shadow-xl cursor-pointer overflow-hidden ${isActive ? 'ring-2 ring-blue-500 border-transparent shadow-blue-500/10' : 'hover:border-slate-300'} ${!article.processed ? 'animate-pulse opacity-80' : ''}`}
    >
      {!article.processed && (
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-2xl">
            <Sparkles className="w-3 h-3 animate-pulse text-blue-400" />
            Decoding Signal...
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg ${article.category ? CATEGORY_COLORS[article.category] : 'bg-slate-100 text-slate-500'}`}>
              {article.category || 'SCANNIG'}
            </span>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              {timeAgo(article.pubDate)}
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">• {article.source}</span>
          </div>
          
          {article.sentiment && (
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border-2 ${SENTIMENT_BG[article.sentiment]}`}>
              <div className={`w-2 h-2 rounded-full ${SENTIMENT_COLORS[article.sentiment].replace('text-', 'bg-')}`} />
              <span className={SENTIMENT_COLORS[article.sentiment]}>{article.sentiment}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-[1.2] pr-6">
            {article.title}
          </h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-2">
            {article.processed ? article.summary : article.contentSnippet}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
              <ChevronRight className={`w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-all ${isActive ? 'rotate-90 text-blue-500' : ''}`} />
            </div>
            <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest transition-colors">
              {article.processed ? 'View Brief' : 'Processing...'}
            </span>
          </div>
          
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-slate-300 hover:text-blue-500 transition-all hover:bg-blue-50 rounded-xl"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
