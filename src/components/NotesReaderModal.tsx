import React, { useState, useEffect, useRef } from 'react';
import { StudyMaterial } from '../types';
import { 
  X, 
  Bookmark, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Zap, 
  AlertTriangle, 
  Lightbulb, 
  BookOpen, 
  Eye, 
  EyeOff,
  Maximize2,
  Minimize2,
  Type
} from 'lucide-react';
import { downloadStudyDocument } from '../utils/downloadHelper';

interface NotesReaderModalProps {
  material: StudyMaterial;
  allMaterials: StudyMaterial[];
  onClose: () => void;
  onSelectMaterial: (m: StudyMaterial) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const NotesReaderModal: React.FC<NotesReaderModalProps> = ({
  material,
  allMaterials,
  onClose,
  onSelectMaterial,
  isBookmarked,
  onToggleBookmark
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState<string>('sec-intro');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [readingProgress, setReadingProgress] = useState(0);
  const [showToc, setShowToc] = useState(true);

  const contentRef = useRef<HTMLDivElement>(null);

  // Calculate read progression
  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
      setReadingProgress(isNaN(progress) ? 0 : progress);
    }
  };

  // Find previous and next topics in the same subject
  const sameSubjectList = allMaterials.filter(m => m.subjectId === material.subjectId);
  const currentIndex = sameSubjectList.findIndex(m => m.id === material.id);
  const prevMaterial = currentIndex > 0 ? sameSubjectList[currentIndex - 1] : null;
  const nextMaterial = currentIndex < sameSubjectList.length - 1 ? sameSubjectList[currentIndex + 1] : null;

