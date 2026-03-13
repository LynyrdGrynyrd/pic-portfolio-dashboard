import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { getChartTheme } from '@/lib/chart-colors';

export function GovernanceView() {
  const { leadershipCommittee, advisoryCouncil, operationalStaff } = PORTFOLIO_DATA.governanceStructure;
  const chartTheme = getChartTheme();

  const donutData = {
    labels: ['Industry', 'Academic', 'Government'],
    datasets: [{
      data: [18, 8, 6],
      backgroundColor: [chartTheme.chart1, chartTheme.chart5, chartTheme.chart3],
      borderWidth: 0,
    }]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const, labels: { color: chartTheme.mutedForeground, boxWidth: 12 } }
    },
    cutout: '70%',
  };

  const PersonRow = ({ p, badge }: { p: any; badge?: string }) => (
    <div className="flex items-center gap-4 mb-4">
      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-sm font-medium shrink-0">
        {p.name.split(' ').map((n: string) => n[0]).join('')}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium flex items-center gap-2 flex-wrap">
          {p.name}
          {badge && (
            <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/20 text-[0.65rem] px-1.5 py-0">{badge}</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground leading-tight">{p.title}</div>
        {p.org && <div className="text-xs text-muted-foreground">{p.org}</div>}
      </div>
    </div>
  );

  const getMonthEvent = (month: string) => {
    switch (month) {
      case 'Mar': return { content: 'Q1 Board Report', color: 'text-amber-500', border: 'border-amber-500/50' };
      case 'Jun': return { content: 'Q2 Board Report', color: 'text-amber-500', border: 'border-amber-500/50' };
      case 'Jul': return { content: 'Annual Federal Reporting', color: 'text-red-500', border: 'border-red-500/50' };
      case 'Sep': return { content: 'Q3 Board Report', color: 'text-amber-500', border: 'border-amber-500/50' };
      case 'Dec': return { content: 'Annual Report Publication', color: 'text-green-500', border: 'border-green-500/50' };
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leadership Committee */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Leadership Committee</CardTitle>
            <p className="text-sm text-muted-foreground">Established January 2024</p>
          </CardHeader>
          <CardContent className="space-y-1">
            {leadershipCommittee.coChairs.map((p: any, i: number) => (
              <PersonRow key={i} p={p} badge="Co-Chair" />
            ))}
            <PersonRow p={leadershipCommittee.viceChair} badge="Vice Chair" />
          </CardContent>
        </Card>

        {/* Operational Staff */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Operational Staff</CardTitle>
            <p className="text-sm text-muted-foreground">Execution & Management</p>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="absolute left-5 top-10 bottom-10 w-px bg-border z-0" />
              {operationalStaff.map((p: any, i: number) => (
                <div key={i} className="relative z-[1] bg-card">
                  <PersonRow p={p} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advisory Council */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Advisory Council</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">{advisoryCouncil.memberCount} Members</div>
            <div className="text-sm text-muted-foreground mb-6">Established January 2022</div>
            
            <div className="h-[200px] flex flex-col">
              <div className="text-sm mb-2 text-center text-muted-foreground">Composition</div>
              <div className="flex-1 relative" role="img" aria-label="Advisory council composition chart showing industry, academic, and government representation">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reporting Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>2026 Reporting Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => {
              const event = getMonthEvent(month);
              return (
                <div
                  key={month}
                  className={`bg-secondary rounded-lg p-3 min-h-[100px] flex flex-col overflow-hidden border ${event ? event.border : 'border-transparent'}`}
                >
                  <div className="font-semibold text-sm mb-2 text-muted-foreground">{month}</div>
                  {event && (
                    <div className={`text-xs font-medium leading-snug ${event.color}`}>
                      {event.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
