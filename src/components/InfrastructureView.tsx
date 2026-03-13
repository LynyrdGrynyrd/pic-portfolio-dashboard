import { PORTFOLIO_DATA } from '../data';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export function InfrastructureView() {
  const facility = PORTFOLIO_DATA.infrastructure[0];

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="p-6 md:p-8">
          <div className="mb-8 border-b border-border pb-6">
            <h2 className="text-3xl font-bold tracking-tight mb-2">{facility.projectName}</h2>
            <div className="text-muted-foreground text-lg flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {facility.location}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="mb-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Facility Specifications</h3>
              <dl className="grid grid-cols-2 gap-y-5 text-sm">
                <dt className="text-muted-foreground font-medium">Funding:</dt>
                <dd className="font-bold text-lg text-foreground">${(facility.fundingAmount / 1000000).toFixed(1)}M</dd>
                
                <dt className="text-muted-foreground font-medium align-middle">Status:</dt>
                <dd><Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">{facility.status}</Badge></dd>
                
                <dt className="text-muted-foreground font-medium">Square Footage:</dt>
                <dd className="font-medium text-foreground">{facility.specs.squareFootage.toLocaleString()} sqft</dd>
                
                <dt className="text-muted-foreground font-medium">Process Bays:</dt>
                <dd className="font-medium text-foreground">{facility.specs.processBays}</dd>
                
                <dt className="text-muted-foreground font-medium">Batch Scale:</dt>
                <dd className="font-medium text-foreground">{facility.specs.batchScale}</dd>
                
                <dt className="text-muted-foreground font-medium">Reactor Volume:</dt>
                <dd className="font-medium text-foreground">{facility.specs.maxReactorVolume}</dd>
                
                <dt className="text-muted-foreground font-medium">High Bay Height:</dt>
                <dd className="font-medium text-foreground">{facility.specs.highBayHeight}</dd>
                
                <dt className="text-muted-foreground font-medium">Director:</dt>
                <dd className="font-medium text-foreground">{facility.manager}</dd>
              </dl>
            </div>

            <div>
              <h3 className="mb-6 text-sm font-bold text-muted-foreground uppercase tracking-wider">Construction Timeline</h3>
              <div className="flex flex-col gap-6">
                
                <div className="flex items-center gap-4">
                  <div className="w-20 shrink-0 sm:w-32 text-sm font-medium">Design & Prep</div>
                  <div className="flex-1 bg-secondary h-3 rounded-full relative overflow-hidden">
                    <div className="absolute left-0 w-[40%] h-full bg-amber-500 rounded-full" />
                  </div>
                  <div className="w-16 shrink-0 sm:w-24 text-xs text-muted-foreground text-right">Jan-Q2 2026</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-20 shrink-0 sm:w-32 text-sm font-medium">Construction</div>
                  <div className="flex-1 bg-secondary h-3 rounded-full relative overflow-hidden">
                    <div className="absolute left-[35%] w-[45%] h-full bg-blue-500 rounded-full" />
                  </div>
                  <div className="w-16 shrink-0 sm:w-24 text-xs text-muted-foreground text-right">Q2-Q4 2026</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-20 shrink-0 sm:w-32 text-sm font-medium">Equipment Install</div>
                  <div className="flex-1 bg-secondary h-3 rounded-full relative overflow-hidden">
                    <div className="absolute left-[70%] w-[25%] h-full bg-muted-foreground rounded-full" />
                  </div>
                  <div className="w-16 shrink-0 sm:w-24 text-xs text-muted-foreground text-right">Q4 '26-Q1 '27</div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-20 shrink-0 sm:w-32 text-sm font-medium">Operations Launch</div>
                  <div className="flex-1 bg-secondary h-3 rounded-full relative overflow-hidden">
                    <div className="absolute left-[90%] w-[10%] h-full bg-green-500 rounded-full" />
                  </div>
                  <div className="w-16 shrink-0 sm:w-24 text-xs text-muted-foreground text-right">2027</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-bold mb-6">Process Bays Configuration</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facility.specs.bayTypes.map((bay, idx) => (
            <Card key={idx} className="text-center overflow-hidden border-t-4 border-t-primary/20">
              <CardContent className="p-6 md:p-8">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`mx-auto mb-6 ${bay === 'TBD' ? 'text-amber-500' : 'text-primary'}`}>
                  <rect x="4" y="8" width="16" height="14" rx="2" />
                  <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="8" y1="14" x2="16" y2="14" />
                </svg>
                <div className="text-lg font-bold mb-2">Bay {idx + 1}</div>
                <div className="text-sm text-muted-foreground mb-6 min-h-[40px] flex items-center justify-center">{bay}</div>
                {bay === 'TBD' ? (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 w-fit mx-auto">To Be Determined</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 w-fit mx-auto">Configured</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
