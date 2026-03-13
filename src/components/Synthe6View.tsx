import { Chart as ChartJS, PointElement, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { PORTFOLIO_DATA } from '../data';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { getChartTheme } from '@/lib/chart-colors';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export function Synthe6View() {
  const startups = PORTFOLIO_DATA.synthe6Startups;
  const advancedCount = startups.filter(s => s.additionalInnovationFunding || s.techHubFunding).length;
  const chartTheme = getChartTheme();

  const withAlpha = (color: string, alpha: number) => {
    if (color.startsWith('hsl(') && color.endsWith(')')) {
      return `${color.slice(0, -1)} / ${alpha})`;
    }
    return color;
  };

  const getFundingLevel = (s: any) => {
    let level = 1;
    if (s.additionalInnovationFunding) level = 2;
    if (s.techHubFunding) level = 3;
    return level;
  };

  const getSectorBadge = (sector: string) => {
    switch(sector) {
      case 'industrial-materials': return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Industrial Materials</Badge>;
      case 'healthcare': return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Healthcare</Badge>;
      case 'energy': return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Energy</Badge>;
      case 'environmental': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Environmental</Badge>;
      case 'defense': return <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/20">Defense</Badge>;
      default: return <Badge variant="secondary">{sector}</Badge>;
    }
  };

  const bubbleData = {
    datasets: startups.map((s, i) => {
      const level = getFundingLevel(s);
      // Rough base exposure calc: 45k + 250k (assumed innovation) + 12.3M
      let exposure = s.fundingReceived;
      if (s.additionalInnovationFunding) exposure += 250000;
      if (s.techHubFunding) exposure += s.techHubFunding;
      
      const colors = [
        chartTheme.chart1,
        chartTheme.chart4,
        chartTheme.chart5,
        chartTheme.chart3,
        chartTheme.chart2,
        chartTheme.chart1,
        chartTheme.foreground,
        chartTheme.mutedForeground,
      ];

      return {
        label: s.projectName,
        data: [{
          x: level,
          y: Math.log10(exposure),
          r: level === 1 ? 10 : level === 2 ? 15 : 25
        }],
        backgroundColor: withAlpha(colors[i % colors.length], 0.5),
        borderColor: colors[i % colors.length],
        borderWidth: 2
      };
    })
  };

  const bubbleOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Startup Funding Progression (Log Scale)', color: chartTheme.foreground },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const level = ctx.raw.x;
            const stage = level === 1 ? 'Accelerator' : level === 2 ? 'Innovation' : 'Tech Hub';
            return ` ${ctx.dataset.label} (${stage})`;
          }
        }
      }
    },
    scales: {
      x: {
        min: 0.5,
        max: 3.5,
        ticks: {
          color: chartTheme.mutedForeground,
          callback: (v: any) => v === 1 ? 'Accelerator' : v === 2 ? '+ Innovation' : v === 3 ? '+ Tech Hub' : ''
        },
        grid: { color: chartTheme.border }
      },
      y: {
        title: { display: true, text: 'Funding Exposure (Log10)', color: chartTheme.mutedForeground },
        ticks: { color: chartTheme.mutedForeground },
        grid: { color: chartTheme.border }
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Synthe6 Accelerator Portfolio</h2>
        <div className="text-muted-foreground text-sm">8 companies | First cohort | $45K seed each</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {startups.map(s => {
          const level = getFundingLevel(s);
          return (
            <Card key={s.projectId} className="flex flex-col h-full">
              <CardContent className="flex flex-col flex-1 p-6">
                <div className="mb-3">{getSectorBadge(s.sector)}</div>
                <h3 className="text-lg font-semibold mb-1 leading-tight">{s.projectName}</h3>
                <div className="text-sm text-muted-foreground mb-4">{s.founderName}</div>
                
                <p className="text-sm text-muted-foreground mb-6 flex-1">{s.technology}</p>
                
                <div className="flex flex-col gap-2 mt-auto">
                  <Badge variant="secondary" className="w-fit">$45K Accelerator</Badge>
                  {s.additionalInnovationFunding && <Badge variant="outline" className="w-fit bg-green-500/10 text-green-500 border-green-500/20">+ Innovation Grant</Badge>}
                  {s.techHubFunding && <Badge variant="outline" className="w-fit bg-blue-500/10 text-blue-400 border-blue-500/20">+ Tech Hub ${(s.techHubFunding/1000000).toFixed(1)}M</Badge>}
                </div>

                <div className="flex justify-center gap-2 mt-6 pt-6 border-t border-border">
                  <div className={`w-3 h-3 rounded-full border border-foreground ${level >= 1 ? 'bg-foreground' : 'bg-transparent'}`} />
                  <div className={`w-3 h-3 rounded-full border border-foreground ${level >= 2 ? 'bg-foreground' : 'bg-transparent'}`} />
                  <div className={`w-3 h-3 rounded-full border border-foreground ${level >= 3 ? 'bg-foreground' : 'bg-transparent'}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-accent border-accent">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium text-accent-foreground m-0">
            {advancedCount} of {startups.length} companies ({Math.round(advancedCount/startups.length*100)}%) advanced to additional funding rounds
          </h3>
        </CardContent>
      </Card>

      <Card className="h-[400px] flex flex-col">
        <CardContent className="p-6 flex-1">
          <Bubble data={bubbleData} options={bubbleOptions} />
        </CardContent>
      </Card>
    </div>
  );
}
