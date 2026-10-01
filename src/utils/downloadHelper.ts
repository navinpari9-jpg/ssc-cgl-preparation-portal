// Utility to generate formatted printable study materials for download
export const downloadStudyDocument = (title: string, subject: string, topic: string, content: string, formulas?: string[], shortcuts?: string[], examples?: any[]) => {
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} - SSC CGL Preparation Portal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .header {
      border-bottom: 2px solid #2563eb;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: #eff6ff;
      color: #1d4ed8;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 26px;
      margin: 8px 0;
      color: #0f172a;
    }
    .meta {
      font-size: 13px;
      color: #64748b;
    }
    .box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #2563eb;
      padding: 14px 18px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .box-title {
      font-weight: 700;
      font-size: 14px;
      color: #1e3a8a;
      margin-bottom: 6px;
    }
    .formula-item, .shortcut-item {
      margin: 8px 0;
      padding: 6px 0;
      border-bottom: 1px dashed #cbd5e1;
      font-size: 14px;
    }
    .content-body {
      font-size: 14px;
      white-space: pre-wrap;
    }
    .footer {
      margin-top: 40px;
      border-top: 1px solid #e2e8f0;
      padding-top: 14px;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">SSC CGL 2025-2026 Examination Resource</span>
    <h1>${title}</h1>
    <div class="meta">Subject: <strong>${subject}</strong> | Topic: <strong>${topic}</strong> | Official Study Document</div>
  </div>

  ${formulas && formulas.length > 0 ? `
  <div class="box">
    <div class="box-title">⚡ High-Yield Exam Formulas & Rules:</div>
    ${formulas.map((f, i) => `<div class="formula-item"><strong>Formula ${i + 1}:</strong> ${f}</div>`).join('')}
  </div>` : ''}

  ${shortcuts && shortcuts.length > 0 ? `
  <div class="box" style="border-left-color: #f59e0b; background: #fffbeb;">
    <div class="box-title" style="color: #92400e;">💡 Quick Shortcut Tricks:</div>
    ${shortcuts.map((s, i) => `<div class="shortcut-item"><strong>Trick ${i + 1}:</strong> ${s}</div>`).join('')}
  </div>` : ''}

  <div class="content-body">
    ${content.replace(/## /g, '<h3>').replace(/### /g, '<h4>')}
  </div>

  ${examples && examples.length > 0 ? `
  <div style="margin-top: 28px;">
    <h3>Solved Model Examples:</h3>
    ${examples.map((ex, i) => `
      <div class="box" style="border-left-color: #10b981; background: #f0fdf4;">
        <div class="box-title" style="color: #065f46;">Example ${i + 1}: ${ex.question}</div>
        <div style="font-size: 13px; margin: 6px 0;"><strong>Solution:</strong> ${ex.solution}</div>
        ${ex.shortcutMethod ? `<div style="font-size: 12px; color: #047857;"><em>Speed Trick:</em> ${ex.shortcutMethod}</div>` : ''}
      </div>
    `).join('')}
  </div>` : ''}

  <div class="footer">
    <span>SSC CGL Preparation Portal · Verified Digital Library</span>
    <span>Downloaded on ${new Date().toLocaleDateString()}</span>
  </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_study_notes.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
