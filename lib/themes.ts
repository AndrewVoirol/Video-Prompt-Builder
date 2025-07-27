export interface Theme {
  label: string;
  value: string;
  preview: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const themes: Theme[] = [
  {
    label: "System",
    value: "system",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      primary: "hsl(222.2 47.4% 11.2%)",
      secondary: "hsl(210 40% 96%)",
      accent: "hsl(210 40% 96%)",
    },
  },
  {
    label: "Primary (tweakcn)",
    value: "tweakcn",
    preview: {
      background: "hsl(0 0% 100%)",
      foreground: "hsl(222.2 84% 4.9%)",
      primary: "hsl(222.2 47.4% 11.2%)",
      secondary: "hsl(210 40% 96%)",
      accent: "hsl(210 40% 96%)",
    },
  },
  {
    label: "Cyberpunk",
    value: "cyberpunk",
    preview: {
      background: "hsl(230 15% 9%)",
      foreground: "hsl(315 100% 85%)",
      primary: "hsl(315 100% 70%)",
      secondary: "hsl(195 100% 50%)",
      accent: "hsl(195 100% 50%)",
    },
  },
  {
    label: "Kodama Grove",
    value: "kodama-grove",
    preview: {
      background: "hsl(120 20% 97%)",
      foreground: "hsl(120 15% 15%)",
      primary: "hsl(120 60% 35%)",
      secondary: "hsl(90 25% 85%)",
      accent: "hsl(160 50% 65%)",
    },
  },
];

// Helper function to get all theme variants (light and dark)
export const getAllThemeVariants = () => {
  const allVariants: string[] = []
  
  themes.forEach(theme => {
    if (theme.value === "system") {
      allVariants.push("system", "light", "dark")
    } else {
      allVariants.push(theme.value, `${theme.value}-dark`)
    }
  })
  
  return allVariants
}
