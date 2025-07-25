'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tab';
import { Button } from '@/components/Button';
import { OutputCard } from '@/components/OutputCard';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const [promptText, setPromptText] = useState('');
  const [activeModel, setActiveModel] = useState('sora');
  const [generatedOutput, setGeneratedOutput] = useState<{
    content: string;
    timestamp: string;
    model: string;
  } | null>(null);

  const handleGenerate = () => {
    if (!promptText.trim()) return;
    
    setGeneratedOutput({
      content: promptText,
      timestamp: new Date().toLocaleString(),
      model: activeModel
    });
  };

  const handleCopy = () => {
    console.log('Content copied to clipboard!');
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VP</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              Video Prompt Builder
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Create Amazing Video Prompts
            </h2>
            <p className="text-muted-foreground">
              Build and customize prompts for AI video generation models
            </p>
          </div>

          {/* Tabbed Interface */}
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="builder">Prompt Builder</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Prompt Builder Tab */}
            <TabsContent value="builder" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Build Your Prompt</h3>
                    
                    {/* Model Selection */}
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-medium">AI Model</label>
                      <div className="flex flex-wrap gap-2">
                        {['sora', 'runway', 'pika', 'stable-video'].map((model) => (
                          <Button
                            key={model}
                            variant={activeModel === model ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => setActiveModel(model)}
                          >
                            {model.charAt(0).toUpperCase() + model.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Prompt Input */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Prompt Text</label>
                      <textarea
                        className="w-full min-h-[200px] p-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        placeholder="Describe the video you want to generate...\n\nExample: A golden retriever running through a sunlit meadow, slow motion, cinematic lighting, high quality, 4K resolution"
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handleGenerate}
                        disabled={!promptText.trim()}
                        className="flex-1"
                      >
                        Generate Preview
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setPromptText('')}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Output Panel */}
                <div className="space-y-4">
                  {generatedOutput ? (
                    <OutputCard
                      title="Generated Prompt Preview"
                      content={generatedOutput.content}
                      metadata={{
                        timestamp: generatedOutput.timestamp,
                        model: generatedOutput.model,
                        tokens: generatedOutput.content.length
                      }}
                      actions={{
                        onCopy: handleCopy,
                        onRegenerate: handleRegenerate
                      }}
                    >
                      <div className="text-sm text-muted-foreground">
                        This is a preview of your video prompt. Use this with your chosen AI video generation platform.
                      </div>
                    </OutputCard>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-muted-foreground">
                          Preview Area
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your generated prompt will appear here
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Examples Tab */}
            <TabsContent value="examples" className="space-y-4">
              <div className="grid gap-4">
                <h3 className="text-lg font-semibold">Example Prompts</h3>
                
                {[
                  {
                    title: "Nature Scene",
                    prompt: "A majestic waterfall cascading down moss-covered rocks in a lush forest, morning mist, golden hour lighting, birds flying in the distance, 4K cinematic quality"
                  },
                  {
                    title: "Urban Life",
                    prompt: "Busy city street at night, neon lights reflecting on wet pavement, people walking with umbrellas, rain drops visible, shallow depth of field, cyberpunk aesthetic"
                  },
                  {
                    title: "Space Adventure",
                    prompt: "Astronaut floating in space near a colorful nebula, Earth visible in the background, realistic physics, dramatic lighting, space debris floating by, ultra-high definition"
                  }
                ].map((example, index) => (
                  <div key={index} className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-medium mb-2">{example.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{example.prompt}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPromptText(example.prompt)}
                    >
                      Use This Prompt
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Application Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Theme</h4>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark modes
                      </p>
                    </div>
                    <ThemeToggle />
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">
                      Video Prompt Builder v1.0.0 - A tool for creating optimized prompts for AI video generation platforms.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
