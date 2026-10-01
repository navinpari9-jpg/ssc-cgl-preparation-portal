import React, { useState } from 'react';
import { StudyMaterial } from '../types';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  Printer, 
  Search, 
  Bookmark, 
  Maximize2, 
  Minimize2, 
  FileText, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { downloadStudyDocument } from '../utils/downloadHelper';

interface PdfViewerModalProps {
  material: StudyMaterial;
  relatedMaterials: StudyMaterial[];
  onClose: () => void;
  onSelectRelated: (m: StudyMaterial) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  material,
  relatedMaterials,
  onClose,
  onSelectRelated,
  isBookmarked,
  onToggleBookmark
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRelated, setShowRelated] = useState(false);

  const totalPages = material.pagesCount || (material.pdfPages ? material.pdfPages.length : 12);
  const pagesList = material.pdfPages || [
    {
      pageNumber: 1,
      title: `${material.title} - Section Overview & Formula Index`,
      section: 'Official Examination Digest',
      content: `## ${material.title}\n### Official SSC CGL Examination Digital Resource\n\n**Subject**: ${material.subjectId} | **Category**: ${material.category}\n**Target Exams**: SSC CGL 2025-2026 Tier 1 & Tier 2\n\n${material.summary}\n\n### Key Instructions for Candidates:\n1. All formulas are rigorously compiled according to the latest TCS CBT exam pattern.\n2. Dedicate at least 30 minutes to practicing the solved model problems.\n3. Verify your conceptual retention by attempting the speed drill on the final pages.`
    },
    {
      pageNumber: 2,
      title: `${material.topic} - Core Theorems & Speed Identities`,
      section: 'Identity Compilation',
      content: `### High-Yield Formula Compilation for ${material.topic}\n\n` + 
        (material.formulas && material.formulas.length > 0 
          ? material.formulas.map((f, i) => `**Identity ${i + 1}**: ${f}`).join('\n\n')
          : 'Standard identities and step-by-step mathematical proofs compiled for this topic.') +
        `\n\n### Golden Exam Shortcuts:\n` +
        (material.shortcuts && material.shortcuts.length > 0
          ? material.shortcuts.map((s, i) => `⚡ **Speed Method ${i + 1}**: ${s}`).join('\n\n')
          : 'Speed calculation and options elimination techniques.')
    },
    {
      pageNumber: 3,
      title: `${material.topic} - Solved Previous Year Examination Questions`,
      section: 'Solved Model Papers',
      content: `### Selected Solved Questions (SSC CGL 2021-2024 Archive)\n\n` +
        (material.solvedExamples && material.solvedExamples.length > 0
          ? material.solvedExamples.map((ex, i) => `**Question ${i + 1}**: ${ex.question}\n- **Detailed Explanation**: ${ex.solution}\n- **Speed Shortcut**: ${ex.shortcutMethod || 'Direct substitution'}`).join('\n\n---\n\n')
          : 'Comprehensive solved illustrations reflecting actual examination difficulty benchmarks.')
    },
    {
      pageNumber: 4,
      title: `${material.topic} - Comprehensive Exercise & Practice Blueprint`,
      section: 'Self-Testing Section',
      content: `### Tier-1 Speed Practice Drill\n\n` +
        (material.practiceQuestions && material.practiceQuestions.length > 0
          ? material.practiceQuestions.map((pq, i) => `**Problem ${i + 1}**: ${pq.question}\nOptions: (A) ${pq.options[0]} | (B) ${pq.options[1]} | (C) ${pq.options[2]} | (D) ${pq.options[3]}\n*Correct Option*: (${String.fromCharCode(65 + pq.correctAnswer)}) ${pq.options[pq.correctAnswer]}\n*Rationale*: ${pq.explanation}`).join('\n\n')
          : 'Authentic 25-question examination practice module with full solution keys.') +
        `\n\n### Official Cutoff Benchmark:\n- Attempt Target: 22+ out of 25 Questions\n- Speed Target: < 20 minutes\n- Accuracy Benchmark: > 85%`
    }
  ];

  const safePageIdx = Math.min(currentPage - 1, pagesList.length - 1);
  const activePageData = pagesList[safePageIdx] || pagesList[0];

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className={`w-full ${isFullscreen ? 'h-screen max-w-none rounded-none' : 'max-w-6xl h-[92vh] rounded-2xl'} bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* Top Control Toolbar */}
        <header className="h-16 px-4 bg-slate-950/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          
          {/* Document Title & Badge */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate max-w-md">
                {material.title}
              </h2>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span className="font-semibold text-blue-400">{material.category}</span>
                <span>•</span>
                <span>{material.fileSizeFormatted || '2.4 MB'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{material.yearRelevance || '2025 Edition'}</span>
              </div>
            </div>
          </div>

          {/* Page Navigation & Zoom Controls */}
          <div className="flex items-center gap-2">
            
            {/* Page Navigator */}
            <div className="flex items-center rounded-lg bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-2 text-xs font-bold tabular-nums text-white">
                Page {currentPage} <span className="text-slate-400 font-normal">/ {totalPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="p-1 rounded text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center rounded-lg bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 text-[11px] font-bold text-white tabular-nums">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                className="p-1 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Actions: Download, Print, Bookmark */}
            <button
              onClick={handleDownload}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Download PDF document"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="hidden sm:block p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
              aria-label="Close viewer"
            >
              <X className="w-4 h-4" />
            </button>

          </div>

        </header>

        {/* Content Body: Rendered Multi-Page Canvas with Watermark */}
        <div className="flex-1 flex overflow-hidden bg-slate-950 relative">
          
          {/* Main Document Reader Paper Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center">
            
            <div 
              className="w-full max-w-3xl min-h-[950px] bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 relative flex flex-col justify-between transition-transform duration-200 select-text"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            >
              {/* Background Security Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <span className="text-7xl sm:text-8xl font-black uppercase text-slate-950 -rotate-45">
                  SSC CGL 2025
                </span>
              </div>

              {/* Running PDF Header */}
              <div className="border-b-2 border-blue-600 pb-3 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>SSC CGL Preparation Portal · Official Document Library</span>
                </div>
                <div className="font-semibold text-blue-700">
                  {material.subjectId.toUpperCase()}
                </div>
              </div>

              {/* Document Page Body */}
              <div className="my-6 space-y-6 flex-1">
                
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                    {activePageData.section || 'Study Material'}
                  </span>
                  <h1 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                    {activePageData.title}
                  </h1>
                </div>

                <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed">
                  {activePageData.content.split('\n\n').map((paragraph: string, pIdx: number) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={pIdx} className="text-lg font-bold text-slate-900 pt-2 border-b border-slate-200 pb-1">{paragraph.replace('## ', '')}</h2>;
                    }
                    if (paragraph.startsWith('### ')) {
                      return <h3 key={pIdx} className="text-sm font-bold text-blue-900 pt-1">{paragraph.replace('### ', '')}</h3>;
                    }
                    if (paragraph.startsWith('**') && paragraph.includes(':')) {
                      return <div key={pIdx} className="p-3 my-1.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 font-semibold">{paragraph}</div>;
                    }
                    return <p key={pIdx} className="my-2">{paragraph}</p>;
                  })}
                </div>

                {/* Additional Page 2 Formulas if active */}
                {currentPage === 2 && material.formulas && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                    <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      Important Formula Reference List
                    </div>
                    <ul className="list-disc list-inside text-xs text-blue-950 space-y-1">
                      {material.formulas.slice(0, 6).map((f, i) => (
                        <li key={i}><strong>{f}</strong></li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Running PDF Footer */}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified CBT Syllabus Material · All Rights Reserved</span>
                <span className="font-bold text-slate-700 tabular-nums">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

            </div>

          </div>

          {/* Right Related Resources Sidebar (Toggleable) */}
          <aside className="w-72 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto hidden xl:block shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Related PDF Resources</span>
            </h3>

            <div className="space-y-2.5">
              {relatedMaterials.slice(0, 5).map(rel => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer group"
                >
                  <div className="text-[10px] font-bold text-blue-400 uppercase">
                    {rel.category}
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors mt-0.5 line-clamp-2">
                    {rel.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span>{rel.pagesCount || 14} Pages</span>
                    <span>•</span>
                    <span>{rel.fileSizeFormatted || '1.8 MB'}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-blue-950/30 border border-blue-900/40 text-xs">
              <div className="text-blue-400 font-bold mb-1">Tier-1 CBT Tip</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Download the formula sheets for offline revision. Keep revision intervals spaced across 3 days before full mocks.
              </p>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
};
