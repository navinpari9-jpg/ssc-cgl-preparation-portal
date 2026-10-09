import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { store, ADMIN_SECRET_TOKEN } from './server/store';
import { 
  askAITutor, 
  solveStudentDoubt, 
  generateDoubtFollowup, 
  generateAIQuestions, 
  analyzeStudentPerformance, 
  testAIConnection, 
  generateAIStudyPlan 
} from './server/ai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Health & System Status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    server: 'running',
    aiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim())
  });
});

// AI Connection Diagnostic Test
app.get('/api/ai/test', async (req: Request, res: Response) => {
  const result = await testAIConnection();
  if (!result.success) {
    res.status(503).json(result);
    return;
  }
  res.json(result);
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

app.delete('/api/mock-tests/:id', (req: Request, res: Response) => {
  const success = store.deleteMockTest(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Mock test not found' });
    return;
  }
  res.json({ success: true, message: 'Mock test deleted successfully' });
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
  const { subjectId, category, resourceType, difficulty, year, search, sortBy } = req.query;
  const materials = store.getStudyMaterials({
    subjectId: subjectId as string,
    category: category as string,
    resourceType: resourceType as string,
    difficulty: difficulty as string,
    year: year as string,
    search: search as string,
    sortBy: sortBy as string
  });
  res.json(materials);
});

app.post('/api/study-materials', (req: Request, res: Response) => {
  const newMat = store.addStudyMaterial(req.body);
  res.status(201).json(newMat);
});

app.put('/api/study-materials/:id', (req: Request, res: Response) => {
  const updated = store.updateStudyMaterial(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Study material not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/study-materials/:id', (req: Request, res: Response) => {
  const success = store.deleteStudyMaterial(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Study material not found' });
    return;
  }
  res.json({ success: true, message: 'Study material deleted successfully' });
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

// AI Features powered by Gemini 3.1 Flash / 3.8 Flash
const handleTutor = async (req: Request, res: Response) => {
  const question = req.body.question || req.body.query;
  const { subject, topic, mode } = req.body;
  if (!question || typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ success: false, error: 'Question is required' });
    return;
  }
  const result = await askAITutor({ question: question.trim(), subject, topic, mode });
  if (!result.success) {
    const status = result.error?.includes('GEMINI_API_KEY') ? 401 : 503;
    res.status(status).json(result);
    return;
  }
  res.json(result);
};

app.post('/api/ai/tutor', handleTutor);
app.post('/api/gemini/tutor', handleTutor);

// Dedicated Student Doubt Resolution using Gemini 3.8 Flash
app.post('/api/ai/doubt/solve', async (req: Request, res: Response) => {
  const { question, subject, topic, doubtType, studentAttempt, imageData, imageMimeType, autoSave } = req.body;
  if ((!question || !question.trim()) && !imageData) {
    res.status(400).json({ success: false, error: 'Please enter a doubt question or upload an image.' });
    return;
  }

  const result = await solveStudentDoubt({
    question: (question || '').trim(),
    subject,
    topic,
    doubtType,
    studentAttempt,
    imageData,
    imageMimeType
  });

  if (!result.success) {
    const status = result.error?.includes('GEMINI_API_KEY') ? 401 : 503;
    res.status(status).json(result);
    return;
  }

  // Optionally auto-save to student doubts notebook
  let savedDoubtId: string | undefined = undefined;
  if (autoSave && result.solution) {
    const saved = store.addStudentDoubt({
      studentName: 'Navin Kumar',
      question: (question || 'Image Doubt').trim(),
      subject: subject || 'Quantitative Aptitude',
      topic: topic || 'General',
      doubtType: doubtType || 'problem_solving',
      studentAttempt: studentAttempt || undefined,
      solution: result.solution as any,
      status: 'resolved'
    });
    savedDoubtId = saved.id;
  }

  res.json({
    ...result,
    savedDoubtId
  });
});

app.post('/api/ai/doubt/followup', async (req: Request, res: Response) => {
  const { originalQuestion, originalAnswer, followupAction, subject, topic } = req.body;
  if (!originalQuestion || !followupAction) {
    res.status(400).json({ success: false, error: 'originalQuestion and followupAction are required' });
    return;
  }

  const result = await generateDoubtFollowup({
    originalQuestion,
    originalAnswer: originalAnswer || '',
    followupAction,
    subject,
    topic
  });

  if (!result.success) {
    res.status(503).json(result);
    return;
  }
  res.json(result);
});

// Student Doubt Notebook Persistence
app.get('/api/student/doubts', (req: Request, res: Response) => {
  const { subject, status, search } = req.query;
  const doubts = store.getStudentDoubts({
    subject: subject as string,
    status: status as string,
    search: search as string
  });
  res.json(doubts);
});

app.post('/api/student/doubts', (req: Request, res: Response) => {
  const newDoubt = store.addStudentDoubt(req.body);
  res.status(201).json(newDoubt);
});

app.put('/api/student/doubts/:id', (req: Request, res: Response) => {
  const updated = store.updateStudentDoubt(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ error: 'Doubt not found' });
    return;
  }
  res.json(updated);
});

app.delete('/api/student/doubts/:id', (req: Request, res: Response) => {
  const success = store.deleteStudentDoubt(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'Doubt not found' });
    return;
  }
  res.json({ success: true, message: 'Doubt deleted from notebook' });
});

