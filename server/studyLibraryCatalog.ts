import { StudyMaterial, SubjectId } from '../src/types';

// Helper to generate realistic PDF pages for any study item
export const generatePdfPages = (title: string, subject: string, topic: string, content: string, formulas: string[], shortcuts: string[], examples: any[], practice: any[]) => {
  const pages = [
    {
      pageNumber: 1,
      title: `${title} - Core Principles & Definitions`,
      section: 'Introduction & Concepts',
      content: `## ${title}\n### SSC CGL Official Exam Blueprint · Target Tier-1 & Tier-2\n\n**Subject**: ${subject} | **Topic**: ${topic}\n\n${content.slice(0, 750)}...\n\n### Key Conceptual Pillars:\n- Direct exam weightage: 2 to 4 questions in Tier-1, up to 6 questions in Tier-2.\n- Primary testing objective: Conceptual clarity, computational velocity, and elimination technique.\n- Negative marking awareness: Deducts 0.50 per incorrect attempt.`
    },
    {
      pageNumber: 2,
      title: `${topic} - Essential Formulas & Standard Identities`,
      section: 'Formulas & Mathematical Rules',
      content: `### High-Yield Formula Bank for ${topic}\n\n` + 
        (formulas.length > 0 ? formulas.map((f, i) => `**Formula ${i + 1}**: ${f}`).join('\n\n') : 'Comprehensive formula reference sheet included in detailed note.') +
        `\n\n### Exam Shortcut Tricks:\n` +
        (shortcuts.length > 0 ? shortcuts.map((s, i) => `⚡ **Trick ${i + 1}**: ${s}`).join('\n\n') : 'Apply standard speed elimination.')
    },
    {
      pageNumber: 3,
      title: `${topic} - Solved Exam Examples with Step-by-Step Analysis`,
      section: 'Previous Year Solved Questions',
      content: `### Solved Model Problems (Recent SSC CGL CBT Pattern)\n\n` +
        (examples.length > 0 ? examples.map((ex, i) => `**Problem ${i + 1}**: ${ex.question}\n- **Detailed Solution**: ${ex.solution}\n- **Exam Shortcut**: ${ex.shortcutMethod || 'Direct formula substitution'}\n- **Relevance**: ${ex.pyqMeta || 'SSC CGL Previous Year'}`).join('\n\n---\n\n') : 'Step-by-step solved illustrations provided.')
    },
    {
      pageNumber: 4,
      title: `${topic} - Self-Assessment Drill & Answer Key`,
      section: 'Practice Exercise & Explanations',
      content: `### Tier-1 Speed Drill Questions\n\n` +
        (practice.length > 0 ? practice.map((p, i) => `**Q${i + 1}**: ${p.question}\nOptions: (A) ${p.options[0]}  (B) ${p.options[1]}  (C) ${p.options[2]}  (D) ${p.options[3]}\n**Correct Option**: Option ${(p.correctAnswer + 1)} (${p.options[p.correctAnswer]})\n*Explanation*: ${p.explanation}`).join('\n\n') : 'Standard exercise questions with complete answer keys.') +
        `\n\n### Quick Revision Golden Checklist:\n1. Verify edge conditions before committing calculations.\n2. In fractions and ratios, reduce to lowest common terms first.\n3. Cross-check dimensional consistency in mensuration and geometry.`
    }
  ];
  return pages;
};

