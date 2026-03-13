import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { PORTFOLIO_DATA } from '../data';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { getChartTheme } from '@/lib/chart-colors';
import type { ViewId } from '../config/views';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function ProgressBar({ label, value, max, unit = '' }: { label: string; value: number; max: number; unit?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value.toLocaleString()}{unit} / {max.toLocaleString()}{unit}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.max(pct, 2)}%` }} />
      </div>
    </div>
  );
}

function TrendBadge({ current, previous, label }: { current: number; previous: number; label: string }) {
  if (previous === 0 && current === 0) return null;
  const delta = current - previous;
  if (delta === 0) return <span className="text-xs text-muted-foreground">No change vs Q4 2025</span>;
  const isUp = delta > 0;
  return (
    <span className={`text-xs font-medium ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
      {isUp ? '↑' : '↓'} {label}
    </span>
  );
}

function AnimatedNumber({ value, formatter = (v: number) => v.toString() }: { value: number, formatter?: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 800;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(value * easeProgress);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return <>{formatter(displayValue)}</>;
}

interface OverviewViewProps {
  onNavigate?: (view: ViewId) => void;
}

export function OverviewView({ onNavigate }: OverviewViewProps = {}) {
  const formatM = (val: number) => `$${(val / 1000000).toFixed(2)}M`;
  const chartTheme = getChartTheme();

  const totalFunding = PORTFOLIO_DATA.fundingSources.reduce((sum, f) => sum + f.totalAmount, 0);
  const activeProjectsCount = PORTFOLIO_DATA.techHubProjects.length + PORTFOLIO_DATA.innovationProjects.length;
  const synthe6StartupsCount = PORTFOLIO_DATA.synthe6Startups.length;
  const jobsTarget = PORTFOLIO_DATA.performanceTargets.metrics.jobsCreated;
  const dataQualityGaps = PORTFOLIO_DATA.innovationProjects.filter(p => p.partnerName === '[NEEDS VERIFICATION]').length;
  const prevQ = PORTFOLIO_DATA.quarterlySnapshots[1]; // Q4 2025 baseline

  const donutData = {
    labels: ['EDA Tech Hub Phase 2', 'Ohio Innovation Hubs', 'EDA Good Jobs (APEX)'],
    datasets: [{
      data: [51000000, 31250000, 3000000],
      backgroundColor: [chartTheme.chart1, chartTheme.chart2, chartTheme.chart3],
      borderWidth: 0,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: chartTheme.mutedForeground } },
      tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${formatM(ctx.raw)}` } }
    },
    cutout: '70%',
  };

  const barData = {
    labels: ['Research', 'Development', 'Execution', 'Unknown'],
    datasets: [{
      label: 'Projects',
      data: [2, 5, 5, 6],
      backgroundColor: [chartTheme.chart5, chartTheme.chart1, chartTheme.chart4, chartTheme.mutedForeground],
      borderRadius: 4,
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: chartTheme.border }, ticks: { color: chartTheme.mutedForeground, stepSize: 1 } },
      y: { grid: { display: false }, ticks: { color: chartTheme.mutedForeground } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Status Verdict */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-primary mb-1">Portfolio Status: On Track</h2>
          <p className="text-sm text-muted-foreground">
            $85.25M secured across 3 funding sources. 18 active projects spanning advanced materials,
            mobility, and energy sectors. Pilot facility construction on schedule for Q2 2026.
          </p>
        </CardContent>
      </Card>

      {/* Hero Stats Card */}
      <Card className="border-t-4 border-t-primary">
        <CardContent className="p-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold">PIC Innovation Portfolio</h2>
            <p className="text-sm text-muted-foreground">Polymer Industry Cluster — Akron, Ohio</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => onNavigate?.('funding')}
              className="text-left group cursor-pointer rounded-lg p-2 -m-2 hover:bg-muted/50 transition-colors disabled:cursor-default"
              disabled={!onNavigate}
            >
              <div className="text-3xl font-bold text-primary group-hover:text-primary/80 transition-colors" aria-live="polite">
                $<AnimatedNumber value={totalFunding / 1000000} formatter={(v) => v.toFixed(2)} />M
              </div>
              <div className="text-sm text-muted-foreground">Total Funding</div>
              <TrendBadge current={totalFunding} previous={prevQ.totalFunding} label="No change vs Q4 2025" />
              {onNavigate && <div className="text-xs text-primary/60 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">View funding →</div>}
            </button>
            <button
              onClick={() => onNavigate?.('innovation')}
              className="text-left group cursor-pointer rounded-lg p-2 -m-2 hover:bg-muted/50 transition-colors disabled:cursor-default"
              disabled={!onNavigate}
            >
              <div className="text-3xl font-bold group-hover:text-primary transition-colors" aria-live="polite">
                <AnimatedNumber value={activeProjectsCount} formatter={(v) => Math.round(v).toString()} />
              </div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
              <TrendBadge current={activeProjectsCount} previous={prevQ.activeProjects} label={`+${activeProjectsCount - prevQ.activeProjects} since Q4 2025`} />
              {onNavigate && <div className="text-xs text-primary/60 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">View projects →</div>}
            </button>
            <button
              onClick={() => onNavigate?.('synthe6')}
              className="text-left group cursor-pointer rounded-lg p-2 -m-2 hover:bg-muted/50 transition-colors disabled:cursor-default"
              disabled={!onNavigate}
            >
              <div className="text-3xl font-bold group-hover:text-primary transition-colors" aria-live="polite">
                <AnimatedNumber value={synthe6StartupsCount} formatter={(v) => Math.round(v).toString()} />
              </div>
              <div className="text-sm text-muted-foreground">Synthe6 Startups</div>
              <TrendBadge current={synthe6StartupsCount} previous={prevQ.synthe6Startups} label={`+${synthe6StartupsCount - prevQ.synthe6Startups} new cohort`} />
              {onNavigate && <div className="text-xs text-primary/60 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">View startups →</div>}
            </button>
            <button
              onClick={() => onNavigate?.('kpis')}
              className="text-left group cursor-pointer rounded-lg p-2 -m-2 hover:bg-muted/50 transition-colors disabled:cursor-default"
              disabled={!onNavigate}
            >
              <div className="text-3xl font-bold group-hover:text-primary transition-colors" aria-live="polite">
                <AnimatedNumber value={jobsTarget} formatter={(v) => Math.round(v).toLocaleString()} />
              </div>
              <div className="text-sm text-muted-foreground">Jobs Target 2031</div>
              <div className="text-xs text-muted-foreground">2,400 by 2031 — 5-year commitment</div>
              {onNavigate && <div className="text-xs text-primary/60 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">View KPIs →</div>}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Data Quality Alert — full-width banner */}
      <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-5 py-4">
        <svg className="mt-0.5 shrink-0 text-amber-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        <div>
          <h3 className="text-sm font-semibold text-amber-500">Data Quality Alert</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {dataQualityGaps} Round 1 Innovation Projects require partner verification. Data entry needed before next committee report.
          </p>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg">Funding Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden relative pb-6" aria-label="Funding breakdown chart: $85.25M total across EDA Tech Hub Phase 2, Ohio Innovation Hubs, and EDA Good Jobs APEX">
            <Doughnut data={donutData} options={donutOptions} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center">
              <div className="text-2xl font-bold">$85.25M</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[400px]">
          <CardHeader>
            <CardTitle className="text-lg">Project Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden pb-6" aria-label="Project stage distribution: 18 active projects across Research, Development, Execution, and Unknown stages">
            <Bar data={barData} options={barOptions} />
            <p className="mt-2 text-xs text-amber-500/80">
              6 projects pending stage classification — update required before next committee report.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sector Coverage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Mobility (3)</Badge>
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Industrial Materials (6)</Badge>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Energy (3)</Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Healthcare (1)</Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Environmental (1)</Badge>
            <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/20">Defense (1)</Badge>
            <Badge variant="secondary">Unknown (6)</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2031 Federal Targets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar label="Jobs Created" value={0} max={PORTFOLIO_DATA.performanceTargets.metrics.jobsCreated} />
            <ProgressBar label="Research Funding Attracted" value={0} max={PORTFOLIO_DATA.performanceTargets.metrics.researchFundingAttracted} />
            <ProgressBar label="Workforce Placements" value={0} max={PORTFOLIO_DATA.performanceTargets.metrics.workforcePlacements} />
            <ProgressBar label="Workers Trained (STEM)" value={0} max={PORTFOLIO_DATA.performanceTargets.metrics.workersTrainedSTEM} />
            <p className="text-xs text-muted-foreground pt-1">All targets due 2031 — currently Year 1 of 5</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
