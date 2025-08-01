"use server";

import { revalidatePath } from "next/cache";
import { BuilderState } from "@/lib/formatters";

/**
 * Server Actions for Video Prompt Builder
 * Using React 19 Server Actions for form submissions
 */

export interface PromptSubmissionResult {
  success: boolean;
  message: string;
  data?: unknown;
  errors?: Record<string, string[]>;
}

/**
 * Save prompt configuration server action
 */
export async function savePromptAction(
  prevState: PromptSubmissionResult | null,
  formData: FormData,
): Promise<PromptSubmissionResult> {
  try {
    // Extract form data
    const promptTemplate = formData.get("promptTemplate") as string;
    const model = formData.get("model") as string;
    const presetId = formData.get("presetId") as string;

    // Basic validation
    if (!promptTemplate?.trim()) {
      return {
        success: false,
        message: "Prompt template is required",
        errors: { promptTemplate: ["Prompt template cannot be empty"] },
      };
    }

    if (!model?.trim()) {
      return {
        success: false,
        message: "Model selection is required",
        errors: { model: ["Please select a model"] },
      };
    }

    // Simulate saving (in real app, would save to database/API)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simulate success response
    const savedData = {
      id: `prompt-${Date.now()}`,
      promptTemplate,
      model,
      presetId,
      createdAt: new Date().toISOString(),
    };

    // Revalidate the path to refresh data
    revalidatePath("/");

    return {
      success: true,
      message: "Prompt saved successfully!",
      data: savedData,
    };
  } catch (error) {
    console.error("Error saving prompt:", error);
    return {
      success: false,
      message: "Failed to save prompt. Please try again.",
    };
  }
}

/**
 * Generate prompt output server action
 */
export async function generatePromptAction(
  prevState: PromptSubmissionResult | null,
  formData: FormData,
): Promise<PromptSubmissionResult> {
  try {
    const builderStateJson = formData.get("builderState") as string;
    const outputFormat = formData.get("outputFormat") as string;

    if (!builderStateJson) {
      return {
        success: false,
        message: "Builder state is required",
      };
    }

    // Parse builder state
    const builderState: BuilderState = JSON.parse(builderStateJson);

    // Simulate generation process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate output based on format
    let generatedContent = "";
    switch (outputFormat) {
      case "json":
        generatedContent = JSON.stringify(builderState, null, 2);
        break;
      case "yaml":
        generatedContent = `# Generated YAML\nmodel: ${builderState.model}\ntemplate: "${builderState.prompt}"\nparameters:\n${Object.entries(
          builderState.parameters,
        )
          .map(([k, v]) => `  ${k}: ${v}`)
          .join("\n")}`;
        break;
      case "markdown":
        generatedContent = `# Video Prompt\n\nModel: ${builderState.model}\n\nTemplate: ${builderState.prompt}\n\n## Parameters\n${Object.entries(
          builderState.parameters,
        )
          .map(([k, v]) => `- **${k}**: ${v}`)
          .join("\n")}`;
        break;
      default:
        generatedContent = `Video prompt for ${builderState.model}: ${builderState.prompt}`;
    }

    return {
      success: true,
      message: "Prompt generated successfully!",
      data: {
        content: generatedContent,
        format: outputFormat,
        generatedAt: new Date().toISOString(),
        tokens: generatedContent.length, // Simple token count
      },
    };
  } catch (error) {
    console.error("Error generating prompt:", error);
    return {
      success: false,
      message: "Failed to generate prompt. Please try again.",
    };
  }
}

/**
 * Delete prompt server action
 */
export async function deletePromptAction(): Promise<PromptSubmissionResult> {
  try {
    // Simulate deletion
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Revalidate to refresh UI
    revalidatePath("/");

    return {
      success: true,
      message: "Prompt deleted successfully!",
    };
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return {
      success: false,
      message: "Failed to delete prompt. Please try again.",
    };
  }
}

/**
 * Bulk export prompts server action
 */
export async function exportPromptsAction(): Promise<PromptSubmissionResult> {
  try {
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 800));

    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      prompts: [], // Would contain actual prompts in real app
    };

    return {
      success: true,
      message: "Prompts exported successfully!",
      data: exportData,
    };
  } catch (error) {
    console.error("Error exporting prompts:", error);
    return {
      success: false,
      message: "Failed to export prompts. Please try again.",
    };
  }
}
