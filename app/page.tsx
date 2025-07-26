'use client'
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tab';
import { Button } from '@/components/Button';
import { OutputCard } from '@/components/OutputCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ALL_PRESETS, getPresetById, VideoPreset } from '@/lib/presets';
import { toJson, toYaml, toMarkdown, toNatural, BuilderState, createBuilderState } from '@/lib/formatters';

const initialBuilderState: BuilderState = createBuilderState(
  '',                   // prompt (user input)
  ALL_PRESETS[0].model, // default model
  ALL_PRESETS[0].parameters,
  ALL_PRESETS[0].id,    // default presetId
  undefined,            // intentId (not used here yet)
  {}                    // provenance
);

export default function HomePage() {
  const [builder, setBuilder] = useState<BuilderState>(initialBuilderState);

  // Dropdown handling: When preset changes, fill state and update provenance
  function handlePresetChange(id: string) {
    const preset = getPresetById(id);
    if (preset) {
      setBuilder(
        createBuilderState(
          preset.promptTemplate, // templated prompt as starting point
          preset.model,
          preset.parameters,
          preset.id,
          undefined,
          Object.assign(
            {},
            ...Object.keys(preset.parameters).map((k) => ({
              [k]: { source: 'preset', origin: preset.id },
            }))
          )
        )
      );
    }
  }

  // Manual builder change marks provenance as 'user'
  function handleBuilderField(field: keyof BuilderState['parameters'], value: string | number) {
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
    <div>
      <h1 className="mb-8">Video Prompt Builder</h1>
      <div className="mb-6">
        <label>Preset:&nbsp;
          <select
            value={builder.presetId}
            onChange={e => handlePresetChange(e.target.value)}
          >
            {ALL_PRESETS.map(preset =>
              <option value={preset.id} key={preset.id}>{preset.name}</option>
            )}
          </select>
        </label>
        &nbsp;&nbsp;
        <div>
          {/* Example mapping all possible builder fields */}
          {Object.entries(builder.parameters).map(([field, value]) =>
            <div key={field}>
              <label>{field}&nbsp;
                <input
                  value={value || ''}
                  onChange={e => handleBuilderField(field as any, e.target.value)}
                />
              </label>
              {/* Provenance badge */}
              <span className="badge badge-sm badge-info ml-2">
                {builder.provenance[field]?.source || '—'}
                {builder.provenance[field]?.origin ? ` (${builder.provenance[field]?.origin})` : ''}
                {builder.provenance[field]?.modified ? ' (customized)' : ''}
              </span>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleCopyAll}>Copy All Outputs</Button>
          <ThemeToggle />
        </div>
      </div>

      <Tabs defaultValue="json">
        <TabsList>
          {['json', 'yaml', 'markdown', 'natural'].map(f =>
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
    </div>
  );
}
