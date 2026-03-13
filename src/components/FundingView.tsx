import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { getChartTheme } from '@/lib/chart-colors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function FundingView() {
  const chartTheme = getChartTheme();
  const formatM = (val: number) => `$${(val / 1000000).toFixed(2)}M`;

  const federalTotal = PORTFOLIO_DATA.fundingSources
    .filter(f => f.source === 'federal')
    .reduce((sum, f) => sum + f.totalAmount, 0);
  const stateTotal = PORTFOLIO_DATA.fundingSources
    .filter(f => f.source === 'state')
    .reduce((sum, f) => sum + f.totalAmount, 0);
  const totalMatch = PORTFOLIO_DATA.fundingSources.reduce((sum, f) => sum + f.matchAmount, 0);

  const barData = {
    labels: PORTFOLIO_DATA.fundingSources.map(f => f.name.replace(' Program', '').replace(' Phase 2', '')),
    datasets: [
      {
        label: 'Total Award',
        data: PORTFOLIO_DATA.fundingSources.map(f => f.totalAmount / 1000000),
        backgroundColor: chartTheme.chart1,
      },
      {
        label: 'Local Match',
        data: PORTFOLIO_DATA.fundingSources.map(f => f.matchAmount / 1000000),
        backgroundColor: chartTheme.chart2,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: chartTheme.mutedForeground } },
      tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: $${ctx.raw.toFixed(2)}M` } }
    },
    scales: {
      x: { stacked: false, grid: { display: false }, ticks: { color: chartTheme.mutedForeground } },
      y: { stacked: false, grid: { color: chartTheme.border }, ticks: { color: chartTheme.mutedForeground, callback: (v: any) => `$${v}M` } }
    }
  };

  return (
    <div className="space-y-8">
      {/* Funding Source Cards */}
      <div className="grid gap-6">
        {PORTFOLIO_DATA.fundingSources.map(source => {
          const isFed = source.source === 'federal';
          const isActiveDisbursing = source.status === 'active-disbursing';
          const progress = isActiveDisbursing ? 35 : 10;

          return (
            <Card key={source.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 mt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold m-0">{source.name}</h2>
                    <Badge variant="outline" className={isFed ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}>
                      {isFed ? 'Federal' : 'State'}
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-2">Awarded: {source.awardDate}</span>
                  </div>
                  <Badge variant="outline" className={isActiveDisbursing ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-sky-500/10 text-sky-400 border-sky-500/20'}>
                    {isActiveDisbursing ? 'Active — Disbursing' : 'Active'}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-6 sm:gap-12 mb-8">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Total Amount</div>
                    <div className="text-3xl font-bold">{formatM(source.totalAmount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Match Amount</div>
                    <div className="text-3xl font-normal text-muted-foreground">{formatM(source.matchAmount)}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Est. Disbursed</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isActiveDisbursing ? 'bg-primary' : 'bg-primary/60'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Federal vs State Split Callout */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Funding Source Split</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Federal Awards</div>
              <div className="text-2xl font-bold text-primary">{formatM(federalTotal)}</div>
              <div className="text-xs text-muted-foreground">EDA Tech Hub + Good Jobs</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">State Awards</div>
              <div className="text-2xl font-bold">{formatM(stateTotal)}</div>
              <div className="text-xs text-muted-foreground">Ohio Innovation Hubs</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Local Match (All)</div>
              <div className="text-2xl font-bold text-muted-foreground">{formatM(totalMatch)}</div>
              <div className="text-xs text-muted-foreground">Required cost-share commitments</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Federal Dependency Risk */}
      <Card className="border-l-4 border-l-destructive">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-1">Federal Dependency Exposure</h3>
          <p className="text-xs text-muted-foreground mb-4">Projects colored by federal funding concentration. High-dependency projects are most vulnerable to CHIPS/EDA policy changes.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PORTFOLIO_DATA.techHubProjects.map(p => (
              <div key={p.projectId} className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{p.projectName}</div>
                  <div className="text-xs text-muted-foreground">{p.partnerName.split(' / ')[0]}</div>
                </div>
                <Badge variant="outline" className="bg-red-500/15 text-red-500 border-red-500/30 shrink-0 ml-2">100% Fed</Badge>
              </div>
            ))}
            {PORTFOLIO_DATA.innovationProjects.filter(p => p.round === 2).map(p => (
              <div key={p.projectId} className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{p.projectName}</div>
                  <div className="text-xs text-muted-foreground">{p.partnerName.split(' / ')[0]}</div>
                </div>
                <Badge variant="outline" className="bg-green-500/15 text-green-500 border-green-500/30 shrink-0 ml-2">100% State</Badge>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 5 projects — 100% EDA (federal)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> 7 projects — 100% Ohio (state)</span>
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="h-[450px] flex flex-col">
        <CardHeader>
          <CardTitle>Total vs Match Leverage</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-hidden pb-6" role="img" aria-label="Bar chart comparing total award amounts to local match amounts for each funding source">
          <Bar data={barData} options={barOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
