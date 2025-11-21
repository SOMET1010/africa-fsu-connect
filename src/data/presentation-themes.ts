export interface PresentationTheme {
  id: string;
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
  };
}

export const presentationThemes: PresentationTheme[] = [
  {
    id: 'professional',
    name: 'Professional',
    colors: {
      background: '222.2 84% 4.9%',
      foreground: '210 40% 98%',
      primary: '217.2 91.2% 59.8%',
      secondary: '217.2 32.6% 17.5%',
      accent: '217.2 32.6% 17.5%',
      muted: '217.2 32.6% 17.5%',
    },
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      background: '0 0% 0%',
      foreground: '0 0% 100%',
      primary: '24 100% 50%',
      secondary: '240 6% 10%',
      accent: '24 100% 40%',
      muted: '240 4% 16%',
    },
  },
  {
    id: 'high-contrast',
    name: 'High Contrast',
    colors: {
      background: '0 0% 100%',
      foreground: '0 0% 0%',
      primary: '221 83% 53%',
      secondary: '210 40% 96.1%',
      accent: '221 83% 53%',
      muted: '210 40% 96.1%',
    },
  },
];
