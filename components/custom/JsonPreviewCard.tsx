"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface JsonPreviewCardProps {
  title: string;
  content: {
    json: string;
    yaml: string;
    markdown: string;
    natural: string;
  };
  metadata?: {
    timestamp?: string;
    model?: string;
    tokens?: number;
  };
  className?: string;
}

/**
 * JsonPreviewCard - Resizable preview card with multiple format outputs
 *
 * Features:
 * - Resizable panels for different content views
 * - Copy button with Sonner toast feedback
 * - Tabbed interface for different output formats
 * - Metadata display
 */
export function JsonPreviewCard({
  title,
  content,
  metadata,
  className,
}: JsonPreviewCardProps) {
  const [activeTab, setActiveTab] = React.useState<
    "json" | "yaml" | "markdown" | "natural"
  >("json");

  const handleCopyAll = () => {
    const allContent = Object.entries(content)
      .map(([format, text]) => `## ${format.toUpperCase()}\n${text}`)
      .join("\n\n");

    navigator.clipboard.writeText(allContent);
    toast.success("All formats copied to clipboard!");
  };

  return (
    <Card className={`h-full bg-[var(--surface-card)] ${className || ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              Copy All
            </Button>
            <CopyButton
              value={content[activeTab]}
              event={`copy_${activeTab}`}
            />
          </div>
        </div>
        {metadata && (
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            {metadata.model && <span>Model: {metadata.model}</span>}
            {metadata.tokens && <span>Tokens: {metadata.tokens}</span>}
            {metadata.timestamp && (
              <span>
                Updated: {new Date(metadata.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 h-full">
        <ResizablePanelGroup direction="vertical" className="h-full">
          <ResizablePanel defaultSize={20} minSize={15}>
            <div className="p-4 border-b border-[var(--border-color)]">
              <Tabs
                value={activeTab}
                onValueChange={(tab) =>
                  setActiveTab(tab as "json" | "yaml" | "markdown" | "natural")
                }
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="yaml">YAML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="natural">Natural</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={80} minSize={30}>
            <div className="p-4 h-full overflow-auto">
              <pre className="text-sm whitespace-pre-wrap font-mono bg-[var(--surface-muted)] text-[var(--text-primary)] p-4 rounded-md h-full overflow-auto">
                {content[activeTab]}
              </pre>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}

export default JsonPreviewCard;
