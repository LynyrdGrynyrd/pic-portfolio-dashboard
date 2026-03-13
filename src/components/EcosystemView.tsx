import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ExternalLink } from 'lucide-react';

const TYPE_STYLES: Record<string, { bg: string; text: string; border: string; label: string }> = {
  university: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', label: 'University' },
  corporate: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', label: 'Corporate' },
  startup: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500/20', label: 'Startup' },
  government: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/20', label: 'Government' },
};

// Normalized names for cross-referencing investing partners with active project partners
const PROJECT_PARTNER_ALIASES: Record<string, string> = {
  'Bioverde': 'BioVerde',
  'Bridgestone Americas, Inc.': 'Bridgestone',
  'Case Western Reserve University': 'Case Western Reserve University',
  'Flexsys': 'Flexsys',
  'Full Circle Technologies, LLC': 'Full Circle Technologies',
  'Goodyear': 'Goodyear',
  'Huntsman': 'Huntsman International',
  'PolyKinetix': 'PolyKinetix',
  'Promerus': 'Promerus',
  'Synthomer': 'Synthomer',
};

export function EcosystemView() {
  const partners = PORTFOLIO_DATA.partnerEcosystem;
  const investing = PORTFOLIO_DATA.investingPartners;
  const cornerstone = PORTFOLIO_DATA.cornerstonePartners;

  const byType = partners.reduce<Record<string, typeof partners>>((acc, p) => {
    if (!acc[p.type]) acc[p.type] = [];
    acc[p.type].push(p);
    return acc;
  }, {});

  const typeCounts = Object.entries(byType).map(([type, list]) => ({
    type,
    count: list.length,
    projects: list.reduce((sum, p) => sum + p.projects, 0),
    style: TYPE_STYLES[type] ?? TYPE_STYLES.corporate,
  }));

  const projectPartnerNames = new Set(partners.map(p => p.name));
  const isProjectPartner = (name: string) =>
    projectPartnerNames.has(name) || projectPartnerNames.has(PROJECT_PARTNER_ALIASES[name] ?? '');

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{investing.length}</div>
            <div className="text-sm text-muted-foreground">Investing Partners</div>
            <div className="text-xs text-muted-foreground mt-1">PIC membership base</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{cornerstone.length}</div>
            <div className="text-sm text-muted-foreground">Cornerstone Partners</div>
            <div className="text-xs text-muted-foreground mt-1">Anchor institutions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{partners.length}</div>
            <div className="text-sm text-muted-foreground">Active in Projects</div>
            <div className="text-xs text-muted-foreground mt-1">Directly engaged in portfolio</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-3xl font-bold">{investing.length + cornerstone.length}</div>
            <div className="text-sm text-muted-foreground">Total Ecosystem</div>
            <div className="text-xs text-muted-foreground mt-1">Investing + Cornerstone</div>
          </CardContent>
        </Card>
      </div>

      {/* Cornerstone Partners */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            Cornerstone Partners
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{cornerstone.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">Anchor institutions providing foundational support, governance, and regional coordination.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cornerstone.map(p => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group"
              >
                <img src={p.logo} alt={p.name} className="h-8 w-auto max-w-[100px] object-contain shrink-0" loading="lazy" />
                <span className="font-medium text-sm flex-1 min-w-0 truncate">{p.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investing Partners */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            Investing Partners
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{investing.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Industry members funding PIC operations. Partners also active in portfolio projects are highlighted.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {investing.map(p => {
              const inProject = isProjectPartner(p.name);
              return (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-colors group text-center ${inProject ? 'bg-green-500/5 border border-green-500/15 hover:bg-green-500/10' : 'bg-secondary/50 hover:bg-secondary border border-transparent'}`}
                >
                  <div className="h-10 flex items-center justify-center">
                    <img src={p.logo} alt={p.name} className="h-10 w-auto max-w-[120px] object-contain" loading="lazy" />
                  </div>
                  <span className={`text-xs leading-tight ${inProject ? 'font-medium' : 'text-muted-foreground'}`}>{p.name}</span>
                  {inProject && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[0.55rem]">
                      In Projects
                    </Badge>
                  )}
                </a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Project Partner Breakdown by Type */}
      <div>
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Active Project Partners by Type</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {typeCounts.map(tc => (
            <Card key={tc.type}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{tc.count}</div>
                <div className="text-sm text-muted-foreground">{tc.style.label}</div>
                <div className="text-xs text-muted-foreground">{tc.projects} project{tc.projects !== 1 ? 's' : ''}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {Object.entries(byType).map(([type, list]) => {
          const style = TYPE_STYLES[type] ?? TYPE_STYLES.corporate;
          return (
            <Card key={type} className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  {style.label} Partners
                  <Badge variant="outline" className={`${style.bg} ${style.text} ${style.border}`}>{list.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map(p => (
                    <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div>
                        <div className="font-medium text-sm">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.projects > 0 ? `${p.projects} project${p.projects > 1 ? 's' : ''}` : 'Funder / governance'}
                          {' · '}{p.scope}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[0.6rem]">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
