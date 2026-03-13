import { PORTFOLIO_DATA } from '../data';
import type { ViewId } from '../config/views';

interface HealthStripProps {
  currentView: ViewId;
  onNavigate: (viewId: ViewId) => void;
}

export function HealthStrip({ currentView, onNavigate }: HealthStripProps) {
  const totalFunding = PORTFOLIO_DATA.fundingSources.reduce((sum, f) => sum + f.totalAmount, 0);
  const activeProjects = PORTFOLIO_DATA.techHubProjects.length + PORTFOLIO_DATA.innovationProjects.length;
  const jobsTarget = PORTFOLIO_DATA.performanceTargets.metrics.jobsCreated;
  const dataGaps = PORTFOLIO_DATA.innovationProjects.filter(p => p.partnerName === '[NEEDS VERIFICATION]').length;
  const facilityStatus = PORTFOLIO_DATA.infrastructure[0]?.status === 'pre-construction' ? 'Design phase' : 'Active';

  const indicators: { label: string; value: string; status: 'green' | 'amber' | 'red'; view: ViewId }[] = [
    { label: 'Funding', value: `$${(totalFunding / 1e6).toFixed(1)}M`, status: 'green', view: 'funding' },
    { label: 'Projects', value: `${activeProjects} active`, status: 'green', view: 'overview' },
    { label: 'Jobs', value: `0/${jobsTarget.toLocaleString()}`, status: 'amber', view: 'kpis' },
    { label: 'Facility', value: facilityStatus, status: 'green', view: 'infrastructure' },
    { label: 'Data', value: `${dataGaps} gaps`, status: dataGaps > 0 ? 'red' : 'green', view: 'innovation' },
  ];

  const statusDot: Record<string, string> = {
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  const statusIcon: Record<string, string> = {
    green: '✓',
    amber: '⚠',
    red: '✕',
  };

  const statusIconColor: Record<string, string> = {
    green: 'text-green-500',
    amber: 'text-amber-500',
    red: 'text-red-500',
  };

  return (
    <div className="no-print flex items-center gap-1 px-4 md:px-6 py-1.5 border-b border-border bg-muted/30 overflow-x-auto">
      {indicators.map((ind, i) => (
        <button
          key={ind.label}
          type="button"
          onClick={() => onNavigate(ind.view)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors hover:bg-accent ${currentView === ind.view ? 'bg-accent font-medium' : ''}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[ind.status]}`} />
          <span className={`text-xs leading-none ${statusIconColor[ind.status]}`} aria-hidden="true">{statusIcon[ind.status]}</span>
          <span className="text-muted-foreground">{ind.label}:</span>
          <span className="font-medium">{ind.value}</span>
        </button>
      ))}
    </div>
  );
}
