/**
 * Video Prompt Builder - Output Formatters
 * Format builder state to various output formats with provenance tracking
 */

// Builder state interface for type safety
export interface BuilderState {
  prompt: string;
  model: string;
  presetId: string | undefined;
  intentId: string | undefined;
  parameters: {
    style?: string;
    quality?: string;
    duration?: number;
    aspectRatio?: string;
    fps?: number;
    resolution?: string;
    motionIntensity?: string;
    cameraMovement?: string;
    lighting?: string;
    colorGrading?: string;
  };
  metadata: {
    timestamp: string;
    version: string;
    userId?: string;
  };
  provenance: {
    [field: string]: {
      source: "user" | "preset" | "intent" | "generated";
      origin?: string; // preset/intent ID or other source identifier
      modified?: boolean;
    };
  };
}

// JSON formatter with full state representation
export function toJson(state: BuilderState): string {
  return JSON.stringify(state, null, 2);
}

// YAML formatter for human-readable configuration
export function toYaml(state: BuilderState): string {
  const yamlLines: string[] = [];

  yamlLines.push("# Video Prompt Configuration");
  yamlLines.push(`# Generated: ${state.metadata.timestamp}`);
  yamlLines.push("");

  yamlLines.push("prompt: >");
  yamlLines.push(`  ${state.prompt}`);
  yamlLines.push("");

  yamlLines.push("model:");
  yamlLines.push(`  name: ${state.model}`);
  yamlLines.push("");

  if (Object.keys(state.parameters).length > 0) {
    yamlLines.push("parameters:");
    Object.entries(state.parameters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        yamlLines.push(`  ${key}: ${value}`);
      }
    });
    yamlLines.push("");
  }

  yamlLines.push("metadata:");
  yamlLines.push(`  timestamp: ${state.metadata.timestamp}`);
  yamlLines.push(`  version: ${state.metadata.version}`);
  if (state.presetId) yamlLines.push(`  preset: ${state.presetId}`);
  if (state.intentId) yamlLines.push(`  intent: ${state.intentId}`);

  return yamlLines.join("\n");
}

// Markdown formatter for documentation and sharing
export function toMarkdown(state: BuilderState): string {
  const lines: string[] = [];

  lines.push("# Video Prompt Configuration");
  lines.push("");
  lines.push(`**Generated:** ${state.metadata.timestamp}`);
  lines.push(`**Model:** ${state.model}`);
  if (state.presetId) lines.push(`**Preset:** ${state.presetId}`);
  if (state.intentId) lines.push(`**Intent:** ${state.intentId}`);
  lines.push("");

  lines.push("## Prompt");
  lines.push("");
  lines.push("```");
  lines.push(state.prompt);
  lines.push("```");
  lines.push("");

  if (Object.keys(state.parameters).length > 0) {
    lines.push("## Parameters");
    lines.push("");
    Object.entries(state.parameters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const provenance = state.provenance[key];
        const sourceInfo = provenance
          ? ` *(${provenance.source}${provenance.origin ? `: ${provenance.origin}` : ""}${provenance.modified ? ", modified" : ""})*`
          : "";
        lines.push(`- **${key}:** ${value}${sourceInfo}`);
      }
    });
    lines.push("");
  }

  // Add provenance section if there are tracked changes
  const provenanceEntries = Object.entries(state.provenance).filter(
    ([, prov]) => prov.source !== "user",
  );
  if (provenanceEntries.length > 0) {
    lines.push("## Field Provenance");
    lines.push("");
    provenanceEntries.forEach(([field, prov]) => {
      lines.push(
        `- **${field}:** ${prov.source}${prov.origin ? ` (${prov.origin})` : ""}${prov.modified ? " - modified by user" : ""}`,
      );
    });
    lines.push("");
  }

  return lines.join("\n");
}

// Natural language formatter for human consumption
export function toNatural(state: BuilderState): string {
  const parts: string[] = [];

  // Opening
  parts.push(`This video prompt was created for the ${state.model} model`);
  if (state.presetId) {
    parts.push(` using the "${state.presetId}" preset`);
  }
  if (state.intentId) {
    parts.push(` with "${state.intentId}" intent`);
  }
  parts.push(` on ${new Date(state.metadata.timestamp).toLocaleString()}.`);

  // Main prompt
  parts.push("\n\n**The prompt reads:**\n");
  parts.push(`"${state.prompt}"`);

  // Technical parameters in natural language
  const params = state.parameters;
  const naturalParams: string[] = [];

  if (params.quality) naturalParams.push(`${params.quality} quality`);
  if (params.resolution) naturalParams.push(`${params.resolution} resolution`);
  if (params.fps) naturalParams.push(`${params.fps} frames per second`);
  if (params.duration) naturalParams.push(`${params.duration} seconds long`);
  if (params.aspectRatio)
    naturalParams.push(`${params.aspectRatio} aspect ratio`);
  if (params.cameraMovement)
    naturalParams.push(`${params.cameraMovement} camera movement`);
  if (params.lighting) naturalParams.push(`${params.lighting} lighting`);
  if (params.motionIntensity)
    naturalParams.push(`${params.motionIntensity} motion intensity`);
  if (params.colorGrading)
    naturalParams.push(`${params.colorGrading} color grading`);

  if (naturalParams.length > 0) {
    parts.push("\n\n**Technical specifications include:**\n");
    if (naturalParams.length === 1) {
      const firstParam = naturalParams[0];
      if (firstParam) {
        parts.push(firstParam);
      }
    } else if (naturalParams.length === 2) {
      const firstParam = naturalParams[0];
      const secondParam = naturalParams[1];
      if (firstParam && secondParam) {
        parts.push(`${firstParam} and ${secondParam}`);
      }
    } else {
      const lastParam = naturalParams.pop();
      if (lastParam) {
        parts.push(`${naturalParams.join(", ")}, and ${lastParam}`);
      }
    }
    parts.push(".");
  }

  // Provenance information in natural language
  const provenanceInfo: string[] = [];
  Object.entries(state.provenance).forEach(([field, prov]) => {
    if (prov.source === "preset" && prov.origin) {
      provenanceInfo.push(`${field} from "${prov.origin}" preset`);
    } else if (prov.source === "intent" && prov.origin) {
      provenanceInfo.push(`${field} from "${prov.origin}" intent`);
    }
    if (prov.modified) {
      provenanceInfo.push(`${field} was customized by the user`);
    }
  });

  if (provenanceInfo.length > 0) {
    parts.push("\n\n**Configuration details:**\n");
    provenanceInfo.forEach((info) => parts.push(`• ${info}\n`));
  }

  return parts.join("");
}

// Utility to create builder state with provenance tracking
export function createBuilderState(
  prompt: string,
  model: string,
  parameters: BuilderState["parameters"] = {},
  presetId?: string,
  intentId?: string,
  provenance: BuilderState["provenance"] = {},
  timestamp?: string,
): BuilderState {
  return {
    prompt,
    model,
    presetId,
    intentId,
    parameters,
    metadata: {
      timestamp: timestamp || new Date().toISOString(),
      version: "1.0.0",
    },
    provenance,
  };
}

// Export all formatters as a collection
export const formatters = {
  json: toJson,
  yaml: toYaml,
  markdown: toMarkdown,
  natural: toNatural,
} as const;

export type FormatType = keyof typeof formatters;

// Default export for convenience
export default formatters;