// Complete Topic Metadata for all 4 Subjects
export const QUANT_TOPICS_CATALOG = [
  { id: 'number-system', name: 'Number System', readTime: 12, pages: 14, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'simplification', name: 'Simplification', readTime: 10, pages: 12, qs: 40, diff: 'Easy', year: '2022-2024' },
  { id: 'percentage', name: 'Percentage', readTime: 14, pages: 16, qs: 45, diff: 'Medium', year: '2020-2024' },
  { id: 'profit-and-loss', name: 'Profit and Loss', readTime: 15, pages: 18, qs: 50, diff: 'Medium', year: '2021-2024' },
  { id: 'discount', name: 'Discount', readTime: 10, pages: 10, qs: 30, diff: 'Medium', year: '2022-2024' },
  { id: 'ratio-and-proportion', name: 'Ratio and Proportion', readTime: 12, pages: 14, qs: 35, diff: 'Easy', year: '2020-2024' },
  { id: 'average', name: 'Average', readTime: 11, pages: 12, qs: 30, diff: 'Medium', year: '2021-2024' },
  { id: 'partnership', name: 'Partnership', readTime: 9, pages: 10, qs: 25, diff: 'Easy', year: '2022-2024' },
  { id: 'mixture-and-alligation', name: 'Mixture and Alligation', readTime: 12, pages: 14, qs: 35, diff: 'Hard', year: '2021-2024' },
  { id: 'time-and-work', name: 'Time and Work', readTime: 16, pages: 18, qs: 45, diff: 'Medium', year: '2020-2024' },
  { id: 'pipes-and-cisterns', name: 'Pipes and Cisterns', readTime: 10, pages: 12, qs: 30, diff: 'Medium', year: '2022-2024' },
  { id: 'time-speed-and-distance', name: 'Time, Speed and Distance', readTime: 18, pages: 20, qs: 50, diff: 'Hard', year: '2020-2024' },
  { id: 'boats-and-streams', name: 'Boats and Streams', readTime: 10, pages: 10, qs: 25, diff: 'Medium', year: '2021-2024' },
  { id: 'simple-interest', name: 'Simple Interest', readTime: 9, pages: 10, qs: 25, diff: 'Easy', year: '2022-2024' },
  { id: 'compound-interest', name: 'Compound Interest', readTime: 15, pages: 16, qs: 40, diff: 'Hard', year: '2021-2024' },
  { id: 'algebra', name: 'Algebra', readTime: 20, pages: 24, qs: 60, diff: 'Hard', year: '2020-2024' },
  { id: 'linear-equations', name: 'Linear Equations', readTime: 10, pages: 10, qs: 25, diff: 'Easy', year: '2022-2024' },
  { id: 'geometry', name: 'Geometry', readTime: 24, pages: 30, qs: 75, diff: 'Hard', year: '2020-2024' },
  { id: 'mensuration', name: 'Mensuration', readTime: 20, pages: 26, qs: 65, diff: 'Hard', year: '2020-2024' },
  { id: 'trigonometry', name: 'Trigonometry', readTime: 18, pages: 22, qs: 55, diff: 'Hard', year: '2020-2024' },
  { id: 'data-interpretation', name: 'Data Interpretation', readTime: 15, pages: 18, qs: 40, diff: 'Medium', year: '2021-2024' },
  { id: 'probability', name: 'Probability', readTime: 12, pages: 14, qs: 30, diff: 'Medium', year: '2023-2024' },
  { id: 'permutation-and-combination', name: 'Permutation and Combination', readTime: 14, pages: 16, qs: 35, diff: 'Hard', year: '2023-2024' },
  { id: 'statistics', name: 'Statistics', readTime: 12, pages: 14, qs: 30, diff: 'Medium', year: '2023-2024' }
];

export const REASONING_TOPICS_CATALOG = [
  { id: 'analogy', name: 'Analogy', readTime: 10, pages: 12, qs: 40, diff: 'Easy', year: '2021-2024' },
  { id: 'classification', name: 'Classification', readTime: 9, pages: 10, qs: 35, diff: 'Easy', year: '2022-2024' },
  { id: 'series', name: 'Series', readTime: 14, pages: 16, qs: 45, diff: 'Medium', year: '2020-2024' },
  { id: 'coding-decoding', name: 'Coding-Decoding', readTime: 14, pages: 16, qs: 45, diff: 'Medium', year: '2020-2024' },
  { id: 'blood-relations', name: 'Blood Relations', readTime: 12, pages: 14, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'direction-sense', name: 'Direction Sense', readTime: 10, pages: 12, qs: 30, diff: 'Easy', year: '2022-2024' },
  { id: 'ranking', name: 'Ranking', readTime: 10, pages: 10, qs: 30, diff: 'Easy', year: '2021-2024' },
  { id: 'venn-diagrams', name: 'Venn Diagrams', readTime: 11, pages: 12, qs: 35, diff: 'Medium', year: '2020-2024' },
  { id: 'syllogism', name: 'Syllogism', readTime: 15, pages: 18, qs: 50, diff: 'Hard', year: '2020-2024' },
  { id: 'statement-and-conclusion', name: 'Statement and Conclusion', readTime: 12, pages: 14, qs: 30, diff: 'Hard', year: '2021-2024' },
  { id: 'statement-and-assumption', name: 'Statement and Assumption', readTime: 12, pages: 14, qs: 30, diff: 'Hard', year: '2022-2024' },
  { id: 'mathematical-operations', name: 'Mathematical Operations', readTime: 10, pages: 12, qs: 35, diff: 'Easy', year: '2021-2024' },
  { id: 'missing-number', name: 'Missing Number', readTime: 12, pages: 14, qs: 40, diff: 'Medium', year: '2020-2024' },
  { id: 'calendar', name: 'Calendar', readTime: 12, pages: 14, qs: 30, diff: 'Medium', year: '2021-2024' },
  { id: 'clock', name: 'Clock', readTime: 11, pages: 12, qs: 30, diff: 'Medium', year: '2021-2024' },
  { id: 'seating-arrangement', name: 'Seating Arrangement', readTime: 16, pages: 18, qs: 40, diff: 'Hard', year: '2020-2024' },
  { id: 'puzzle', name: 'Puzzle', readTime: 16, pages: 18, qs: 40, diff: 'Hard', year: '2020-2024' },
  { id: 'non-verbal-reasoning', name: 'Non-Verbal Reasoning', readTime: 12, pages: 16, qs: 50, diff: 'Medium', year: '2020-2024' },
  { id: 'mirror-image', name: 'Mirror Image', readTime: 8, pages: 10, qs: 30, diff: 'Easy', year: '2022-2024' },
  { id: 'water-image', name: 'Water Image', readTime: 8, pages: 10, qs: 30, diff: 'Easy', year: '2022-2024' },
  { id: 'paper-folding', name: 'Paper Folding', readTime: 9, pages: 10, qs: 30, diff: 'Easy', year: '2022-2024' },
  { id: 'figure-completion', name: 'Figure Completion', readTime: 8, pages: 10, qs: 30, diff: 'Easy', year: '2021-2024' },
  { id: 'embedded-figures', name: 'Embedded Figures', readTime: 8, pages: 10, qs: 30, diff: 'Easy', year: '2021-2024' }
];

