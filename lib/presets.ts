/**
 * Video Prompt Builder - Core Presets
 * Foundational preset configurations for different video generation models and use cases
 */

// Base preset interface
export interface VideoPreset {
  id: string;
  name: string;
  description: string;
  category: 'cinematic' | 'documentary' | 'commercial' | 'artistic' | 'educational';
  model: 'sora' | 'runway' | 'pika' | 'stable-video' | 'general';
  parameters: {
    style?: string;
    quality?: 'draft' | 'standard' | 'high' | 'ultra';
    duration?: number;
    aspectRatio?: '16:9' | '9:16' | '1:1' | '4:3' | '21:9';
    fps?: 24 | 30 | 60;
    resolution?: '720p' | '1080p' | '4k';
    motionIntensity?: 'subtle' | 'moderate' | 'dynamic' | 'extreme';
    cameraMovement?: 'static' | 'slow-pan' | 'tracking' | 'handheld' | 'drone';
    lighting?: 'natural' | 'cinematic' | 'dramatic' | 'soft' | 'harsh';
    colorGrading?: 'natural' | 'warm' | 'cool' | 'desaturated' | 'vibrant';
  };
  promptTemplate: string;
  tags: string[];
  examples?: string[];
}

// Filmmaking preset categories
export const CINEMATIC_PRESETS: VideoPreset[] = [
  {
    id: 'cinematic-hero-shot',
    name: 'Cinematic Hero Shot',
    description: 'Epic establishing shot with dramatic camera movement and lighting',
    category: 'cinematic',
    model: 'sora',
    parameters: {
      style: 'cinematic',
      quality: 'ultra',
      duration: 10,
      aspectRatio: '21:9',
      fps: 24,
      resolution: '4k',
      motionIntensity: 'dynamic',
      cameraMovement: 'drone',
      lighting: 'cinematic',
      colorGrading: 'warm'
    },
    promptTemplate: 'Cinematic {subject} shot, {environment}, dramatic lighting, {camera_movement} camera movement, golden hour, film grain, shallow depth of field, {mood} atmosphere',
    tags: ['cinematic', 'hero-shot', 'dramatic', 'epic'],
    examples: [
      'Cinematic mountain peak shot, vast wilderness landscape, dramatic lighting, ascending drone camera movement, golden hour, film grain, shallow depth of field, majestic atmosphere',
      'Cinematic city skyline shot, urban metropolis at sunset, dramatic lighting, slow tracking camera movement, golden hour, film grain, shallow depth of field, inspiring atmosphere'
    ]
  },
  {
    id: 'intimate-character-study',
    name: 'Intimate Character Study',
    description: 'Close-up character-focused shot with emotional depth',
    category: 'cinematic',
    model: 'runway',
    parameters: {
      style: 'naturalistic',
      quality: 'high',
      duration: 8,
      aspectRatio: '16:9',
      fps: 24,
      resolution: '1080p',
      motionIntensity: 'subtle',
      cameraMovement: 'static',
      lighting: 'soft',
      colorGrading: 'natural'
    },
    promptTemplate: 'Close-up of {character}, {emotion} expression, {lighting} lighting, subtle {micro_expression}, {background} background, intimate {mood}',
    tags: ['character', 'close-up', 'emotional', 'intimate'],
    examples: [
      'Close-up of elderly artist, contemplative expression, window lighting, subtle smile forming, art studio background, intimate peaceful mood',
      'Close-up of young child, wonder expression, golden hour lighting, subtle eye movement, nature background, intimate curious mood'
    ]
  }
];

