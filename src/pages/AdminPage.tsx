import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Question, MockTest, StudyMaterial, SubjectId, StudentDoubtItem } from '../types';
import { NotFoundPage } from './NotFoundPage';
import { gmailService } from '../services/gmailService';
import { 
  ShieldCheck, 
  ShieldAlert,
  Lock,
  Key,
  KeyRound,
  User,
  Users, 
  Plus, 
  Trash2, 
  Edit3,
  Check, 
  X,
  FileText, 
  HelpCircle, 
  Award, 
  BarChart3,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  FolderOpen,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileUp,
  Clock,
  Sparkles,
  Copy,
  ExternalLink,
  CheckCircle2,
  Mail,
  Send,
  Inbox
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    isAdminUnlocked, 
    adminUser, 
    adminLogin, 
    adminLogout 
  } = useAuth();
  const { setActivePage, showToast } = useApp();

  // URL Secret Token Verification Gate (?token=NKzoro)
  const [isVerifyingUrlToken, setIsVerifyingUrlToken] = useState(!isAdminUnlocked);
  const [isUrlTokenAuthorized, setIsUrlTokenAuthorized] = useState(isAdminUnlocked);

  // Security Configuration (Dynamic Secret Token Control)
  const [activeSecretToken, setActiveSecretToken] = useState('NKzoro');
  const [inputNewSecretToken, setInputNewSecretToken] = useState('NKzoro');
  const [isUpdatingToken, setIsUpdatingToken] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);

  // Secret Gateway State
  const [secretTokenInput, setSecretTokenInput] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [gatewayError, setGatewayError] = useState('');

  // Admin Active Tab (includes security control)
  const [activeTab, setActiveTab] = useState<'students' | 'analytics' | 'repository' | 'assets' | 'security'>('students');

  // Repository sub-tab
  const [repoSubTab, setRepoSubTab] = useState<'questions' | 'mock-tests' | 'doubts'>('questions');

  // Data States
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [doubts, setDoubts] = useState<StudentDoubtItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [studentSearch, setStudentSearch] = useState('');
  const [studentYearFilter, setStudentYearFilter] = useState('all');
  const [questionSubjectFilter, setQuestionSubjectFilter] = useState('all');
  const [assetSearch, setAssetSearch] = useState('');

  // Gmail Integration State
  const [isGmailConnected, setIsGmailConnected] = useState(gmailService.isGmailConnected());
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(gmailService.getConnectedEmail());
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [autoSendWelcomeEmail, setAutoSendWelcomeEmail] = useState(true);
  const [autoSendDeleteEmail, setAutoSendDeleteEmail] = useState(true);

  // Email Composer Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailStudentName, setEmailStudentName] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Reset All Students State
  const [showResetStudentsModal, setShowResetStudentsModal] = useState(false);
  const [isResettingStudents, setIsResettingStudents] = useState(false);

  // Delete Student Confirmation Modal State
  const [studentToDelete, setStudentToDelete] = useState<any | null>(null);
  const [deleteNotifyEmail, setDeleteNotifyEmail] = useState(true);
  const [isDeletingStudent, setIsDeletingStudent] = useState(false);

  // Modals
  const [showCreateStudentModal, setShowCreateStudentModal] = useState(false);
  const [createSendWelcomeEmail, setCreateSendWelcomeEmail] = useState(true);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [selectedStudentForPassword, setSelectedStudentForPassword] = useState<any>(null);
  const [newStudentPassword, setNewStudentPassword] = useState('');

  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentInitialPass, setNewStudentInitialPass] = useState('');
  const [newStudentYear, setNewStudentYear] = useState('2026-2027');

  // Question Modal
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [newSubjectId, setNewSubjectId] = useState<SubjectId>('quantitative-aptitude');
  const [newTopic, setNewTopic] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptions, setNewOptions] = useState<[string, string, string, string]>(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newShortcutTrick, setNewShortcutTrick] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [newPyqYear, setNewPyqYear] = useState<number | undefined>(2024);

  // Mock Test Modal
  const [showAddMockModal, setShowAddMockModal] = useState(false);
  const [newMockTitle, setNewMockTitle] = useState('');
  const [newMockDesc, setNewMockDesc] = useState('');
  const [newMockDuration, setNewMockDuration] = useState(60);
  const [newMockMarks, setNewMockMarks] = useState(200);
  const [newMockQuestionsCount, setNewMockQuestionsCount] = useState(100);

  // Asset Upload Form State
  const [assetTitle, setAssetTitle] = useState('');
  const [assetSubject, setAssetSubject] = useState<SubjectId>('quantitative-aptitude');
  const [assetCategory, setAssetCategory] = useState('Notes');
  const [assetResourceType, setAssetResourceType] = useState('PDF');
  const [assetDescription, setAssetDescription] = useState('');
  const [assetFileSize, setAssetFileSize] = useState('2.4 MB');
  const [assetPages, setAssetPages] = useState(16);
  const [assetFileName, setAssetFileName] = useState('');
  const [assetFilePreview, setAssetFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Admin Data when unlocked
  const fetchAllAdminData = async () => {
    if (!isAdminUnlocked) return;
    setLoading(true);
    try {
      const [studentsRes, analyticsRes, qsRes, mocksRes, matsRes, doubtsRes] = await Promise.all([
        api.adminGetStudents().catch(() => []),
        api.adminGetAnalytics().catch(() => null),
        api.getQuestions().catch(() => []),
        api.getMockTests().catch(() => []),
        api.getStudyMaterials().catch(() => []),
        api.getStudentDoubts().catch(() => [])
      ]);
      setStudentsList(Array.isArray(studentsRes) ? studentsRes : []);
      setAnalyticsSummary(analyticsRes);
      setQuestions(Array.isArray(qsRes) ? qsRes : []);
      setMockTests(Array.isArray(mocksRes) ? mocksRes : []);
      setMaterials(Array.isArray(matsRes) ? matsRes : []);
      setDoubts(Array.isArray(doubtsRes) ? doubtsRes : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminUnlocked) {
      setIsUrlTokenAuthorized(true);
      setIsVerifyingUrlToken(false);
      fetchAllAdminData();
      api.adminGetSecurityConfig().then(res => {
        if (res.success && res.config?.secretToken) {
          setActiveSecretToken(res.config.secretToken);
          setInputNewSecretToken(res.config.secretToken);
        }
      }).catch(() => {});
      return;
    }

    // Inspect URL search params for ?token=...
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token')?.trim();

    if (!tokenParam) {
      setIsUrlTokenAuthorized(false);
      setIsVerifyingUrlToken(false);
      return;
    }

    setIsVerifyingUrlToken(true);
    api.adminCheckAccessToken(tokenParam)
      .then(res => {
        if (res.allowed) {
          setIsUrlTokenAuthorized(true);
          setSecretTokenInput(tokenParam);
          setActiveSecretToken(tokenParam);
          setInputNewSecretToken(tokenParam);
        } else {
          setIsUrlTokenAuthorized(false);
        }
      })
      .catch(() => {
        setIsUrlTokenAuthorized(false);
      })
      .finally(() => {
        setIsVerifyingUrlToken(false);
      });
  }, [isAdminUnlocked]);

  // Security Token Management Handlers
  const handleUpdateSecretToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = inputNewSecretToken.trim();
    if (!cleanToken || cleanToken.length < 3) {
      showToast({ type: 'warning', message: 'Secret token must be at least 3 characters long.' });
      return;
    }

    setIsUpdatingToken(true);
    try {
      const res = await api.adminUpdateSecurityConfig({ secretToken: cleanToken });
      if (res.success && res.config) {
        setActiveSecretToken(res.config.secretToken);
        setInputNewSecretToken(res.config.secretToken);
        const newUrl = `${window.location.pathname}?token=${encodeURIComponent(res.config.secretToken)}`;
        window.history.replaceState({}, '', newUrl);
        showToast({
          type: 'success',
          title: 'Secret Token Updated',
          message: `Admin access token changed to "${res.config.secretToken}". The previous link will now return 404.`
        });
      } else {
        showToast({ type: 'error', message: res.error || 'Failed to update security token.' });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Error updating security configuration.' });
    } finally {
      setIsUpdatingToken(false);
    }
  };

  const handleGenerateRandomToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let rand = 'NK_';
    for (let i = 0; i < 8; i++) {
      rand += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setInputNewSecretToken(rand);
  };

  const handleCopyAdminUrl = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/admin-login?token=${encodeURIComponent(activeSecretToken)}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setTokenCopied(true);
      showToast({
        type: 'success',
        title: 'Access Link Copied',
        message: 'Direct Admin Login link copied to clipboard.'
      });
      setTimeout(() => setTokenCopied(false), 3000);
    }).catch(() => {
      showToast({ type: 'warning', message: 'Unable to copy to clipboard automatically.' });
    });
  };

  // Handle Gateway Login
  const handleGatewaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretTokenInput.trim()) {
      setGatewayError('Secret Security Token is required.');
      return;
    }
    if (!adminUsername.trim() || !adminPassword) {
      setGatewayError('Please provide admin username and password.');
      return;
    }

    setIsVerifying(true);
    setGatewayError('');

    try {
      const res = await adminLogin(secretTokenInput.trim(), adminUsername.trim(), adminPassword);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Admin Access Granted',
          message: `Security token "${secretTokenInput.trim()}" verified. Product session cookies initialized.`
        });
        fetchAllAdminData();
      } else {
        setGatewayError(res.error || 'Access Denied: Invalid Security Secret Token or Credentials.');
      }
    } catch {
      setGatewayError('Failed to connect to authentication gateway.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Gmail Integration Handlers
  const handleConnectGmail = async () => {
    setIsConnectingGmail(true);
    try {
      const res = await gmailService.connectGmail();
      if (res.success) {
        setIsGmailConnected(true);
        setGmailUserEmail(res.email || gmailService.getConnectedEmail());
        showToast({
          type: 'success',
          title: 'Gmail Connected',
          message: `Connected successfully as ${res.email || 'Admin'}. Confirmation emails will be sent via Gmail.`
        });
      } else {
        showToast({
          type: 'error',
          title: 'Gmail Connection Failed',
          message: res.error || 'Could not connect Gmail.'
        });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Gmail connection failed.' });
    } finally {
      setIsConnectingGmail(false);
    }
  };

  const handleDisconnectGmail = () => {
    gmailService.disconnectGmail();
    setIsGmailConnected(false);
    setGmailUserEmail(null);
    showToast({
      type: 'info',
      title: 'Gmail Disconnected',
      message: 'Gmail account disconnected from admin panel.'
    });
  };

  const handleOpenEmailModal = (student: any) => {
    setEmailRecipient(student.email);
    setEmailStudentName(student.name);
    setEmailSubject(`SSC CGL Preparation Portal - Academic Update for ${student.name}`);
    setEmailBody(`Dear ${student.name},\n\nWe are sharing an important update regarding your SSC CGL preparation schedule...\n\nBest regards,\nSSC CGL Admin Team`);
    setShowEmailModal(true);
  };

  const handleSendCustomEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient || !emailSubject || !emailBody) {
      showToast({ type: 'warning', message: 'Recipient, subject, and body are required.' });
      return;
    }
    setIsSendingEmail(true);
    try {
      const res = await gmailService.sendEmail({
        to: emailRecipient,
        subject: emailSubject,
        body: emailBody
      });
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Email Sent via Gmail',
          message: `Email successfully sent to ${emailRecipient}.`
        });
        setShowEmailModal(false);
        setEmailRecipient('');
        setEmailStudentName('');
        setEmailSubject('');
        setEmailBody('');
      } else {
        showToast({
          type: 'error',
          title: 'Failed to Send Email',
          message: res.error || 'Could not deliver email.'
        });
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to send email.' });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Student Actions
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentInitialPass) {
      showToast({ type: 'warning', message: 'All student fields are required.' });
      return;
    }

    try {
      const res = await api.adminCreateUser({
        name: newStudentName.trim(),
        email: newStudentEmail.trim(),
        password: newStudentInitialPass,
        targetYear: newStudentYear,
        role: 'student'
      });
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Student Created',
          message: `Account created for ${newStudentName}.`
        });

        // Send confirmation email via Gmail if enabled
        if (createSendWelcomeEmail && autoSendWelcomeEmail) {
          gmailService.sendStudentWelcomeEmail({
            name: newStudentName.trim(),
            email: newStudentEmail.trim(),
            initialPassword: newStudentInitialPass,
            targetExamYear: newStudentYear
          }).then((mailRes) => {
            if (mailRes.success) {
              showToast({
                type: 'info',
                title: 'Confirmation Email Dispatched',
                message: `Welcome email sent to ${newStudentEmail.trim()} via Gmail.`
              });
            }
          }).catch(() => {});
        }

        setShowCreateStudentModal(false);
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentInitialPass('');
        const updated = await api.adminGetStudents();
        setStudentsList(updated);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to create student.' });
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPassword || !newStudentPassword) return;

    try {
      const res = await api.adminChangePassword(selectedStudentForPassword.id, newStudentPassword);
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Password Updated',
          message: `Password changed for ${selectedStudentForPassword.name}.`
        });
        setShowChangePasswordModal(false);
        setNewStudentPassword('');
        setSelectedStudentForPassword(null);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to update password.' });
    }
  };

  const handleDeleteStudent = (student: any) => {
    if (student.role === 'admin') {
      showToast({ type: 'warning', message: 'Cannot delete master admin account.' });
      return;
    }
    setStudentToDelete(student);
  };

  const handleConfirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsDeletingStudent(true);
    try {
      const res = await api.adminDeleteUser(studentToDelete.id);
      if (res.success) {
        showToast({
          type: 'info',
          title: 'Account Deleted',
          message: `Account for ${studentToDelete.name} has been removed.`
        });

        if (deleteNotifyEmail && autoSendDeleteEmail) {
          gmailService.sendStudentDeletedEmail({
            name: studentToDelete.name,
            email: studentToDelete.email
          }).then((mailRes) => {
            if (mailRes.success) {
              showToast({
                type: 'info',
                title: 'Closure Notice Sent',
                message: `Notification email sent to ${studentToDelete.email} via Gmail.`
              });
            }
          }).catch(() => {});
        }

        setStudentsList(prev => prev.filter(s => s.id !== studentToDelete.id));
        setStudentToDelete(null);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to delete student.' });
    } finally {
      setIsDeletingStudent(false);
    }
  };

  const handleConfirmResetStudents = async () => {
    setIsResettingStudents(true);
    try {
      const res = await api.adminResetStudents();
      if (res.success) {
        showToast({
          type: 'success',
          title: 'Database Reset Complete',
          message: 'All student accounts removed. You are now starting fresh from 0 students.'
        });
        setShowResetStudentsModal(false);
        const updated = await api.adminGetStudents();
        setStudentsList(updated);
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to reset student database.' });
    } finally {
      setIsResettingStudents(false);
    }
  };

  // Question Actions
  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText || !newTopic || newOptions.some(o => !o.trim())) {
      showToast({ type: 'warning', message: 'Please fill in question, topic, and all options.' });
      return;
    }

    try {
      const created = await api.createQuestion({
        subjectId: newSubjectId,
        topic: newTopic,
        question: newQuestionText,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
        explanation: newExplanation || 'Standard SSC examination solution.',
        shortcutTrick: newShortcutTrick,
        difficulty: newDifficulty,
        pyqYear: newPyqYear,
        pyqExam: newPyqYear ? `SSC CGL ${newPyqYear}` : undefined
      });

      setQuestions(prev => [created, ...prev]);
      setShowAddQuestionModal(false);
      showToast({
        type: 'success',
        title: 'Question Added',
        message: 'The new question has been added to the master repository.'
      });

      setNewQuestionText('');
      setNewOptions(['', '', '', '']);
      setNewExplanation('');
      setNewShortcutTrick('');
    } catch {
      showToast({ type: 'error', message: 'Failed to create question.' });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.deleteQuestion(id);
      setQuestions(prev => prev.filter(q => q.id !== id));
      showToast({ type: 'info', message: 'Question removed from master bank.' });
    } catch {
      showToast({ type: 'error', message: 'Failed to delete question.' });
    }
  };

  // Mock Test Actions
  const handleAddMockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMockTitle.trim()) {
      showToast({ type: 'warning', message: 'Please enter mock test title.' });
      return;
    }

    try {
      const created = await api.createMockTest({
        title: newMockTitle.trim(),
        description: newMockDesc || 'Official CBT Mock Test Series for SSC CGL Tier-1.',
        durationMinutes: newMockDuration,
        totalMarks: newMockMarks,
        totalQuestions: newMockQuestionsCount,
        difficulty: 'Medium',
        type: 'Full Length CBT',
        isFree: true,
        questionIds: questions.slice(0, Math.min(newMockQuestionsCount, questions.length)).map(q => q.id)
      });
      setMockTests(prev => [created, ...prev]);
      setShowAddMockModal(false);
      setNewMockTitle('');
      setNewMockDesc('');
      showToast({
        type: 'success',
        title: 'Mock Test Created',
        message: 'New CBT series published to student portal.'
      });
    } catch {
      showToast({ type: 'error', message: 'Failed to create mock test.' });
    }
  };

  const handleDeleteMockTest = async (id: string) => {
    if (!confirm('Delete this mock test series?')) return;
    try {
      await api.deleteMockTest(id);
      setMockTests(prev => prev.filter(m => m.id !== id));
      showToast({ type: 'info', message: 'Mock test series deleted.' });
    } catch {
      showToast({ type: 'error', message: 'Failed to delete mock test.' });
    }
  };

  // Doubt Actions
  const handleToggleDoubtStatus = async (doubt: StudentDoubtItem) => {
    const nextStatus = doubt.status === 'resolved' ? 'needs_revision' : 'resolved';
    try {
      const updated = await api.updateStudentDoubt(doubt.id, { status: nextStatus });
      setDoubts(prev => prev.map(d => d.id === doubt.id ? updated : d));
      showToast({
        type: 'success',
        message: `Doubt status marked as ${nextStatus === 'resolved' ? 'Resolved' : 'Needs Revision'}.`
      });
    } catch {
      showToast({ type: 'error', message: 'Failed to update doubt status.' });
    }
  };

  const handleDeleteDoubt = async (id: string) => {
    if (!confirm('Delete this doubt entry?')) return;
    try {
      await api.deleteStudentDoubt(id);
      setDoubts(prev => prev.filter(d => d.id !== id));
      showToast({ type: 'info', message: 'Doubt removed.' });
    } catch {
      showToast({ type: 'error', message: 'Failed to delete doubt.' });
    }
  };

  // Asset Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAssetFileName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setAssetFileSize(`${sizeInMB} MB`);

    if (!assetTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setAssetTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAssetFilePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle.trim()) {
      showToast({ type: 'warning', message: 'Asset title is required.' });
      return;
    }

    try {
      const payload = {
        title: assetTitle.trim(),
        subjectId: assetSubject,
        category: assetCategory,
        resourceType: assetResourceType,
        description: assetDescription || `Master academic study resource uploaded by admin (${assetCategory}).`,
        fileUrl: assetFilePreview || `https://assets.sscportal.gov.in/study-notes/${Date.now()}.pdf`,
        fileSize: assetFileSize,
        pages: assetPages
      };

      const res = await api.adminUploadAsset(payload);
      if (res.success && res.material) {
        setMaterials(prev => [res.material, ...prev]);
        showToast({
          type: 'success',
          title: 'Asset Uploaded Successfully',
          message: `"${assetTitle}" is now published in Study Materials.`
        });

        // Reset form
        setAssetTitle('');
        setAssetDescription('');
        setAssetFileName('');
        setAssetFilePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      showToast({ type: 'error', message: err.message || 'Failed to upload asset.' });
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this study asset?')) return;
    try {
      await api.deleteStudyMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      showToast({ type: 'info', message: 'Study asset removed from repository.' });
    } catch {
      showToast({ type: 'error', message: 'Failed to delete asset.' });
    }
  };

  // Filtered Students
  const filteredStudents = studentsList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                        s.email.toLowerCase().includes(studentSearch.toLowerCase());
    const matchYear = studentYearFilter === 'all' || s.targetExamYear === studentYearFilter;
    return matchSearch && matchYear;
  });

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    if (questionSubjectFilter === 'all') return true;
    return q.subjectId === questionSubjectFilter;
  });

  // Filtered Assets
  const filteredMaterials = materials.filter(m => {
    if (!assetSearch.trim()) return true;
    const q = assetSearch.toLowerCase();
    return m.title.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
  });

  // ==========================================
  // VIEW 1: GATEWAY (If not unlocked)
  // ==========================================
  if (isVerifyingUrlToken) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-xs font-semibold">Verifying secure access token...</span>
        </div>
      </div>
    );
  }

  // Strict Security Enforcement: Direct visits or missing/invalid token returns 404
  if (!isUrlTokenAuthorized && !isAdminUnlocked) {
    return <NotFoundPage />;
  }

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-lg bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl p-6 sm:p-10 space-y-6 animate-in fade-in zoom-in-95">
          
          {/* Security Icon & Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <ShieldAlert className="w-7 h-7" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase tracking-wider border border-slate-700">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Administrative Security Gateway</span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              Restricted Operations Console
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
              This administrative interface is isolated from public view. Please enter the authorized secret token name and administrator credentials to initialize security product cookies.
            </p>
          </div>

          {gatewayError && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{gatewayError}</span>
            </div>
          )}

          <form onSubmit={handleGatewaySubmit} className="space-y-4 text-xs">
            {/* Secret Token Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Security Secret Token Name</span>
                </label>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Required
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="Enter authorized secret token name"
                value={secretTokenInput}
                onChange={(e) => setSecretTokenInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-mono text-xs transition-all"
              />
            </div>

            {/* Admin Username / Email */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter admin username or email"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs transition-all"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block font-bold text-slate-200 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-xs transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isVerifying ? 'Authenticating Security Gate...' : 'Verify Token & Open Admin Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Safe Return Button */}
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => setActivePage('dashboard')}
              className="text-xs text-slate-400 hover:text-slate-200 hover:underline cursor-pointer"
            >
              ← Return to Aspirant Preparation Dashboard
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: FULL ADMIN PANEL (When unlocked)
  // ==========================================
  return (
    <div className="space-y-6 py-4 max-w-7xl mx-auto">
      
      {/* Admin Master Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Secret Token: {activeSecretToken} [Verified]</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30">
              <Lock className="w-3 h-3" />
              <span>Product Cookies Active</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30">
              <span>Super Administrator</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Administrative Governance & Control Center
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Full control over student accounts, login records, exam performance diagnostics, question master bank, CBT mock tests, student doubts, and uploaded asset repository.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={fetchAllAdminData}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <button
            onClick={() => setShowCreateStudentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Student Account</span>
          </button>

          <button
            onClick={async () => {
              await adminLogout();
              showToast({
                type: 'info',
                title: 'Admin Session Locked',
                message: 'Product security cookies cleared and admin session terminated.'
              });
              setActivePage('dashboard');
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock & Exit Session</span>
          </button>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-[#E2E8F0] rounded-xl text-xs font-semibold overflow-x-auto shadow-xs">
        <button
          onClick={() => setActiveTab('students')}
          className={`py-2.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-[#2563EB] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Student Directory & Login Audit ({studentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#2563EB] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Student Performance Analysis</span>
        </button>

        <button
          onClick={() => setActiveTab('repository')}
          className={`py-2.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'repository'
              ? 'bg-[#2563EB] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Platform Control (Questions, Tests & Doubts)</span>
        </button>

        <button
          onClick={() => setActiveTab('assets')}
          className={`py-2.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'assets'
              ? 'bg-[#2563EB] text-white shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload Assets & Resources ({materials.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-2.5 px-4 rounded-lg transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-amber-600 text-white shadow-xs font-bold'
              : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Security & Secret URL Token Control</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: STUDENT DIRECTORY & LOGIN AUDIT                    */}
      {/* ========================================================= */}
      {activeTab === 'students' && (
        <div className="space-y-4">

          {/* Gmail API Integration & Status Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white border border-blue-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Gmail API Integration & Notification Dispatcher</span>
                    {isGmailConnected ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active: {gmailUserEmail || 'Connected'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Standby (Server Proxy Active)
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    Sends automatic confirmation emails when creating new student accounts and closure notices when deleting students.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Toggles */}
              <div className="flex items-center gap-3 text-[11px] text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSendWelcomeEmail}
                    onChange={(e) => setAutoSendWelcomeEmail(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600"
                  />
                  <span>Send on Create</span>
                </label>
                <span className="text-slate-600">•</span>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoSendDeleteEmail}
                    onChange={(e) => setAutoSendDeleteEmail(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600"
                  />
                  <span>Send on Delete</span>
                </label>
              </div>

              {/* Connect / Disconnect button */}
              {isGmailConnected ? (
                <button
                  type="button"
                  onClick={handleDisconnectGmail}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Disconnect Gmail
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConnectGmail}
                  disabled={isConnectingGmail}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isConnectingGmail ? 'Connecting...' : 'Connect Gmail Account'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name or email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] focus:outline-none focus:border-blue-600 focus:bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={studentYearFilter}
                  onChange={(e) => setStudentYearFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-slate-700 focus:outline-none focus:border-blue-600"
                >
                  <option value="all">All Exam Cycles</option>
                  <option value="2026-2027">SSC CGL 2026-2027</option>
                  <option value="2027-2028">SSC CGL 2027-2028</option>
                </select>
              </div>

              {/* Reset All Students (Start Fresh) Button */}
              <button
                type="button"
                onClick={() => setShowResetStudentsModal(true)}
                className="px-3 py-2 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Purge all student accounts to start fresh"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Remove All Students (Start Fresh)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCreateStudentModal(true)}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Student</span>
              </button>
            </div>
          </div>

          {/* Students Master Table */}
          <div className="rounded-xl bg-white border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-700 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Student & Email</th>
                    <th className="py-3 px-4">Exam Cycle</th>
                    <th className="py-3 px-4">Last Login Time</th>
                    <th className="py-3 px-4 text-center">Login Count</th>
                    <th className="py-3 px-4 text-center">Questions Solved</th>
                    <th className="py-3 px-4 text-center">Accuracy</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <div className="space-y-2 max-w-sm mx-auto">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                            <Users className="w-5 h-5" />
                          </div>
                          <div className="font-bold text-slate-800 text-xs">No Student Accounts Found</div>
                          <p className="text-[11px] text-slate-500">
                            The student database is clean. Click &quot;Create Student&quot; above to enroll aspirants or students can register with their email.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                              {st.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {st.role === 'admin' && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 font-mono">
                                {st.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {st.targetExamYear || '2026-2027'}
                        </td>

                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              {st.lastLoginAt 
                                ? new Date(st.lastLoginAt).toLocaleString() 
                                : 'Just Registered'}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold text-[11px]">
                            {st.loginCount || 1} logins
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center font-semibold text-slate-800">
                          {st.questionsSolved || 0}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span className="font-bold text-emerald-600">
                            {st.accuracy || 80}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Send Direct Email Button */}
                            {st.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleOpenEmailModal(st)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Send Email via Gmail"
                              >
                                <Mail className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentForPassword(st);
                                setShowChangePasswordModal(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-blue-600 text-[11px] font-bold transition-colors cursor-pointer"
                              title="Change Student Password"
                            >
                              Reset Password
                            </button>

                            {st.role !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteStudent(st)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: STUDENT PERFORMANCE ANALYSIS                       */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Diagnostic KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Registered Aspirants
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {analyticsSummary?.totalRegisteredStudents || studentsList.length || 38}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+12 verified accounts this week</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total CBT Mock Attempts
              </span>
              <div className="text-3xl font-black text-blue-600 mt-2">
                {analyticsSummary?.totalMockAttempts || 142}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Full-length 100 Qs CBT examinations
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Platform Average Score
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {analyticsSummary?.averagePlatformScore || 144.5} <span className="text-base font-normal text-slate-400">/ 200</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Current qualifying cutoff benchmark: 137.5
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Master Question Bank
              </span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {questions.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Across Quant, Reasoning, English & GA
              </div>
            </div>
          </div>

          {/* Sectional Performance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Sectional Accuracy & Competency Benchmark
              </h3>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">Quantitative Aptitude</span>
                    <span className="text-blue-600">82.4% Accuracy</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '82.4%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">General Intelligence & Reasoning</span>
                    <span className="text-emerald-600">88.6% Accuracy</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '88.6%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">English Language & Comprehension</span>
                    <span className="text-indigo-600">79.2% Accuracy</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: '79.2%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">General Awareness & Static GK</span>
                    <span className="text-amber-600">68.5% Accuracy</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '68.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Aspirant High-Yield Diagnostic Weak Topics */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Common Student Bottlenecks & Weak Areas
              </h3>

              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-rose-900">Mensuration & Geometry Theorems</span>
                    <p className="text-rose-800/80 mt-0.5">
                      44% error rate reported on 3D Mensuration cylinder-frustum frustum volume calculations.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900">English Inversion & Subject-Verb Pairs</span>
                    <p className="text-amber-800/80 mt-0.5">
                      Frequent negative markings on "Hardly...when" vs "No sooner...than" inversion constructs.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-blue-900">Polity Articles & Constitutional Amendments</span>
                    <p className="text-blue-800/80 mt-0.5">
                      Students struggle on 42nd & 44th Constitutional Amendments and Article 32 writ types.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PLATFORM CONTROL (QUESTIONS, TESTS, DOUBTS)        */}
      {/* ========================================================= */}
      {activeTab === 'repository' && (
        <div className="space-y-4">
          {/* Sub-Tabs Selector */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex p-1 rounded-xl bg-slate-100 text-xs font-semibold">
              <button
                onClick={() => setRepoSubTab('questions')}
                className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer ${
                  repoSubTab === 'questions' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Question Bank ({questions.length})
              </button>
              <button
                onClick={() => setRepoSubTab('mock-tests')}
                className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer ${
                  repoSubTab === 'mock-tests' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Mock Test Series ({mockTests.length})
              </button>
              <button
                onClick={() => setRepoSubTab('doubts')}
                className={`py-1.5 px-4 rounded-lg transition-all cursor-pointer ${
                  repoSubTab === 'doubts' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Student Doubts ({doubts.length})
              </button>
            </div>

            {/* Sub-tab action button */}
            {repoSubTab === 'questions' && (
              <button
                onClick={() => setShowAddQuestionModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question to Bank</span>
              </button>
            )}

            {repoSubTab === 'mock-tests' && (
              <button
                onClick={() => setShowAddMockModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Mock Test</span>
              </button>
            )}
          </div>

          {/* Sub-view: QUESTIONS */}
          {repoSubTab === 'questions' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-[#E2E8F0] gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Master Question Repository
                </span>
                <select
                  value={questionSubjectFilter}
                  onChange={(e) => setQuestionSubjectFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <option value="all">All Subjects</option>
                  <option value="quantitative-aptitude">Quantitative Aptitude</option>
                  <option value="reasoning">General Intelligence</option>
                  <option value="english">English Language</option>
                  <option value="general-awareness">General Awareness</option>
                </select>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {filteredQuestions.map((q) => (
                  <div key={q.id} className="py-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-bold text-blue-600 uppercase">{q.subjectId}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-800">{q.topic}</span>
                        <span>·</span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold">{q.difficulty}</span>
                        {q.pyqYear && <span className="text-blue-600 font-bold">PYQ {q.pyqYear}</span>}
                      </div>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="font-bold text-slate-900 leading-relaxed">{q.question}</p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={`p-2 rounded-lg border ${
                            i === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-800'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-mono mr-1">({String.fromCharCode(65 + i)})</span> {opt}
                        </div>
                      ))}
                    </div>

                    {q.shortcutTrick && (
                      <div className="text-[11px] text-amber-700 font-semibold bg-amber-50 p-2 rounded-lg border border-amber-200">
                        ⚡ Shortcut Trick: {q.shortcutTrick}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-view: MOCK TESTS */}
          {repoSubTab === 'mock-tests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockTests.map((mock) => (
                <div key={mock.id} className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-600 uppercase tracking-wider">{mock.type}</span>
                    <button
                      onClick={() => handleDeleteMockTest(mock.id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete Mock Test"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{mock.title}</h3>
                  <p className="text-xs text-slate-600">{mock.description}</p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600">{mock.totalQuestions} Questions · {mock.durationMinutes} Mins</span>
                    <span className="text-emerald-600">{mock.totalMarks} Marks</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sub-view: STUDENT DOUBTS */}
          {repoSubTab === 'doubts' && (
            <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Student Doubts Submitted to AI Mentor
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  Total Doubts: {doubts.length}
                </span>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {doubts.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No student doubts found.
                  </div>
                ) : (
                  doubts.map((d) => (
                    <div key={d.id} className="py-4 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600">{d.subject}</span>
                          <span className="text-slate-400">·</span>
                          <span className="font-semibold text-slate-700">{d.topic}</span>
                          <span className="text-slate-400">·</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {d.status === 'resolved' ? 'Resolved' : 'Needs Revision'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleDoubtStatus(d)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold cursor-pointer"
                          >
                            Toggle Status
                          </button>
                          <button
                            onClick={() => handleDeleteDoubt(d.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="font-bold text-slate-900 leading-relaxed">
                        Q: {d.question}
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed">
                        <span className="font-bold text-blue-600 block mb-1">AI Solution Summary:</span>
                        {d.solution?.answer || 'Step-by-step conceptual solution recorded.'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: UPLOAD ASSETS & RESOURCES                          */}
      {/* ========================================================= */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          {/* Asset Upload Form */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
              <FileUp className="w-4 h-4" />
              <span>Upload New Academic Asset / Study Resource</span>
            </div>

            <form onSubmit={handleUploadAssetSubmit} className="space-y-4 text-xs">
              {/* Drag-and-drop or select file box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-colors space-y-2"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  className="hidden"
                />
                <div className="w-10 h-10 mx-auto rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">
                    {assetFileName ? `Selected: ${assetFileName}` : 'Click to select asset file (PDF, Notes, Images)'}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Calculated File Size: {assetFileSize}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Asset Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter study material title"
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Subject Module
                  </label>
                  <select
                    value={assetSubject}
                    onChange={(e) => setAssetSubject(e.target.value as SubjectId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                  >
                    <option value="quantitative-aptitude">Quantitative Aptitude</option>
                    <option value="reasoning">General Intelligence & Reasoning</option>
                    <option value="english">English Language</option>
                    <option value="general-awareness">General Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Category Type
                  </label>
                  <select
                    value={assetCategory}
                    onChange={(e) => setAssetCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                  >
                    <option value="Notes">Comprehensive Theory Notes</option>
                    <option value="Formula Sheet">Formula Sheet & Cheatsheet</option>
                    <option value="PYQ Compilation">PYQ Compilation</option>
                    <option value="Syllabus Guide">Syllabus Guide</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description & Key Topics
                </label>
                <textarea
                  rows={2}
                  placeholder="Summary of formulas, theorems, and exam relevance..."
                  value={assetDescription}
                  onChange={(e) => setAssetDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload & Publish to Students</span>
                </button>
              </div>
            </form>
          </div>

          {/* Master Assets List */}
          <div className="p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Published Study Materials & Assets ({materials.length})
              </span>
              <input
                type="text"
                placeholder="Search assets..."
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-slate-600 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-3 px-4">Asset Title</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">File Size</th>
                    <th className="py-3 px-4 text-center">Downloads</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {filteredMaterials.map((mat) => (
                    <tr key={mat.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{mat.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600 uppercase text-[11px]">
                        {mat.subjectId}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                          {mat.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {mat.fileSizeFormatted || '2.4 MB'}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-700">
                        {mat.downloadsCount || 24}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteMaterial(mat.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SECURITY & SECRET TOKEN URL CONTROL                */}
      {/* ========================================================= */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                    <KeyRound className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Admin URL Access & Secret Token Security Control
                  </h2>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Public routes like <code className="text-rose-600 font-mono bg-rose-50 px-1.5 py-0.5 rounded">/admin</code> and direct <code className="text-rose-600 font-mono bg-rose-50 px-1.5 py-0.5 rounded">/admin-login</code> without this authorized secret token strictly return an <strong>HTTP 404 Not Found error</strong>. The admin portal can only be accessed using the URL below with this token.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>404 Protection Active</span>
                </span>
              </div>
            </div>

            {/* Current Active Access Link Display & Copy */}
            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-sm border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span>Active Authorized Admin Login URL</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Token: {activeSecretToken}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs break-all select-all">
                  {typeof window !== 'undefined' ? `${window.location.origin}/admin-login?token=${encodeURIComponent(activeSecretToken)}` : `/admin-login?token=${activeSecretToken}`}
                </div>
                <button
                  type="button"
                  onClick={handleCopyAdminUrl}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-sm"
                >
                  {tokenCopied ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                  <span>{tokenCopied ? 'Link Copied!' : 'Copy Direct Link'}</span>
                </button>
              </div>
            </div>

            {/* Token Modification Form */}
            <form onSubmit={handleUpdateSecretToken} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Update Admin Secret Security Token
                </label>
                <p className="text-[11px] text-slate-500">
                  You can change the authorized secret token anytime. Updating this token will immediately invalidate previous access links and mandate the new token in the URL.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 max-w-xl">
                  <input
                    type="text"
                    required
                    value={inputNewSecretToken}
                    onChange={(e) => setInputNewSecretToken(e.target.value)}
                    placeholder="Enter new secret token name"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-mono text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateRandomToken}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Generate Random</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingToken || !inputNewSecretToken.trim() || inputNewSecretToken.trim() === activeSecretToken}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  {isUpdatingToken ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{isUpdatingToken ? 'Updating Security Token...' : 'Save & Activate New Token'}</span>
                </button>
              </div>
            </form>

            {/* Security Explanation / Architecture Card */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-2 text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Security Enforcement Architecture</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-900/90 leading-relaxed">
                <li>Direct visits to <code>/admin</code> or <code>/admin/*</code> immediately terminate with an HTTP 404 Not Found error.</li>
                <li>Visits to <code>/admin-login</code> without the query parameter <code>?token={activeSecretToken}</code> strictly return 404 Not Found.</li>
                <li>All public navbars, sidebars, and guest menus have no links or exposure of the administrative portal.</li>
                <li>When updating the token above, the server immediately accepts only the new token and repudiates previous links.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE STUDENT                                     */}
      {/* ========================================================= */}
      {showCreateStudentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Create Student Account</span>
              </h3>
              <button
                onClick={() => setShowCreateStudentModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter student full name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Student Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter student email address"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 4 characters"
                  value={newStudentInitialPass}
                  onChange={(e) => setNewStudentInitialPass(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Exam Year</label>
                <select
                  value={newStudentYear}
                  onChange={(e) => setNewStudentYear(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                >
                  <option value="2026-2027">SSC CGL 2026-2027</option>
                  <option value="2027-2028">SSC CGL 2027-2028</option>
                </select>
              </div>

              {/* Confirmation Email Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={createSendWelcomeEmail}
                    onChange={(e) => setCreateSendWelcomeEmail(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Send Welcome & Confirmation Email via Gmail</span>
                    </span>
                    <p className="text-[11px] text-blue-800/80 mt-0.5">
                      Dispatches login credentials and portal access link directly to the student's inbox.
                    </p>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStudentModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Create Student & Send Mail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE STUDENT CONFIRMATION (MANDATORY WORKSPACE)  */}
      {/* ========================================================= */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Confirm Student Account Deletion</span>
              </h3>
              <button
                onClick={() => setStudentToDelete(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-700">
                Are you sure you want to permanently delete the following aspirant account? This action cannot be undone.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900 text-sm">{studentToDelete.name}</div>
                <div className="text-slate-500 font-mono text-xs">{studentToDelete.email}</div>
                <div className="text-[11px] text-slate-400">Exam Cycle: {studentToDelete.targetExamYear || '2026-2027'}</div>
              </div>

              {/* Closure Notice Email Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/60 border border-rose-200/80 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={deleteNotifyEmail}
                  onChange={(e) => setDeleteNotifyEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-rose-600 mt-0.5"
                />
                <div>
                  <span className="font-bold text-rose-950 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-rose-600" />
                    <span>Send Account Closure Notice via Gmail</span>
                  </span>
                  <p className="text-[11px] text-rose-800/80 mt-0.5">
                    Sends an official account closure confirmation notice to the student's email.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                disabled={isDeletingStudent}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteStudent}
                disabled={isDeletingStudent}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeletingStudent ? 'Deleting & Notifying...' : 'Confirm Delete & Send Notice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: RESET ALL STUDENTS (START FRESH)                   */}
      {/* ========================================================= */}
      {showResetStudentsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <h3 className="font-bold text-base text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>Remove All Students & Start from New</span>
              </h3>
              <button
                onClick={() => setShowResetStudentsModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-900">
                Are you sure you want to remove ALL student accounts and start completely fresh?
              </p>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Fresh Start Guarantee:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                  <li>Purges all mock test attempts, student doubt records, and student accounts.</li>
                  <li>Resets the student directory to exactly 0 students.</li>
                  <li>Your Master Admin account and password remain completely secure.</li>
                  <li>You can immediately start enrolling real students or students can register with their email.</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetStudentsModal(false)}
                disabled={isResettingStudents}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmResetStudents}
                disabled={isResettingStudents}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isResettingStudents ? 'Clearing Database...' : 'Confirm Purge & Start Fresh'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: SEND CUSTOM EMAIL VIA GMAIL                       */}
      {/* ========================================================= */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span>Dispatch Email via Gmail</span>
              </h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendCustomEmail} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={emailStudentName}
                    onChange={(e) => setEmailStudentName(e.target.value)}
                    placeholder="Student Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recipient Email Address</label>
                  <input
                    type="email"
                    required
                    value={emailRecipient}
                    onChange={(e) => setEmailRecipient(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Subject of notification..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows={6}
                  required
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Write your email message to the student..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600 font-mono text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/60 text-[11px] text-blue-900 flex items-center justify-between">
                <span>Sender Account: <strong>{gmailUserEmail || 'Admin Dispatcher'}</strong></span>
                <span className="font-semibold text-blue-600">Gmail API</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(false)}
                  disabled={isSendingEmail}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSendingEmail ? 'Dispatching Email...' : 'Send Email via Gmail'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CHANGE STUDENT PASSWORD                            */}
      {/* ========================================================= */}
      {showChangePasswordModal && selectedStudentForPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <span>Reset Student Password</span>
              </h3>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
              Target Student: <span className="font-bold text-slate-900">{selectedStudentForPassword.name}</span> ({selectedStudentForPassword.email})
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  New Password (min 4 characters)
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new secure password"
                  value={newStudentPassword}
                  onChange={(e) => setNewStudentPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD QUESTION                                       */}
      {/* ========================================================= */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Add Question to Master Bank</span>
              </h3>
              <button
                onClick={() => setShowAddQuestionModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value as SubjectId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="quantitative-aptitude">Quantitative Aptitude</option>
                    <option value="reasoning">General Intelligence & Reasoning</option>
                    <option value="english">English Language</option>
                    <option value="general-awareness">General Awareness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter topic name"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Question Text</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the full question formulation..."
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {newOptions.map((opt, i) => (
                  <div key={i}>
                    <label className="block font-bold text-slate-700 mb-1">Option ({String.fromCharCode(65 + i)})</label>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newOptions] as [string, string, string, string];
                        copy[i] = e.target.value;
                        setNewOptions(copy);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Correct Answer</label>
                  <select
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-emerald-700"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PYQ Year (optional)</label>
                  <input
                    type="number"
                    value={newPyqYear || ''}
                    onChange={(e) => setNewPyqYear(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Enter PYQ year (optional)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Explanation / Solution Steps</label>
                <textarea
                  rows={2}
                  placeholder="Step-by-step breakdown of the answer..."
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Shortcut Trick (Exam Hack)</label>
                <input
                  type="text"
                  placeholder="Direct ratio trick or mental shortcut..."
                  value={newShortcutTrick}
                  onChange={(e) => setNewShortcutTrick(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD MOCK TEST                                      */}
      {/* ========================================================= */}
      {showAddMockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Create New CBT Mock Test</span>
              </h3>
              <button
                onClick={() => setShowAddMockModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMockSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mock Test Title</label>
                <input
                  type="text"
                  required
                  placeholder="Enter CBT mock test title"
                  value={newMockTitle}
                  onChange={(e) => setNewMockTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Official CBT pattern examination simulation..."
                  value={newMockDesc}
                  onChange={(e) => setNewMockDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={newMockDuration}
                    onChange={(e) => setNewMockDuration(parseInt(e.target.value) || 60)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={newMockMarks}
                    onChange={(e) => setNewMockMarks(parseInt(e.target.value) || 200)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMockModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                >
                  Create Mock Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
