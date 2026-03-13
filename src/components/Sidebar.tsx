import { VIEWS, type ViewId } from '../config/views';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: ViewId;
  onNavigate: (viewId: ViewId) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside role="navigation" className="no-print flex w-full md:w-64 flex-col border-b md:border-b-0 md:border-r border-border bg-background md:fixed md:inset-y-0 md:left-0 z-20 transition-all duration-300">
      <div className="flex items-center p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Polymer Industry Cluster"
            className="h-10 w-auto object-contain bg-white rounded-sm p-1"
          />
          <div className="hidden md:block">
            <div className="font-bold text-lg text-foreground">Innovation</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Dashboard</div>
          </div>
        </div>
      </div>

      <nav
        className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden md:overflow-y-auto flex-1 p-1 md:py-4 md:px-0 gap-1 md:gap-0"
        aria-label="Dashboard sections"
      >
        {VIEWS.map(view => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          return (
            <button
              key={view.id}
              type="button"
              className={cn(
                'group flex w-auto shrink-0 md:w-full md:shrink items-center gap-2 md:gap-3 px-3 md:px-6 py-2.5 md:py-3 text-left rounded-md md:rounded-none transition-colors border-b-2 md:border-b-0 md:border-l-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                isActive
                  ? 'border-primary bg-accent text-accent-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:bg-accent/50 hover:text-foreground',
              )}
              aria-pressed={isActive}
              aria-current={isActive ? 'page' : undefined}
              aria-label={view.name}
              onClick={() => onNavigate(view.id)}
            >
              <Icon size={20} className="shrink-0" />
              <span className="text-xs font-medium md:hidden">{view.shortName}</span>
              <span className="hidden md:block">{view.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block p-6 text-[0.65rem] text-muted-foreground/60 border-t border-border">
        As of March 2026
      </div>
    </aside>
  );
}
