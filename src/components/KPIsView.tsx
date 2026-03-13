import { PORTFOLIO_DATA } from '../data';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from './ui/table';

export function KPIsView() {
  const { deadline, metrics } = PORTFOLIO_DATA.performanceTargets;

  const kpis = [
    { name: 'Jobs Created (Ohio Hubs)', target: metrics.jobsCreated, current: 0, prefix: '', suffix: '', trend: '—' },
    { name: 'Jobs Created (Tech Hub)', target: metrics.jobsCreatedTechHub, current: 0, prefix: '', suffix: '', trend: '—' },
    { name: 'STEM Workers Trained', target: metrics.workersTrainedSTEM, current: 47, prefix: '', suffix: '', trend: '↑' },
    { name: 'Research Funding Attracted', target: metrics.researchFundingAttracted, current: 85250000, prefix: '$', suffix: '', trend: '↑↑', isCurrency: true },
    { name: 'Economic Impact Added', target: metrics.economicImpactAdded, current: 12000000, prefix: '$', suffix: '', trend: '↑', isCurrency: true },
    { name: 'Private Investment', target: metrics.privateInvestmentTarget, current: 180000000, prefix: '$', suffix: '', trend: '→', isCurrency: true },
    { name: 'Workforce Placements', target: metrics.workforcePlacements, current: 0, prefix: '', suffix: '', trend: '—' },
    { name: 'Workforce Enrollments', target: metrics.workforceEnrollments, current: 85, prefix: '', suffix: '', trend: '↑' }
  ];

  const formatVal = (val: number, isCurrency?: boolean) => {
    if (isCurrency) {
      if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
      if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
      return `$${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  const getStatusInfo = (pct: number) => {
    if (pct >= 100) return { label: 'Exceeded', class: 'bg-primary/10 text-primary border-primary/20', color: 'text-primary', barColor: 'bg-primary', icon: '★' };
    if (pct >= 5) return { label: 'On Track', class: 'bg-green-500/10 text-green-500 border-green-500/20', color: 'text-green-500', barColor: 'bg-green-500', icon: '' };
    if (pct > 0) return { label: 'In Progress', class: 'bg-amber-500/10 text-amber-500 border-amber-500/20', color: 'text-amber-500', barColor: 'bg-amber-500', icon: '' };
    return { label: 'Not Started', class: 'bg-secondary text-muted-foreground', color: 'text-muted-foreground', barColor: 'bg-muted', icon: '' };
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Performance Targets</h2>
          <div className="text-muted-foreground text-sm">Deadline: {deadline}</div>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-1.5 text-sm">
          5 years remaining
        </Badge>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
          <div className="rounded-md border border-border">
            <Table>
              <ShadcnTableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Current (Illustrative)</TableHead>
                  <TableHead className="min-w-[140px]">% Complete</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {kpis.map((kpi, idx) => {
                  const pct = (kpi.current / kpi.target) * 100;
                  const displayPct = Math.round(pct);
                  const status = getStatusInfo(pct);
                  const barWidth = Math.min(pct, 110); // allow overflow to 110%
                  
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{kpi.name}</TableCell>
                      <TableCell>{formatVal(kpi.target, kpi.isCurrency)}</TableCell>
                      <TableCell>{formatVal(kpi.current, kpi.isCurrency)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="w-10 text-right text-sm font-mono">{displayPct}%</span>
                          <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ease-out ${status.barColor}`} 
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`flex items-center gap-1 w-fit ${status.class}`}>
                          {status.icon} {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-center font-bold ${status.color}`}>
                        {kpi.trend}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          </div>
        </CardContent>
      </Card>

      {/* 2031 Trajectory Assessment */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="p-6">
          <h3 className="font-semibold text-primary mb-3">2031 Trajectory Assessment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            With 5 years remaining and facility operations launching in 2027, most employment and workforce metrics will accelerate post-construction. Current pace assessment:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-xs text-green-500 font-medium mb-1">Ahead of Pace</div>
              <div className="text-sm font-semibold">Research Funding</div>
              <div className="text-xs text-muted-foreground">$85.25M vs $75M target — already exceeded</div>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="text-xs text-green-500 font-medium mb-1">Ahead of Pace</div>
              <div className="text-sm font-semibold">Private Investment</div>
              <div className="text-xs text-muted-foreground">$180M secured — 18% of $1B target with 5 yrs left</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-xs text-amber-500 font-medium mb-1">Expected — Facility Dependent</div>
              <div className="text-sm font-semibold">Jobs & Workforce</div>
              <div className="text-xs text-muted-foreground">Near zero pre-construction — will accelerate post-2027 operations launch</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="text-xs text-amber-500 font-medium mb-1">Needs Acceleration</div>
              <div className="text-sm font-semibold">Economic Impact</div>
              <div className="text-xs text-muted-foreground">$12M of $43M — requires commercialization outputs from active projects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Funding Overperformance</h3>
            <p className="text-sm text-muted-foreground">
              $85.25M secured vs. $75M target — 14% above goal. Strong foundation for earned-revenue transition.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Infrastructure Critical Path</h3>
            <p className="text-sm text-muted-foreground">
              Pilot facility construction start Q2 2026 unlocks job creation and workforce metrics. Pre-construction = expected zero on employment KPIs.
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <h3 className="text-sm font-bold text-red-500 uppercase tracking-wider mb-2">Data Quality Gap</h3>
            <p className="text-sm text-muted-foreground">
              6 Round 1 projects unverified. Economic impact calculations may be understated. Priority: partner verification outreach.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
