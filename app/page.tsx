'use client'

import React, { useState, useEffect } from 'react';
import { ALL_PRESETS, getPresetById } from '@/lib/presets';
import { toJson, toYaml, toMarkdown, toNatural, BuilderState, createBuilderState } from '@/lib/formatters';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tab';
import { Button } from '@/components/Button';
import { OutputCard } from '@/components/OutputCard';
import { ThemeToggle } from '@/components/ThemeToggle';

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

export default function HomePage() {
  const firstPreset = ALL_PRESETS[0];
  if (!firstPreset) {
    throw new Error('No presets available');
  }
  
  // Use a static timestamp to prevent hydration mismatches
  // This will be the same for both server and client renders
  const [builder, setBuilder] = useState<BuilderState>(() => 
    stateFromPreset(firstPreset.id, '2025-01-01T00:00:00.000Z')
  );
  const [tab, setTab] = useState<'json' | 'yaml' | 'markdown' | 'natural'>('json');
  
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

  function handlePresetChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    setBuilder(stateFromPreset(evt.target.value));
  }

  function handleParamChange(field: keyof BuilderState['parameters'], value: string) {
    setBuilder((old: BuilderState) => ({
      ...old,
      parameters: { ...old.parameters, [field]: value },
      provenance: {
        ...old.provenance,
        [field]: { source: 'user', modified: true }
      }
    }));
  }

  const outputs = {
    json: toJson(builder),
    yaml: toYaml(builder),
    markdown: toMarkdown(builder),
    natural: toNatural(builder),
  };

  function handleCopyAll() {
    navigator.clipboard.writeText(
      Object.entries(outputs)
        .map(([k, v]) => `## ${k.toUpperCase()}\n${v}`)
        .join('\n\n')
    );
  }

  // Compute tokens as simple character count for example
  function getTokenCount(content: string) {
    return content.length;
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🎬 Video Prompt Builder</h1>
        <ThemeToggle />
      </header>

      <form className="mb-8 p-4 bg-muted rounded-lg">
        <label className="block mb-2 font-medium text-lg">Preset:</label>
        <select
          className="py-2 px-3 border rounded-md bg-background"
          value={builder.presetId}
          onChange={handlePresetChange}
        >
          {ALL_PRESETS.map((preset) =>
            <option key={preset.id} value={preset.id}>{preset.name}</option>
          )}
        </select>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {Object.entries(builder.parameters).map(([field, value]) => (
            <div key={field}>
              <label className="font-semibold">{field}:</label>
              <input
                type="text"
                value={typeof value === 'string' ? value : (typeof value === 'number' ? value.toString() : '')}
                className="ml-2 px-2 py-1 border rounded"
                onChange={e => handleParamChange(field as keyof BuilderState['parameters'], e.target.value)}
              />
              {/* Provenance badge */}
              <span className="ml-3 px-2 py-1 rounded text-xs bg-accent text-accent-foreground">
                {builder.provenance[field]?.source ?? '—'}
                {builder.provenance[field]?.origin ? ` (${builder.provenance[field]?.origin})` : ''}
                {builder.provenance[field]?.modified ? ' (modified)' : ''}
              </span>
            </div>
          ))}
        </div>
      </form>

      <section className="mb-8">
        <Button onClick={handleCopyAll}>Copy All Outputs</Button>
      </section>

      <Tabs value={tab} onValueChange={(t) => setTab(t as 'json' | 'yaml' | 'markdown' | 'natural')}>
        <TabsList>
          {(['json', 'yaml', 'markdown', 'natural'] as const).map(f =>
            <TabsTrigger key={f} value={f}>{f.toUpperCase()}</TabsTrigger>
          )}
        </TabsList>
        {(['json', 'yaml', 'markdown', 'natural'] as const).map(f =>
          <TabsContent key={f} value={f}>
            <OutputCard
              title={f.toUpperCase()}
              content={outputs[f]}
              metadata={{
                timestamp: builder.metadata.timestamp,
                model: builder.model,
                tokens: getTokenCount(outputs[f]),
                // Optionally: duration: builder.parameters.duration?.toString(),
              }}
              actions={{
                onCopy: () => navigator.clipboard.writeText(outputs[f]),
                // Add onDownload or onShare if desired
              }}
            >
              <div className="mt-2 text-xs text-muted-foreground">
                Format: {f}, Source preset: {builder.presetId}
              </div>
            </OutputCard>
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
