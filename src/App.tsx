import { useState, useEffect } from 'react';
import { VIEWS, type ViewId } from './config/views';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HealthStrip } from './components/HealthStrip';
import { ErrorBoundary } from './components/ErrorBoundary';

type Theme = 'light' | 'dark';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('pic-theme');
    return (stored === 'dark' || stored === 'light') ? stored : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pic-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
}

import { OverviewView } from './components/OverviewView';
import { FundingView } from './components/FundingView';
import { TechHubView } from './components/TechHubView';
import { InnovationView } from './components/InnovationView';
import { Synthe6View } from './components/Synthe6View';
import { InfrastructureView } from './components/InfrastructureView';
import { KPIsView } from './components/KPIsView';
import { GovernanceView } from './components/GovernanceView';
import { RiskRegisterView } from './components/RiskRegisterView';
import { TimelineView } from './components/TimelineView';
import { EcosystemView } from './components/EcosystemView';

const VIEW_COMPONENTS: Record<ViewId, React.FC> = {
  overview: OverviewView,
  funding: FundingView,
  'tech-hub': TechHubView,
  innovation: InnovationView,
  synthe6: Synthe6View,
  infrastructure: InfrastructureView,
  kpis: KPIsView,
  governance: GovernanceView,
  'risk-register': RiskRegisterView,
  timeline: TimelineView,
  ecosystem: EcosystemView,
};

function App() {
  const [currentView, setCurrentView] = useState<ViewId>('overview');
  const { theme, toggleTheme } = useTheme();

  const activeViewObj = VIEWS.find(v => v.id === currentView);
  const ViewComponent = VIEW_COMPONENTS[currentView];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <main className="min-w-0 min-h-screen flex flex-col md:ml-64">
        <Header
          title={activeViewObj?.name ?? ''}
          subtitle={activeViewObj?.subtitle}
          onPrint={() => window.print()}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <HealthStrip currentView={currentView} onNavigate={setCurrentView} />

        <div className="min-w-0 flex-1 p-4 md:p-6 animate-in fade-in duration-300">
          <ErrorBoundary key={currentView} fallbackTitle={`${activeViewObj?.name ?? 'View'} failed to render`}>
            {currentView === 'overview'
              ? <OverviewView onNavigate={setCurrentView} />
              : <ViewComponent />
            }
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;