export const ENGLISH_TOPICS_CATALOG = [
  { id: 'parts-of-speech', name: 'Parts of Speech', readTime: 14, pages: 16, qs: 40, diff: 'Medium', year: '2020-2024' },
  { id: 'noun', name: 'Noun', readTime: 10, pages: 12, qs: 35, diff: 'Easy', year: '2021-2024' },
  { id: 'pronoun', name: 'Pronoun', readTime: 11, pages: 12, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'verb', name: 'Verb', readTime: 14, pages: 16, qs: 45, diff: 'Hard', year: '2020-2024' },
  { id: 'adjective', name: 'Adjective', readTime: 10, pages: 12, qs: 30, diff: 'Medium', year: '2022-2024' },
  { id: 'adverb', name: 'Adverb', readTime: 10, pages: 12, qs: 30, diff: 'Medium', year: '2022-2024' },
  { id: 'tenses', name: 'Tenses', readTime: 16, pages: 18, qs: 50, diff: 'Hard', year: '2020-2024' },
  { id: 'subject-verb-agreement', name: 'Subject-Verb Agreement', readTime: 15, pages: 18, qs: 50, diff: 'Hard', year: '2020-2024' },
  { id: 'articles', name: 'Articles', readTime: 10, pages: 12, qs: 35, diff: 'Easy', year: '2022-2024' },
  { id: 'prepositions', name: 'Prepositions', readTime: 18, pages: 22, qs: 60, diff: 'Hard', year: '2020-2024' },
  { id: 'conjunctions', name: 'Conjunctions', readTime: 11, pages: 12, qs: 30, diff: 'Medium', year: '2021-2024' },
  { id: 'active-and-passive-voice', name: 'Active and Passive Voice', readTime: 15, pages: 18, qs: 55, diff: 'Medium', year: '2020-2024' },
  { id: 'direct-and-indirect-speech', name: 'Direct and Indirect Speech', readTime: 16, pages: 18, qs: 55, diff: 'Medium', year: '2020-2024' },
  { id: 'error-detection', name: 'Error Detection', readTime: 18, pages: 22, qs: 65, diff: 'Hard', year: '2020-2024' },
  { id: 'sentence-improvement', name: 'Sentence Improvement', readTime: 16, pages: 20, qs: 60, diff: 'Hard', year: '2020-2024' },
  { id: 'fill-in-the-blanks', name: 'Fill in the Blanks', readTime: 12, pages: 14, qs: 40, diff: 'Medium', year: '2021-2024' },
  { id: 'cloze-test', name: 'Cloze Test', readTime: 16, pages: 20, qs: 50, diff: 'Hard', year: '2020-2024' },
  { id: 'synonyms', name: 'Synonyms', readTime: 15, pages: 18, qs: 75, diff: 'Medium', year: '2020-2024' },
  { id: 'antonyms', name: 'Antonyms', readTime: 15, pages: 18, qs: 75, diff: 'Medium', year: '2020-2024' },
  { id: 'one-word-substitution', name: 'One Word Substitution', readTime: 16, pages: 20, qs: 80, diff: 'Medium', year: '2020-2024' },
  { id: 'idioms-and-phrases', name: 'Idioms and Phrases', readTime: 16, pages: 20, qs: 80, diff: 'Medium', year: '2020-2024' },
  { id: 'spelling', name: 'Spelling', readTime: 10, pages: 12, qs: 50, diff: 'Easy', year: '2021-2024' },
  { id: 'reading-comprehension', name: 'Reading Comprehension', readTime: 18, pages: 22, qs: 45, diff: 'Hard', year: '2020-2024' },
  { id: 'para-jumbles', name: 'Para Jumbles', readTime: 14, pages: 16, qs: 40, diff: 'Hard', year: '2021-2024' },
  { id: 'vocabulary', name: 'Vocabulary', readTime: 20, pages: 25, qs: 100, diff: 'Hard', year: '2020-2024' }
];

