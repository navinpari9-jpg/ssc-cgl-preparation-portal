import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './server/store';
import { askAITutor, generateAIQuestions, analyzeStudentPerformance } from './server/ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'SSC CGL Preparation Portal' });
});

// Subjects Catalog & Syllabus
app.get('/api/subjects', (req: Request, res: Response) => {
  res.json(store.getSubjects());
});

// Questions Engine & Filters
app.get('/api/questions', (req: Request, res: Response) => {
  const { subjectId, topic, difficulty, pyqYear, search } = req.query;
  const questions = store.getQuestions({
    subjectId: subjectId as string,
    topic: topic as string,
    difficulty: difficulty as string,
    pyqYear: pyqYear ? parseInt(pyqYear as string, 10) : undefined,
    search: search as string
  });
  res.json(questions);
});

app.get('/api/questions/:id', (req: Request, res: Response) => {
  const q = store.getQuestionById(req.params.id);
  if (!q) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json(q);
});

app.post('/api/questions', (req: Request, res: Response) => {
  const newQuestion = store.addQuestion(req.body);
  res.status(201).json(newQuestion);
});

app.put('/api/questions/:id', (req: Request, res: Response) => {
  const updated = store.updateQuestion(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/questions/:id', (req: Request, res: Response) => {
  const success = store.deleteQuestion(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Question not found' });
    return;
  }
  res.json({ success: true, message: 'Question deleted successfully' });
});

// Mock Tests System
app.get('/api/mock-tests', (req: Request, res: Response) => {
  res.json(store.getMockTests());
});

app.get('/api/mock-tests/:id', (req: Request, res: Response) => {
  const mock = store.getMockTestById(req.params.id);
  if (!mock) {
    res.status(404).json({ error: 'Mock test not found' });
    return;
  }
  // Hydrate questions
  const questions = mock.questionIds
    .map(qid => store.getQuestionById(qid))
    .filter(Boolean);
  
  res.json({
    ...mock,
    questions
  });
});

app.post('/api/mock-tests', (req: Request, res: Response) => {
  const newMock = store.addMockTest(req.body);
  res.status(201).json(newMock);
});

// Test Attempts & Submissions
app.post('/api/test-attempts', (req: Request, res: Response) => {
  const attempt = store.saveTestAttempt(req.body);
  res.status(201).json(attempt);
});

app.get('/api/test-attempts', (req: Request, res: Response) => {
  res.json(store.getTestAttempts());
});

// Study Materials Library
app.get('/api/study-materials', (req: Request, res: Response) => {
  const { subjectId, category, search } = req.query;
  const materials = store.getStudyMaterials({
    subjectId: subjectId as string,
    category: category as string,
    search: search as string
  });
  res.json(materials);
});

app.post('/api/study-materials', (req: Request, res: Response) => {
  const newMat = store.addStudyMaterial(req.body);
  res.status(201).json(newMat);
});

// Current Affairs
app.get('/api/current-affairs', (req: Request, res: Response) => {
  const { category, search } = req.query;
  const items = store.getCurrentAffairs(category as string, search as string);
  res.json(items);
});

app.post('/api/current-affairs', (req: Request, res: Response) => {
  const item = store.addCurrentAffair(req.body);
  res.status(201).json(item);
});

// Daily Study Planner
app.get('/api/study-plan', (req: Request, res: Response) => {
  res.json(store.getStudyPlan());
});

app.post('/api/study-plan', (req: Request, res: Response) => {
  const plan = store.updateStudyPlan(req.body);
  res.json(plan);
});

app.post('/api/study-plan/toggle-task', (req: Request, res: Response) => {
  const { taskId } = req.body;
  const plan = store.toggleTaskCompleted(taskId);
  res.json(plan);
});

// Leaderboard
app.get('/api/leaderboard', (req: Request, res: Response) => {
  res.json(store.getLeaderboard());
});

// User Profile & Bookmarks
app.get('/api/user/profile', (req: Request, res: Response) => {
  res.json(store.getProfile());
});

app.post('/api/user/profile', (req: Request, res: Response) => {
  const profile = store.updateProfile(req.body);
  res.json(profile);
});

app.post('/api/user/bookmark', (req: Request, res: Response) => {
  const { type, id } = req.body;
  const result = store.toggleBookmark(type, id);
  res.json(result);
});

// Notifications
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(store.getNotifications());
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notifs = store.markNotificationRead(req.params.id);
  res.json(notifs);
});

// AI Features powered by Gemini
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  const { query, subject, topic, mode } = req.body;
  if (!query) {
    res.status(400).json({ error: 'Query is required' });
    return;
  }
  const result = await askAITutor(query, { subject, topic, mode });
  res.json(result);
});

app.post('/api/gemini/generate-questions', async (req: Request, res: Response) => {
  const { subject, topic, difficulty, count } = req.body;
  const questions = await generateAIQuestions({
    subject: subject || 'Quantitative Aptitude',
    topic: topic || 'Algebra',
    difficulty: difficulty || 'Medium',
    count: count || 5
  });
  res.json(questions);
});

app.post('/api/gemini/analyze-performance', async (req: Request, res: Response) => {
  const stats = req.body;
  const analysis = await analyzeStudentPerformance(stats);
  res.json(analysis);
});

// Helper to extract bearer token
function getBearerToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return (req.headers['x-session-token'] as string) || undefined;
}

// Authentication Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, rememberMe } = req.body;
  
  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ success: false, error: 'Please enter your email address.' });
    return;
  }
  if (!password || typeof password !== 'string' || !password.trim()) {
    res.status(400).json({ success: false, error: 'Please enter your password.' });
    return;
  }

  const result = store.loginUser(email, password, rememberMe !== false);
  if (!result.success) {
    res.status(401).json({ success: false, error: result.error || 'Invalid email or password.' });
    return;
  }

  res.json({
    success: true,
    token: result.token,
    user: result.user
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, targetExamYear } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.status(400).json({ success: false, error: 'Full name is required.' });
    return;
  }
  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ success: false, error: 'Please enter your email address.' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 4) {
    res.status(400).json({ success: false, error: 'Password must be at least 4 characters long.' });
    return;
  }

  const result = store.registerUser(name, email, password, targetExamYear);
  if (!result.success) {
    res.status(400).json({ success: false, error: result.error });
    return;
  }

  res.status(201).json({
    success: true,
    token: result.token,
    user: result.user,
    message: 'Account created successfully.'
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const token = getBearerToken(req);
  const session = store.validateSession(token);
  if (!session) {
    res.status(401).json({ success: false, error: 'Your session has expired. Please log in again.' });
    return;
  }

  res.json({
    success: true,
    user: store.getProfile(),
    session
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = getBearerToken(req);
  if (token) {
    store.destroySession(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !email.trim()) {
    res.status(400).json({ success: false, error: 'Enter your registered email address.' });
    return;
  }

  const result = store.requestPasswordReset(email);
  res.json(result);
});

// Vite Middleware for Development / Static Server for Production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`SSC CGL Preparation Portal server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
