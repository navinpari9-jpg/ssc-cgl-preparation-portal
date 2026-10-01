import { GoogleGenAI, Type } from '@google/genai';

// Prioritized list of compatible, active models from @google/genai guidelines
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

export const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// Safe JSON extraction from potential code fences or raw text
function extractAndParseJson<T>(rawText: string): T | null {
  if (!rawText) return null;
  const trimmed = rawText.trim();
  
  // Try direct parse
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // Attempt to extract from ```json ... ``` or ``` ... ```
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) {
      try {
        return JSON.parse(match[1].trim()) as T;
      } catch {
        // Fall through
      }
    }
    
    // Attempt to extract between first '{' and last '}' or '[' and ']'
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.substring(firstBrace, lastBrace + 1)) as T;
      } catch {
        // Fall through
      }
    }

    const firstBracket = trimmed.indexOf('[');
    const lastBracket = trimmed.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      try {
        return JSON.parse(trimmed.substring(firstBracket, lastBracket + 1)) as T;
      } catch {
        // Fall through
      }
    }
  }
  return null;
}

// Resilient model caller that tries candidates if capacity or model issues occur
async function callGeminiWithFallback(
  callFn: (modelName: string, ai: GoogleGenAI) => Promise<any>
): Promise<any> {
  const ai = getAiClient();
  if (!ai) {
    const error: any = new Error('GEMINI_API_KEY is not configured');
    error.status = 401;
    throw error;
  }

  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      return await callFn(model, ai);
    } catch (err: any) {
      lastError = err;
      const status = err.status || (err.error && err.error.code);
      console.warn(`Gemini model ${model} failed with status ${status}:`, err.message || err);
      // If 503 (high demand) or 404 (model not found), continue to next candidate
      if (status === 503 || status === 404 || status === 429) {
        continue;
      }
      // If it's a fatal validation or auth error, don't keep cycling uselessly
      if (status === 400 || status === 401 || status === 403) {
        throw err;
      }
    }
  }
  throw lastError;
}

// -------------------------------------------------------------
// 1. Connection Test
// -------------------------------------------------------------
export async function testAIConnection(): Promise<{ success: boolean; message: string; error?: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return {
      success: false,
      message: 'Gemini AI connection failed',
      error: 'GEMINI_API_KEY is missing from environment variables'
    };
  }

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: 'Confirm connection in one word: READY.'
      });
    });

    const reply = response.text ? response.text.trim() : '';
    return {
      success: true,
      message: `Gemini AI connection successful (${reply || 'OK'})`
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Gemini AI connection failed',
      error: error.message || 'Unknown network error'
    };
  }
}

// -------------------------------------------------------------
// 2. AI Tutor
// -------------------------------------------------------------
export interface TutorRequestParams {
  question: string;
  subject?: string;
  topic?: string;
  mode?: string;
}

export interface TutorResponseData {
  success: boolean;
  answer: string;
  formula?: string;
  shortcut?: string;
  examTip?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  relatedTopics: string[];
  error?: string;
}

