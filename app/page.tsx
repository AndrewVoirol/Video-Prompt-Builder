'use client'

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tab';
import { Button } from '@/components/Button';
import { OutputCard } from '@/components/OutputCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ALL_PRESETS, getPresetById } from '@/lib/presets';
import { toJson, toYaml, toMarkdown, toNatural, BuilderState, createBuilderState } from '@/lib/formatters';

/** Helper to derive a builder state from a preset model. */
function stateFromPreset(presetId: string): BuilderState {
  const preset = getPresetById(presetId) ?? ALL_PRESETS[0];
  // Loads preset parameters as the builder state, and tracks provenance for each.
  return createBuilderState(
    preset.promptTemplate,
    preset.model,
    preset.parameters,
    preset.id,
    undefined,
    Object.entries(preset.parameters).reduce(
      (acc, [key]) => ({ ...acc, [key]: { source: 'preset', origin: preset.id } }),
      {}
    )
  );
}

export default function HomePage() {
  const [builder, setBuilder] = useState<BuilderState>(stateFromPreset(ALL_PRESETS[0].id));
  const [tab, setTab] = useState<'json' | 'yaml' | 'markdown' | 'natural'>('json');

  // Set state when preset dropdown changes.
  function handlePresetChange(id: string) {
    setBuilder(stateFromPreset(id));
  }

  // Change a builder parameter, record field-level provenance.
  function handleParamChange(field: keyof BuilderState['parameters'], value: string) {
    setBuilder((old) => ({
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

  return (
    <main className="max-w-3xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">🎬 Video Prompt Builder</h1>
        <ThemeToggle />
      </header>
      <section className="mb-8 p-4 bg-muted rounded-lg">
        <label className="block mb-2 font-medium text-lg">Preset:</label>
        <select
          className="py-2 px-3 border rounded-md bg-background"
          value={builder.presetId}
          onChange={e => handlePresetChange(e.target.value)}
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
                value={value ?? ''}
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
      </section>
      <section className="mb-8">
        <Button onClick={handleCopyAll}>Copy All Outputs</Button>
      </section>
      <Tabs value={tab} onValueChange={(t) => setTab(t as any)}>
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
              actions={{ onCopy: () => navigator.clipboard.writeText(outputs[f]) }}
            />
          </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
