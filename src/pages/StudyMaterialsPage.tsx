import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { StudyMaterial, SubjectId } from '../types';
import { 
  FileText, 
  Search, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Zap, 
  BookOpen, 
  X, 
  Download, 
  Share2, 
  Check 
} from 'lucide-react';

export const StudyMaterialsPage: React.FC = () => {
  const { user, toggleBookmark, showToast, activeSubjectFilter } = useApp();
  
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>(activeSubjectFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMaterial, setActiveMaterial] = useState<StudyMaterial | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const list = await api.getStudyMaterials({
        subjectId: selectedSubject !== 'all' ? selectedSubject : undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined
      });
      setMaterials(list);
    } catch (err) {
      console.error('Failed to load study materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [selectedSubject, selectedCategory, searchQuery]);

  const toggleCompleted = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedIds(prev => {
      const isDone = prev.includes(id);
      const next = isDone ? prev.filter(x => x !== id) : [...prev, id];
      showToast({
        type: 'info',
        title: isDone ? 'Marked Incomplete' : 'Completed!',
        message: isDone ? 'Removed from completed modules.' : 'Module marked as mastered.'
      });
      return next;
    });
  };

  const categories = ['Notes', 'Formulas', 'Short Tricks', 'Vocabulary', 'Static GK', 'PYQ Analysis'];

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>High-Yield Revision Library</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Formulas, Short Tricks & Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hand-crafted formula pocket sheets, 15-second shortcut tricks, English grammar rules, and Static GK capsules.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Subjects</option>
            <option value="quantitative-aptitude">Quantitative Aptitude</option>
            <option value="reasoning">General Intelligence & Reasoning</option>
            <option value="english">English Language</option>
            <option value="general-awareness">General Awareness</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search formulas or tricks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

      </div>

      {/* Materials Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading library...</div>
      ) : materials.length === 0 ? (
        <div className="py-20 text-center text-xs text-slate-500">
          No materials matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map(mat => {
            const isSaved = user?.bookmarkedMaterialIds.includes(mat.id);
            const isCompleted = completedIds.includes(mat.id);

            return (
              <div
                key={mat.id}
                onClick={() => setActiveMaterial(mat)}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                      {mat.category}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark('material', mat.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isSaved ? 'text-amber-500 border-amber-300' : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                        title="Save for revision"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-500' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => toggleCompleted(mat.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isCompleted ? 'text-emerald-500 border-emerald-300' : 'text-slate-400 border-transparent hover:text-slate-600'
                        }`}
                        title="Mark as completed"
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'fill-emerald-500 text-white' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {mat.summary}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{mat.readTimeMinutes} min read</span>
                  </span>

                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Read Notes →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Material Modal Viewer */}
      {activeMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activeMaterial.subjectId.toUpperCase().replace('-', ' ')} · {activeMaterial.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                  {activeMaterial.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span>{activeMaterial.readTimeMinutes} min read</span>
                  <span>·</span>
                  <span>Updated {activeMaterial.updatedAt}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveMaterial(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="flex-1 overflow-y-auto py-5 space-y-4 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed pr-2">
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 font-medium text-indigo-900 dark:text-indigo-200">
                {activeMaterial.summary}
              </div>

              <div className="whitespace-pre-wrap font-sans">
                {activeMaterial.content}
              </div>

              {activeMaterial.keyPoints && activeMaterial.keyPoints.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                    Golden Exam Takeaways:
                  </div>
                  <ul className="space-y-1.5">
                    {activeMaterial.keyPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => toggleBookmark('material', activeMaterial.id)}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600"
              >
                <Bookmark className="w-4 h-4" />
                <span>Bookmark Article</span>
              </button>

              <button
                onClick={() => {
                  showToast({ type: 'success', message: 'PDF study capsule download triggered.' });
                }}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Offline Capsule</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