export const DOCUMENTARY_PRESETS: VideoPreset[] = [
  {
    id: 'observational-documentary',
    name: 'Observational Documentary',
    description: 'Natural, unobtrusive documentary style footage',
    category: 'documentary',
    model: 'stable-video',
    parameters: {
      style: 'realistic',
      quality: 'standard',
      duration: 15,
      aspectRatio: '16:9',
      fps: 30,
      resolution: '1080p',
      motionIntensity: 'moderate',
      cameraMovement: 'handheld',
      lighting: 'natural',
      colorGrading: 'natural'
    },
    promptTemplate: 'Documentary footage of {subject}, {activity}, natural lighting, handheld camera, authentic {environment}, candid {behavior}',
    tags: ['documentary', 'observational', 'realistic', 'candid'],
    examples: [
      'Documentary footage of street musician, playing guitar, natural lighting, handheld camera, authentic urban environment, candid performance',
      'Documentary footage of farmer, tending crops, natural lighting, handheld camera, authentic rural environment, candid working behavior'
    ]
  }
];

export const COMMERCIAL_PRESETS: VideoPreset[] = [
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    description: 'Clean, professional product presentation',
    category: 'commercial',
    model: 'pika',
    parameters: {
      style: 'clean',
      quality: 'high',
      duration: 6,
      aspectRatio: '16:9',
      fps: 30,
      resolution: '1080p',
      motionIntensity: 'moderate',
      cameraMovement: 'slow-pan',
      lighting: 'soft',
      colorGrading: 'vibrant'
    },
    promptTemplate: 'Professional {product} showcase, {background} background, soft studio lighting, {camera_movement}, clean composition, {brand_style} aesthetic',
    tags: ['commercial', 'product', 'professional', 'clean'],
    examples: [
      'Professional smartphone showcase, minimal white background, soft studio lighting, 360-degree rotation, clean composition, modern aesthetic',
      'Professional coffee cup showcase, wooden table background, soft studio lighting, slow zoom in, clean composition, warm aesthetic'
    ]
  }
];

export const ARTISTIC_PRESETS: VideoPreset[] = [
  {
    id: 'abstract-motion',
    name: 'Abstract Motion',
    description: 'Experimental abstract visual patterns and movements',
    category: 'artistic',
    model: 'stable-video',
    parameters: {
      style: 'abstract',
      quality: 'high',
      duration: 12,
      aspectRatio: '1:1',
      fps: 60,
      resolution: '1080p',
      motionIntensity: 'extreme',
      cameraMovement: 'static',
      lighting: 'dramatic',
      colorGrading: 'vibrant'
    },
    promptTemplate: 'Abstract {pattern} motion, {colors} color palette, {movement_type} movement, {texture} textures, {rhythm} rhythm, experimental visual art',
    tags: ['abstract', 'experimental', 'artistic', 'motion'],
    examples: [
      'Abstract fluid motion, rainbow color palette, swirling movement, liquid textures, hypnotic rhythm, experimental visual art',
      'Abstract geometric motion, neon color palette, pulsing movement, crystalline textures, rhythmic rhythm, experimental visual art'
    ]
  }
];

// Consolidated preset collection
export const ALL_PRESETS: VideoPreset[] = [
  ...CINEMATIC_PRESETS,
  ...DOCUMENTARY_PRESETS,
  ...COMMERCIAL_PRESETS,
  ...ARTISTIC_PRESETS
];

// Preset utilities
export const getPresetById = (id: string): VideoPreset | undefined => {
  return ALL_PRESETS.find(preset => preset.id === id);
};

export const getPresetsByCategory = (category: VideoPreset['category']): VideoPreset[] => {
  return ALL_PRESETS.filter(preset => preset.category === category);
};

export const getPresetsByModel = (model: VideoPreset['model']): VideoPreset[] => {
  return ALL_PRESETS.filter(preset => preset.model === model);
};

export const getPresetsByTag = (tag: string): VideoPreset[] => {
  return ALL_PRESETS.filter(preset => preset.tags.includes(tag));
};

// Default preset configurations
export const DEFAULT_PRESET_CONFIG = {
  quality: 'standard' as const,
  duration: 10,
  aspectRatio: '16:9' as const,
  fps: 30,
  resolution: '1080p' as const,
  motionIntensity: 'moderate' as const,
  cameraMovement: 'static' as const,
  lighting: 'natural' as const,
  colorGrading: 'natural' as const
};

export default ALL_PRESETS;
