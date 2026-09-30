import { GoogleGenAI, Type } from '@google/genai';

// Initialize Gemini SDK with telemetry header per guidelines
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

export interface TutorResponse {
  answer: string;
  keyPoints?: string[];
  shortcutTip?: string;
  recommendedTopics?: string[];
  sampleFollowUp?: string;
}

export async function askAITutor(query: string, context?: { subject?: string; topic?: string; mode?: string }): Promise<TutorResponse> {
  const ai = getAiClient();
  const systemInstruction = `You are an SSC CGL preparation tutor. Always respond in clear, accurate English. Never respond in Hindi, regional languages, or mixed-language text under any circumstances. All explanations, solutions, question text, options, formulas, and shortcut tricks must be in English only. Explain concepts step-by-step using clear, accessible English suitable for SSC CGL aspirants.
You specialize in the Staff Selection Commission Combined Graduate Level (Tier-1 and Tier-2) syllabus:
1. Quantitative Aptitude (Arithmetic, Algebra, Geometry, Trigonometry, Mensuration, Number System)
2. General Intelligence & Reasoning (Syllogisms, Blood Relations, Coding-Decoding, Non-Verbal, Series)
3. English Language (Grammar rules, Vocabulary roots, Idioms, One-word substitution, Cloze Test)
4. General Awareness (Polity, Modern History, Geography, Science, Economics, Static GK)

Rules:
- All responses must be entirely in English.
- Explain concepts with clarity, mathematical rigor, and step-by-step logic.
- Always provide the conventional formula AND a time-saving "SSC Short Trick / Speed Method" where applicable.
- If asked to solve a math/reasoning problem, break it down clearly.
- Highlight exam traps (e.g. unit conversions, negative sign errors, common grammatical pitfalls).
- Avoid confidently inventing factual information. For current affairs, note when verification from official government gazettes/sources is prudent.
- Be encouraging, disciplined, and focused on exam performance.`;

  if (!ai) {
    // High-quality deterministic fallback when API key is not yet set
    return {
      answer: `Here is the comprehensive SSC CGL mentor explanation for: "${query}".\n\n### Core Concept & Examination Insight:\nFor SSC CGL (Tier-1 & Tier-2), questions of this type test both theoretical fundamentals and rapid pattern recognition under timed conditions (each question should ideally be tackled in 40–50 seconds).\n\n### Step-by-Step Approach:\n1. **Identify Given Data**: Always isolate what is known and check units (e.g., km/hr to m/s by multiplying by 5/18).\n2. **Apply Standard Framework**: Formulate the primary equation using standard identities.\n3. **Sanity Check**: Verify that options with extreme values or inconsistent units can be eliminated immediately.\n\n*(Note: To unlock live real-time Gemini 3.8 Flash streaming explanations, configure your GEMINI_API_KEY in the environment.)*`,
      keyPoints: [
        'Always check dimensional units (e.g. km/h vs m/s)',
        'Look for symmetry and elimination options first',
        'Practice daily calculation speed drills for 15 minutes'
      ],
      shortcutTip: 'Use digital root or unit digit checking to eliminate 2 out of 4 options in 5 seconds.',
      recommendedTopics: [context?.topic || 'Algebra', 'Number System', 'Syllogism'],
      sampleFollowUp: 'Would you like to practice 5 exam-level questions on this specific topic?'
    };
  }

  try {
    const prompt = `Student Query: ${query}\nSubject Context: ${context?.subject || 'All Subjects'}\nTopic Context: ${context?.topic || 'General'}\nMode: ${context?.mode || 'General Explanation'}`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const text = response.text || 'Unable to generate response at this time.';
    return {
      answer: text,
      keyPoints: [
        'Master the fundamental theorem before memorizing shortcuts.',
        'Solve previous year questions from 2021–2024 to verify pattern variations.',
        'Keep a formula cheat notebook for weekly revision.'
      ],
      shortcutTip: 'Try solving with options or assuming convenient values (e.g., x = 0, 1, or 2 for symmetric algebra).',
      recommendedTopics: [context?.topic || 'Quantitative Aptitude', 'Reasoning Speed Drill'],
      sampleFollowUp: 'Would you like step-by-step practice questions for this topic?'
    };
  } catch (error: any) {
    console.error('Gemini Tutor Error:', error);
    return {
      answer: `Unable to connect to live AI services right now: ${error.message || 'Network error'}. Here is the general guideline: For this topic in SSC CGL, focus on PYQ patterns (2021-2024) and time-tested shortcut techniques.`,
      shortcutTip: 'Always verify if unit digit or digital sum elimination applies.',
      recommendedTopics: ['Number System', 'Algebra Identities']
    };
  }
}