export const GA_TOPICS_CATALOG = [
  { id: 'indian-history', name: 'Indian History', readTime: 22, pages: 28, qs: 60, diff: 'Hard', year: '2020-2024' },
  { id: 'ancient-history', name: 'Ancient History', readTime: 15, pages: 18, qs: 40, diff: 'Medium', year: '2021-2024' },
  { id: 'medieval-history', name: 'Medieval History', readTime: 14, pages: 16, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'modern-history', name: 'Modern History', readTime: 18, pages: 22, qs: 50, diff: 'Hard', year: '2020-2024' },
  { id: 'indian-polity', name: 'Indian Polity', readTime: 20, pages: 26, qs: 65, diff: 'Hard', year: '2020-2024' },
  { id: 'constitution', name: 'Constitution', readTime: 18, pages: 22, qs: 55, diff: 'Hard', year: '2020-2024' },
  { id: 'fundamental-rights', name: 'Fundamental Rights', readTime: 12, pages: 14, qs: 40, diff: 'Medium', year: '2021-2024' },
  { id: 'parliament', name: 'Parliament', readTime: 14, pages: 16, qs: 45, diff: 'Hard', year: '2020-2024' },
  { id: 'president-and-prime-minister', name: 'President and Prime Minister', readTime: 12, pages: 14, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'judiciary', name: 'Judiciary', readTime: 12, pages: 14, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'indian-geography', name: 'Indian Geography', readTime: 18, pages: 24, qs: 55, diff: 'Hard', year: '2020-2024' },
  { id: 'world-geography', name: 'World Geography', readTime: 14, pages: 18, qs: 40, diff: 'Medium', year: '2021-2024' },
  { id: 'indian-economy', name: 'Indian Economy', readTime: 16, pages: 20, qs: 45, diff: 'Hard', year: '2020-2024' },
  { id: 'banking', name: 'Banking', readTime: 12, pages: 14, qs: 35, diff: 'Medium', year: '2022-2024' },
  { id: 'budget-and-taxation-basics', name: 'Budget and Taxation basics', readTime: 12, pages: 14, qs: 30, diff: 'Medium', year: '2022-2024' },
  { id: 'general-science', name: 'General Science', readTime: 20, pages: 26, qs: 60, diff: 'Hard', year: '2020-2024' },
  { id: 'physics', name: 'Physics', readTime: 14, pages: 18, qs: 45, diff: 'Medium', year: '2021-2024' },
  { id: 'chemistry', name: 'Chemistry', readTime: 14, pages: 18, qs: 45, diff: 'Medium', year: '2021-2024' },
  { id: 'biology', name: 'Biology', readTime: 18, pages: 22, qs: 55, diff: 'Hard', year: '2020-2024' },
  { id: 'environment', name: 'Environment', readTime: 12, pages: 14, qs: 35, diff: 'Easy', year: '2022-2024' },
  { id: 'computer-awareness', name: 'Computer Awareness', readTime: 14, pages: 16, qs: 45, diff: 'Medium', year: '2022-2024' },
  { id: 'static-gk', name: 'Static GK', readTime: 24, pages: 30, qs: 80, diff: 'Hard', year: '2020-2024' },
  { id: 'important-organizations', name: 'Important Organizations', readTime: 12, pages: 14, qs: 35, diff: 'Easy', year: '2021-2024' },
  { id: 'important-awards', name: 'Important Awards', readTime: 11, pages: 12, qs: 30, diff: 'Easy', year: '2022-2024' },
  { id: 'books-and-authors', name: 'Books and Authors', readTime: 12, pages: 14, qs: 35, diff: 'Medium', year: '2021-2024' },
  { id: 'sports', name: 'Sports', readTime: 12, pages: 14, qs: 35, diff: 'Easy', year: '2022-2024' },
  { id: 'important-days', name: 'Important Days', readTime: 10, pages: 12, qs: 30, diff: 'Easy', year: '2021-2024' }
];
