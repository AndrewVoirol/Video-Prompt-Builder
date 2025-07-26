import { ThemeConfig } from './types';

export const darkTheme: ThemeConfig = {
  name: 'dark',
  displayName: 'Dark',
  description: 'Elegant dark theme for comfortable nighttime viewing',
  colors: {
    // Base colors
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    
    // Card colors
    card: 'hsl(222.2 84% 4.9%)',
    'card-foreground': 'hsl(210 40% 98%)',
    
    // Popover colors
    popover: 'hsl(222.2 84% 4.9%)',
    'popover-foreground': 'hsl(210 40% 98%)',
    
    // Primary colors
    primary: 'hsl(210 40% 98%)',
    'primary-foreground': 'hsl(222.2 47.4% 11.2%)',
    
    // Secondary colors
    secondary: 'hsl(217.2 32.6% 17.5%)',
    'secondary-foreground': 'hsl(210 40% 98%)',
    
    // Muted colors
    muted: 'hsl(217.2 32.6% 17.5%)',
    'muted-foreground': 'hsl(215 20.2% 65.1%)',
    
    // Accent colors
    accent: 'hsl(217.2 32.6% 17.5%)',
    'accent-foreground': 'hsl(210 40% 98%)',
    
    // Destructive colors
    destructive: 'hsl(0 62.8% 30.6%)',
    'destructive-foreground': 'hsl(210 40% 98%)',
    
    // Border and input
    border: 'hsl(217.2 32.6% 17.5%)',
    input: 'hsl(217.2 32.6% 17.5%)',
    
    // Ring (focus)
    ring: 'hsl(212.7 26.8% 83.9%)',
    
    // Chart colors
    'chart-1': 'hsl(220 70% 50%)',
    'chart-2': 'hsl(160 60% 45%)',
    'chart-3': 'hsl(30 80% 55%)',
    'chart-4': 'hsl(280 65% 60%)',
    'chart-5': 'hsl(340 75% 55%)'
  },
  radius: '0.5rem',
  fonts: {
    sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.8)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.8), 0 2px 4px -2px rgb(0 0 0 / 0.8)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.8), 0 4px 6px -4px rgb(0 0 0 / 0.8)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.8), 0 8px 10px -6px rgb(0 0 0 / 0.8)'
  }
};
