#!/usr/bin/env node

/**
 * Schema Validation CLI Tool
 * Validates configuration files against their schemas
 */

import { z } from "zod";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { VIDEO_PRESETS } from "../lib/presets.js";
import { VIDEO_INTENTS } from "../lib/intents.js";

// Define schemas for validation
const VideoPresetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1),
  prompt: z.string().min(1),
  parameters: z.object({
    duration: z.number().min(1).max(300).optional(),
    aspectRatio: z.string().optional(),
    style: z.string().optional(),
    quality: z.string().optional(),
    motion: z.string().optional(),
  }),
  examples: z.array(z.string()).optional(),
});

const VideoIntentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  keywords: z.array(z.string()).min(1),
  promptTemplate: z.string().min(1),
  defaultParameters: z.object({
    duration: z.number().min(1).max(300).optional(),
    aspectRatio: z.string().optional(),
    style: z.string().optional(),
    quality: z.string().optional(),
    motion: z.string().optional(),
  }),
  examples: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
      }),
    )
    .optional(),
});

const PackageJsonSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  scripts: z.record(z.string()).optional(),
  dependencies: z.record(z.string()).optional(),
  devDependencies: z.record(z.string()).optional(),
  type: z.enum(["module", "commonjs"]).optional(),
  engines: z
    .object({
      node: z.string().optional(),
    })
    .optional(),
});

interface ValidationResult {
  file: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

class ConfigValidator {
  private results: ValidationResult[] = [];

  async validatePresets(): Promise<ValidationResult> {
    const result: ValidationResult = {
      file: "lib/presets.ts",
      valid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Validate each preset
      for (const [index, preset] of VIDEO_PRESETS.entries()) {
        try {
          VideoPresetSchema.parse(preset);
        } catch (error) {
          result.valid = false;
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              result.errors.push(
                `Preset ${index} (${preset.id || "unknown"}): ${err.path.join(".")} - ${err.message}`,
              );
            });
          }
        }
      }

      // Check for duplicate IDs
      const ids = VIDEO_PRESETS.map((p) => p.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        result.valid = false;
        result.errors.push(
          `Duplicate preset IDs found: ${duplicateIds.join(", ")}`,
        );
      }

