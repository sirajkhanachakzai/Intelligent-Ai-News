
import React, { useState } from 'react';
import { UserPreferences, RSSSource } from '../types';
import { BellRing, Mail, ShieldAlert, X, Plus, Rss, Trash2, Check, ExternalLink } from 'lucide-react';

interface AlertSettingsProps {
  preferences: UserPreferences;
  setPreferences: (p: UserPreferences) => void;
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ preferences, setPreferences }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  const addKeyword = () => {
    if (newKeyword && !preferences.trackedKeywords.includes(newKeyword)) {
      setPreferences({
        ...preferences,
        trackedKeywords: [...preferences.trackedKeywords, newKeyword]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (kw: string) => {
    setPreferences({
      ...preferences,
      trackedKeywords: preferences.trackedKeywords.filter(k => k !== kw)
    });
  };

  const addSource = () => {
    if (newSourceName && newSourceUrl) {
      const newSource: RSSSource = {
        id: `source-${Date.now()}`,
        name: newSourceName,
        url: newSourceUrl,
        active: true
      };
      setPreferences({
        ...preferences,
        sources: [...preferences.sources, newSource]
      });
      setNewSourceName('');
      setNewSourceUrl('');
    }
  };

  const toggleSource = (id: string) => {
    setPreferences({
      ...preferences,
      sources: preferences.sources.map(s => s.id === id ? { ...s, active: !s.active } : s)
    });
  };

  const removeSource = (id: string) => {
    setPreferences({
      ...preferences,
      sources: preferences.sources.filter(s => s.id !== id)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <div className="border-b pb-6 mb-8">
          <h2 className="text-2xl font-black text-slate-900">Intelligence Preferences</h2>
          <p className="text-slate-500 text-sm">Configure how the AI agent monitors signals and manages RSS data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* RSS Sources */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <Rss className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">RSS Data Ingestion</h3>
            </div>
            
            <div className="space-y-3">
              {preferences.sources.map(source => (
                <div key={source.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                      onClick={() => toggleSource(source.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${source.active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}
                    >
                      {source.active && <Check className="w-3.5 h-3.5" />}
                    </button>
                    <div className="overflow-hidden">
                      <p className={`text-sm font-bold ${source.active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>{source.name}</p>
                      <p className="text-[10px] text-slate-400 truncate w-48">{source.url}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => removeSource(source.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase">Add New Intelligence Source</p>
              <div className="grid grid-cols-1 gap-2">
                <input 
                  type="text" 
                  placeholder="Source Name (e.g. BBC News)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="RSS Feed URL"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={newSourceUrl}
                    onChange={(e) => setNewSourceUrl(e.target.value)}
                  />
                  <button 
                    onClick={addSource}
                    disabled={!newSourceName || !newSourceUrl}
                    className="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-30"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Keyword Tracking & Alerts */}
          <section className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Priority Keywords</h3>
              </div>
              <p className="text-xs text-slate-500">The AI agent triggers alerts when these terms appear in high-sentiment signals.</p>
              
              <div className="flex flex-wrap gap-2">
                {preferences.trackedKeywords.map(kw => (
                  <span key={kw} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="hover:text-rose-500 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="text" 
                  placeholder="Add keyword..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                />
                <button 
                  onClick={addKeyword}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <BellRing className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Alert Logic</h3>
              </div>
              
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold text-slate-500 uppercase">Sentiment Threshold ({Math.round(preferences.sentimentThreshold * 100)}%)</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    className="w-full mt-3 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={preferences.sentimentThreshold}
                    onChange={(e) => setPreferences({...preferences, sentimentThreshold: parseFloat(e.target.value)})}
                  />
                </label>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-900">Email Digest</p>
                      <p className="text-[10px] text-slate-500">Daily summaries</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPreferences({...preferences, emailEnabled: !preferences.emailEnabled})}
                    className={`w-10 h-5 rounded-full transition-colors relative ${preferences.emailEnabled ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${preferences.emailEnabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Check className="w-4 h-4 text-emerald-500" />
            Preferences synced with cloud agent
          </div>
          <button className="w-full sm:w-auto px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
            Save All Configurations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;
