
import React from 'react';
import { X, Sparkles, ExternalLink, MessageSquare, ShieldCheck, Share2, BarChart } from 'lucide-react';
import { Article } from '../types';
import { CATEGORY_COLORS, SENTIMENT_COLORS, SENTIMENT_BG } from '../constants';

interface ArticleReaderProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="w-[450px] bg-white border-l border-slate-100 flex flex-col h-full z-30 shadow-2xl animate-in slide-in-from-right-full duration-300 ease-out shrink-0">
      {/* Reader Header */}
      <div className="h-16 border-b flex items-center justify-between px-6 bg-white shrink-0 sticky top-0">
        <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4" />
          Intelligence Brief
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* Main Title Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
             <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-xl ${article.category ? CATEGORY_COLORS[article.category] : 'bg-slate-100'}`}>
              {article.category || 'Categorizing'}
            </span>
            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${article.sentiment ? SENTIMENT_BG[article.sentiment] : 'border-slate-100'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${article.sentiment ? SENTIMENT_COLORS[article.sentiment].replace('text-', 'bg-') : 'bg-slate-300'}`} />
              <span className={article.sentiment ? SENTIMENT_COLORS[article.sentiment] : 'text-slate-400'}>{article.sentiment || 'Analyzing'}</span>
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 leading-[1.15] tracking-tight">
            {article.title}
          </h2>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
            <span className="text-slate-900">{article.source}</span>
            <span>•</span>
            <span>{new Date(article.pubDate).toLocaleDateString()}</span>
          </div>
        </section>

        {/* AI Analysis Summary */}
        <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <MessageSquare className="w-24 h-24 text-blue-600" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Executive Summary</h3>
          </div>
          <p className="text-slate-700 text-lg font-medium leading-relaxed">
            {article.processed ? article.summary : "Analyzing article content for high-level extraction..."}
          </p>
        </section>

        {/* Intelligence Metrics */}
        <section className="space-y-6 pt-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
            <BarChart className="w-4 h-4" /> Intelligence Metrics
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sentiment Weight</span>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-slate-900">{article.sentimentScore ? (article.sentimentScore * 100).toFixed(0) : '0'}</span>
                <span className="text-xs font-bold text-slate-400 mb-1">pts</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${article.sentimentScore && article.sentimentScore > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                  style={{ width: `${Math.abs(article.sentimentScore || 0) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Score</span>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-slate-900">88</span>
                <span className="text-xs font-bold text-slate-400 mb-1">/100</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="w-[88%] h-full bg-blue-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Original Content Fragment */}
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Signal Origin</h3>
          <div className="p-6 rounded-3xl border-2 border-dashed border-slate-100">
            <p className="text-slate-500 text-sm italic leading-relaxed">
              "{article.contentSnippet}"
            </p>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-slate-100 flex items-center gap-3">
          <a 
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-slate-900 text-white rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
          >
            Open Source <ExternalLink className="w-4 h-4" />
          </a>
          <button className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="pb-12 text-center">
          <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Verified Intelligence Report
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;
