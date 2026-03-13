import { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PORTFOLIO_DATA } from '../data';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge'; 
import { getChartTheme } from '@/lib/chart-colors';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export function TechHubView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const chartTheme = getChartTheme();
  
  const filters = ['All', 'Mobility', 'Industrial Materials', 'Energy'];

  const filteredProjects = PORTFOLIO_DATA.techHubProjects.filter(p => {
    if (activeFilter === 'All') return true;
    return p.sector.toLowerCase().replace('-', ' ') === activeFilter.toLowerCase();
  });

  const getSectorBadge = (sector: string) => {
    switch (sector) {
      case 'mobility': return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Mobility</Badge>;
      case 'industrial-materials': return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Industrial Materials</Badge>;
      case 'energy': return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Energy</Badge>;
      default: return <Badge variant="secondary">{sector}</Badge>;
    }
  };

  const getFundingColor = (sector: string) => {
    switch(sector) {
      case 'mobility': return chartTheme.chart1;
      case 'industrial-materials': return chartTheme.chart2;
      case 'energy': return chartTheme.chart3;
      default: return chartTheme.mutedForeground;
    }
  };

  const chartData = {
    labels: PORTFOLIO_DATA.techHubProjects.map(p => p.projectId),
    datasets: [{
      label: 'Funding Amount',
      data: PORTFOLIO_DATA.techHubProjects.map(p => p.fundingAmount / 1000000),
      backgroundColor: PORTFOLIO_DATA.techHubProjects.map(p => getFundingColor(p.sector)),
      borderRadius: 4
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Tech Hub Funding by Project', color: chartTheme.foreground },
      tooltip: { callbacks: { label: (ctx: any) => ` $${ctx.raw.toFixed(1)}M` } }
    },
    scales: {
      x: { grid: { color: chartTheme.border }, ticks: { color: chartTheme.mutedForeground, callback: (v: any) => `$${v}M` } },
      y: { grid: { display: false }, ticks: { color: chartTheme.mutedForeground } }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 pb-4 border-b border-border">
        {filters.map(filter => (
          <button
            key={filter}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors border ${
              activeFilter === filter 
                ? 'bg-accent text-accent-foreground border-primary' 
                : 'bg-transparent text-muted-foreground border-border hover:bg-accent/50'
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <Card key={project.projectId} className="flex flex-col h-full">
            <CardContent className="flex flex-col flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-muted-foreground font-mono">{project.projectId}</span>
                {getSectorBadge(project.sector)}
              </div>
              <h3 className="text-lg font-semibold mb-1 leading-tight">{project.projectName}</h3>
              <div className="text-sm text-muted-foreground mb-4">{project.partnerName}</div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="text-2xl font-bold text-green-500">
                  ${(project.fundingAmount / 1000000).toFixed(1)}M
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 capitalize">
                  {project.stageGate}
                </Badge>
              </div>
              
              <div className="mb-4">
                <Badge variant="secondary" className="flex items-center gap-1.5 w-fit">
                  {project.tier === 'Startup/Synthe6' && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  )}
                  {project.tier}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mt-auto pt-4 border-t border-border">
                {project.description}
              </p>
            </CardContent>
          </Card>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-muted-foreground py-12">
            No projects found for this sector.
          </div>
        )}
      </div>

      <Card className="h-[400px] flex flex-col">
        <CardContent className="p-6 flex-1">
          <Bar data={chartData} options={chartOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