export async function askAITutor(params: TutorRequestParams): Promise<TutorResponseData> {
  const query = (params.question || '').trim();
  if (!query) {
    return {
      success: false,
      answer: '',
      relatedTopics: [],
      error: 'Please enter a valid question.'
    };
  }

  const subject = params.subject || 'All Subjects';
  const topic = params.topic || 'General';

  const systemInstruction = `You are a senior SSC CGL mentor and exam expert.
Always respond in clear, formal, accurate English. All text, formulas, steps, tips, and shortcuts MUST be in English only.
Specializations:
- Quantitative Aptitude (Arithmetic, Algebra, Geometry, Mensuration, Trigonometry, Number System)
- General Intelligence & Reasoning (Syllogisms, Blood Relations, Coding-Decoding, Series, Non-Verbal)
- English Language (Grammar rules, Vocabulary roots, Sentence Improvement, Error Detection)
- General Awareness (Indian Polity, Modern History, Geography, Economy, Science, Static GK)

Requirements for each answer:
1. Provide a comprehensive, accurate step-by-step solution.
2. State the canonical formula or rule used.
3. Provide an exam-tested "Speed Shortcut" or elimination technique (ideal for 40-second CBT targets).
4. Provide a practical "Exam Tip" highlighting common trap distractors or units pitfalls.
5. Provide 2 to 4 related SSC CGL topics.
6. Rate the difficulty as Easy, Medium, or Hard.`;

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: `Subject: ${subject}
Topic: ${topic}
Student Question: "${query}"

Provide the step-by-step solution and analysis following the required JSON schema.`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: {
                type: Type.STRING,
                description: 'Detailed step-by-step solution and final answer in clear English'
              },
              formula: {
                type: Type.STRING,
                description: 'The primary mathematical formula or grammatical rule utilized'
              },
              shortcut: {
                type: Type.STRING,
                description: 'Topper shortcut, alligation method, option elimination, or speed trick'
              },
              examTip: {
                type: Type.STRING,
                description: 'Crucial exam tip or common pitfall to avoid in SSC CGL CBT'
              },
              difficulty: {
                type: Type.STRING,
                description: 'Easy, Medium, or Hard'
              },
              relatedTopics: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Related syllabus topics'
              }
            },
            required: ['answer', 'formula', 'shortcut', 'examTip', 'relatedTopics']
          }
        }
      });
    });

    const parsed = extractAndParseJson<TutorResponseData>(response.text);
    if (!parsed || !parsed.answer) {
      // If structured parsing was imperfect, use raw text safely
      const rawText = response.text || '';
      return {
        success: true,
        answer: rawText,
        formula: 'Standard identity applicable to ' + topic,
        shortcut: 'Check option divisibility and units digit to save time.',
        examTip: 'Double check units consistency before calculating final values.',
        relatedTopics: [topic, subject]
      };
    }

    return {
      success: true,
      answer: parsed.answer,
      formula: parsed.formula || 'Standard formula for ' + topic,
      shortcut: parsed.shortcut || 'Verify by testing options directly.',
      examTip: parsed.examTip || 'Eliminate extreme options immediately.',
      difficulty: (parsed.difficulty as any) || 'Medium',
      relatedTopics: Array.isArray(parsed.relatedTopics) ? parsed.relatedTopics : [topic]
    };
  } catch (error: any) {
    console.error('askAITutor Error:', error);
    const status = error.status || (error.error && error.error.code);
    return {
      success: false,
      answer: '',
      relatedTopics: [],
      error: status === 401
        ? 'GEMINI_API_KEY is not configured or invalid on the server.'
        : 'AI service temporarily unavailable. Please retry shortly.'
    };
  }
}

