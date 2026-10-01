import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { StudyMaterial, SubjectId, StudyMaterialCategory } from '../types';
import { 
  FileText, 
  Search, 
  Bookmark, 
  Download, 
  BookOpen, 
  Zap, 
  Clock, 
  Award, 
  Filter, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Eye, 
  HelpCircle,
  TrendingUp,
  FileCheck,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  ArrowRight,
  X,
  Calculator,
  Brain,
  Languages,
  Compass,
  FileSpreadsheet
} from 'lucide-react';
import { NotesReaderModal } from '../components/NotesReaderModal';
import { PdfViewerModal } from '../components/PdfViewerModal';
import { downloadStudyDocument } from '../utils/downloadHelper';

export const StudyMaterialsPage: React.FC = () => {
  const { user, toggleBookmark, showToast, activeSubjectFilter } = useApp();
  
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Search
  const [selectedSubject, setSelectedSubject] = useState<string>(activeSubjectFilter || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('recent');
  
  // Modals state
  const [activeReadingNote, setActiveReadingNote] = useState<StudyMaterial | null>(null);
  const [activeViewingPdf, setActiveViewingPdf] = useState<StudyMaterial | null>(null);
  
  // Pagination
  const [visibleCount, setVisibleCount] = useState<number>(12);

  // Load materials from server
  const loadMaterials = async () => {
    setLoading(true);
    try {
      const list = await api.getStudyMaterials({
        subjectId: selectedSubject !== 'all' ? selectedSubject : undefined,
        category: selectedCategory !== 'all' && selectedCategory !== 'bookmarked' ? selectedCategory : undefined,
        resourceType: selectedResourceType !== 'all' ? selectedResourceType : undefined,
        difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        year: selectedYear !== 'all' ? selectedYear : undefined,
        search: searchQuery || undefined,
        sortBy: sortBy || 'recent'
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
  }, [selectedSubject, selectedCategory, selectedResourceType, selectedDifficulty, selectedYear, searchQuery, sortBy]);

  // Featured items for top hero showcase
  const featuredMaterials = useMemo(() => {
    return materials.filter(m => m.isFeatured).slice(0, 3);
  }, [materials]);

  // Subject quick filters
  const subjectList = [
    {
      id: 'quantitative-aptitude',
      name: 'Quantitative Aptitude',
      desc: '24 Topics · Arithmetic, Algebra, Geometry, Trig',
      icon: Calculator,
      color: 'amber',
      accentBg: 'bg-amber-50 text-amber-700 border-amber-200 hover:border-amber-300',
      badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-200'
    },
    {
      id: 'reasoning',
      name: 'Reasoning Ability',
      desc: '23 Topics · Syllogism, Series, Coding, Puzzles',
      icon: Brain,
      color: 'purple',
      accentBg: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300',
      badgeBg: 'bg-indigo-500/10 text-indigo-700 border-indigo-200'
    },
    {
      id: 'english',
      name: 'English Comprehension',
      desc: '25 Topics · Grammar, Vocab, Cloze, Reading',
      icon: Languages,
      color: 'sky',
      accentBg: 'bg-sky-50 text-sky-700 border-sky-200 hover:border-sky-300',
      badgeBg: 'bg-sky-500/10 text-sky-700 border-sky-200'
    },
    {
      id: 'general-awareness',
      name: 'General Awareness',
      desc: '26 Topics · History, Polity, Geography, Science',
      icon: Compass,
      color: 'emerald',
      accentBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300',
      badgeBg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200'
    }
  ];

  // Helper for subject accent styling
  const getSubjectBadge = (subId: SubjectId) => {
    switch (subId) {
      case 'quantitative-aptitude':
        return { label: 'Quant', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'reasoning':
        return { label: 'Reasoning', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'english':
        return { label: 'English', bg: 'bg-sky-50 text-sky-700 border-sky-200' };
      case 'general-awareness':
        return { label: 'Gen Awareness', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      default:
        return { label: 'General', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  const categoriesTabList = [
    { id: 'all', label: 'All Resources' },
    { id: 'Notes', label: 'Subject Notes' },
    { id: 'Formula Book', label: 'Formula Books' },
    { id: 'Quick Revision', label: 'Revision Materials' },
    { id: 'PYQ Collection', label: 'Previous Year Papers' },
    { id: 'Practice PDF', label: 'Practice Sets (01–10)' },
    { id: 'Mock Test PDF', label: 'Mock Test PDFs' },
    { id: 'Revision Capsule', label: 'Revision Capsules' },
    { id: 'bookmarked', label: 'Saved Bookmarks' }
  ];

  // Handle bookmarking
  const handleBookmarkClick = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await toggleBookmark('material', id);
  };

  // Handle direct download
  const handleDownloadClick = (e: React.MouseEvent, item: StudyMaterial) => {
    e.stopPropagation();
    downloadStudyDocument(
      item.title,
      item.subjectId,
      item.topic,
      item.content,
      item.formulas,
      item.shortcuts,
      item.solvedExamples
    );
    showToast({
      type: 'success',
      title: 'Download Started',
      message: `Downloaded "${item.title}". You can revise offline anytime.`
    });
  };

  // Filtered list taking bookmarks tab into account
  const displayedMaterials = useMemo(() => {
    if (selectedCategory === 'bookmarked') {
      return materials.filter(m => user?.bookmarkedMaterialIds.includes(m.id));
    }
    return materials;
  }, [materials, selectedCategory, user?.bookmarkedMaterialIds]);

  const pagedMaterials = displayedMaterials.slice(0, visibleCount);

  return (
    <div className="space-y-8 py-2 text-slate-900">
      
      {/* 1. Header & Digital Library Hero Showcase */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#1E3A8A] text-white border border-slate-800 p-6 sm:p-8 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3B82F6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>SSC CGL Complete Digital Library · Tier-1 & Tier-2</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Notes & PDF Study Materials
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            Access over 200+ authentic exam-focused study resources covering all 98 SSC CGL subjects topics, complete formula books, topic-wise PYQs from 2021–2024, sectional drills, full-length CBT mock PDFs, and 48-hour revision capsules.
          </p>

          {/* Quick Metrics Counter Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
              <div className="text-xl font-black text-amber-400">98</div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Detailed Notes</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
              <div className="text-xl font-black text-purple-400">115+</div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">PDF Books & Sets</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
              <div className="text-xl font-black text-sky-400">15</div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Formula Sheets</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center">
              <div className="text-xl font-black text-emerald-400">50</div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Practice Sets</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-center col-span-2 sm:col-span-1">
              <div className="text-xl font-black text-rose-400">30+</div>
              <div className="text-[10px] text-slate-300 uppercase font-semibold">Mock & PYQ Sets</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Quick Subject Cards Navigator */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Browse by Subject Catalog
            </h2>
          </div>
          {selectedSubject !== 'all' && (
            <button
              onClick={() => setSelectedSubject('all')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            >
              Show All Subjects
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectList.map(sub => {
            const Icon = sub.icon;
            const isSelected = selectedSubject === sub.id;

            return (
              <div
                key={sub.id}
                onClick={() => {
                  setSelectedSubject(isSelected ? 'all' : sub.id);
                  setVisibleCount(12);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected 
                    ? 'bg-blue-50/70 border-blue-500 shadow-md ring-2 ring-blue-500/20' 
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl ${sub.accentBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {sub.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold">
                  <span className={isSelected ? 'text-blue-700 font-bold' : 'text-slate-500'}>
                    {isSelected ? 'Filtered' : 'Click to filter'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-blue-600 rotate-90' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Study Material Showcase */}
      {featuredMaterials.length > 0 && selectedCategory === 'all' && !searchQuery && selectedSubject === 'all' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Recommended by Toppers · High Yield
              </h2>
            </div>
            <span className="text-xs text-blue-600 font-semibold">Must-Revise Before CBT</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredMaterials.map(feat => {
              const badge = getSubjectBadge(feat.subjectId);
              const isSaved = user?.bookmarkedMaterialIds.includes(feat.id);

              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveReadingNote(feat)}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      <span className="text-[10px] font-bold text-blue-700 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {feat.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {feat.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span>{feat.pagesCount || 20} Pages</span>
                      <span>•</span>
                      <span>{feat.questionsCount || 40} Qs</span>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold">{feat.fileSizeFormatted || '2.4 MB'}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveViewingPdf(feat);
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Read PDF</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDownloadClick(e, feat)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Download offline"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleBookmarkClick(e, feat.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-amber-50 text-amber-600 border-amber-300' 
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title="Bookmark"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Category Navigation Tabs */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesTabList.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedCategory(tab.id);
              setVisibleCount(12);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </section>

      {/* 5. Search and Multi-Filter Controls */}
      <section className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        
        {/* Large Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(12);
            }}
            placeholder="Search across 200+ notes, formulas, topics, tricks, or PYQs..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Selectors Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Subject Dropdown */}
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setVisibleCount(12);
              }}
              className="py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All 4 Subjects</option>
              <option value="quantitative-aptitude">Quantitative Aptitude</option>
              <option value="reasoning">General Intelligence & Reasoning</option>
              <option value="english">English Comprehension</option>
              <option value="general-awareness">General Awareness</option>
            </select>

            {/* Resource Type Dropdown */}
            <select
              value={selectedResourceType}
              onChange={(e) => {
                setSelectedResourceType(e.target.value);
                setVisibleCount(12);
              }}
              className="py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Resource Types</option>
              <option value="note">Topic Notes</option>
              <option value="pdf">PDF Books</option>
              <option value="formula-sheet">Formula Sheets</option>
              <option value="pyq">PYQ Papers</option>
              <option value="practice-set">Practice Sets</option>
              <option value="mock-pdf">Mock PDFs</option>
              <option value="capsule">Revision Capsules</option>
            </select>

            {/* Year Dropdown */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setVisibleCount(12);
              }}
              className="py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Years</option>
              <option value="2025">2025 Edition / Model</option>
              <option value="2024">2024 Official Shifts</option>
              <option value="2023">2023 Solved Papers</option>
              <option value="2022">2022 Archive</option>
              <option value="2021">2021 Official</option>
            </select>

            {/* Difficulty Dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setVisibleCount(12);
              }}
              className="py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy Level</option>
              <option value="Medium">Medium Level</option>
              <option value="Hard">Hard / Tier-2 Level</option>
            </select>

            {/* Reset Filters */}
            {(selectedSubject !== 'all' || selectedDifficulty !== 'all' || selectedCategory !== 'all' || selectedResourceType !== 'all' || selectedYear !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSubject('all');
                  setSelectedDifficulty('all');
                  setSelectedCategory('all');
                  setSelectedResourceType('all');
                  setSelectedYear('all');
                  setSearchQuery('');
                  setSortBy('recent');
                }}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="recent">Recently Added</option>
              <option value="views">Most Viewed</option>
              <option value="downloads">Most Downloaded</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="pages">Longest Form (Pages)</option>
              <option value="difficulty">Difficulty Level</option>
              <option value="relevance">Topper Recommended</option>
            </select>
          </div>

        </div>

      </section>

      {/* 6. Materials Grid */}
      <section className="space-y-6">
        
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-900">{pagedMaterials.length}</strong> of <strong className="text-slate-900">{displayedMaterials.length}</strong> study resources
          </span>
          {selectedCategory === 'bookmarked' && (
            <span className="text-amber-600 font-semibold">Your Saved Bookmarks</span>
          )}
        </div>

        {loading ? (
          <div className="py-28 text-center text-xs text-slate-500 animate-pulse">
            Loading digital study library resources...
          </div>
        ) : displayedMaterials.length === 0 ? (
          <div className="py-24 text-center rounded-2xl bg-white border border-slate-200 p-8 space-y-3 shadow-sm">
            <FileText className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Study Materials Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or clearing specific subject, category, and difficulty filters.
            </p>
            <button
              onClick={() => {
                setSelectedSubject('all');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedResourceType('all');
                setSelectedYear('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pagedMaterials.map(item => {
              const badge = getSubjectBadge(item.subjectId);
              const isSaved = user?.bookmarkedMaterialIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveReadingNote(item)}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-600 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {item.category}
                        </span>
                      </div>

                      {item.difficulty && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          item.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.difficulty}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-2">
                        <span>{item.topic}</span>
                        {item.yearRelevance && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600 font-semibold">{item.yearRelevance}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.summary}
                    </p>

                    {/* Meta stats */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span className="font-medium text-slate-700">{item.pagesCount || 14} Pages</span>
                      <span>•</span>
                      <span>{item.questionsCount || 30} Qs</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{item.fileSizeFormatted || '1.8 MB'}</span>
                      <span>•</span>
                      <span>{item.readTimeMinutes} min read</span>
                    </div>

                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReadingNote(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read Note</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveViewingPdf(item);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View PDF</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleDownloadClick(e, item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                        title="Download offline"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleBookmarkClick(e, item.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-amber-50 text-amber-600 border-amber-300' 
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Add to Bookmarks'}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < displayedMaterials.length && (
          <div className="pt-6 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-blue-600 hover:text-blue-700 font-bold text-xs border border-slate-200 shadow-sm transition-all cursor-pointer"
            >
              Load More Study Materials ({displayedMaterials.length - visibleCount} remaining)
            </button>
          </div>
        )}

      </section>

      {/* 7. Active Modals */}
      {activeReadingNote && (
        <NotesReaderModal
          material={activeReadingNote}
          allMaterials={materials}
          onClose={() => setActiveReadingNote(null)}
          onSelectMaterial={(m) => setActiveReadingNote(m)}
          isBookmarked={!!user?.bookmarkedMaterialIds.includes(activeReadingNote.id)}
          onToggleBookmark={() => toggleBookmark('material', activeReadingNote.id)}
        />
      )}

      {activeViewingPdf && (
        <PdfViewerModal
          material={activeViewingPdf}
          relatedMaterials={materials.filter(m => m.subjectId === activeViewingPdf.subjectId && m.id !== activeViewingPdf.id)}
          onClose={() => setActiveViewingPdf(null)}
          onSelectRelated={(m) => setActiveViewingPdf(m)}
          isBookmarked={!!user?.bookmarkedMaterialIds.includes(activeViewingPdf.id)}
          onToggleBookmark={() => toggleBookmark('material', activeViewingPdf.id)}
        />
      )}

    </div>
  );
};
