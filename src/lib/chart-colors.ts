const SECTOR_COLORS: Record<string, string> = {
  'mobility':             '#1a8a9e',
  'industrial-materials': '#00bfe7',
  'energy':               '#e5b731',
  'healthcare':           '#995480',
  'environmental':        '#5b7fa6',
  'defense':              '#6b7fa8',
  'unknown':              '#9ca3af',
};

export function getSectorColor(sector: string): string {
  return SECTOR_COLORS[sector.toLowerCase()] ?? SECTOR_COLORS['unknown'];
}

const FALLBACKS = {
  foreground: '#1a2a2e',
  mutedForeground: '#6b7b80',
  border: '#d8e2e4',
  chart1: '#1a8a9e',
  chart2: '#00bfe7',
  chart3: '#e5b731',
  chart4: '#995480',
  chart5: '#5b7fa6',
};

function resolveHslToken(token: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const rawValue = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return rawValue ? `hsl(${rawValue})` : fallback;
}

export function getChartTheme() {
  return {
    foreground: resolveHslToken('--foreground', FALLBACKS.foreground),
    mutedForeground: resolveHslToken('--muted-foreground', FALLBACKS.mutedForeground),
    border: resolveHslToken('--border', FALLBACKS.border),
    chart1: resolveHslToken('--chart-1', FALLBACKS.chart1),
    chart2: resolveHslToken('--chart-2', FALLBACKS.chart2),
    chart3: resolveHslToken('--chart-3', FALLBACKS.chart3),
    chart4: resolveHslToken('--chart-4', FALLBACKS.chart4),
    chart5: resolveHslToken('--chart-5', FALLBACKS.chart5),
  };
}

