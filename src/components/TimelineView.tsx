import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  governance: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'Governance' },
  funding: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'Funding' },
  portfolio: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Portfolio' },
  infrastructure: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: 'Infrastructure' },
  performance: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Performance' },
};

const STATUS_STYLES: Record<string, { dot: string; label: string }> = {
  complete: { dot: 'bg-green-500', label: 'Complete' },
  'in-progress': { dot: 'bg-amber-500', label: 'In Progress' },
  planned: { dot: 'bg-muted-foreground/40', label: 'Planned' },
};

export function TimelineView() {
  const milestones = PORTFOLIO_DATA.timelineMilestones;

  // Group by year
  const byYear = milestones.reduce<Record<string, typeof milestones>>((acc, m) => {
    const year = m.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(m);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort();

  return (
    <div className="space-y-8">
      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground font-medium">Status:</span>
              {Object.entries(STATUS_STYLES).map(([key, s]) => (
                <span key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  <span className="text-muted-foreground">{s.label}</span>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Major Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[7px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-border" />

            {years.map((year, yi) => (
              <div key={year}>
                {/* Year marker */}
                <div className="relative flex items-center mb-6 mt-2">
                  <div className="md:absolute md:left-1/2 md:-translate-x-1/2 z-10 bg-primary text-primary-foreground text-sm font-bold px-3 py-1 rounded-full ml-[-4px] md:ml-0">
                    {year}
                  </div>
                </div>

                {byYear[year].map((m, mi) => {
                  const cat = CATEGORY_STYLES[m.category] ?? CATEGORY_STYLES.portfolio;
                  const status = STATUS_STYLES[m.status] ?? STATUS_STYLES.planned;
                  const isLeft = mi % 2 === 0;
                  const monthLabel = new Date(m.date + '-01').toLocaleDateString('en-US', { month: 'short' });

                  return (
                    <div key={m.date + m.label} className="relative flex items-start mb-6 last:mb-0">
                      {/* Dot */}
                      <div className={`absolute left-0 md:left-1/2 md:-translate-x-1/2 w-[15px] h-[15px] rounded-full border-2 border-background z-10 ${status.dot}`} />

                      {/* Content card — alternating sides on desktop */}
                      <div className={`ml-8 md:ml-0 md:w-[45%] ${isLeft ? 'md:mr-auto md:pr-8 md:text-right' : 'md:ml-auto md:pl-8'}`}>
                        <div className="bg-card border rounded-lg p-3">
                          <div className={`flex items-center gap-2 mb-1 ${isLeft ? 'md:justify-end' : ''}`}>
                            <span className="text-xs font-mono text-muted-foreground">{monthLabel} {year}</span>
                            <Badge variant="outline" className={`${cat.bg} ${cat.text} ${cat.border} text-[0.6rem] px-1.5 py-0`}>
                              {cat.label}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{m.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