  const toggleSolution = (id: string) => {
    setRevealedSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = () => {
    downloadStudyDocument(
      material.title,
      material.subjectId,
      material.topic,
      material.content,
      material.formulas,
      material.shortcuts,
      material.solvedExamples
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-6xl h-[92vh] bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <header className="h-16 px-4 sm:px-6 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[11px] font-bold shrink-0">
              {material.category}
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {material.title}
              </h2>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{material.topic}</span>
                <span>•</span>
                <span>{material.readTimeMinutes} min read</span>
                {material.difficulty && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{material.difficulty}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => setFontSize('sm')}
                className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer ${fontSize === 'sm' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Small text"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer ${fontSize === 'base' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Standard text"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer ${fontSize === 'lg' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Large text"
              >
                A+
              </button>
            </div>

            {/* Bookmark */}
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isBookmarked ? 'Saved to Bookmarks' : 'Save Bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Download Note Document"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
              aria-label="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </header>

        {/* Reading Progress Line */}
        <div className="w-full h-1 bg-slate-800 shrink-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        {/* Main Workspace: Left TOC Sidebar + Center Reading Column */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Table of Contents Column */}
          {showToc && (
            <aside className="w-64 bg-slate-950/70 border-r border-slate-800 p-4 overflow-y-auto hidden md:block shrink-0">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                Table of Contents
              </div>
              
              <nav className="space-y-1">
                {(material.tableOfContents || [
                  { id: 'sec-intro', title: '1. Topic Fundamentals' },
                  { id: 'sec-formulas', title: '2. High-Yield Formulas' },
                  { id: 'sec-shortcuts', title: '3. Speed Tricks' },
                  { id: 'sec-examples', title: '4. Solved PYQ Examples' },
                  { id: 'sec-practice', title: '5. Practice Questions' }
                ]).map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer truncate ${
                      activeSection === sec.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </nav>

              {/* Exam Relevance Tag */}
              {material.examRelevance && (
                <div className="mt-6 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                  <div className="text-blue-400 font-bold mb-1">Exam Weightage</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    {material.examRelevance}
                  </div>
                </div>
              )}
            </aside>
          )}

          {/* Reading Column */}
          <main 
            ref={contentRef}
            onScroll={handleScroll}
            className={`flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 bg-slate-900 ${
              fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-base' : 'text-sm'
            }`}
          >
            {/* Topic Summary Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Executive Overview</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {material.summary}
              </p>
            </div>

            {/* Formula Box */}
            {material.formulas && material.formulas.length > 0 && (
              <div className="p-5 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <span>Essential Formulas & Canonical Rules</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {material.formulas.map((formula, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-blue-900/40 font-mono text-blue-200 font-semibold">
                      {formula}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shortcuts Trick Box */}
            {material.shortcuts && material.shortcuts.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Tier-1 Speed Shortcuts & Elimination Methods</span>
                </div>
                <div className="space-y-2">
                  {material.shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-amber-900/30 text-amber-200">
                      {shortcut}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Common Mistakes Warning Box */}
            {material.commonMistakes && material.commonMistakes.length > 0 && (
              <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Common Traps to Avoid</span>
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  {material.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold shrink-0">✗</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main Rich Content */}
            <div className="prose prose-invert max-w-none space-y-4 text-slate-200 leading-relaxed font-sans">
              {material.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                  return <h2 key={idx} className="text-lg font-bold text-white pt-2 border-b border-slate-800 pb-1">{paragraph.replace('## ', '')}</h2>;
                }
                if (paragraph.startsWith('### ')) {
                  return <h3 key={idx} className="text-sm font-bold text-cyan-300 pt-2">{paragraph.replace('### ', '')}</h3>;
                }
                return <p key={idx} className="text-slate-300">{paragraph}</p>;
              })}
            </div>

            {/* Solved Examples Section */}
            {material.solvedExamples && material.solvedExamples.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Solved Previous-Year Model Questions</span>
                </h3>

                <div className="space-y-4">
                  {material.solvedExamples.map((ex, idx) => (
                    <div key={ex.id || idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                          Example {idx + 1}
                        </span>
                        {ex.pyqMeta && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            {ex.pyqMeta}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-semibold text-white">
                        {ex.question}
                      </div>

                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-emerald-400">Step-by-Step Solution:</div>
                        <div className="text-xs text-slate-300 leading-relaxed">
                          {ex.solution}
                        </div>

                        {ex.stepByStep && ex.stepByStep.length > 0 && (
                          <ol className="list-decimal list-inside text-xs text-slate-400 space-y-1 pt-1">
                            {ex.stepByStep.map((s: string, sIdx: number) => (
                              <li key={sIdx}>{s}</li>
                            ))}
                          </ol>
                        )}

                        {ex.shortcutMethod && (
                          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 mt-2 font-medium">
                            ⚡ <strong>Exam Shortcut:</strong> {ex.shortcutMethod}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Practice Questions Section */}
            {material.practiceQuestions && material.practiceQuestions.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>Self-Assessment Speed Drills</span>
                </h3>

                <div className="space-y-4">
                  {material.practiceQuestions.map((pq, idx) => {
                    const isRevealed = revealedSolutions[pq.id || idx];
                    return (
                      <div key={pq.id || idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-cyan-400">Practice Q{idx + 1}</span>
                          <span className="text-[10px] text-slate-500">Tier-1 CBT Format</span>
                        </div>

                        <div className="text-sm font-semibold text-white">
                          {pq.question}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {pq.options.map((opt: string, optIdx: number) => (
                            <div key={optIdx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px]">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex items-center justify-between">
                          <button
                            onClick={() => toggleSolution(pq.id || String(idx))}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            <span>{isRevealed ? 'Hide Solution' : 'Reveal Answer & Explanation'}</span>
                          </button>
                        </div>

                        {isRevealed && (
                          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs text-blue-200 space-y-1 animate-in fade-in duration-150">
                            <div className="font-bold text-emerald-400">
                              Correct Option: ({String.fromCharCode(65 + pq.correctAnswer)}) {pq.options[pq.correctAnswer]}
                            </div>
                            <div className="text-slate-300">
                              {pq.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Revision Checklist */}
            {material.quickRevision && material.quickRevision.length > 0 && (
              <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Quick Revision Golden Checklist
                </div>
                <ul className="space-y-1 text-slate-300 text-xs">
                  {material.quickRevision.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom Next / Previous Navigation */}
            <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
              {prevMaterial ? (
                <button
                  onClick={() => onSelectMaterial(prevMaterial)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer max-w-[240px] truncate"
                >
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                  <span className="truncate">Previous: {prevMaterial.topic}</span>
                </button>
              ) : <div />}

              {nextMaterial && (
                <button
                  onClick={() => onSelectMaterial(nextMaterial)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer max-w-[240px] truncate ml-auto"
                >
                  <span className="truncate">Next: {nextMaterial.topic}</span>
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </button>
              )}
            </div>

          </main>

        </div>

      </div>
    </div>
  );
};
