'use client'

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarInset,
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { PresetSidebar } from '@/components/custom/PresetSidebar';
import { PromptForm } from '@/components/custom/PromptForm';
import { JsonPreviewCard } from '@/components/custom/JsonPreviewCard';
import { ThemeSelect } from '@/components/custom/ThemeSelect';
import { ALL_PRESETS, getPresetById } from '@/lib/presets';
import { toJson, toYaml, toMarkdown, toNatural, BuilderState, createBuilderState } from '@/lib/formatters';
import { useIsMobile } from '@/hooks/use-mobile';

// Utility: derive initial builder state from the first preset (change as needed)
function stateFromPreset(presetId: string, timestamp?: string): BuilderState {
  const preset = getPresetById(presetId) || ALL_PRESETS[0];
  if (!preset) {
    throw new Error('No presets available');
  }
  return createBuilderState(
    preset.promptTemplate,
    preset.model,
    preset.parameters,
    preset.id,
    undefined,
    Object.entries(preset.parameters).reduce(
      (acc, [key]) => ({ ...acc, [key]: { source: 'preset', origin: preset.id } }),
      {}
    ),
    timestamp
  );
}

/**
 * HomePage - Complete user flow integration
 * 
 * Layout:
 * - Left: Sidebar with searchable preset selection (ComboBox)
 * - Center: PromptForm using react-hook-form with validation
 * - Right/Bottom (mobile): JsonPreviewCard with resizable panels and copy functionality
 * 
 * Features:
 * - Sonner toast notifications for copy actions and validation errors
 * - Responsive design with mobile-first approach
 * - Real-time updates and form validation
 * - Resizable panels for flexible layout
 */
export default function HomePage() {
  const isMobile = useIsMobile();
  const firstPreset = ALL_PRESETS[0];
  
  if (!firstPreset) {
    throw new Error('No presets available');
  }
  
  // State management
  const [selectedPresetId, setSelectedPresetId] = useState<string>(firstPreset.id);
  const [builder, setBuilder] = useState<BuilderState>(() => 
    stateFromPreset(firstPreset.id, '2025-01-01T00:00:00.000Z')
  );
  
  // Update timestamp after component mounts (client-side only)
  useEffect(() => {
    setBuilder(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        timestamp: new Date().toISOString()
      }
    }));
  }, []);

  // Handle preset selection from sidebar
  const handlePresetSelect = (presetId: string) => {
    try {
      setSelectedPresetId(presetId);
      const newBuilder = stateFromPreset(presetId);
      setBuilder(newBuilder);
      toast.success(`Loaded preset: ${getPresetById(presetId)?.name}`);
    } catch {
      toast.error('Failed to load preset. Please try again.');
    }
  };

  // Handle builder state changes from form
  const handleBuilderChange = (newBuilder: BuilderState) => {
    setBuilder(newBuilder);
  };

  // Generate outputs for preview
  const outputs = {
    json: toJson(builder),
    yaml: toYaml(builder),
    markdown: toMarkdown(builder),
    natural: toNatural(builder),
  };

  // Get tokens as simple character count for example
  const getTokenCount = (content: string) => {
    return content.length;
  };

  const selectedPreset = getPresetById(selectedPresetId);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Left Sidebar - Preset Selection */}
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
          <PresetSidebar
            selectedPresetId={selectedPresetId}
            onPresetSelect={handlePresetSelect}
          />
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset>
          {/* Header with hamburger menu for mobile */}
          <header className="glass-header sticky top-0 z-50 flex h-16 shrink-0 items-center">
            <div className="flex w-full items-center px-4">
              <SidebarTrigger className="mr-3 md:hidden" />
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold tracking-tight md:text-xl">🎬 Video Prompt Builder</h1>
                </div>
                <div className="flex items-center">
                  <ThemeSelect />
                </div>
              </div>
            </div>
          </header>

          {/* Main Layout - Responsive */}
          <main className="flex-1 overflow-hidden p-4">
            {isMobile ? (
              // Mobile Layout: Vertical stack
              <div className="flex flex-col h-full gap-4">
                {/* Prompt Form */}
                <div className="flex-1 min-h-0">
                  <PromptForm
                    initialBuilder={builder}
                    onBuilderChange={handleBuilderChange}
                    selectedPreset={selectedPreset || undefined}
                    className="h-full"
                  />
                </div>

                {/* JSON Preview - Bottom */}
                <div className="h-80">
                  <JsonPreviewCard
                    title="Generated Outputs"
                    content={outputs}
                    metadata={{
                      timestamp: builder.metadata.timestamp,
                      model: builder.model,
                      tokens: getTokenCount(outputs.json),
                    }}
                    className="h-full"
                  />
                </div>
              </div>
            ) : (
              // Desktop Layout: Horizontal resizable panels
              <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Center Panel - Prompt Form */}
                <ResizablePanel defaultSize={60} minSize={40}>
                  <PromptForm
                    initialBuilder={builder}
                    onBuilderChange={handleBuilderChange}
                    selectedPreset={selectedPreset || undefined}
                    className="h-full mr-2"
                  />
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - JSON Preview */}
                <ResizablePanel defaultSize={40} minSize={30}>
                  <JsonPreviewCard
                    title="Generated Outputs"
                    content={outputs}
                    metadata={{
                      timestamp: builder.metadata.timestamp,
                      model: builder.model,
                      tokens: getTokenCount(outputs.json),
                    }}
                    className="h-full ml-2"
                  />
                </ResizablePanel>
              </ResizablePanelGroup>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
