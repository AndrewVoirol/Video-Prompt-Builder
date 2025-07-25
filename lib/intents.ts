export const promptIntents = [
  {
    id: "sci-fi-chase",
    domain: "action",
    label: "Futuristic City Chase",
    description: "Dynamic drone chase, neon-lit city, 120fps, cinematic rain.",
    technical: {
      cameraMoves: ["fpv", "tracking", "dolly"],
      lighting: ["neon", "high_contrast", "backlit"],
      fps: 120,
      aspect: "2.39:1",
      shotTypes: ["wide", "closeup"]
    },
    tags: ["action", "sci-fi", "neon", "chase", "drone", "highspeed"],
    modelSupport: ["Luma", "Veo", "Runway", "Kling"],
    promptTemplate: "A breathtaking drone chase through neon-lit skyscrapers in the rain, captured at 120fps for ultra-smooth slow motion. FPV and tracking shots emphasize speed as protagonist weaves between traffic. The scene glows with electric blues and magentas.",
    references: ["Blade Runner 2049 Alley Chase", "Gemini-Veo Docs: Camera Movement"]
  },
  // Add more as needed
];