export interface GeneratedQuestion {
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  shortcutTrick?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export async function generateAIQuestions(params: {
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  count: number;
}): Promise<GeneratedQuestion[]> {
  const { subject, topic, difficulty, count } = params;
  const numQuestions = Math.min(Math.max(count || 5, 1), 10);
  const ai = getAiClient();

  if (!ai) {
    // Fallback sample questions tailored to the request
    return [
      {
        question: `[Practice Sample] In ${subject} (${topic}), if a + b = 10 and ab = 21, what is the value of a³ + b³?`,
        options: ['370', '420', '390', '410'],
        correctAnswer: 0,
        explanation: 'a³ + b³ = (a + b)³ - 3ab(a + b) = 10³ - 3(21)(10) = 1000 - 630 = 370. Alternatively, numbers are 7 and 3 (7+3=10, 7*3=21). 7³ + 3³ = 343 + 27 = 370.',
        shortcutTrick: 'Factor search: 21 = 7 * 3. 7 + 3 = 10. Direct calculation: 7³ + 3³ = 343 + 27 = 370.',
        difficulty,
        topic
      },
      {
        question: `[Practice Sample] If the marked price of an article is ₹800 and two successive discounts of 10% and 5% are given, what is the net selling price?`,
        options: ['₹684', '₹680', '₹692', '₹700'],
        correctAnswer: 0,
        explanation: 'After 10% discount: 800 - 80 = 720. After second 5% discount: 720 - 36 = ₹684.',
        shortcutTrick: 'Net factor = 0.90 * 0.95 = 0.855. 800 * 0.855 = 684.',
        difficulty,
        topic
      }
    ];
  }

  try {
    const prompt = `Generate exactly ${numQuestions} multiple-choice questions for SSC CGL Tier-1/Tier-2 exam.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Strict Requirements:
- Generate all questions, answer choices, explanations, and shortcut tricks in English only. Never output Hindi or regional language text.
- Realistic SSC CGL exam style.
- Exactly 4 plausible options for each question.
- Index of correctAnswer must be an integer from 0 to 3.
- Clear step-by-step explanation with formula.
- Practical shortcut trick.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
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
              correctAnswer: { type: Type.INTEGER, description: '0 to 3' },
              explanation: { type: Type.STRING },
              shortcutTrick: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              topic: { type: Type.STRING }
            },
            required: ['question', 'options', 'correctAnswer', 'explanation', 'difficulty', 'topic']
          }
        }
      }
    });

    const parsed = JSON.parse(response.text || '[]');
    return parsed.map((q: any) => ({
      ...q,
      options: q.options.slice(0, 4) as [string, string, string, string],
      correctAnswer: Math.min(Math.max(q.correctAnswer ?? 0, 0), 3)
    }));
  } catch (error: any) {
    console.error('Gemini Question Generator Error:', error);
    return [
      {
        question: `Sample Fallback Question for ${topic}: If x + 1/x = 3, find x² + 1/x².`,
        options: ['7', '9', '11', '6'],
        correctAnswer: 0,
        explanation: 'x² + 1/x² = 3² - 2 = 9 - 2 = 7.',
        shortcutTrick: 'k² - 2 rule.',
        difficulty: 'Easy',
        topic
      }
    ];
  }
}

export async function analyzeStudentPerformance(stats: {
  studentName?: string;
  totalMockTests: number;
  averageScore: number;
  accuracy: number;
  weakTopics: string[];
  strongTopics: string[];
  recentTestScores: number[];
}): Promise<{
  executiveSummary: string;
  strengthsSummary: string;
  criticalGaps: string[];
  actionPlanDaily: string[];
  targetMilestones: string[];
}> {
  const candidateName = stats.studentName || 'Navin Kumar';
  const ai = getAiClient();
  if (!ai) {
    return {
      executiveSummary: `Hello ${candidateName}, your current average score is ${stats.averageScore} marks with an accuracy rate of ${stats.accuracy}%. You demonstrate good foundational competence, but negative markings in tricky questions are limiting your score progression towards the 160+ Tier-1 cutoff threshold.`,
      strengthsSummary: `High accuracy in ${stats.strongTopics.join(', ') || 'Reasoning and English Comprehension'}. You finish these sections quickly, creating buffer time for Quantitative Aptitude.`,
      criticalGaps: stats.weakTopics.length > 0 
        ? stats.weakTopics 
        : ['Compound Interest calculation speed', 'Geometry theorems (Circle tangents & Cyclic quadrilaterals)', 'Historical Dynasty chronologies in Static GK'],
      actionPlanDaily: [
        'Dedicate the first 60 minutes of your morning to 25 timed Quantitative questions focusing on your identified weak topics.',
        'Maintain an "Error Diary" recording every silly mistake and revision formula.',
        'Attempt one sectional 15-minute speed quiz daily under strict negative-marking rules.'
      ],
      targetMilestones: [
        'Achieve > 90% accuracy in Quantitative Aptitude arithmetic within 10 days',
        'Consistently cross 150+ in full-length Tier-1 mocks before the final month',
        'Reduce average time per reasoning question to under 38 seconds'
      ]
    };
  }

  try {
    const prompt = `Analyze this SSC CGL student preparation profile for aspirant ${candidateName}:
- Candidate Name: ${candidateName}
- Total Mock Tests: ${stats.totalMockTests}
- Average Score: ${stats.averageScore} / 200
- Accuracy: ${stats.accuracy}%
- Weak Topics: ${stats.weakTopics.join(', ') || 'Algebra, Geometry, Modern History'}
- Strong Topics: ${stats.strongTopics.join(', ') || 'English Vocabulary, Coding-Decoding'}
- Recent Scores: ${stats.recentTestScores.join(', ')}

Provide an authoritative, encouraging, strategic performance breakdown for ${candidateName} to crack the SSC CGL Exam with top ranks. Respond in English only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveSummary: { type: Type.STRING },
            strengthsSummary: { type: Type.STRING },
            criticalGaps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            actionPlanDaily: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            targetMilestones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['executiveSummary', 'strengthsSummary', 'criticalGaps', 'actionPlanDaily', 'targetMilestones']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (err: any) {
    console.error('Gemini Performance Analysis Error:', err);
    return {
      executiveSummary: `You are performing with ${stats.accuracy}% accuracy across ${stats.totalMockTests} mock tests. Continue consistent daily practice with special focus on negative marking reduction.`,
      strengthsSummary: 'Consistent mock test completion rhythm and active participation.',
      criticalGaps: ['Time management in Quantitative Aptitude', 'Static GK retention'],
      actionPlanDaily: ['Solve 30 PYQ questions daily', 'Review error logs before bed'],
      targetMilestones: ['Cross 160+ marks in Tier-1 full mock tests']
    };
  }
}
