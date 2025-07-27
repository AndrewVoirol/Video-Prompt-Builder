'use client'

import React from 'react';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { BuilderState, createBuilderState } from '@/lib/formatters';
import { VideoPreset } from '@/lib/presets';

// Form validation schema
const promptFormSchema = z.object({
  promptTemplate: z.string().min(10, 'Prompt template must be at least 10 characters'),
  model: z.string().min(1, 'Model is required'),
  style: z.string().optional(),
  quality: z.enum(['draft', 'standard', 'high', 'ultra']),
  duration: z.number().min(1).max(60),
  aspectRatio: z.enum(['16:9', '9:16', '1:1', '4:3', '21:9']),
  fps: z.union([z.literal(24), z.literal(30), z.literal(60)]),
  resolution: z.enum(['720p', '1080p', '4k']),
  motionIntensity: z.enum(['subtle', 'moderate', 'dynamic', 'extreme']),
  cameraMovement: z.enum(['static', 'slow-pan', 'tracking', 'handheld', 'drone']),
  lighting: z.enum(['natural', 'cinematic', 'dramatic', 'soft', 'harsh']),
  colorGrading: z.enum(['natural', 'warm', 'cool', 'desaturated', 'vibrant']),
  advancedMode: z.boolean(),
});

type PromptFormData = z.infer<typeof promptFormSchema>;

interface PromptFormProps {
  initialBuilder: BuilderState;
  onBuilderChange: (builder: BuilderState) => void;
  selectedPreset?: VideoPreset | undefined;
  className?: string;
}

/**
 * PromptForm - Enhanced form component using react-hook-form
 * 
 * Features:
 * - React Hook Form with Zod validation
 * - Sonner toast notifications for validation errors
 * - Dynamic form fields based on preset
 * - Advanced mode toggle for additional options
 * - Real-time validation feedback
 */
