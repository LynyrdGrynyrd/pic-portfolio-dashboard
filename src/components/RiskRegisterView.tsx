import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const LIKELIHOOD_LABELS = ['', 'Very Low', 'Low', 'Medium', 'High', 'Very High'];
const IMPACT_LABELS = ['', 'Negligible', 'Minor', 'Moderate', 'Major', 'Critical'];

function riskScore(likelihood: number, impact: number) {
  return likelihood * impact;
}

function riskColor(score: number) {
  if (score >= 12) return 'bg-red-500/15 text-red-500 border-red-500/30';
  if (score >= 6) return 'bg-amber-500/15 text-amber-500 border-amber-500/30';
  return 'bg-green-500/15 text-green-500 border-green-500/30';
}

function riskLabel(score: number) {
  if (score >= 12) return 'High';
  if (score >= 6) return 'Medium';
  return 'Low';
}

export function RiskRegisterView() {
  const risks = PORTFOLIO_DATA.riskRegister;

  // Build 5x5 matrix
  const matrix: string[][][] = Array.from({ length: 5 }, () =>
    Array.from({ length: 5 }, () => [] as string[])
  );
  risks.forEach(r => {
    matrix[5 - r.impact][r.likelihood - 1].push(r.id);
  });

  return (
    <div className="space-y-8">
      {/* Risk Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="flex items-end gap-1 mb-1">
                <div className="w-20 shrink-0" />
                {[1, 2, 3, 4, 5].map(l => (
                  <div key={l} className="flex-1 text-center text-[0.65rem] text-muted-foreground">{LIKELIHOOD_LABELS[l]}</div>
                ))}
              </div>
              {[5, 4, 3, 2, 1].map((impact, row) => (
                <div key={impact} className="flex items-stretch gap-1 mb-1">
                  <div className="w-20 shrink-0 flex items-center text-[0.65rem] text-muted-foreground text-right pr-2">
                    {IMPACT_LABELS[impact]}
                  </div>
                  {[1, 2, 3, 4, 5].map(likelihood => {
                    const score = likelihood * impact;
                    const cellRisks = matrix[row][likelihood - 1];
                    const bg = score >= 12 ? 'bg-red-500/20' : score >= 6 ? 'bg-amber-500/20' : 'bg-green-500/20';
                    return (
                      <div key={likelihood} className={`flex-1 min-h-[48px] rounded ${bg} flex items-center justify-center gap-1 p-1`}>
                        {cellRisks.map(id => (
                          <span key={id} className="text-[0.6rem] font-mono font-medium bg-background/80 rounded px-1 py-0.5">{id}</span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="flex items-end gap-1 mt-2">
                <div className="w-20 shrink-0" />
                <div className="flex-1 text-center text-xs text-muted-foreground" style={{ gridColumn: 'span 5' }}>
                  Likelihood →
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map(r => {
          const score = riskScore(r.likelihood, r.impact);
          const color = riskColor(score);
          return (
            <Card key={r.id} className={`border-l-4 ${score >= 12 ? 'border-l-red-500' : score >= 6 ? 'border-l-amber-500' : 'border-l-green-500'}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{r.id}</span>
                    <h3 className="font-semibold text-sm">{r.risk}</h3>
                  </div>
                  <Badge variant="outline" className={color}>
                    {riskLabel(score)}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                  <span>Likelihood: <strong className="text-foreground">{LIKELIHOOD_LABELS[r.likelihood]}</strong></span>
                  <span>Impact: <strong className="text-foreground">{IMPACT_LABELS[r.impact]}</strong></span>
                  <span>Owner: <strong className="text-foreground">{r.owner}</strong></span>
                </div>
                <p className="text-sm text-muted-foreground">{r.mitigation}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