      // Check for reasonable preset count
      if (VIDEO_PRESETS.length < 3) {
        result.warnings.push("Consider adding more presets for better variety");
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to load presets: ${error}`);
    }

    return result;
  }

  async validateIntents(): Promise<ValidationResult> {
    const result: ValidationResult = {
      file: "lib/intents.ts",
      valid: true,
      errors: [],
      warnings: [],
    };

    try {
      // Validate each intent
      for (const [index, intent] of VIDEO_INTENTS.entries()) {
        try {
          VideoIntentSchema.parse(intent);
        } catch (error) {
          result.valid = false;
          if (error instanceof z.ZodError) {
            error.errors.forEach((err) => {
              result.errors.push(
                `Intent ${index} (${intent.id || "unknown"}): ${err.path.join(".")} - ${err.message}`,
              );
            });
          }
        }
      }

      // Check for duplicate IDs
      const ids = VIDEO_INTENTS.map((i) => i.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        result.valid = false;
        result.errors.push(
          `Duplicate intent IDs found: ${duplicateIds.join(", ")}`,
        );
      }

      // Check for template variable consistency
      VIDEO_INTENTS.forEach((intent) => {
        const templateVars = intent.promptTemplate.match(/{([^}]+)}/g) || [];
        if (templateVars.length === 0) {
          result.warnings.push(
            `Intent ${intent.id}: No template variables found in promptTemplate`,
          );
        }
      });
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to load intents: ${error}`);
    }

    return result;
  }

  async validatePackageJson(): Promise<ValidationResult> {
    const result: ValidationResult = {
      file: "package.json",
      valid: true,
      errors: [],
      warnings: [],
    };

    try {
      const packagePath = join(process.cwd(), "package.json");
      if (!existsSync(packagePath)) {
        result.valid = false;
        result.errors.push("package.json not found");
        return result;
      }

      const packageContent = readFileSync(packagePath, "utf-8");
      const packageJson = JSON.parse(packageContent);

      try {
        PackageJsonSchema.parse(packageJson);
      } catch (error) {
        result.valid = false;
        if (error instanceof z.ZodError) {
          error.errors.forEach((err) => {
            result.errors.push(`${err.path.join(".")}: ${err.message}`);
          });
        }
      }

      // Check for required scripts
      const requiredScripts = ["dev", "build", "start", "lint", "type-check"];
      const missingScripts = requiredScripts.filter(
        (script) => !packageJson.scripts || !packageJson.scripts[script],
      );
      if (missingScripts.length > 0) {
        result.warnings.push(
          `Missing recommended scripts: ${missingScripts.join(", ")}`,
        );
      }

      // Check for Next.js dependency
      if (!packageJson.dependencies?.next) {
        result.warnings.push("Next.js dependency not found");
      }

      // Check for TypeScript dependencies
      if (
        !packageJson.devDependencies?.typescript &&
        !packageJson.dependencies?.typescript
      ) {
        result.warnings.push("TypeScript dependency not found");
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to parse package.json: ${error}`);
    }

    return result;
  }

  async validateTsConfig(): Promise<ValidationResult> {
    const result: ValidationResult = {
      file: "tsconfig.json",
      valid: true,
      errors: [],
      warnings: [],
    };

    try {
      const tsconfigPath = join(process.cwd(), "tsconfig.json");
      if (!existsSync(tsconfigPath)) {
        result.valid = false;
        result.errors.push("tsconfig.json not found");
        return result;
      }

      const tsconfigContent = readFileSync(tsconfigPath, "utf-8");
      const tsconfig = JSON.parse(tsconfigContent);

      // Check for essential compiler options
      const compilerOptions = tsconfig.compilerOptions || {};

      if (!compilerOptions.target) {
        result.warnings.push("No target specified in compilerOptions");
      }

      if (!compilerOptions.module) {
        result.warnings.push("No module system specified in compilerOptions");
      }

      if (compilerOptions.strict !== true) {
        result.warnings.push(
          "Strict mode not enabled - recommended for better type safety",
        );
      }

      // Check for Next.js specific settings
      if (!compilerOptions.jsx) {
        result.warnings.push("JSX setting not found - required for Next.js");
      }

      if (
        !tsconfig.include ||
        (!tsconfig.include.includes("**/*.ts") &&
          !tsconfig.include.includes("**/*.tsx"))
      ) {
        result.warnings.push(
          "Include patterns may not cover all TypeScript files",
        );
      }
    } catch (error) {
      result.valid = false;
      result.errors.push(`Failed to parse tsconfig.json: ${error}`);
    }

    return result;
  }

  async validateAll(): Promise<ValidationResult[]> {
    console.log("🔍 Validating configuration files...\n");

    const validations = [
      this.validatePresets(),
      this.validateIntents(),
      this.validatePackageJson(),
      this.validateTsConfig(),
    ];

    this.results = await Promise.all(validations);
    return this.results;
  }

  printResults(): void {
    let hasErrors = false;
    let hasWarnings = false;

    this.results.forEach((result) => {
      console.log(`📄 ${result.file}`);

      if (
        result.valid &&
        result.errors.length === 0 &&
        result.warnings.length === 0
      ) {
        console.log("  ✅ Valid\n");
        return;
      }

      if (result.errors.length > 0) {
        hasErrors = true;
        console.log("  ❌ Errors:");
        result.errors.forEach((error) => console.log(`    • ${error}`));
      }

      if (result.warnings.length > 0) {
        hasWarnings = true;
        console.log("  ⚠️  Warnings:");
        result.warnings.forEach((warning) => console.log(`    • ${warning}`));
      }

      console.log("");
    });

    // Summary
    const totalFiles = this.results.length;
    const validFiles = this.results.filter(
      (r) => r.valid && r.errors.length === 0,
    ).length;
    const filesWithWarnings = this.results.filter(
      (r) => r.warnings.length > 0,
    ).length;
    const filesWithErrors = this.results.filter(
      (r) => r.errors.length > 0,
    ).length;

    console.log("📊 Summary:");
    console.log(`  Total files: ${totalFiles}`);
    console.log(`  Valid: ${validFiles}`);
    console.log(`  With warnings: ${filesWithWarnings}`);
    console.log(`  With errors: ${filesWithErrors}`);

    if (hasErrors) {
      console.log("\n❌ Validation failed. Please fix the errors above.");
      process.exit(1);
    } else if (hasWarnings) {
      console.log("\n⚠️  Validation passed with warnings.");
      process.exit(0);
    } else {
      console.log("\n✅ All configurations are valid!");
      process.exit(0);
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const validator = new ConfigValidator();

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🔍 Configuration Validator

Usage:
  pnpm validate-configs [options]

Options:
  --help, -h     Show this help message
  --presets      Validate only presets
  --intents      Validate only intents
  --package      Validate only package.json
  --tsconfig     Validate only tsconfig.json

Examples:
  pnpm validate-configs           # Validate all configs
  pnpm validate-configs --presets # Validate only presets
`);
    process.exit(0);
  }

  try {
    if (args.includes("--presets")) {
      const result = await validator.validatePresets();
      validator.results = [result];
    } else if (args.includes("--intents")) {
      const result = await validator.validateIntents();
      validator.results = [result];
    } else if (args.includes("--package")) {
      const result = await validator.validatePackageJson();
      validator.results = [result];
    } else if (args.includes("--tsconfig")) {
      const result = await validator.validateTsConfig();
      validator.results = [result];
    } else {
      await validator.validateAll();
    }

    validator.printResults();
  } catch (error) {
    console.error("❌ Validation failed:", error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ConfigValidator, VideoPresetSchema, VideoIntentSchema };
