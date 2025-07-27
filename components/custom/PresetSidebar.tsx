'use client'

import React from 'react';
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { ComboBox, ComboBoxOption } from '@/components/ui/combobox';
import { ALL_PRESETS, VideoPreset } from '@/lib/presets';
import { FileTextIcon, TagIcon, PlayIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PresetSidebarProps {
  selectedPresetId?: string;
  onPresetSelect: (presetId: string) => void;
  className?: string;
}

/**
 * PresetSidebar - Sidebar component with searchable preset selection
 * 
 * Features:
 * - ComboBox for searchable preset selection
 * - Categorized preset display
 * - Visual indicators for preset types
 * - Recent presets section
 */
export function PresetSidebar({ 
  selectedPresetId, 
  onPresetSelect, 
  className 
}: PresetSidebarProps) {
  // Transform presets into ComboBox options
  const presetOptions: ComboBoxOption[] = ALL_PRESETS.map(preset => ({
    value: preset.id,
    label: `${preset.name} (${preset.model})`,
    disabled: false
  }));

  // Group presets by category
  const presetsByCategory = ALL_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category]!.push(preset);
    return acc;
  }, {} as Record<string, VideoPreset[]>);

  const handlePresetChange = (presetId: string) => {
    if (presetId && presetId !== selectedPresetId) {
      onPresetSelect(presetId);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cinematic': return '🎬';
      case 'documentary': return '📹';
      case 'commercial': return '📺';
      case 'artistic': return '🎨';
      case 'educational': return '📚';
      default: return '🎥';
    }
  };

  return (
    <SidebarContent className={className}>
      <SidebarHeader className="border-b border-sidebar-border pb-4">
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <FileTextIcon className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Video Prompt Builder</span>
            <span className="text-xs text-sidebar-foreground/60">AI-powered prompts</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Searchable Preset Selection */}
      <SidebarGroup>
        <SidebarGroupLabel>Search Presets</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2">
            <ComboBox
              value={selectedPresetId || ''}
              onChange={handlePresetChange}
              options={presetOptions}
              placeholder="Search presets..."
              searchPlaceholder="Type to search..."
              emptyText="No presets found."
              className="w-full"
            />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Categorized Presets */}
      {Object.entries(presetsByCategory).map(([category, presets]) => (
        <SidebarGroup key={category}>
          <SidebarGroupLabel className="flex items-center gap-2">
            <span>{getCategoryIcon(category)}</span>
            <span className="capitalize">{category}</span>
            <Badge variant="secondary" className="ml-auto">
              {presets.length}
            </Badge>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {presets.map((preset) => (
                <SidebarMenuItem key={preset.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={selectedPresetId === preset.id}
                    onClick={() => handlePresetChange(preset.id)}
                  >
                    <button className="w-full justify-start">
                      <PlayIcon className="size-4" />
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="font-medium truncate">{preset.name}</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {preset.model} • {preset.parameters.duration}s
                        </span>
                      </div>
                      {preset.tags.length > 0 && (
                        <TagIcon className="size-3 text-muted-foreground" />
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  );
}

export default PresetSidebar;
