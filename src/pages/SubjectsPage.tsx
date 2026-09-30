import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SubjectMetadata, SubjectId } from '../types';
import { 
  Calculator, 
  Brain, 
  BookOpen, 
  Globe, 
  Play, 
  FileText, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  BarChart, 
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const SubjectsPage: React.FC = () => {
  const { 
    activeSubjectFilter, 
    setActiveSubjectFilter, 
    setActiveTopicFilter, 
    setActivePage 
  } = useApp();

  const [subjects, setSubjects] = useState<SubjectMetadata[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId>(
    (activeSubjectFilter as SubjectId) || 'quantitative-aptitude'
  );
  const [searchTopic, setSearchTopic] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subs = await api.getSubjects();
        setSubjects(subs);
      } catch (err) {
        console.error('Failed to load subjects:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSubjects();
  }, []);

  useEffect(() => {
    if (activeSubjectFilter) {
      setSelectedSubjectId(activeSubjectFilter as SubjectId);
    }
  }, [activeSubjectFilter]);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const filteredTopics = activeSubject?.topics.filter(t => 
    t.name.toLowerCase().includes(searchTopic.toLowerCase())
  ) || [];

  const handlePracticeTopic = (topicName: string) => {
    setActiveSubjectFilter(selectedSubjectId);
    setActiveTopicFilter(topicName);
    setActivePage('practice');
  };

  const handleStudyMaterialTopic = (topicName: string) => {
    setActiveSubjectFilter(selectedSubjectId);
    setActiveTopicFilter(topicName);
    setActivePage('study-materials');
  };

  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'quantitative-aptitude':
        return <Calculator className="w-5 h-5" />;
      case 'reasoning':
        return <Brain className="w-5 h-5" />;
      case 'english':
        return <BookOpen className="w-5 h-5" />;
      case 'general-awareness':
        return <Globe className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs">
        Loading syllabus & subjects...
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <span>SSC CGL Syllabus Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Syllabus & Topic Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select any of the 4 Tier-1 exam sections to review detailed topics, formulas, and topic-wise practice sets.
        </p>
      </div>

      {/* 4 Primary Subject Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {subjects.map(s => {
          const isSelected = s.id === selectedSubjectId;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedSubjectId(s.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'}`}>
                    {getSubjectIcon(s.id)}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                    {s.topics.length} Topics
                  </span>
                </div>
                <h3 className="font-bold text-sm tracking-tight">{s.name}</h3>
                <p className={`text-[11px] mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                  {s.subtitle || `${s.topics.length} Syllabus Chapters`}
                </p>
              </div>

              <div className={`mt-3 pt-2 text-[10px] border-t font-semibold ${isSelected ? 'border-white/20 text-indigo-100' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                Weightage: {s.weightageTier1}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Subject Overview & Topic Directory */}
      {activeSubject && (
        <div className="space-y-6">
          
          {/* Active Subject Description Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {activeSubject.name} Overview
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                  {activeSubject.weightageTier1}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
                {activeSubject.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveSubjectFilter(selectedSubjectId);
                  setActivePage('practice');
                }}
                className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Practice All {activeSubject.name}</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubjectFilter(selectedSubjectId);
                  setActivePage('study-materials');
                }}
                className="py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Formulas & Notes</span>
              </button>
            </div>
          </div>

          {/* Search topics in active subject */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Showing {filteredTopics.length} of {activeSubject.topics.length} Topics
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeSubject.name} topics...`}
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTopics.map((topic, idx) => {
              const isHigh = topic.importance === 'High';
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400/60 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {topic.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isHigh
                          ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {topic.importance} Weightage
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{topic.questionCount} Questions in Bank</span>
                      <span>·</span>
                      <span>{topic.difficulty}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handlePracticeTopic(topic.name)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-indigo-600 dark:fill-indigo-400" />
                      <span>Practice Drill</span>
                    </button>

                    <button
                      onClick={() => handleStudyMaterialTopic(topic.name)}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Formulas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
