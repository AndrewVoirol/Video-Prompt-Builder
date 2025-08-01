"use client";

import { useState } from "react";
import {
  Moon,
  Sun,
  Palette,
  Check,
  Copy,
  Sparkles,
  Monitor,
} from "lucide-react";
import { useDualTheme } from "@/hooks/use-dual-theme";
import { themes } from "@/lib/themes";

// Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function ComprehensiveThemeTest() {
  const { colorScheme, mode, setColorScheme, toggleMode, mounted } =
    useDualTheme();
  const [selectedValue, setSelectedValue] = useState("option1");
  const [switchValue, setSwitchValue] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleThemeChange = (newTheme: string) => {
    setColorScheme(newTheme as "monogeist" | "kodama-grove" | "cyber-punk");
  };

  const toggleDarkMode = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Extract click coordinates and pass them to toggleMode
    const { clientX: x, clientY: y } = e;
    toggleMode({ x, y });
  };

  const copyThemeInfo = () => {
    const themeInfo = `Theme: ${colorScheme}\nMode: ${mode}`;
    navigator.clipboard.writeText(themeInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentThemeInfo =
    themes.find((t) => t.value === colorScheme) || themes[0];

  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Animated Background Pattern */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-pulse delay-700" />
        </div>

        <div className="container mx-auto p-8 space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Theme Showcase
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the beauty of MONOGEIST, KODAMA GROVE, and CYBER PUNK
              themes with seamless light and dark mode transitions
            </p>
          </div>

          {/* Theme Controls Card */}
          <Card className="border-2 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Theme Configuration
              </CardTitle>
              <CardDescription>
                Customize your visual experience with our theme system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selector */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Color Scheme</Label>
                  <Select value={colorScheme} onValueChange={handleThemeChange}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.value} value={theme.value}>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{
                                  backgroundColor: theme.preview.primary,
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{
                                  backgroundColor: theme.preview.secondary,
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{
                                  backgroundColor: theme.preview.accent,
                                }}
                              />
                            </div>
                            <span>{theme.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dark Mode Toggle */}
                <div className="space-y-3">
                  <Label>Appearance Mode</Label>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={toggleDarkMode}
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {mode === "dark" ? (
                          <>
                            <Moon className="h-4 w-4" />
                            Dark Mode
                          </>
                        ) : (
                          <>
                            <Sun className="h-4 w-4" />
                            Light Mode
                          </>
                        )}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {mode === "dark" ? "ON" : "OFF"}
                      </Badge>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Current Theme Info */}
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Current Configuration</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {currentThemeInfo?.name || "Unknown"} •{" "}
                      {mode === "dark" ? "Dark" : "Light"} Mode
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" onClick={copyThemeInfo}>
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Component Showcase */}
          <Tabs defaultValue="components" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
            </TabsList>

            {/* Components Tab */}
            <TabsContent value="components" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Buttons Showcase */}
                <Card>
                  <CardHeader>
                    <CardTitle>Button Variants</CardTitle>
                    <CardDescription>
                      All button styles with hover animations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button>Default</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="link">Link</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="icon">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges & Cards */}
                <Card>
                  <CardHeader>
                    <CardTitle>Badges & Status</CardTitle>
                    <CardDescription>
                      Various badge styles and states
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge>Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                    <Separator />
                    <Card className="border-dashed">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Nested card with dashed border style
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>

              {/* Interactive Elements */}
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Elements</CardTitle>
                  <CardDescription>
                    Switches, selects, and other controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="select-demo">Select Menu</Label>
                      <Select
                        value={selectedValue}
                        onValueChange={setSelectedValue}
                      >
                        <SelectTrigger id="select-demo">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">First Option</SelectItem>
                          <SelectItem value="option2">Second Option</SelectItem>
                          <SelectItem value="option3">Third Option</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="switch-demo">Toggle Switch</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="switch-demo"
                          checked={switchValue}
                          onCheckedChange={setSwitchValue}
                        />
                        <Label htmlFor="switch-demo" className="text-sm">
                          {switchValue ? "Enabled" : "Disabled"}
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tooltip Demo</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" className="w-full">
                            Hover for tooltip
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>This is a helpful tooltip!</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Forms Tab */}
            <TabsContent value="forms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Elements</CardTitle>
                  <CardDescription>
                    Input fields and form controls with validation states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="input-demo">Input Field</Label>
                      <Input
                        id="input-demo"
                        placeholder="Enter some text..."
                        className="transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="input-disabled">Disabled Input</Label>
                      <Input
                        id="input-disabled"
                        placeholder="This is disabled"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="textarea-demo">Textarea</Label>
                    <Textarea
                      id="textarea-demo"
                      placeholder="Type your message here..."
                      className="min-h-[100px] transition-all"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Overlays Tab */}
            <TabsContent value="overlays" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Popover Demo */}
                <Card>
                  <CardHeader>
                    <CardTitle>Popover</CardTitle>
                    <CardDescription>
                      Click to reveal floating content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Open Popover
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">
                              Dimensions
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Set the dimensions for the layer.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="width">Width</Label>
                              <Input
                                id="width"
                                defaultValue="100%"
                                className="col-span-2 h-8"
                              />
                            </div>
                            <div className="grid grid-cols-3 items-center gap-4">
                              <Label htmlFor="height">Height</Label>
                              <Input
                                id="height"
                                defaultValue="25px"
                                className="col-span-2 h-8"
                              />
                            </div>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </CardContent>
                </Card>

                {/* Dialog Demo */}
                <Card>
                  <CardHeader>
                    <CardTitle>Dialog</CardTitle>
                    <CardDescription>
                      Modal dialog with backdrop
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          Open Dialog
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => setDialogOpen(false)}
                          >
                            Delete Account
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Command Demo */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Command Menu</CardTitle>
                    <CardDescription>
                      Searchable command interface
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput placeholder="Type a command or search..." />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                          <CommandItem>
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Calendar</span>
                          </CommandItem>
                          <CommandItem>
                            <Monitor className="mr-2 h-4 w-4" />
                            <span>Search Emoji</span>
                          </CommandItem>
                          <CommandItem>
                            <Palette className="mr-2 h-4 w-4" />
                            <span>Calculator</span>
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <Card className="border-0 bg-muted/30">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Built with shadcn/ui components and TweakCN theming
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="link" size="sm">
                    Documentation
                  </Button>
                  <Button variant="link" size="sm">
                    GitHub
                  </Button>
                  <Button variant="link" size="sm">
                    Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
