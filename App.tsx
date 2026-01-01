
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Rss, 
  Settings, 
  Bell, 
  Search, 
  RefreshCw, 
  BarChart3,
  Globe,
  Zap
} from 'lucide-react';
import { Article, AppNotification, Category, Sentiment, UserPreferences, RSSSource } from './types';
import { INITIAL_PREFERENCES } from './constants';
import { fetchRssFeed } from './services/rssService';
import { analyzeArticle } from './services/geminiService';
import NewsCard from './components/NewsCard';
import Dashboard from './components/Dashboard';
import AlertSettings from './components/AlertSettings';
import NotificationsPanel from './components/NotificationsPanel';
import ArticleReader from './components/ArticleReader';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'dashboard' | 'settings'>('feed');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment | 'All'>('All');
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('vibenews_prefs');
    return saved ? JSON.parse(saved) : INITIAL_PREFERENCES;
  });
  const [showNotifications, setShowNotifications] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('vibenews_prefs', JSON.stringify(preferences));
  }, [preferences]);

  // RSS Data Fetch
  const refreshFeed = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    const allArticles: Article[] = [];
    
    const activeSources = preferences.sources.filter(s => s.active);
    
    try {
      const results = await Promise.all(
        activeSources.map(source => fetchRssFeed(source.url, source.name))
      );
      results.forEach(items => allArticles.push(...items));

      // Sort by date and unique links
      const sorted = allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      setArticles(prev => {
        const existingLinks = new Set(prev.map(a => a.link));
        const uniqueNew = sorted.filter(a => !existingLinks.has(a.link));
        return [...uniqueNew, ...prev].slice(0, 100);
      });
    } catch (error) {
      console.error("Refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [preferences.sources, isRefreshing]);

  useEffect(() => {
    refreshFeed();
  }, [preferences.sources.filter(s => s.active).length]); 

  // Background Processor for un-analyzed articles
  useEffect(() => {
    const processNext = async () => {
      const unanalyzed = articles.find(a => !a.processed);
      if (unanalyzed) {
        const analysis = await analyzeArticle(unanalyzed);
        setArticles(prev => prev.map(a => 
          a.id === unanalyzed.id 
            ? { ...a, ...analysis, processed: true } 
            : a
        ));

        // Trigger Alerts
        const matchesKeyword = preferences.trackedKeywords.some(k => 
          unanalyzed.title.toLowerCase().includes(k.toLowerCase())
        );
        const extremeSentiment = Math.abs(analysis.sentimentScore) >= preferences.sentimentThreshold;

        if (matchesKeyword && extremeSentiment) {
          const newNotif: AppNotification = {
            id: `notif-${Date.now()}`,
            title: 'Breaking Intel',
            message: `High impact coverage detected: "${unanalyzed.title}" in ${analysis.category}`,
            timestamp: new Date(),
            isRead: false,
            type: 'breaking'
          };
          setNotifications(prev => [newNotif, ...prev]);
        }
      }
    };

    const timer = setTimeout(processNext, 1500);
    return () => clearTimeout(timer);
  }, [articles, preferences]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (a.summary && a.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'All' || a.category === categoryFilter;
      const matchesSentiment = sentimentFilter === 'All' || a.sentiment === sentimentFilter;
      return matchesSearch && matchesCategory && matchesSentiment;
    });
  }, [articles, searchTerm, categoryFilter, sentimentFilter]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const selectedArticle = articles.find(a => a.id === selectedArticleId) || null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 border-r border-white/5">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-white tracking-tighter italic">VibeNEWS</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('feed')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'feed' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-bold">Intelligence Feed</span>
          </button>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-bold">Insights Hub</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold">Configurations</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Network Health</p>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-slate-300 font-medium">{preferences.sources.filter(s => s.active).length} Nodes Connected</span>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 font-mono">GEN-3-FLASH: STANDBY</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white">
        {/* Header */}
        <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 z-20 sticky top-0 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search signals..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500/50 transition-all outline-none font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => refreshFeed()}
              disabled={isRefreshing}
              className={`flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-xs uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 ${isRefreshing ? 'opacity-50' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Syncing' : 'Sync'}
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 text-slate-500 hover:text-blue-600 transition-all rounded-xl hover:bg-blue-50 relative border border-transparent hover:border-blue-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationsPanel 
                  notifications={notifications} 
                  onClose={() => setShowNotifications(false)}
                  onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))}
                />
              )}
            </div>

            <div className="flex items-center gap-3 pl-2">
              <div className="flex flex-col items-end hidden lg:block">
                <span className="text-xs font-black text-slate-900 leading-none">Senior Analyst</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Level 4 Clearance</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper with Reader Layout */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-slate-50/30">
            {activeTab === 'feed' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                      Signal Stream <Zap className="w-8 h-8 text-amber-400 fill-amber-400" />
                    </h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">Global news signals analyzed by AI for sentiment and relevance.</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                    <select 
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as Category | 'All')}
                      className="bg-transparent px-4 py-2 text-xs font-black shadow-none border-none outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">Topics: All</option>
                      <option value="Tech">Tech</option>
                      <option value="Finance">Finance</option>
                      <option value="Politics">Politics</option>
                      <option value="Brands">Brands</option>
                    </select>
                    <div className="w-[1px] h-4 bg-slate-200" />
                    <select 
                      value={sentimentFilter}
                      onChange={(e) => setSentimentFilter(e.target.value as Sentiment | 'All')}
                      className="bg-transparent px-4 py-2 text-xs font-black shadow-none border-none outline-none text-slate-700 cursor-pointer"
                    >
                      <option value="All">Sentiment: All</option>
                      <option value="Positive">Positive</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Negative">Negative</option>
                    </select>
                  </div>
                </div>

                {filteredArticles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border-2 border-dashed border-slate-200 text-center px-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center mb-6">
                      <Rss className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No signals in the pipe</h3>
                    <p className="text-slate-500 max-w-xs font-medium">Try broadening your filters or adding new RSS sources in configurations.</p>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                    >
                      Update Sources
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 pb-12">
                    {filteredArticles.map(article => (
                      <NewsCard 
                        key={article.id} 
                        article={article} 
                        isActive={selectedArticleId === article.id}
                        onSelect={() => setSelectedArticleId(article.id)} 
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div className="max-w-6xl mx-auto">
                <Dashboard articles={articles} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto">
                <AlertSettings preferences={preferences} setPreferences={setPreferences} />
              </div>
            )}
          </div>

          {/* Reader Panel (Sidebar style) */}
          <ArticleReader 
            article={selectedArticle} 
            onClose={() => setSelectedArticleId(null)} 
          />
        </div>
      </main>
    </div>
  );
};

export default App;
