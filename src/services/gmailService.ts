import { auth, googleProvider, setCachedAccessToken, getCachedAccessToken } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

export interface SendEmailPayload {
  to: string;
  subject: string;
  body: string;
  fromName?: string;
}

export interface GmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class GmailService {
  private connectedEmail: string | null = null;
  private isConnecting: boolean = false;

  getConnectedEmail(): string | null {
    if (this.connectedEmail) return this.connectedEmail;
    if (auth.currentUser?.email) return auth.currentUser.email;
    return null;
  }

  isGmailConnected(): boolean {
    const token = getCachedAccessToken();
    return !!token;
  }

  async connectGmail(): Promise<{ success: boolean; email?: string; error?: string }> {
    if (this.isConnecting) {
      return { success: false, error: 'Connection already in progress.' };
    }
    this.isConnecting = true;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential?.accessToken) {
        throw new Error('Failed to obtain Google OAuth access token with Gmail permissions.');
      }

      setCachedAccessToken(credential.accessToken);
      this.connectedEmail = result.user.email || null;

      return {
        success: true,
        email: this.connectedEmail || undefined
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Failed to authenticate Gmail account.'
      };
    } finally {
      this.isConnecting = false;
    }
  }

  disconnectGmail(): void {
    setCachedAccessToken(null);
    this.connectedEmail = null;
  }

  private createRawEmail(to: string, subject: string, bodyText: string): string {
    const fromAddr = this.getConnectedEmail();
    const headers = [
      `To: ${to}`,
      ...(fromAddr ? [`From: "SSC CGL Portal" <${fromAddr}>`] : []),
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      bodyText
    ];

    const rawStr = headers.join('\r\n');
    return btoa(unescape(encodeURIComponent(rawStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async sendEmail(payload: SendEmailPayload): Promise<GmailSendResult> {
    const accessToken = getCachedAccessToken();
    const cleanTo = payload.to.trim();
    if (!cleanTo || !cleanTo.includes('@')) {
      return { success: false, error: 'A valid recipient email address is required.' };
    }

    // Try client-side direct Gmail API call if OAuth token is available
    if (accessToken) {
      try {
        const raw = this.createRawEmail(cleanTo, payload.subject, payload.body);
        const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw })
        });

        if (res.ok) {
          const data = await res.json();
          return { success: true, messageId: data.id };
        } else {
          const errData = await res.json().catch(() => ({}));
          console.warn('Gmail API returned non-ok status:', errData);
        }
      } catch (clientErr: any) {
        console.warn('Client-side Gmail send error:', clientErr);
      }
    }

    // Fallback or server-side proxy
    try {
      const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_token') : null;
      const secret = typeof window !== 'undefined' ? sessionStorage.getItem('ssc_admin_secret') : null;

      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { 'Authorization': `Bearer ${adminToken}` } : {}),
          ...(secret ? { 'x-secret-token': secret } : {})
        },
        body: JSON.stringify({
          to: cleanTo,
          subject: payload.subject,
          body: payload.body,
          oauthToken: accessToken || undefined
        })
      });

      if (res.ok) {
        const data = await res.json();
        return { success: true, messageId: data.messageId || 'dispatched' };
      } else {
        const errJson = await res.json().catch(() => ({}));
        return { success: false, error: errJson.error || 'Server email dispatch failed.' };
      }
    } catch (serverErr: any) {
      return {
        success: false,
        error: serverErr.message || 'Unable to connect to email dispatcher.'
      };
    }
  }

  // Predefined Confirmation Email: Student Created
  async sendStudentWelcomeEmail(student: {
    name: string;
    email: string;
    initialPassword?: string;
    targetExamYear?: string;
  }): Promise<GmailSendResult> {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sscportal.gov.in';
    const subject = `Welcome to SSC CGL Portal - Aspirant Account Created (${student.name})`;
    const body = `Dear ${student.name},

Congratulations! Your aspirant profile has been successfully enrolled into the SSC CGL Preparation Portal for the ${student.targetExamYear || '2026-2027'} exam cycle.

--- YOUR ACCOUNT DETAILS ---
Full Name: ${student.name}
Login Email: ${student.email}
${student.initialPassword ? `Initial Password: ${student.initialPassword}` : 'Access Method: Direct Google Sign-In or Password'}
Target Cycle: SSC CGL ${student.targetExamYear || '2026-2027'}
Portal URL: ${origin}

--- WHAT YOU CAN DO NEXT ---
1. Take Full-Length CBT Tier-1 & Tier-2 Mock Tests
2. Solve previous year questions (PYQs) with step-by-step shortcuts
3. Ask doubts to the AI Doubt Mentor
4. Track your real-time accuracy and subject percentiles

If you have questions, reply to this email or contact support.

Best regards,
SSC CGL Academic Administration Team`;

    return this.sendEmail({
      to: student.email,
      subject,
      body
    });
  }

  // Predefined Confirmation Email: Student Deleted
  async sendStudentDeletedEmail(student: {
    name: string;
    email: string;
  }): Promise<GmailSendResult> {
    const subject = `SSC CGL Preparation Portal - Account Closure Notice`;
    const body = `Dear ${student.name},

This email is an official confirmation notice that your aspirant account (${student.email}) on the SSC CGL Preparation Portal has been removed and closed by the administrator.

All associated mock test records, bookmarks, and active sessions have been securely purged from the active system.

If this was done in error or if you wish to re-enroll for upcoming test series, you may register a new account on the portal or contact the administrator.

Best regards,
SSC CGL Portal Security & Student Records`;

    return this.sendEmail({
      to: student.email,
      subject,
      body
    });
  }
}

export const gmailService = new GmailService();