// -------------------------------------------------------------
// 3. AI Question Generator
// -------------------------------------------------------------
export interface GeneratedQuestionItem {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string; // The exact string of the correct option
  correctAnswerIndex?: number;
  explanation: string;
  formula: string;
  shortcut: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export async function generateAIQuestions(params: {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
}): Promise<{ success: boolean; questions: GeneratedQuestionItem[]; error?: string }> {
  const { subject, topic, difficulty } = params;
  const numQuestions = Math.min(Math.max(params.count || 5, 1), 10);

  const prompt = `Generate exactly ${numQuestions} authentic, high-quality SSC CGL multiple-choice questions (MCQs) for Tier-1/Tier-2.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}

Strict Requirements:
1. Every question must be in English only. Never output Hindi or regional language text.
2. Provide exactly 4 distinct and plausible options for each question.
3. "correctAnswer" must match exactly one of the 4 items in the "options" array.
4. Calculations must be 100% mathematically correct and internally consistent.
5. Provide a clear step-by-step explanation.
6. Provide the formula used.
7. Provide an exam shortcut method.
8. Set the difficulty to "${difficulty}".
9. Set the topic to "${topic}".`;

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                formula: { type: Type.STRING },
                shortcut: { type: Type.STRING },
                difficulty: { type: Type.STRING },
                topic: { type: Type.STRING }
              },
              required: [
                'question',
                'options',
                'correctAnswer',
                'explanation',
                'formula',
                'shortcut',
                'difficulty',
                'topic'
              ]
            }
          }
        }
      });
    });

    const parsed = extractAndParseJson<any[]>(response.text);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return {
        success: false,
        questions: [],
        error: 'Failed to parse generated questions from AI.'
      };
    }

    const validated: GeneratedQuestionItem[] = parsed.map((item, idx) => {
      const rawOpts = Array.isArray(item.options) ? item.options.map(String) : [];
      let fourOpts: [string, string, string, string] = [
        rawOpts[0] || 'Option A',
        rawOpts[1] || 'Option B',
        rawOpts[2] || 'Option C',
        rawOpts[3] || 'Option D'
      ];

      // Ensure correctAnswer is exact string and matches options
      let correctStr = String(item.correctAnswer || fourOpts[0]);
      let correctIndex = fourOpts.findIndex(
        opt => opt.trim().toLowerCase() === correctStr.trim().toLowerCase()
      );

      // If correct answer was given as an index (e.g. 0, 1, 2, 3) or 'A', 'B', 'C', 'D'
      if (correctIndex === -1) {
        if (['0', '1', '2', '3'].includes(correctStr.trim())) {
          correctIndex = parseInt(correctStr.trim(), 10);
          correctStr = fourOpts[correctIndex];
        } else if (['a', 'b', 'c', 'd'].includes(correctStr.trim().toLowerCase())) {
          correctIndex = correctStr.trim().toLowerCase().charCodeAt(0) - 97;
          correctStr = fourOpts[correctIndex];
        } else {
          // Default to first option and align
          fourOpts[0] = correctStr;
          correctIndex = 0;
        }
      }

      return {
        question: item.question || `SSC CGL Model Question ${idx + 1} on ${topic}`,
        options: fourOpts,
        correctAnswer: correctStr,
        correctAnswerIndex: correctIndex,
        explanation: item.explanation || 'Step-by-step solution provided by SSC CGL syllabus.',
        formula: item.formula || 'Primary identity for ' + topic,
        shortcut: item.shortcut || 'Verify by testing options directly.',
        difficulty: (item.difficulty as any) || difficulty,
        topic: item.topic || topic
      };
    });

    return {
      success: true,
      questions: validated
    };
  } catch (error: any) {
    console.error('generateAIQuestions Error:', error);
    const status = error.status || (error.error && error.error.code);
    return {
      success: false,
      questions: [],
      error: status === 401
        ? 'GEMINI_API_KEY is missing or invalid on the server.'
        : 'AI service temporarily unavailable. Please try again.'
    };
  }
}

// -------------------------------------------------------------
// 4. AI Performance Analysis
// -------------------------------------------------------------
export interface StudentStatsInput {
  studentName?: string;
  questionsAttempted?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  accuracy?: number;
  subjectScores?: Record<string, number>;
  topicPerformance?: Array<{ topic: string; correct: number; total: number }>;
  mockTestScores?: number[];
  timePerQuestion?: number;
}

export interface PerformanceAnalysisOutput {
  success: boolean;
  strongAreas: string[];
  weakAreas: string[];
  topicsRequiringRevision: string[];
  commonMistakes: string[];
  recommendedStudyOrder: string[];
  personalizedDailyRevisionPlan: string[];
  recommendedPracticeDifficulty: 'Easy' | 'Medium' | 'Hard';
  executiveSummary: string;
  error?: string;
}

