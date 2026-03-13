import { PORTFOLIO_DATA } from '../data';

export function generateSummaryReport(): void {
  const totalFunding = PORTFOLIO_DATA.fundingSources.reduce((s, f) => s + f.totalAmount, 0);
  const activeProjects = PORTFOLIO_DATA.techHubProjects.length + PORTFOLIO_DATA.innovationProjects.length;
  const jobsTarget = PORTFOLIO_DATA.performanceTargets.metrics.jobsCreated;
  const dataGaps = PORTFOLIO_DATA.innovationProjects.filter(p => p.partnerName === '[NEEDS VERIFICATION]').length;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PIC Portfolio Summary — ${today}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; color: #1a2a2e; }
    h1 { color: #1a8a9e; border-bottom: 2px solid #1a8a9e; padding-bottom: 8px; }
    h2 { color: #1a8a9e; margin-top: 32px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 20px 0; }
    .stat { background: #f0f9fb; border-radius: 8px; padding: 16px; text-align: center; }
    .stat .value { font-size: 1.8rem; font-weight: bold; color: #1a8a9e; }
    .stat .label { font-size: 0.8rem; color: #6b7b80; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.9rem; }
    th { background: #1a8a9e; color: white; padding: 8px 12px; text-align: left; }
    td { padding: 8px 12px; border-bottom: 1px solid #d8e2e4; }
    tr:nth-child(even) td { background: #f8fafb; }
    .alert { background: #fff8e1; border-left: 4px solid #e5b731; padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0; }
    .footer { font-size: 0.75rem; color: #9ca3af; margin-top: 40px; text-align: center; }
    @media print { body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>PIC Innovation Portfolio — Executive Summary</h1>
  <p style="color: #6b7b80;">Generated: ${today} &nbsp;|&nbsp; Polymer Industry Cluster, Akron, Ohio</p>

  <div class="stats">
    <div class="stat"><div class="value">$${(totalFunding / 1e6).toFixed(2)}M</div><div class="label">Total Funding Secured</div></div>
    <div class="stat"><div class="value">${activeProjects}</div><div class="label">Active Projects</div></div>
    <div class="stat"><div class="value">${PORTFOLIO_DATA.synthe6Startups.length}</div><div class="label">Synthe6 Startups</div></div>
    <div class="stat"><div class="value">${jobsTarget.toLocaleString()}</div><div class="label">Jobs Target (2031)</div></div>
  </div>

  ${dataGaps > 0 ? `<div class="alert">⚠ Data Quality: ${dataGaps} Round 1 Innovation Projects require partner verification before next committee report.</div>` : ''}

  <h2>Funding Sources</h2>
  <table>
    <tr><th>Program</th><th>Amount</th><th>Source</th><th>Status</th></tr>
    ${PORTFOLIO_DATA.fundingSources.map(f => `
    <tr><td>${f.name}</td><td>$${(f.totalAmount / 1e6).toFixed(2)}M</td><td>${f.source}</td><td>${f.status}</td></tr>
    `).join('')}
  </table>

  <h2>Tech Hub Projects (EDA Phase 2)</h2>
  <table>
    <tr><th>Project</th><th>Partner</th><th>Funding</th><th>Stage</th><th>Sector</th></tr>
    ${PORTFOLIO_DATA.techHubProjects.map(p => `
    <tr><td>${p.projectName}</td><td>${p.partnerName}</td><td>$${(p.fundingAmount / 1e6).toFixed(1)}M</td><td>${p.stageGate}</td><td>${p.sector}</td></tr>
    `).join('')}
  </table>

  <h2>Innovation Projects (Ohio Innovation Hubs)</h2>
  <table>
    <tr><th>Project</th><th>Partner</th><th>Stage</th><th>Sector</th></tr>
    ${PORTFOLIO_DATA.innovationProjects.map(p => `
    <tr><td>${p.projectName}</td><td>${p.partnerName}</td><td>${p.stageGate}</td><td>${p.sector}</td></tr>
    `).join('')}
  </table>

  <h2>Risk Summary</h2>
  <table>
    <tr><th>Risk</th><th>Likelihood</th><th>Impact</th><th>Status</th></tr>
    ${PORTFOLIO_DATA.riskRegister.map(r => `
    <tr><td>${r.risk}</td><td>${r.likelihood}/5</td><td>${r.impact}/5</td><td>${r.status}</td></tr>
    `).join('')}
  </table>

  <div class="footer">PIC Portfolio Dashboard &nbsp;|&nbsp; is.gd/picdashboard &nbsp;|&nbsp; ${today}</div>
  <script>window.print();</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
