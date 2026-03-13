import React, { useState } from 'react';
import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader as ShadcnTableHeader, TableRow } from './ui/table';

export function InnovationView() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const round2 = PORTFOLIO_DATA.innovationProjects.filter(p => p.round === 2);
  const round1 = PORTFOLIO_DATA.innovationProjects.filter(p => p.round === 1);

  const getSectorBadge = (sector: string) => {
    switch (sector) {
      case 'healthcare': return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Healthcare</Badge>;
      case 'industrial-materials': return <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">Industrial Materials</Badge>;
      case 'energy': return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">Energy</Badge>;
      case 'unknown': return <span className="text-muted-foreground">—</span>;
      default: return <Badge variant="secondary">{sector}</Badge>;
    }
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'development': return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Development</Badge>;
      case 'research': return <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">Research</Badge>;
      case 'unknown': return <span className="text-muted-foreground">—</span>;
      default: return <Badge variant="secondary">{stage}</Badge>;
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const ProjectRow = ({ p }: { p: any }) => {
    const isExpanded = expandedId === p.projectId;
    const needsVerification = p.partnerName === '[NEEDS VERIFICATION]';
    
    return (
      <React.Fragment>
        <TableRow 
          onClick={() => !needsVerification && toggleExpand(p.projectId)}
          className={needsVerification ? 'cursor-default' : 'cursor-pointer'}
        >
          <TableCell className="text-muted-foreground font-mono">{p.projectId}</TableCell>
          <TableCell className="font-medium">{p.projectName}</TableCell>
          <TableCell className={needsVerification ? 'text-amber-500 font-medium' : ''}>
            {p.partnerName}
          </TableCell>
          <TableCell>{getSectorBadge(p.sector)}</TableCell>
          <TableCell>{getStageBadge(p.stageGate)}</TableCell>
          <TableCell className="text-center">
            {p.synthe6 ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto text-primary"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ) : <span className="text-muted-foreground">—</span>}
          </TableCell>
        </TableRow>
        {isExpanded && !needsVerification && (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={6} className="p-0 border-b">
              <div className="p-4 md:px-6 md:py-4 bg-muted/50 text-muted-foreground text-sm space-y-2">
                <div><strong className="text-foreground">Description:</strong> {p.description}</div>
              </div>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Round 2 — {round2.length} Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <div className="rounded-md border border-border">
            <Table>
              <ShadcnTableHeader>
                <TableRow>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Partner</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Stage Gate</TableHead>
                  <TableHead className="text-center">Synthe6</TableHead>
                </TableRow>
              </ShadcnTableHeader>
              <TableBody>
                {round2.map(p => <ProjectRow key={p.projectId} p={p} />)}
              </TableBody>
            </Table>
          </div>
          </div>
        </CardContent>
      </Card>

      <details className="group">
        <summary className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition-transform group-open:rotate-90"><path d="m9 18 6-6-6-6"/></svg>
          <span>Round 1 Projects — {round1.length} entries pending partner verification</span>
        </summary>
        <Card className="mt-4 border-amber-500/50">
          <CardContent className="pt-6">
            <div className="mb-6 p-4 border-l-4 border-amber-500 bg-amber-500/10 text-amber-500 rounded-r-md text-sm">
              <strong className="font-semibold">Attention:</strong> These {round1.length} projects represent the highest-priority data gap. Partner outreach and record verification required before next board report.
            </div>

            <div className="overflow-x-auto">
            <div className="rounded-md border border-border">
              <Table>
                <ShadcnTableHeader>
                  <TableRow>
                    <TableHead>Project ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Partner</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Stage Gate</TableHead>
                    <TableHead className="text-center">Synthe6</TableHead>
                  </TableRow>
                </ShadcnTableHeader>
                <TableBody>
                  {round1.map(p => <ProjectRow key={p.projectId} p={p} />)}
                </TableBody>
              </Table>
            </div>
            </div>
          </CardContent>
        </Card>
      </details>
    </div>
  );
}