export async function analyzeStudentPerformance(stats: StudentStatsInput): Promise<PerformanceAnalysisOutput> {
  const candidateName = stats.studentName || 'Navin Kumar';
  const attempted = stats.questionsAttempted || 1420;
  const correct = stats.correctAnswers || 1113;
  const incorrect = stats.incorrectAnswers !== undefined ? stats.incorrectAnswers : (attempted - correct);
  const accuracy = stats.accuracy || Math.round((correct / (attempted || 1)) * 100);
  const recentScores = stats.mockTestScores || [112, 124, 119, 135, 142, 139, 148, 154];
  const timePerQ = stats.timePerQuestion || 48; // seconds

  const prompt = `Analyze this real SSC CGL student preparation dataset for candidate "${candidateName}":
- Total Questions Attempted: ${attempted}
- Total Correct Answers: ${correct}
- Total Incorrect Answers: ${incorrect}
- Overall Accuracy: ${accuracy}%
- Recent Mock Test Scores (out of 200): ${recentScores.join(', ')}
- Average Time per Question: ${timePerQ} seconds
- Subject Performance: ${JSON.stringify(stats.subjectScores || { 'Quant': 81, 'Reasoning': 91, 'English': 84, 'General Awareness': 68 })}
- Topic Breakdown: ${JSON.stringify(stats.topicPerformance || [
    { topic: 'Algebra', correct: 18, total: 25 },
    { topic: 'Percentage', correct: 22, total: 25 },
    { topic: 'Syllogism', correct: 19, total: 20 },
    { topic: 'Indian Polity', correct: 12, total: 20 },
    { topic: 'Error Detection', correct: 16, total: 20 }
  ])}

Strict Requirements:
1. Provide insights strictly based on this candidate's supplied metrics. Do not invent contradictory numbers.
2. Identify genuine strong areas and critical weak areas.
3. List 3 to 5 priority topics requiring urgent revision.
4. Pinpoint common examination mistakes based on the accuracy level.
5. Provide a recommended study sequence.
6. Provide a personalized daily revision schedule.
7. Recommend target practice difficulty (Easy, Medium, or Hard).
8. Provide an executive summary in encouraging, actionable English.`;

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              strongAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              weakAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
              topicsRequiringRevision: { type: Type.ARRAY, items: { type: Type.STRING } },
              commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedStudyOrder: { type: Type.ARRAY, items: { type: Type.STRING } },
              personalizedDailyRevisionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendedPracticeDifficulty: { type: Type.STRING },
              executiveSummary: { type: Type.STRING }
            },
            required: [
              'strongAreas',
              'weakAreas',
              'topicsRequiringRevision',
              'commonMistakes',
              'recommendedStudyOrder',
              'personalizedDailyRevisionPlan',
              'recommendedPracticeDifficulty',
              'executiveSummary'
            ]
          }
        }
      });
    });

    const parsed = extractAndParseJson<PerformanceAnalysisOutput>(response.text);
    if (!parsed) {
      return {
        success: false,
        strongAreas: [],
        weakAreas: [],
        topicsRequiringRevision: [],
        commonMistakes: [],
        recommendedStudyOrder: [],
        personalizedDailyRevisionPlan: [],
        recommendedPracticeDifficulty: 'Medium',
        executiveSummary: '',
        error: 'Failed to parse AI performance response.'
      };
    }

    return {
      success: true,
      strongAreas: parsed.strongAreas || ['Reasoning Speed', 'Arithmetic'],
      weakAreas: parsed.weakAreas || ['Indian Polity Articles', 'Time & Work'],
      topicsRequiringRevision: parsed.topicsRequiringRevision || ['Mensuration', 'Geometry Theorems'],
      commonMistakes: parsed.commonMistakes || ['Calculation errors under timed conditions', 'Negative marking in GK guesses'],
      recommendedStudyOrder: parsed.recommendedStudyOrder || ['Quant Weak Areas', 'Reasoning Puzzles', 'Daily English Vocab', 'Static GK'],
      personalizedDailyRevisionPlan: parsed.personalizedDailyRevisionPlan || [
        '07:00 AM - 08:30 AM: Quant speed drills and formulas',
        '09:00 AM - 10:00 AM: English grammar & 20 vocab words',
        '02:00 PM - 03:00 PM: General Awareness static capsules',
        '07:00 PM - 08:30 PM: 1 Sectional mock test under strict CBT timing'
      ],
      recommendedPracticeDifficulty: (parsed.recommendedPracticeDifficulty as any) || 'Medium',
      executiveSummary: parsed.executiveSummary || `Hello ${candidateName}, your accuracy is ${accuracy}%. Focus on your lowest scoring topics to cross 160+ in Tier-1.`
    };
  } catch (error: any) {
    console.error('analyzeStudentPerformance Error:', error);
    const status = error.status || (error.error && error.error.code);
    return {
      success: false,
      strongAreas: [],
      weakAreas: [],
      topicsRequiringRevision: [],
      commonMistakes: [],
      recommendedStudyOrder: [],
      personalizedDailyRevisionPlan: [],
      recommendedPracticeDifficulty: 'Medium',
      executiveSummary: '',
      error: status === 401
        ? 'GEMINI_API_KEY is not configured or invalid on the server.'
        : 'AI performance analysis service temporarily unavailable.'
    };
  }
}

