import { SubjectMetadata, Question, MockTest, StudyMaterial, CurrentAffairItem, LeaderboardEntry, Achievement, NotificationItem } from '../src/types';
import { COMPLETE_STUDY_LIBRARY } from './studyLibraryData';

export const SUBJECTS_CATALOG: SubjectMetadata[] = [
  {
    id: 'quantitative-aptitude',
    name: 'Quantitative Aptitude',
    subtitle: 'Arithmetic & Advanced Mathematics',
    icon: 'Calculator',
    color: 'emerald',
    totalTopics: 15,
    weightageTier1: '25 Questions / 50 Marks',
    description: 'Master core arithmetic, advanced mathematics, geometry, algebra, and data interpretation with time-saving shortcut tricks.',
    topics: [
      { name: 'Number System', questionCount: 42, difficulty: 'Medium', importance: 'High' },
      { name: 'Simplification', questionCount: 38, difficulty: 'Easy', importance: 'High' },
      { name: 'Percentage', questionCount: 45, difficulty: 'Medium', importance: 'High' },
      { name: 'Ratio and Proportion', questionCount: 36, difficulty: 'Medium', importance: 'Medium' },
      { name: 'Average', questionCount: 30, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Profit and Loss', questionCount: 48, difficulty: 'Medium', importance: 'High' },
      { name: 'Simple Interest', questionCount: 28, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Compound Interest', questionCount: 35, difficulty: 'Hard', importance: 'High' },
      { name: 'Time and Work', questionCount: 40, difficulty: 'Medium', importance: 'High' },
      { name: 'Time, Speed and Distance', questionCount: 42, difficulty: 'Hard', importance: 'High' },
      { name: 'Algebra', questionCount: 50, difficulty: 'Hard', importance: 'High' },
      { name: 'Geometry', questionCount: 55, difficulty: 'Hard', importance: 'High' },
      { name: 'Mensuration', questionCount: 44, difficulty: 'Medium', importance: 'High' },
      { name: 'Trigonometry', questionCount: 46, difficulty: 'Hard', importance: 'High' },
      { name: 'Data Interpretation', questionCount: 35, difficulty: 'Medium', importance: 'High' }
    ]
  },
  {
    id: 'reasoning',
    name: 'General Intelligence & Reasoning',
    subtitle: 'Logical Reasoning & Deduction',
    icon: 'Brain',
    color: 'indigo',
    totalTopics: 12,
    weightageTier1: '25 Questions / 50 Marks',
    description: 'Develop rapid logical deduction, pattern recognition, spatial orientation, syllogisms, and coding patterns.',
    topics: [
      { name: 'Analogy', questionCount: 40, difficulty: 'Easy', importance: 'High' },
      { name: 'Classification', questionCount: 35, difficulty: 'Easy', importance: 'High' },
      { name: 'Series', questionCount: 45, difficulty: 'Medium', importance: 'High' },
      { name: 'Coding-Decoding', questionCount: 48, difficulty: 'Medium', importance: 'High' },
      { name: 'Blood Relations', questionCount: 32, difficulty: 'Medium', importance: 'High' },
      { name: 'Direction Sense', questionCount: 26, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Syllogism', questionCount: 38, difficulty: 'Medium', importance: 'High' },
      { name: 'Venn Diagram', questionCount: 28, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Statement and Conclusion', questionCount: 30, difficulty: 'Hard', importance: 'Medium' },
      { name: 'Ranking', questionCount: 24, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Mathematical Operations', questionCount: 32, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Non-Verbal Reasoning', questionCount: 52, difficulty: 'Medium', importance: 'High' }
    ]
  },
  {
    id: 'english',
    name: 'English Language & Comprehension',
    subtitle: 'Grammar, Vocabulary & Comprehension',
    icon: 'BookOpen',
    color: 'sky',
    totalTopics: 13,
    weightageTier1: '25 Questions / 50 Marks',
    description: 'Boost your verbal ability, grammatical rules, vocab roots, idioms, cloze test strategies, and reading speed.',
    topics: [
      { name: 'Grammar', questionCount: 60, difficulty: 'Medium', importance: 'High' },
      { name: 'Vocabulary', questionCount: 80, difficulty: 'Medium', importance: 'High' },
      { name: 'Synonyms', questionCount: 65, difficulty: 'Medium', importance: 'High' },
      { name: 'Antonyms', questionCount: 65, difficulty: 'Medium', importance: 'High' },
      { name: 'One Word Substitution', questionCount: 75, difficulty: 'Medium', importance: 'High' },
      { name: 'Idioms and Phrases', questionCount: 70, difficulty: 'Medium', importance: 'High' },
      { name: 'Error Detection', questionCount: 55, difficulty: 'Hard', importance: 'High' },
      { name: 'Fill in the Blanks', questionCount: 45, difficulty: 'Easy', importance: 'Medium' },
      { name: 'Sentence Improvement', questionCount: 50, difficulty: 'Medium', importance: 'High' },
      { name: 'Active and Passive Voice', questionCount: 35, difficulty: 'Easy', importance: 'High' },
      { name: 'Direct and Indirect Speech', questionCount: 35, difficulty: 'Medium', importance: 'High' },
      { name: 'Reading Comprehension', questionCount: 40, difficulty: 'Hard', importance: 'High' },
      { name: 'Cloze Test', questionCount: 45, difficulty: 'Hard', importance: 'High' }
    ]
  },
  {
    id: 'general-awareness',
    name: 'General Awareness',
    subtitle: 'Polity, History, Geography & Science',
    icon: 'Globe',
    color: 'amber',
    totalTopics: 10,
    weightageTier1: '25 Questions / 50 Marks',
    description: 'Cover high-yield Static GK, Indian Polity, Modern History, Physical Geography, Basic Economics, and Current Affairs.',
    topics: [
      { name: 'Indian History', questionCount: 65, difficulty: 'Medium', importance: 'High' },
      { name: 'Geography', questionCount: 55, difficulty: 'Medium', importance: 'High' },
      { name: 'Indian Polity', questionCount: 60, difficulty: 'Medium', importance: 'High' },
      { name: 'Economics', questionCount: 40, difficulty: 'Hard', importance: 'Medium' },
      { name: 'General Science', questionCount: 45, difficulty: 'Medium', importance: 'Medium' },
      { name: 'Physics', questionCount: 38, difficulty: 'Medium', importance: 'Medium' },
      { name: 'Chemistry', questionCount: 35, difficulty: 'Medium', importance: 'Medium' },
      { name: 'Biology', questionCount: 50, difficulty: 'Medium', importance: 'High' },
      { name: 'Static GK', questionCount: 85, difficulty: 'Hard', importance: 'High' },
      { name: 'Current Affairs', questionCount: 90, difficulty: 'Medium', importance: 'High' }
    ]
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  // Quantitative Aptitude
  {
    id: 'q-quant-01',
    subjectId: 'quantitative-aptitude',
    topic: 'Percentage',
    question: 'If the price of petrol increases by 25%, by what percentage must a motorist reduce petrol consumption so that the total expenditure remains unchanged?',
    options: ['20%', '25%', '16.67%', '33.33%'],
    correctAnswer: 0,
    explanation: 'When price increases by r%, consumption must decrease by [r / (100 + r)] * 100% to keep expenditure constant. Here r = 25%. Required reduction = [25 / (100 + 25)] * 100% = [25 / 125] * 100% = 1/5 * 100% = 20%.',
    shortcutTrick: 'Standard Fraction Method: +1/4 increase in price requires -1/5 decrease in consumption. 1/5 = 20%.',
    formulaUsed: 'Reduction % = [r / (100 + r)] * 100',
    difficulty: 'Easy',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-2'
  },
  {
    id: 'q-quant-02',
    subjectId: 'quantitative-aptitude',
    topic: 'Profit and Loss',
    question: 'A shopkeeper marks his goods 40% above the cost price and allows a discount of 25% on the marked price. Find his net profit or loss percentage.',
    options: ['5% Profit', '5% Loss', '10% Profit', '8% Profit'],
    correctAnswer: 0,
    explanation: 'Let CP = 100. Marked Price (MP) = 100 + 40 = 140. Discount = 25% of 140 = 35. Selling Price (SP) = 140 - 35 = 105. Net Profit = SP - CP = 105 - 100 = 5%.',
    shortcutTrick: 'Successive % change formula: Net = a + b + (a*b)/100 = +40 - 25 - (40*25)/100 = 15 - 10 = +5% profit.',
    formulaUsed: 'Net % = a + b + (ab)/100',
    difficulty: 'Easy',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-1'
  },
  {
    id: 'q-quant-03',
    subjectId: 'quantitative-aptitude',
    topic: 'Algebra',
    question: 'If x + 1/x = 5, what is the value of x³ + 1/x³?',
    options: ['110', '125', '140', '115'],
    correctAnswer: 0,
    explanation: 'Using identity (x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x). Therefore, x³ + 1/x³ = (x + 1/x)³ - 3(x + 1/x). Substituting 5: 5³ - 3(5) = 125 - 15 = 110.',
    shortcutTrick: 'If x + 1/x = k, then x³ + 1/x³ = k³ - 3k. For k = 5, 5³ - 3(5) = 125 - 15 = 110.',
    formulaUsed: 'x³ + 1/x³ = k³ - 3k',
    difficulty: 'Medium',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-3'
  },
  {
    id: 'q-quant-04',
    subjectId: 'quantitative-aptitude',
    topic: 'Time and Work',
    question: 'A can complete a piece of work in 12 days and B can do it in 18 days. If they work together on alternate days starting with A, in how many days will the work be completed?',
    options: ['14 1/3 days', '14 1/2 days', '15 days', '13 2/3 days'],
    correctAnswer: 0,
    explanation: 'Total work = LCM(12, 18) = 36 units. Efficiency of A = 36/12 = 3 units/day. Efficiency of B = 36/18 = 2 units/day. In 2 days (A then B), work completed = 3 + 2 = 5 units. For 7 two-day cycles (14 days), work = 7 * 5 = 35 units. Remaining work = 36 - 35 = 1 unit. On day 15, A works: time taken = 1/3 day. Total time = 14 + 1/3 = 14 1/3 days.',
    shortcutTrick: 'Find 2-day cycle total = 5 units. 7 cycles = 14 days for 35 units. Next turn A does 1/3 day for remaining 1 unit.',
    formulaUsed: 'Total Work = LCM of individual times',
    difficulty: 'Hard',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-1'
  },
  {
    id: 'q-quant-05',
    subjectId: 'quantitative-aptitude',
    topic: 'Geometry',
    question: 'In a right-angled triangle ABC right-angled at B, if AB = 7 cm and BC = 24 cm, find the inradius (r) of the triangle.',
    options: ['3 cm', '4 cm', '5 cm', '2.5 cm'],
    correctAnswer: 0,
    explanation: 'Hypotenuse AC = √(AB² + BC²) = √(7² + 24²) = √(49 + 576) = √625 = 25 cm. For any right-angled triangle, inradius r = (a + b - c)/2, where a and b are perpendicular sides and c is the hypotenuse. r = (7 + 24 - 25)/2 = 6/2 = 3 cm.',
    shortcutTrick: 'Direct Inradius formula for right triangle: r = (Perpendicular + Base - Hypotenuse) / 2 = (7 + 24 - 25)/2 = 3 cm.',
    formulaUsed: 'r = (P + B - H) / 2',
    difficulty: 'Medium',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-4'
  },
  {
    id: 'q-quant-06',
    subjectId: 'quantitative-aptitude',
    topic: 'Compound Interest',
    question: 'The difference between compound interest and simple interest on a certain sum of money for 2 years at 10% per annum is ₹65. What is the principal sum?',
    options: ['₹6,500', '₹7,200', '₹5,800', '₹6,000'],
    correctAnswer: 0,
    explanation: 'For 2 years, difference (D) = P * (r / 100)². Here D = 65 and r = 10%. 65 = P * (10 / 100)² = P * (1/100). Thus, P = 65 * 100 = ₹6,500.',
    shortcutTrick: 'Difference for 2 years = P * (r/100)². 65 = P * (1/100) => P = ₹6500.',
    formulaUsed: 'D = P * (R/100)²',
    difficulty: 'Medium',
    pyqYear: 2021,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2021 Tier-1 Shift-1'
  },

  // General Intelligence & Reasoning
  {
    id: 'q-reas-01',
    subjectId: 'reasoning',
    topic: 'Coding-Decoding',
    question: 'In a certain code language, if "FLOWER" is written as "UOLDVI", how will "TERMINAL" be written in that same code language?',
    options: ['GVINRMZO', 'GVRMINZO', 'GVNRIMZO', 'HVINRNZO'],
    correctAnswer: 0,
    explanation: 'Each letter is replaced by its reverse opposite alphabet letter (A↔Z, B↔Y, ..., F↔U, L↔O, O↔L, W↔D, E↔V, R↔I). For TERMINAL: T↔G, E↔V, R↔I, M↔N, I↔R, N↔M, A↔Z, L↔O. Hence "GVINRMZO".',
    shortcutTrick: 'Sum of positional values of opposite letters is 27. (T=20, G=7; 20+7=27; E=5, V=22; 5+22=27).',
    difficulty: 'Medium',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-1'
  },
  {
    id: 'q-reas-02',
    subjectId: 'reasoning',
    topic: 'Syllogism',
    question: 'Statements:\n1. All mangoes are fruits.\n2. Some fruits are sweet.\nConclusions:\nI. Some mangoes are sweet.\nII. No sweet is a mango.',
    options: ['Either conclusion I or II follows', 'Only conclusion I follows', 'Only conclusion II follows', 'Neither I nor II follows'],
    correctAnswer: 0,
    explanation: 'From the given statements, the relationship between "mangoes" and "sweet" is uncertain (it is possible but not certain). Since Conclusion I is particular affirmative ("Some mangoes are sweet") and Conclusion II is universal negative ("No sweet is a mango"), they form a complementary pair (A/E/I/O type). Therefore, either I or II must follow.',
    shortcutTrick: 'Complementary pair condition: Same elements ("mango" and "sweet"), both conclusions false individually in definite case, one is "Some" and other is "No". Result is always EITHER...OR.',
    difficulty: 'Medium',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-3'
  },
  {
    id: 'q-reas-03',
    subjectId: 'reasoning',
    topic: 'Series',
    question: 'Find the next number in the sequence: 7, 11, 19, 35, 67, ?',
    options: ['131', '135', '129', '141'],
    correctAnswer: 0,
    explanation: 'Observe the differences between consecutive terms: 11 - 7 = 4 (2²); 19 - 11 = 8 (2³); 35 - 19 = 16 (2⁴); 67 - 35 = 32 (2⁵). The difference is doubling each step. Next difference = 32 * 2 = 64 (2⁶). Next term = 67 + 64 = 131.',
    shortcutTrick: 'Pattern: Each term is 2 * (previous term) - 3. 7*2-3=11; 11*2-3=19; 19*2-3=35; 35*2-3=67; 67*2-3=131.',
    difficulty: 'Easy',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-2'
  },
  {
    id: 'q-reas-04',
    subjectId: 'reasoning',
    topic: 'Blood Relations',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: ['Father', 'Uncle', 'Brother', 'Grandfather'],
    correctAnswer: 0,
    explanation: 'Break down the statement from the end: "My mother\'s only son" = Suresh himself (since Suresh is a male and the only son of his mother). "He is the son of [Suresh]" = Suresh is the father of the boy.',
    shortcutTrick: 'Only son of mother = Self. Son of self = Son. Therefore Suresh is the Father.',
    difficulty: 'Easy',
    pyqYear: 2021,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2021 Tier-1 Shift-2'
  },
  {
    id: 'q-reas-05',
    subjectId: 'reasoning',
    topic: 'Direction Sense',
    question: 'A man travels 4 km towards North, then turns right and travels 3 km, then turns right again and travels 4 km. How far and in which direction is he from his starting point?',
    options: ['3 km East', '3 km West', '5 km North-East', '7 km East'],
    correctAnswer: 0,
    explanation: 'North 4 km (+y), right turn is East 3 km (+x), right turn is South 4 km (-y). Net vertical movement = +4 - 4 = 0 km. Net horizontal movement = +3 km (East). He is 3 km East of his origin.',
    shortcutTrick: 'North 4 and South 4 cancel each other out. Only 3 km East remains.',
    difficulty: 'Easy',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-4'
  },

  // English Language
  {
    id: 'q-eng-01',
    subjectId: 'english',
    topic: 'Idioms and Phrases',
    question: 'What is the correct meaning of the idiom: "To spill the beans"?',
    options: ['To reveal a secret prematurely or indiscreetly', 'To waste food carelessly', 'To spoil a grand plan', 'To sow seeds for future harvest'],
    correctAnswer: 0,
    explanation: '"To spill the beans" is a well-known English idiom meaning to disclose a secret or reveal confidential information unintentionally or prematurely.',
    difficulty: 'Easy',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-1'
  },
  {
    id: 'q-eng-02',
    subjectId: 'english',
    topic: 'Error Detection',
    question: 'Identify the segment containing a grammatical error: "Neither of the two candidates (A) / have submitted (B) / their original certificates (C) / to the commission (D)."',
    options: ['have submitted (B)', 'Neither of the two candidates (A)', 'their original certificates (C)', 'to the commission (D)'],
    correctAnswer: 0,
    explanation: '"Neither of" is distributive and takes a singular verb. The correct verb form is "has submitted", not "have submitted".',
    shortcutTrick: 'Rule: Either of, Neither of, Each of, None of + Plural Noun + Singular Verb.',
    formulaUsed: 'Distributive Pronoun Rule: Neither of + Noun(Plural) + Verb(Singular)',
    difficulty: 'Medium',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-2'
  },
  {
    id: 'q-eng-03',
    subjectId: 'english',
    topic: 'One Word Substitution',
    question: 'A person who hates or distrusts humankind is known as a/an:',
    options: ['Misanthrope', 'Philanthropist', 'Misogynist', 'Altruist'],
    correctAnswer: 0,
    explanation: '"Misanthrope" comes from Greek misos (hatred) + anthropos (man/humanity). Philanthropist is a lover of humanity; Misogynist is one who hates women; Altruist is someone who cares unselfishly for others.',
    shortcutTrick: 'Root Words: Mis/Miso = Hate, Anthropos = Mankind.',
    difficulty: 'Easy',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-3'
  },
  {
    id: 'q-eng-04',
    subjectId: 'english',
    topic: 'Active and Passive Voice',
    question: 'Choose the correct passive voice of: "The storm destroyed twelve houses along the coast."',
    options: [
      'Twelve houses along the coast were destroyed by the storm.',
      'Twelve houses along the coast had been destroyed by the storm.',
      'Twelve houses along the coast are destroyed by the storm.',
      'Twelve houses along the coast were being destroyed by the storm.'
    ],
    correctAnswer: 0,
    explanation: 'Simple Past Active ("Subject + V2 + Object") converts to Simple Past Passive ("Object + was/were + V3 + by Subject"). Here "destroyed" becomes "were destroyed".',
    difficulty: 'Easy',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-1'
  },
  {
    id: 'q-eng-05',
    subjectId: 'english',
    topic: 'Synonyms',
    question: 'Select the most appropriate synonym of the word "EPHEMERAL":',
    options: ['Transitory', 'Perpetual', 'Unyielding', 'Enduring'],
    correctAnswer: 0,
    explanation: '"Ephemeral" means lasting for a very short time; fleeting or transient. Hence "Transitory" is the direct synonym. Perpetual and Enduring are antonyms.',
    difficulty: 'Medium',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-1'
  },

  // General Awareness
  {
    id: 'q-ga-01',
    subjectId: 'general-awareness',
    topic: 'Indian Polity',
    question: 'Under which Article of the Constitution of India can the Supreme Court issue writs for the enforcement of Fundamental Rights?',
    options: ['Article 32', 'Article 226', 'Article 143', 'Article 131'],
    correctAnswer: 0,
    explanation: 'Article 32 empowers the Supreme Court to issue writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari) for the enforcement of Fundamental Rights. Dr. B.R. Ambedkar called Article 32 the "Heart and Soul of the Constitution". (Article 226 gives writ jurisdiction to High Courts).',
    difficulty: 'Easy',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-1'
  },
  {
    id: 'q-ga-02',
    subjectId: 'general-awareness',
    topic: 'Indian History',
    question: 'Who among the following was the founder of the Indian National Congress in 1885?',
    options: ['Allan Octavian Hume', 'W.C. Bonnerjee', 'Dadabhai Naoroji', 'Gopal Krishna Gokhale'],
    correctAnswer: 0,
    explanation: 'A.O. Hume, a retired British civil servant, organized the first session of the Indian National Congress in Bombay in December 1885. W.C. Bonnerjee was the first President of INC, and Lord Dufferin was the Viceroy at that time.',
    difficulty: 'Easy',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-2'
  },
  {
    id: 'q-ga-03',
    subjectId: 'general-awareness',
    topic: 'Geography',
    question: 'Which of the following mountain passes connects Srinagar with Leh in Ladakh?',
    options: ['Zoji La', 'Rohtang Pass', 'Nathu La', 'Shipki La'],
    correctAnswer: 0,
    explanation: 'Zoji La pass is located on National Highway 1D between Srinagar and Leh. Nathu La connects Sikkim with Tibet; Rohtang Pass is in Himachal Pradesh; Shipki La is on the Himachal-Tibet border.',
    difficulty: 'Medium',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-4'
  },
  {
    id: 'q-ga-04',
    subjectId: 'general-awareness',
    topic: 'General Science',
    question: 'Which enzyme present in human saliva initiates the chemical digestion of dietary carbohydrates (starches)?',
    options: ['Salivary Amylase (Ptyalin)', 'Pepsin', 'Trypsin', 'Lipase'],
    correctAnswer: 0,
    explanation: 'Salivary amylase (also known as ptyalin) breaks down complex starches into maltose and dextrin in the mouth. Pepsin breaks down proteins in the stomach; Trypsin operates in the duodenum; Lipase breaks down dietary fats.',
    difficulty: 'Easy',
    pyqYear: 2022,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2022 Tier-1 Shift-1'
  },
  {
    id: 'q-ga-05',
    subjectId: 'general-awareness',
    topic: 'Economics',
    question: 'What is the term for a situation where inflation and economic stagnation (slow growth and high unemployment) occur simultaneously?',
    options: ['Stagflation', 'Deflation', 'Hyperinflation', 'Reflation'],
    correctAnswer: 0,
    explanation: 'Stagflation is an economic condition characterized by stagnant economic growth, high unemployment, and high inflation. It defies the simple Phillips curve relationship.',
    difficulty: 'Medium',
    pyqYear: 2021,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2021 Tier-1 Shift-3'
  },
  {
    id: 'q-ga-06',
    subjectId: 'general-awareness',
    topic: 'Static GK',
    question: 'In which Indian state is the famous classical dance form "Kathakali" traditionally originated and performed?',
    options: ['Kerala', 'Tamil Nadu', 'Odisha', 'Andhra Pradesh'],
    correctAnswer: 0,
    explanation: 'Kathakali originated in southwestern India, specifically the state of Kerala. Tamil Nadu is famous for Bharatanatyam, Odisha for Odissi, and Andhra Pradesh for Kuchipudi.',
    difficulty: 'Easy',
    pyqYear: 2023,
    pyqTier: 'Tier-1',
    pyqExam: 'SSC CGL 2023 Tier-1 Shift-2'
  }
];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-cgl-tier1-full-01',
    title: 'SSC CGL Tier-1 All-India Live Full Mock #01',
    description: 'Real exam pattern simulation covering all 4 sections (General Intelligence, General Awareness, Quantitative Aptitude, English Comprehension). 60 Minutes, 100 Qs (+2.0 / -0.50).',
    type: 'full-tier1',
    totalQuestions: 20, // Sample set of curated questions expandable to 100
    totalMarks: 40,
    durationMinutes: 25,
    positiveMarksPerQuestion: 2.0,
    negativeMarksPerQuestion: 0.5,
    sections: [
      { subjectId: 'reasoning', title: 'General Intelligence & Reasoning', questionCount: 5, marks: 10 },
      { subjectId: 'general-awareness', title: 'General Awareness', questionCount: 5, marks: 10 },
      { subjectId: 'quantitative-aptitude', title: 'Quantitative Aptitude', questionCount: 5, marks: 10 },
      { subjectId: 'english', title: 'English Comprehension', questionCount: 5, marks: 10 }
    ],
    questionIds: [
      'q-reas-01', 'q-reas-02', 'q-reas-03', 'q-reas-04', 'q-reas-05',
      'q-ga-01', 'q-ga-02', 'q-ga-03', 'q-ga-04', 'q-ga-05',
      'q-quant-01', 'q-quant-02', 'q-quant-03', 'q-quant-04', 'q-quant-05',
      'q-eng-01', 'q-eng-02', 'q-eng-03', 'q-eng-04', 'q-eng-05'
    ],
    difficulty: 'Medium',
    attemptCount: 14250,
    averageScore: 26.8
  },
  {
    id: 'mock-cgl-quant-special',
    title: 'Quantitative Aptitude Speed & Accuracy Booster',
    description: 'Focused sectional mock test on arithmetic, algebra, and geometry with detailed shortcut methods.',
    type: 'subject',
    subjectId: 'quantitative-aptitude',
    totalQuestions: 6,
    totalMarks: 12,
    durationMinutes: 10,
    positiveMarksPerQuestion: 2.0,
    negativeMarksPerQuestion: 0.5,
    questionIds: ['q-quant-01', 'q-quant-02', 'q-quant-03', 'q-quant-04', 'q-quant-05', 'q-quant-06'],
    difficulty: 'Hard',
    attemptCount: 9840,
    averageScore: 7.4
  },
  {
    id: 'mock-cgl-pyq-2023-tier1',
    title: 'SSC CGL 2023 Tier-1 Official Paper (Shift-1)',
    description: 'Exact questions asked in the actual SSC CGL 2023 Tier-1 Examination with official answer keys and step-by-step solutions.',
    type: 'pyq',
    pyqYear: 2023,
    totalQuestions: 12,
    totalMarks: 24,
    durationMinutes: 15,
    positiveMarksPerQuestion: 2.0,
    negativeMarksPerQuestion: 0.5,
    questionIds: [
      'q-quant-01', 'q-quant-03', 'q-quant-04',
      'q-reas-01', 'q-reas-02', 'q-reas-05',
      'q-eng-01', 'q-eng-02', 'q-eng-04',
      'q-ga-01', 'q-ga-03', 'q-ga-06'
    ],
    difficulty: 'Medium',
    attemptCount: 22100,
    averageScore: 16.2
  },
  {
    id: 'mock-cgl-reasoning-speed',
    title: 'General Intelligence Reasoning 15-Minute Sprint',
    description: 'High-speed test targeting Syllogism, Coding-Decoding, Number Series, and Direction Sense.',
    type: 'subject',
    subjectId: 'reasoning',
    totalQuestions: 5,
    totalMarks: 10,
    durationMinutes: 8,
    positiveMarksPerQuestion: 2.0,
    negativeMarksPerQuestion: 0.5,
    questionIds: ['q-reas-01', 'q-reas-02', 'q-reas-03', 'q-reas-04', 'q-reas-05'],
    difficulty: 'Medium',
    attemptCount: 8120,
    averageScore: 7.8
  },
  {
    id: 'mock-cgl-english-mastery',
    title: 'English Grammar & Vocabulary Diagnostic Test',
    description: 'Test your grasp on subject-verb agreement, idioms, synonyms, active-passive voice, and cloze test strategies.',
    type: 'subject',
    subjectId: 'english',
    totalQuestions: 5,
    totalMarks: 10,
    durationMinutes: 8,
    positiveMarksPerQuestion: 2.0,
    negativeMarksPerQuestion: 0.5,
    questionIds: ['q-eng-01', 'q-eng-02', 'q-eng-03', 'q-eng-04', 'q-eng-05'],
    difficulty: 'Medium',
    attemptCount: 11500,
    averageScore: 8.1
  },
  {
    id: 'mock-cgl-ga-highyield',
    title: 'General Awareness High-Yield Static GK & Polity Test',
    description: 'Essential questions from Indian Constitution, Modern History, Geography passes, and Biology enzymes.',
    type: 'subject',
    subjectId: 'general-awareness',
    totalQuestions: 6,
    totalMarks: 12,
    durationMinutes: 8,
    positiveMarksPerQuestion: 2.0,
    negativeMarksPerQuestion: 0.5,
    questionIds: ['q-ga-01', 'q-ga-02', 'q-ga-03', 'q-ga-04', 'q-ga-05', 'q-ga-06'],
    difficulty: 'Medium',
    attemptCount: 15400,
    averageScore: 8.9
  }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-quant-formulas',
    title: 'Complete Algebra & Trigonometry Formula Pocket Sheet',
    subjectId: 'quantitative-aptitude',
    topic: 'Algebra',
    category: 'Formulas',
    readTimeMinutes: 7,
    summary: 'All vital algebraic identities, symmetric conditions, component-dividendo rules, and trigonometric value tables frequently tested in CGL.',
    content: `### 1. Fundamental Algebraic Identities
- **(a + b)²** = a² + 2ab + b²
- **(a - b)²** = a² - 2ab + b²
- **a² - b²** = (a - b)(a + b)
- **(a + b + c)²** = a² + b² + c² + 2(ab + bc + ca)
- **a³ + b³ + c³ - 3abc** = (a + b + c)(a² + b² + c² - ab - bc - ca) = 1/2(a + b + c)[(a - b)² + (b - c)² + (c - a)²]

> **Golden SSC Rule**: If a + b + c = 0, then a³ + b³ + c³ = 3abc.

### 2. Standard Symmetric Forms (x + 1/x)
If **x + 1/x = k**:
1. x² + 1/x² = k² - 2
2. x³ + 1/x³ = k³ - 3k
3. x⁴ + 1/x⁴ = (k² - 2)² - 2
4. x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) - (x + 1/x) = (k² - 2)(k³ - 3k) - k

### 3. Trigonometric Triplets & Identities
- **sin²θ + cos²θ = 1**
- **1 + tan²θ = sec²θ** ➔ sec²θ - tan²θ = 1 ➔ (secθ - tanθ) = 1 / (secθ + tanθ)
- **1 + cot²θ = cosec²θ** ➔ cosec²θ - cot²θ = 1
- Common Pythagorean Triplets: (3, 4, 5), (5, 12, 13), (7, 24, 25), (8, 15, 17), (9, 40, 41), (11, 60, 61), (12, 35, 37), (20, 21, 29).`,
    keyPoints: [
      'If x + 1/x = 2, then x = 1 (x^n + 1/x^n = 2)',
      'If x + 1/x = -2, then x = -1',
      'If x + 1/x = √3, then x⁶ = -1 and x¹² = 1'
    ],
    updatedAt: '2026-09-15'
  },
  {
    id: 'mat-quant-tricks',
    title: 'Percentage & Profit-Loss Fraction Conversion Shortcuts',
    subjectId: 'quantitative-aptitude',
    topic: 'Percentage',
    category: 'Short Tricks',
    readTimeMinutes: 5,
    summary: 'Memory chart of fraction to percentage tables (1/1 to 1/25) for solving arithmetic in under 15 seconds.',
    content: `### Fractional Equivalents (Must Memorize):
- 1/2 = 50%
- 1/3 = 33.33% (33 1/3%)
- 1/4 = 25%
- 1/5 = 20%
- 1/6 = 16.66% (16 2/3%)
- 1/7 = 14.28% (14 2/7%)
- 1/8 = 12.5% (12 1/2%)
- 1/9 = 11.11% (11 1/9%)
- 1/10 = 10%
- 1/11 = 9.09% (9 1/11%)
- 1/12 = 8.33% (8 1/3%)
- 1/13 = 7.69%
- 1/14 = 7.14%
- 1/15 = 6.66%
- 1/16 = 6.25%
- 1/20 = 5%
- 1/25 = 4%

### Application Rule:
If A is x% more than B (fraction +a/b), then B is (a / (a + b)) * 100% less than A.
Example: Sugar price increases by 25% (+1/4). To maintain expenditure, consumption must decrease by 1/(4+1) = 1/5 = 20%.`,
    keyPoints: [
      'Converting percentages to fractions eliminates complex decimal calculations.',
      'Always simplify ratios before computing compounding intervals.'
    ],
    updatedAt: '2026-09-10'
  },
  {
    id: 'mat-eng-grammar-rules',
    title: 'Top 50 Golden Rules of English Grammar for SSC CGL',
    subjectId: 'english',
    topic: 'Grammar',
    category: 'Notes',
    readTimeMinutes: 10,
    summary: 'The most repeated grammatical rules tested in Sentence Improvement and Error Detection over the past 10 years.',
    content: `### Rule 1: Subject Connected by 'As well as', 'With', 'Along with'
When two subjects are joined by **as well as, along with, together with, with, in addition to, accompanied by, like, unlike, rather than**, the verb agrees with the **FIRST subject**.
- *Incorrect*: The captain, along with his sailors, were drowned.
- *Correct*: The captain, along with his sailors, **was** drowned.

### Rule 2: Correlative Conjunctions
When subjects are connected by **either...or, neither...nor, not only...but also**, the verb agrees with the **NEAREST subject**.
- *Incorrect*: Neither the teacher nor the students was present.
- *Correct*: Neither the teacher nor the students **were** present.

### Rule 3: The Distributives
**Each, Every, Either, Neither, Everyone, Anyone, Nobody** are strictly singular and followed by a singular verb and singular pronoun.
- *Example*: Each of the students has finished his/her assignment.

### Rule 4: Hyphenated Compound Nouns
A hyphenated noun or noun used as an adjective does not take a plural 's'.
- *Incorrect*: He gave me a five-hundreds rupee note.
- *Correct*: He gave me a **five-hundred rupee note**.

### Rule 5: Scarcely/Hardly and No Sooner
- **No sooner** is followed by **than** (and uses inversion: No sooner had he arrived than...).
- **Hardly / Scarcely** is followed by **when** (Hardly had she entered when the phone rang).`,
    keyPoints: [
      'Never use "than" with Hardly or Scarcely.',
      'Never use "when" with No sooner.',
      'Look for the subject closest to the verb in Either/Or sentences.'
    ],
    updatedAt: '2026-09-18'
  },
  {
    id: 'mat-ga-polity-articles',
    title: 'Crucial Articles & Schedules of Indian Constitution',
    subjectId: 'general-awareness',
    topic: 'Indian Polity',
    category: 'Static GK',
    readTimeMinutes: 8,
    summary: 'High-frequency articles on Fundamental Rights, DPSP, Writs, Emergency provisions, and Constitutional Bodies.',
    content: `### Key Parts of the Constitution:
- **Part I**: Union and its Territory (Articles 1–4)
- **Part II**: Citizenship (Articles 5–11)
- **Part III**: Fundamental Rights (Articles 12–35)
- **Part IV**: Directive Principles of State Policy (Articles 36–51)
- **Part IV-A**: Fundamental Duties (Article 51A, added by 42nd Amendment 1976)
- **Part V**: The Union (Articles 52–151)
- **Part XVIII**: Emergency Provisions (Articles 352, 356, 360)

### Most Asked Articles:
- **Article 14**: Equality before Law
- **Article 17**: Abolition of Untouchability
- **Article 21**: Protection of Life and Personal Liberty
- **Article 21A**: Right to Elementary Education (86th Amendment 2002)
- **Article 32**: Remedies for Enforcement of Fundamental Rights (Supreme Court Writs)
- **Article 40**: Organization of Village Panchayats
- **Article 44**: Uniform Civil Code
- **Article 76**: Attorney-General for India
- **Article 108**: Joint Sitting of both Houses of Parliament
- **Article 110**: Money Bills definition
- **Article 112**: Annual Financial Statement (Budget)
- **Article 148**: Comptroller and Auditor-General of India (CAG)
- **Article 280**: Finance Commission
- **Article 324**: Election Commission of India`,
    keyPoints: [
      'Writs: Article 32 (Supreme Court) vs Article 226 (High Court - broader scope).',
      'Article 352: National Emergency, Article 356: President Rule, Article 360: Financial Emergency.'
    ],
    updatedAt: '2026-09-12'
  },
  {
    id: 'mat-reas-syllogism',
    title: 'Venn Diagram & 100-50 Method for Syllogisms',
    subjectId: 'reasoning',
    topic: 'Syllogism',
    category: 'Short Tricks',
    readTimeMinutes: 6,
    summary: 'Master all Syllogism variations including "Only a few", "Can be", and complementary "Either-Or" pairs in minutes.',
    content: `### 1. Statement Interpretations:
1. **All A are B** (Universal Positive)
   - Value: A is 100, B is 50.
   - Definite truth: Some A are B, Some B are A.
2. **No A is B** (Universal Negative)
   - Value: A is 100, B is 100.
   - Definite truth: No B is A, Some A are not B, Some B are not A.
3. **Some A are B** (Particular Positive)
   - Value: A is 50, B is 50.
   - Definite truth: Some B are A.
4. **Some A are not B** (Particular Negative)
   - Value: A is 50, B is 100.

### 2. The Modern SSC "Only a few" Concept:
- **"Only a few A are B"** means BOTH:
  1. *Some A are B* (True)
  2. *Some A are NOT B* (True)
  - Therefore: "All A can never be B" is always DEFINITELY TRUE!

### 3. Either-Or Complementary Conditions:
Both conditions must be met:
1. Both conclusions must be doubtful/uncertain individually.
2. Subject and Predicate must be the same in both conclusions.
3. One conclusion is affirmative and the other is negative:
   - Some + No (Standard Pair)
   - All + Some Not (Standard Pair)
   *(Note: All + No NEVER forms an Either-Or pair!)*`,
    keyPoints: [
      '"Only a few" is a combination of Some + Some Not.',
      'Possibility rule: If a relationship is unknown, any possibility is TRUE.'
    ],
    updatedAt: '2026-09-14'
  },
  ...COMPLETE_STUDY_LIBRARY
];

export const INITIAL_CURRENT_AFFAIRS: CurrentAffairItem[] = [
  {
    id: 'ca-01',
    title: 'India achieves milestone in Renewable Energy capacity expansion',
    date: 'September 2026',
    category: 'Economy',
    summary: 'India crossed 200 GW of non-fossil fuel installed capacity, progressing towards the 500 GW target by 2030.',
    detailedText: 'The Ministry of New and Renewable Energy reported that non-fossil fuel power generation accounts for over 45% of total electric installed capacity. Solar photovoltaic installations and hybrid wind-solar projects drove the rapid surge.',
    tags: ['Renewable Energy', 'Economy', 'COP30', 'Target 2030'],
    sampleQuestions: [
      {
        question: 'What is India’s non-fossil energy capacity target set for the year 2030 under its updated Nationally Determined Contributions (NDCs)?',
        options: ['500 GW', '350 GW', '400 GW', '600 GW'],
        correctAnswer: 0,
        explanation: 'India committed at COP26 and in its updated NDCs to achieve 500 GW of non-fossil fuel energy capacity by 2030.'
      }
    ]
  },
  {
    id: 'ca-02',
    title: 'ISRO advances Next-Generation Launch Vehicle (NGLV) roadmap',
    date: 'September 2026',
    category: 'Science & Tech',
    summary: 'ISRO finalized architectural benchmarks for the reusable NGLV "Soorya" capable of carrying up to 30 tonnes to Low Earth Orbit.',
    detailedText: 'The project aims to provide cost-effective heavy-lift capabilities for the future Bharatiya Antariksh Station (BAS) and planned lunar missions. The launch vehicle will utilize methane-liquid oxygen propellants.',
    tags: ['ISRO', 'NGLV', 'Space Technology', 'Bharatiya Antariksh Station'],
    sampleQuestions: [
      {
        question: 'What propellant combination is primarily planned for ISRO\'s upcoming semi-cryogenic and reusable Next-Generation Launch Vehicle (NGLV)?',
        options: ['Methane and Liquid Oxygen (Methalox)', 'Hydrogen and Liquid Oxygen', 'UDMH and Nitrogen Tetroxide', 'Solid HTPB'],
        correctAnswer: 0,
        explanation: 'The NGLV utilizes environmentally friendly, cost-effective Methalox (liquid methane and liquid oxygen) propulsion for reusability.'
      }
    ]
  },
  {
    id: 'ca-03',
    title: 'India hosts Global Digital Public Infrastructure Summit',
    date: 'August 2026',
    category: 'National',
    summary: 'Over 40 nations participated to study India Stack components including UPI, DigiLocker, and Aadhaar-enabled services.',
    detailedText: 'Delegates focused on open protocols and interoperable financial identity frameworks. Several developing economies signed bilateral MoUs to deploy adapted versions of the Unified Payments Interface (UPI).',
    tags: ['Digital India', 'UPI', 'India Stack', 'National Governance'],
    sampleQuestions: [
      {
        question: 'Which organization operates and manages the Unified Payments Interface (UPI) in India?',
        options: ['National Payments Corporation of India (NPCI)', 'Reserve Bank of India (RBI)', 'State Bank of India', 'NITI Aayog'],
        correctAnswer: 0,
        explanation: 'NPCI (National Payments Corporation of India), an umbrella organization founded by RBI and IBA under the PSS Act 2007, manages UPI.'
      }
    ]
  },
  {
    id: 'ca-04',
    title: 'New Tiger Reserve notified under Project Tiger',
    date: 'August 2026',
    category: 'National',
    summary: 'The National Tiger Conservation Authority (NTCA) approved the establishment of India\'s latest Tiger Reserve.',
    detailedText: 'Project Tiger, which celebrated 50 years of conservation, now manages over 55 designated reserves across 18 states, protecting approximately 75% of the world\'s wild tiger population.',
    tags: ['Environment', 'Project Tiger', 'Biodiversity', 'NTCA'],
    sampleQuestions: [
      {
        question: 'In which year was "Project Tiger" originally launched by the Government of India?',
        options: ['1973', '1982', '1971', '1986'],
        correctAnswer: 0,
        explanation: 'Project Tiger was launched on April 1, 1973, from Jim Corbett National Park in Uttarakhand during the tenure of Prime Minister Indira Gandhi.'
      }
    ]
  }
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'user-01', name: 'Aditya Sharma', avatarSeed: 'aditya', score: 188.5, accuracy: 94.2, testsCompleted: 48, streak: 24 },
  { rank: 2, userId: 'user-02', name: 'Priya Mukherjee', avatarSeed: 'priya', score: 184.0, accuracy: 92.5, testsCompleted: 45, streak: 31 },
  { rank: 3, userId: 'user-03', name: 'Rohan Verma', avatarSeed: 'rohan', score: 181.5, accuracy: 91.0, testsCompleted: 42, streak: 19 },
  { rank: 4, userId: 'user-04', name: 'Sneha Patel', avatarSeed: 'sneha', score: 177.0, accuracy: 89.4, testsCompleted: 39, streak: 15 },
  { rank: 5, userId: 'user-05', name: 'Vikas Meena', avatarSeed: 'vikas', score: 174.5, accuracy: 88.0, testsCompleted: 36, streak: 12 },
  { rank: 6, userId: 'user-demo', name: 'Navin Kumar (You)', avatarSeed: 'navin', score: 168.0, accuracy: 82.0, testsCompleted: 18, streak: 12 },
  { rank: 7, userId: 'user-07', name: 'Ananya Roy', avatarSeed: 'ananya', score: 165.5, accuracy: 85.2, testsCompleted: 29, streak: 9 },
  { rank: 8, userId: 'user-08', name: 'Mohit Chauhan', avatarSeed: 'mohit', score: 162.0, accuracy: 84.1, testsCompleted: 25, streak: 6 },
  { rank: 9, userId: 'user-09', name: 'Divya Nair', avatarSeed: 'divya', score: 159.5, accuracy: 82.8, testsCompleted: 22, streak: 8 },
  { rank: 10, userId: 'user-10', name: 'Kunal Joshi', avatarSeed: 'kunal', score: 156.0, accuracy: 81.5, testsCompleted: 20, streak: 4 }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'ach-first-step', title: 'First Step', description: 'Attempt your first mock test or practice quiz', iconName: 'Compass', unlockedAt: '2026-09-20', progress: 1, maxProgress: 1 },
  { id: 'ach-streak-7', title: 'Consistency King', description: 'Maintain an uninterrupted 12-day preparation streak', iconName: 'Flame', unlockedAt: '2026-09-28', progress: 12, maxProgress: 12 },
  { id: 'ach-centurion', title: 'Centurion', description: 'Solve 100+ questions across any subject', iconName: 'Award', unlockedAt: '2026-09-25', progress: 100, maxProgress: 100 },
  { id: 'ach-quant-master', title: 'Quant Prodigy', description: 'Score above 85% accuracy in 5 Quantitative Aptitude drills', iconName: 'Zap', unlockedAt: null, progress: 3, maxProgress: 5 },
  { id: 'ach-speed-demon', title: 'Speed Demon', description: 'Solve 25 questions in under 15 minutes with > 80% accuracy', iconName: 'Timer', unlockedAt: null, progress: 0, maxProgress: 1 },
  { id: 'ach-mock-veteran', title: 'Mock Veteran', description: 'Complete 18 full-length SSC CGL Tier-1 Mock Tests', iconName: 'Trophy', unlockedAt: null, progress: 18, maxProgress: 20 }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif-1', title: 'Daily Study Goal Alert', message: 'Navin Kumar, your daily study goal is 80% complete. Solve remaining practice questions to maintain your 12-day streak!', type: 'reminder', timestamp: '1 hour ago', read: false },
  { id: 'notif-2', title: 'New Mock Test Available', message: 'SSC CGL Tier-1 All-India Mock #02 has been released. Test your rank against 15,000+ peers!', type: 'test', timestamp: '5 hours ago', read: false },
  { id: 'notif-3', title: 'Achievement Unlocked!', message: 'Congratulations, Navin Kumar! You maintained your preparation streak for 12 days.', type: 'achievement', timestamp: 'Yesterday', read: true }
];