const handleGenerateQuestions = async (req: Request, res: Response) => {
  const { subject, topic, difficulty, count } = req.body;
  const result = await generateAIQuestions({
    subject: subject || 'Quantitative Aptitude',
    topic: topic || 'Percentage',
    difficulty: difficulty || 'Medium',
    count: typeof count === 'number' ? count : parseInt(count, 10) || 5
  });
  if (!result.success) {
    const status = result.error?.includes('GEMINI_API_KEY') ? 401 : 503;
    res.status(status).json(result);
    return;
  }
  // Return questions array directly or object
  res.json(result.questions);
};

app.post('/api/ai/generate-questions', handleGenerateQuestions);
app.post('/api/gemini/generate-questions', handleGenerateQuestions);

const handleAnalyzePerformance = async (req: Request, res: Response) => {
  const stats = req.body || {};
  const result = await analyzeStudentPerformance(stats);
  if (!result.success) {
    const status = result.error?.includes('GEMINI_API_KEY') ? 401 : 503;
    res.status(status).json(result);
    return;
  }
  res.json(result);
};

app.post('/api/ai/analyze-performance', handleAnalyzePerformance);
app.post('/api/gemini/analyze-performance', handleAnalyzePerformance);

// AI Study Plan Generation
app.post('/api/ai/study-plan', async (req: Request, res: Response) => {
  const result = await generateAIStudyPlan(req.body || {});
  if (!result.success) {
    const status = result.error?.includes('GEMINI_API_KEY') ? 401 : 503;
    res.status(status).json(result);
    return;
  }
  res.json(result);
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

// Firebase Auth Synchronize
app.post('/api/auth/firebase-sync', (req: Request, res: Response) => {
  const { uid, email, displayName } = req.body;
  if (!email) {
    res.status(400).json({ success: false, error: 'Firebase email is required' });
    return;
  }
  const result = store.syncFirebaseUser({ uid: uid || 'fb-' + Date.now(), email, displayName });
  res.json({
    success: true,
    token: result.token,
    user: result.user
  });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = getBearerToken(req);
  if (token) {
    store.destroySession(token);
  }
  res.clearCookie('ssc_auth_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Admin Authorization Middleware
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = getBearerToken(req) || req.cookies?.ssc_admin_cookie;
  const secretHeader = (req.headers['x-secret-token'] as string) || (req.query.token as string);
  const session = store.validateAdminSession(token, req.cookies?.ssc_admin_cookie, secretHeader);
  if (!session) {
    res.status(403).json({ 
      success: false, 
      error: 'Security Gate: Access Denied. Secret token NKzoro and admin privileges required.' 
    });
    return;
  }
  (req as any).adminSession = session;
  next();
};

// Admin Secret Token Verification Gate
app.post('/api/admin/verify-token', (req: Request, res: Response) => {
  const { secretToken } = req.body;
  const currentToken = store.getAdminSecretToken();
  if (secretToken && secretToken.trim() === currentToken) {
    res.json({ success: true, verified: true, tokenName: currentToken });
  } else {
    res.status(403).json({ success: false, verified: false, error: 'Invalid secret security token.' });
  }
});

// Admin Check Access via Query Param (e.g. /admin-login?token=...)
app.get('/api/admin/check-access', (req: Request, res: Response) => {
  const token = (req.query.token as string)?.trim();
  const currentToken = store.getAdminSecretToken();
  if (token && token === currentToken) {
    res.json({ success: true, allowed: true, tokenName: currentToken });
  } else {
    res.status(403).json({ success: false, allowed: false, error: 'Invalid or missing secret access token.' });
  }
});

// Admin Security Configuration (View & Update Token via Admin Panel)
app.get('/api/admin/security-config', requireAdminAuth, (req: Request, res: Response) => {
  res.json({ success: true, config: store.getAdminSecurityConfig() });
});

app.post('/api/admin/security-config', requireAdminAuth, (req: Request, res: Response) => {
  const result = store.updateAdminSecurityConfig(req.body);
  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.json({ 
    success: true, 
    config: result.config, 
    message: 'Admin security token successfully updated. New access link activated.' 
  });
});

// Admin Login with Secret Token & Product Cookies
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { secretToken, username, password, rememberMe } = req.body;
  const currentToken = store.getAdminSecretToken();

  if (!secretToken || secretToken.trim() !== currentToken) {
    res.status(403).json({ 
      success: false, 
      error: 'Access Denied: Invalid Security Secret Token. (Expected valid token)' 
    });
    return;
  }

  if (!username || !password) {
    res.status(400).json({ success: false, error: 'Admin username and password are required.' });
    return;
  }

  const result = store.adminLogin(secretToken, username, password, rememberMe !== false);
  if (!result.success || !result.token) {
    res.status(401).json({ success: false, error: result.error || 'Invalid admin credentials.' });
    return;
  }

  // Set secure product cookies
  const cookieMaxAge = rememberMe !== false ? 7 * 24 * 3600 * 1000 : 24 * 3600 * 1000;
  res.cookie('ssc_admin_cookie', result.token, {
    httpOnly: true,
    maxAge: cookieMaxAge,
    path: '/',
    sameSite: 'lax'
  });
  res.cookie('ssc_admin_verified', 'true', {
    maxAge: cookieMaxAge,
    path: '/',
    sameSite: 'lax'
  });
  res.cookie('ssc_admin_token_name', currentToken, {
    maxAge: cookieMaxAge,
    path: '/',
    sameSite: 'lax'
  });

  res.json({
    success: true,
    token: result.token,
    user: result.user,
    secretToken: currentToken
  });
});

app.get('/api/admin/session', (req: Request, res: Response) => {
  const token = getBearerToken(req) || req.cookies?.ssc_admin_cookie;
  const secretHeader = (req.headers['x-secret-token'] as string) || (req.query.token as string);
  const session = store.validateAdminSession(token, req.cookies?.ssc_admin_cookie, secretHeader);
  if (!session) {
    res.status(401).json({ success: false, error: 'Admin session expired or invalid.' });
    return;
  }
  res.json({
    success: true,
    user: session,
    secretTokenVerified: true
  });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const token = getBearerToken(req) || req.cookies?.ssc_admin_cookie;
  if (token) {
    store.destroySession(token);
  }
  res.clearCookie('ssc_admin_cookie');
  res.clearCookie('ssc_admin_verified');
  res.clearCookie('ssc_admin_token_name');
  res.json({ success: true, message: 'Admin logged out and security cookies cleared.' });
});

// Admin Protected Routes
app.get(['/api/admin/students', '/api/admin/users'], requireAdminAuth, (req: Request, res: Response) => {
  res.json(store.getAdminStudentsList());
});

app.post('/api/admin/users', requireAdminAuth, (req: Request, res: Response) => {
  const result = store.adminCreateUser(req.body);
  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.status(201).json(result);
});

app.put('/api/admin/users/:id/password', requireAdminAuth, (req: Request, res: Response) => {
  const { password } = req.body;
  const result = store.adminChangeUserPassword(req.params.id, password);
  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.json(result);
});

app.delete('/api/admin/users/:id', requireAdminAuth, (req: Request, res: Response) => {
  const result = store.adminDeleteUser(req.params.id);
  if (!result.success) {
    res.status(404).json(result);
    return;
  }
  res.json(result);
});

app.get('/api/admin/analytics', requireAdminAuth, (req: Request, res: Response) => {
  res.json(store.getAdminAnalyticsSummary());
});

app.post('/api/admin/upload-asset', requireAdminAuth, (req: Request, res: Response) => {
  const { title, subjectId, category, resourceType, description, fileUrl, fileSize, pages } = req.body;
  if (!title || !fileUrl) {
    res.status(400).json({ success: false, error: 'Asset title and file URL are required.' });
    return;
  }
  const newMaterial = store.addStudyMaterial({
    title,
    subjectId: subjectId || 'quantitative-aptitude',
    topic: 'Master Academic Notes',
    category: (category || 'Quick Revision') as any,
    resourceType: 'pdf',
    readTimeMinutes: 15,
    summary: description || 'Master study resource uploaded by admin.',
    content: description || 'Official SSC CGL academic notes and study material.',
    downloadablePdf: fileUrl,
    fileSizeFormatted: fileSize || '2.4 MB',
    pagesCount: pages || 24,
    isPublished: true
  });
  res.status(201).json({ success: true, material: newMaterial });
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

// Enforce strict 404 response on any attempt to access /admin or /admin/* directly
app.all(['/admin', '/admin/*'], (req: Request, res: Response) => {
  res.status(404).format({
    'text/html': () => {
      res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>404 Not Found</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 1.5rem; padding: 2.5rem 2rem; max-width: 440px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .badge { display: inline-block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 9999px; padding: 0.25rem 0.75rem; margin-bottom: 1rem; }
    .code { font-size: 5rem; font-weight: 900; line-height: 1; color: #ef4444; margin-bottom: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.75rem; color: #ffffff; }
    p { color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin: 0 0 1.5rem; }
    a { display: inline-block; background: #2563eb; color: #ffffff; padding: 0.625rem 1.25rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 0.875rem; transition: background 0.2s; }
    a:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HTTP 404 Error</div>
    <div class="code">404</div>
    <h1>Page Not Found</h1>
    <p>The requested URL <code>/admin</code> was not found on this server. Access denied.</p>
    <a href="/">Back to Safety</a>
  </div>
</body>
</html>`);
    },
    'application/json': () => {
      res.status(404).json({ error: 'Not Found', status: 404, message: 'Cannot GET /admin' });
    },
    default: () => {
      res.status(404).type('txt').send('404 Not Found: Cannot access /admin');
    }
  });
});

// Protect /admin-login: ONLY open if query parameter matches active secret token (?token=...)
app.all(['/admin-login', '/admin-login/*'], (req: Request, res: Response, next) => {
  const token = (req.query.token as string)?.trim();
  const activeToken = store.getAdminSecretToken();
  if (!token || token !== activeToken) {
    return res.status(404).format({
      'text/html': () => {
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>404 Not Found</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 1.5rem; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 1.5rem; padding: 2.5rem 2rem; max-width: 440px; text-align: center; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
    .badge { display: inline-block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 9999px; padding: 0.25rem 0.75rem; margin-bottom: 1rem; }
    .code { font-size: 5rem; font-weight: 900; line-height: 1; color: #ef4444; margin-bottom: 0.5rem; }
    h1 { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.75rem; color: #ffffff; }
    p { color: #94a3b8; font-size: 0.875rem; line-height: 1.5; margin: 0 0 1.5rem; }
    a { display: inline-block; background: #2563eb; color: #ffffff; padding: 0.625rem 1.25rem; border-radius: 0.75rem; text-decoration: none; font-weight: 600; font-size: 0.875rem; transition: background 0.2s; }
    a:hover { background: #1d4ed8; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HTTP 404 Error</div>
    <div class="code">404</div>
    <h1>Page Not Found</h1>
    <p>The requested URL <code>/admin-login</code> was not found on this server. Access denied.</p>
    <a href="/">Back to Safety</a>
  </div>
</body>
</html>`);
      },
      'application/json': () => {
        res.status(404).json({ error: 'Not Found', status: 404, message: 'Cannot GET /admin-login' });
      },
      default: () => {
        res.status(404).type('txt').send('404 Not Found: Cannot access /admin-login without valid secret token.');
      }
    });
  }
  // Secret token verified in query param: Proceed to app!
  next();
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

if (!process.env.VERCEL) {
  startServer();
}

export { app };
export default app;
