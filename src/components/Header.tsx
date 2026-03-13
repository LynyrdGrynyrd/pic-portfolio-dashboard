import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onPrint: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Header({ title, subtitle, onPrint, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-10 w-full h-16 md:h-[72px] px-4 md:px-6 flex items-center justify-between gap-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg sm:text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onToggleTheme} aria-label="Toggle dark mode">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={onPrint} aria-label="Print report">
          <span className="sm:hidden">Print</span>
          <span className="hidden sm:inline">Print This View</span>
        </Button>
      </div>
    </header>
  );
}