export function PromptForm({ 
  initialBuilder, 
  onBuilderChange, 
  selectedPreset,
  className 
}: PromptFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      promptTemplate: initialBuilder.prompt,
      model: initialBuilder.model,
      style: initialBuilder.parameters.style || '',
      quality: (initialBuilder.parameters.quality as 'draft' | 'standard' | 'high' | 'ultra') || 'standard', 
      duration: initialBuilder.parameters.duration || 10,
      aspectRatio: (initialBuilder.parameters.aspectRatio as '16:9' | '9:16' | '1:1' | '4:3' | '21:9') || '16:9',
      fps: (initialBuilder.parameters.fps as 24 | 30 | 60) || 30,
      resolution: (initialBuilder.parameters.resolution as '720p' | '1080p' | '4k') || '1080p',
      motionIntensity: (initialBuilder.parameters.motionIntensity as 'subtle' | 'moderate' | 'dynamic' | 'extreme') || 'moderate',
      cameraMovement: (initialBuilder.parameters.cameraMovement as 'static' | 'slow-pan' | 'tracking' | 'handheld' | 'drone') || 'static',
      lighting: (initialBuilder.parameters.lighting as 'natural' | 'cinematic' | 'dramatic' | 'soft' | 'harsh') || 'natural',
      colorGrading: (initialBuilder.parameters.colorGrading as 'natural' | 'warm' | 'cool' | 'desaturated' | 'vibrant') || 'natural',
      advancedMode: false,
    },
    mode: 'onChange'
  });

  const watchAdvancedMode = watch('advancedMode');

  // Update form when preset changes
  React.useEffect(() => {
    if (selectedPreset) {
      reset({
        promptTemplate: selectedPreset.promptTemplate,
        model: selectedPreset.model,
        style: selectedPreset.parameters.style || '',
        quality: selectedPreset.parameters.quality || 'standard',
        duration: selectedPreset.parameters.duration || 10,
        aspectRatio: selectedPreset.parameters.aspectRatio || '16:9',
        fps: selectedPreset.parameters.fps || 30,
        resolution: selectedPreset.parameters.resolution || '1080p',
        motionIntensity: selectedPreset.parameters.motionIntensity || 'moderate',
        cameraMovement: selectedPreset.parameters.cameraMovement || 'static',
        lighting: selectedPreset.parameters.lighting || 'natural',
        colorGrading: selectedPreset.parameters.colorGrading || 'natural',
        advancedMode: watchAdvancedMode,
      });
    }
  }, [selectedPreset, reset, watchAdvancedMode]);

  const onSubmit = React.useCallback((data: PromptFormData) => {
    try {
      // Filter out undefined values to satisfy TypeScript strict mode
      const parameters: Record<string, unknown> = {};
      if (data.style) parameters.style = data.style;
      parameters.quality = data.quality;
      parameters.duration = data.duration;
      parameters.aspectRatio = data.aspectRatio;
      parameters.fps = data.fps;
      parameters.resolution = data.resolution;
      parameters.motionIntensity = data.motionIntensity;
      parameters.cameraMovement = data.cameraMovement;
      parameters.lighting = data.lighting;
      parameters.colorGrading = data.colorGrading;

      const updatedBuilder = createBuilderState(
        data.promptTemplate,
        data.model,
        parameters as BuilderState['parameters'],
        selectedPreset?.id || 'custom'
      );

      onBuilderChange(updatedBuilder);
      toast.success('Prompt updated successfully!');
    } catch {
      toast.error('Failed to update prompt. Please check your inputs.');
    }
  }, [onBuilderChange, selectedPreset?.id]);

  const onError = React.useCallback((errors: FieldErrors<PromptFormData>) => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message || 'Unknown error')
      .filter(Boolean)
      .join(', ');
    toast.error(`Validation errors: ${errorMessages}`);
  }, []);

  // Real-time updates
  const watchedValues = watch();
  React.useEffect(() => {
    if (isValid && isDirty) {
      const debounceTimer = setTimeout(() => {
        handleSubmit(onSubmit, onError)();
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [watchedValues, isValid, isDirty, handleSubmit, onSubmit, onError]);

  return (
    <Card className={`h-full overflow-auto ${className || ''}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Video Prompt Configuration</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isValid ? 'default' : 'destructive'}>
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
            {selectedPreset && (
              <Badge variant="outline">
                {selectedPreset.name}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
          {/* Prompt Template */}
          <div className="space-y-2">
            <Label htmlFor="promptTemplate">Prompt Template *</Label>
            <Controller
              name="promptTemplate"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="promptTemplate"
                  placeholder="Describe your video prompt..."
                  className="min-h-24"
                />
              )}
            />
            {errors.promptTemplate && (
              <p className="text-sm text-destructive">{errors.promptTemplate.message}</p>
            )}
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <Label htmlFor="model">AI Model *</Label>
            <Controller
              name="model"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sora">OpenAI Sora</SelectItem>
                    <SelectItem value="runway">Runway ML</SelectItem>
                    <SelectItem value="pika">Pika Labs</SelectItem>
                    <SelectItem value="stable-video">Stable Video</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.model && (
              <p className="text-sm text-destructive">{errors.model.message}</p>
            )}
          </div>

          {/* Basic Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quality */}
            <div className="space-y-2">
              <Label htmlFor="quality">Quality</Label>
              <Controller
                name="quality"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="ultra">Ultra</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Controller
                name="duration"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="60"
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                )}
              />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="aspectRatio">Aspect Ratio</Label>
              <Controller
                name="aspectRatio"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                      <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="4:3">4:3 (Classic)</SelectItem>
                      <SelectItem value="21:9">21:9 (Cinematic)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Advanced Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Controller
              name="advancedMode"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="advancedMode">Advanced Mode</Label>
          </div>

          {/* Advanced Parameters */}
          {watchAdvancedMode && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="text-sm font-medium">Advanced Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Motion Intensity */}
                <div className="space-y-2">
                  <Label>Motion Intensity</Label>
                  <Controller
                    name="motionIntensity"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="subtle">Subtle</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="dynamic">Dynamic</SelectItem>
                          <SelectItem value="extreme">Extreme</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Camera Movement */}
                <div className="space-y-2">
                  <Label>Camera Movement</Label>
                  <Controller
                    name="cameraMovement"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="static">Static</SelectItem>
                          <SelectItem value="slow-pan">Slow Pan</SelectItem>
                          <SelectItem value="tracking">Tracking</SelectItem>
                          <SelectItem value="handheld">Handheld</SelectItem>
                          <SelectItem value="drone">Drone</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Lighting */}
                <div className="space-y-2">
                  <Label>Lighting</Label>
                  <Controller
                    name="lighting"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="natural">Natural</SelectItem>
                          <SelectItem value="cinematic">Cinematic</SelectItem>
                          <SelectItem value="dramatic">Dramatic</SelectItem>
                          <SelectItem value="soft">Soft</SelectItem>
                          <SelectItem value="harsh">Harsh</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Color Grading */}
                <div className="space-y-2">
                  <Label>Color Grading</Label>
                  <Controller
                    name="colorGrading"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="natural">Natural</SelectItem>
                          <SelectItem value="warm">Warm</SelectItem>
                          <SelectItem value="cool">Cool</SelectItem>
                          <SelectItem value="desaturated">Desaturated</SelectItem>
                          <SelectItem value="vibrant">Vibrant</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!isValid}>
              Update Prompt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default PromptForm;