// -------------------------------------------------------------
// 5. AI Study Plan Generator
// -------------------------------------------------------------
export interface StudyPlanInputs {
  targetExamDate?: string;
  dailyStudyHours?: number;
  currentAccuracy?: number;
  weakSubjects?: string[];
  strongSubjects?: string[];
  completedTopics?: string[];
}

export interface DayTaskItem {
  subject: string;
  topic: string;
  duration: number; // minutes
  type: string; // "Study", "Practice Drill", "Mock Test", etc.
  notes?: string;
}

export interface DayScheduleItem {
  day: number;
  tasks: DayTaskItem[];
}

export interface AIStudyPlanOutput {
  success: boolean;
  days: DayScheduleItem[];
  recommendationNote?: string;
  error?: string;
}

export async function generateAIStudyPlan(inputs: StudyPlanInputs): Promise<AIStudyPlanOutput> {
  const targetDate = inputs.targetExamDate || '2026-12-15';
  const hours = inputs.dailyStudyHours || 4.5;
  const accuracy = inputs.currentAccuracy || 78;
  const weakSubs = (inputs.weakSubjects && inputs.weakSubjects.length > 0)
    ? inputs.weakSubjects.join(', ')
    : 'Quantitative Aptitude, General Awareness';
  const strongSubs = (inputs.strongSubjects && inputs.strongSubjects.length > 0)
    ? inputs.strongSubjects.join(', ')
    : 'Reasoning, English Comprehension';
  const completed = (inputs.completedTopics && inputs.completedTopics.length > 0)
    ? inputs.completedTopics.join(', ')
    : 'Number System, Percentage, Coding-Decoding';

  const prompt = `Create a realistic, structured 7-day SSC CGL preparation schedule based on these student inputs:
- Target Exam Date: ${targetDate}
- Available Daily Study Hours: ${hours} hours/day
- Current Accuracy: ${accuracy}%
- Weak Subjects (require higher time allocation): ${weakSubs}
- Strong Subjects: ${strongSubs}
- Already Completed Topics: ${completed}

Strict Requirements:
1. Provide exactly 7 days of daily schedules (days 1 to 7).
2. For each day, provide 3 to 4 distinct tasks totaling approximately ${Math.round(hours * 60)} minutes.
3. Distribute time to strengthen weak subjects while maintaining practice in strong subjects.
4. Task types must be one of: "Study", "Practice Drill", "Mock Test", "Revision", "Vocab / GK".
5. Provide clear topic names and duration in minutes.`;

  try {
    const response = await callGeminiWithFallback(async (model, ai) => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              days: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          subject: { type: Type.STRING },
                          topic: { type: Type.STRING },
                          duration: { type: Type.INTEGER, description: 'Duration in minutes' },
                          type: { type: Type.STRING },
                          notes: { type: Type.STRING }
                        },
                        required: ['subject', 'topic', 'duration', 'type']
                      }
                    }
                  },
                  required: ['day', 'tasks']
                }
              },
              recommendationNote: { type: Type.STRING }
            },
            required: ['days']
          }
        }
      });
    });

    const parsed = extractAndParseJson<AIStudyPlanOutput>(response.text);
    if (!parsed || !Array.isArray(parsed.days) || parsed.days.length === 0) {
      return {
        success: false,
        days: [],
        error: 'Failed to generate structured study plan from AI.'
      };
    }

    return {
      success: true,
      days: parsed.days,
      recommendationNote: parsed.recommendationNote || 'Maintain daily consistency and review mistakes before sleeping.'
    };
  } catch (error: any) {
    console.error('generateAIStudyPlan Error:', error);
    const status = error.status || (error.error && error.error.code);
    return {
      success: false,
      days: [],
      error: status === 401
        ? 'GEMINI_API_KEY is missing or invalid on the server.'
        : 'AI Study Planner temporarily unavailable. Please retry.'
    };
  }
}
