export interface Theme {
  name: string;
  label: string;
  value: string;
  preview: {
    primary: string;
    secondary: string;
    accent: string;
    surfaceCode: string;
  };
}

// Available theme options based on tweakcn and our CSS definitions
export const themes: Theme[] = [
  {
    name: "Modern Minimal",
    label: "Modern Minimal",
    value: "modern-minimal",
    preview: {
      primary: "oklch(0.56 0 0)",
      secondary: "oklch(0.97 0 0)",
      accent: "oklch(0.97 0 0)",
      surfaceCode: "oklch(0.56 0 0)"
    },
  },
  {
    name: "Kodama Grove",
    label: "Kodama Grove",
    value: "kodama-grove",
    preview: {
      primary: "oklch(0.6657 0.1050 118.9078)",
      secondary: "oklch(0.8532 0.0631 91.1493)",
      accent: "oklch(0.8361 0.0713 90.3269)",
      surfaceCode: "oklch(0.6657 0.1050 118.9078)"
    },
  },
  {
    name: "Cosmic Night",
    label: "Cosmic Night",
    value: "cosmic-night",
    preview: {
      primary: "oklch(0.6726 0.2904 341.4084)",
      secondary: "oklch(0.9595 0.0200 286.0164)",
      accent: "oklch(0.8903 0.1739 171.2690)",
      surfaceCode: "oklch(0.6726 0.2904 341.4084)"
    },
  },
];
