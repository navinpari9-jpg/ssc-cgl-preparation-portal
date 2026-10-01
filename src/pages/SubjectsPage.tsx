import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SubjectMetadata, SubjectId } from '../types';
import { 
  Brain, 
  BookOpen, 
  Globe, 
  Play, 
  FileText, 
  Search, 
  ArrowRight,
  Sparkles
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

  // Default subject progress mapping
  const subjectProgressMap: Record<SubjectId, number> = {
    'quantitative-aptitude': 74,
    'reasoning': 82,
    'english': 68,
    'general-awareness': 52
  };

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
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="16" height="20" x="4" y="2" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" />
            <path d="M16 10h.01" />
            <path d="M12 10h.01" />
            <path d="M8 10h.01" />
            <path d="M12 14h.01" />
            <path d="M8 14h.01" />
            <path d="M12 18h.01" />
            <path d="M8 18h.01" />
          </svg>
        );
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
      <div className="py-20 text-center text-[#64748B] text-xs">
        Loading syllabus & subjects...
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      
      {/* Page Header */}
      <div>
        <div className="text-xs font-semibold text-[#2563EB]">
          SSC CGL Examination Structure
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] mt-1">
          Subjects & Syllabus Architecture
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Comprehensive curriculum coverage for Tier-1 and Tier-2. Review chapter weightage, formulas, and topic-wise practice questions.
        </p>
      </div>

      {/* Four Required Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map(s => {
          const isSelected = s.id === selectedSubjectId;
          const progress = subjectProgressMap[s.id] || 65;
          const totalQuestions = s.topics.reduce((acc, t) => acc + t.questionCount, 0);

          return (
            <div
              key={s.id}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors ${
                isSelected
                  ? 'border-[#2563EB] ring-1 ring-[#2563EB]'
                  : 'border-[#E2E8F0] hover:border-[#2563EB]/50'
              }`}
            >
              <div>
                {/* Subject Icon & Progress */}
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
                    {getSubjectIcon(s.id)}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0F172A] tabular-nums">
                      {progress}%
                    </span>
                    <div className="text-[10px] text-[#64748B]">completed</div>
                  </div>
                </div>

                {/* Subject Name */}
                <h3 className="font-bold text-sm text-[#0F172A]">
                  {s.name}
                </h3>

                {/* Short Description */}
                <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                  {s.description}
                </p>

                {/* Metadata: Topics & Questions */}
                <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-3">
                  <span>{s.topics.length} Topics</span>
                  <span aria-hidden="true">·</span>
                  <span>{totalQuestions} Questions</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-[#2563EB] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Continue Button */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => setSelectedSubjectId(s.id)}
                  className={`w-full py-2 px-3 rounded-md text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#2563EB] border border-[#E2E8F0]'
                  }`}
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Subject In-Depth Topic Explorer */}
      {activeSubject && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-xs space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0F172A]">
                  {activeSubject.name} Topic Directory
                </h2>
                <span className="text-[11px] text-[#64748B]">
                  Tier 1 Weightage: {activeSubject.weightageTier1}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Explore individual syllabus modules, key formulas, and launch topic-focused practice drills.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setActiveSubjectFilter(selectedSubjectId);
                  setActivePage('practice');
                }}
                className="px-3.5 py-1.5 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Practice All {activeSubject.name}</span>
              </button>

              <button
                onClick={() => {
                  setActiveSubjectFilter(selectedSubjectId);
                  setActivePage('study-materials');
                }}
                className="px-3.5 py-1.5 rounded-md border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Formulas & Notes</span>
              </button>
            </div>
          </div>

          {/* Search bar inside active subject */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-semibold text-[#64748B]">
              Showing {filteredTopics.length} of {activeSubject.topics.length} topics
            </div>

            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder={`Search ${activeSubject.name} topics...`}
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-md text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTopics.map((topic, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB]/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-[#0F172A]">
                      {topic.name}
                    </span>
                    <span className={`text-[10px] font-semibold tabular-nums ${
                      topic.importance === 'High' ? 'text-[#DC2626]' : 'text-[#64748B]'
                    }`}>
                      {topic.importance} Importance
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-[#64748B]">
                    <span>{topic.questionCount} Questions</span>
                    <span aria-hidden="true">·</span>
                    <span>{topic.difficulty} Difficulty</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#E2E8F0] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handlePracticeTopic(topic.name)}
                    className="flex-1 py-1.5 px-2 rounded-md bg-[#2563EB] hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Practice Drill</span>
                  </button>

                  <button
                    onClick={() => handleStudyMaterialTopic(topic.name)}
                    className="py-1.5 px-2.5 rounded-md border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-[#64748B]" />
                    <span>Notes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
