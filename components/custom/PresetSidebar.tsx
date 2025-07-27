'use client'

import React, { useState, useCallback } from 'react';
import { 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { ComboBox, ComboBoxOption } from '@/components/ui/combobox';
import { ALL_PRESETS, VideoPreset } from '@/lib/presets';
import { 
  FileTextIcon, 
  PlayIcon, 
  ClockIcon, 
  SparklesIcon, 
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  CopyIcon,
  HeartIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
  // State for collapsible categories
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Transform presets into ComboBox options with cleaner formatting
  const presetOptions: ComboBoxOption[] = ALL_PRESETS.map(preset => ({
    value: preset.id,
    label: preset.name.length > 30 ? `${preset.name.substring(0, 27)}...` : preset.name,
    disabled: false
  }));

  // Filter presets based on search query
  const filteredPresets = ALL_PRESETS.filter(preset => 
    preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    preset.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group filtered presets by category
  const presetsByCategory = filteredPresets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category]!.push(preset);
    return acc;
  }, {} as Record<string, VideoPreset[]>);

  // Favorite presets
  const favoritePresets = ALL_PRESETS.filter(preset => favorites.has(preset.id));


  // Toggle category collapse
  const toggleCategory = useCallback((category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }, []);

  // Toggle favorite
  const toggleFavorite = useCallback((presetId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(presetId)) {
        newSet.delete(presetId);
      } else {
        newSet.add(presetId);
      }
      return newSet;
    });
  }, []);

  // Copy preset (placeholder function)
  const copyPreset = useCallback((preset: VideoPreset, event: React.MouseEvent) => {
    event.stopPropagation();
    // TODO: Implement copy functionality
    console.log('Copy preset:', preset.name);
  }, []);

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

      {/* Enhanced Search */}
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <SearchIcon className="size-4" />
          Search & Filter
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="px-2 space-y-2">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-sidebar-foreground/40" />
              <Input
                type="text"
                placeholder="Search presets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 bg-sidebar-accent/50 border-sidebar-border focus:bg-background"
              />
            </div>
            <ComboBox
              value={selectedPresetId || ''}
              onChange={handlePresetChange}
              options={presetOptions}
              placeholder="Quick select..."
              searchPlaceholder="Type to search..."
              emptyText="No presets found."
              className="w-full"
            />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Favorites Section */}
      {favoritePresets.length > 0 && (
        <>
          <SidebarSeparator className="my-2" />
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 px-2 py-2 font-medium text-sidebar-foreground/90">
              <HeartIcon className="size-4 text-red-500" />
              <span className="text-sm font-semibold">Favorites</span>
              <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                {favoritePresets.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favoritePresets.map((preset) => (
                  <PresetItem
                    key={`fav-${preset.id}`}
                    preset={preset}
                    isSelected={selectedPresetId === preset.id}
                    isFavorite={true}
                    onSelect={() => handlePresetChange(preset.id)}
                    onToggleFavorite={(e) => toggleFavorite(preset.id, e)}
                    onCopy={(e) => copyPreset(preset, e)}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </>
      )}

      {/* Categorized Presets */}
      {Object.entries(presetsByCategory).map(([category, presets], index) => {
        const isCollapsed = collapsedCategories.has(category);
        return (
          <React.Fragment key={category}>
            {(index > 0 || favoritePresets.length > 0) && <SidebarSeparator className="my-2" />}
            <SidebarGroup>
              <SidebarGroupLabel 
                className="flex items-center gap-2 px-2 py-2 font-medium text-sidebar-foreground/90 cursor-pointer hover:bg-sidebar-accent/50 rounded-md transition-colors"
                onClick={() => toggleCategory(category)}
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="size-4 text-sidebar-foreground/60" />
                ) : (
                  <ChevronDownIcon className="size-4 text-sidebar-foreground/60" />
                )}
                <span className="text-base">{getCategoryIcon(category)}</span>
                <span className="capitalize text-sm font-semibold">{category}</span>
                <Badge variant="secondary" className="ml-auto text-xs h-5 px-1.5">
                  {presets.length}
                </Badge>
              </SidebarGroupLabel>
              {!isCollapsed && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {presets.map((preset) => (
                      <PresetItem
                        key={preset.id}
                        preset={preset}
                        isSelected={selectedPresetId === preset.id}
                        isFavorite={favorites.has(preset.id)}
                        onSelect={() => handlePresetChange(preset.id)}
                        onToggleFavorite={(e) => toggleFavorite(preset.id, e)}
                        onCopy={(e) => copyPreset(preset, e)}
                      />
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </React.Fragment>
      )})}
    </SidebarContent>
  );
}

// Enhanced Preset Item Component with quick actions
interface PresetItemProps {
  preset: VideoPreset;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (event: React.MouseEvent) => void;
  onCopy: (event: React.MouseEvent) => void;
}

function PresetItem({ preset, isSelected, isFavorite, onSelect, onToggleFavorite, onCopy }: PresetItemProps) {
  return (
    <SidebarMenuItem className="mb-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton 
              asChild 
              isActive={isSelected}
              onClick={onSelect}
              className={cn(
                "group/preset-item h-auto min-h-[68px] p-0 transition-all duration-200 hover:bg-sidebar-accent/80",
                "border border-transparent hover:border-sidebar-border/50 rounded-lg relative",
                isSelected 
                  ? "bg-sidebar-accent border-sidebar-primary/30 shadow-sm ring-1 ring-sidebar-primary/20" 
                  : "hover:shadow-sm hover:scale-[1.02]"
              )}
            >
              <div className="w-full h-full justify-start gap-3 p-3 text-left rounded-lg flex items-start">
                <div className={cn(
                  "flex aspect-square size-10 items-center justify-center rounded-lg transition-all duration-200 flex-shrink-0",
                  isSelected 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md" 
                    : "bg-muted text-sidebar-foreground/70 group-hover/preset-item:bg-sidebar-primary/10 group-hover/preset-item:text-sidebar-primary"
                )}>
                  <PlayIcon className="size-4" />
                </div>
                <div className="flex flex-col items-start flex-1 min-w-0 gap-1.5">
                  <div className="flex items-center justify-between w-full">
                    <span className={cn(
                      "font-semibold truncate text-sm leading-tight text-sidebar-foreground",
                      isSelected ? "text-sidebar-accent-foreground" : ""
                    )}>
                      {preset.name}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover/preset-item:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-6 w-6 p-0 hover:bg-sidebar-primary/10",
                          isFavorite ? "text-red-500 opacity-100" : "text-sidebar-foreground/40"
                        )}
                        onClick={onToggleFavorite}
                      >
                        <HeartIcon className={cn("size-3", isFavorite ? "fill-current" : "")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-primary/10"
                        onClick={onCopy}
                      >
                        <CopyIcon className="size-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
                    <div className="flex items-center gap-1">
                      <SparklesIcon className="size-3 flex-shrink-0" />
                      <span className="truncate font-medium">{preset.model}</span>
                    </div>
                    <span className="text-sidebar-foreground/30">•</span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="size-3 flex-shrink-0" />
                      <span className="whitespace-nowrap font-medium">{preset.parameters.duration}s</span>
                    </div>
                  </div>
                  {preset.description && (
                    <p className="text-xs text-sidebar-foreground/50 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  )}
                  {preset.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {preset.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs h-4 px-1 py-0 text-sidebar-foreground/60 border-sidebar-border/50">
                          {tag}
                        </Badge>
                      ))}
                      {preset.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs h-4 px-1 py-0 text-sidebar-foreground/40 border-sidebar-border/30">
                          +{preset.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-semibold">{preset.name}</p>
              <p className="text-xs text-muted-foreground">{preset.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Model: {preset.model}</span>
                <span>•</span>
                <span>Duration: {preset.parameters.duration}s</span>
              </div>
              {preset.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {preset.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs h-4 px-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItem>
  );
}

export default PresetSidebar;
