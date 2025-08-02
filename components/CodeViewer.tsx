"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import {
  oneDark,
  oneLight,
  atomDark,
  prism,
  vscDarkPlus,
  vs,
  coldarkDark,
  coldarkCold,
} from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Code2, Eye, EyeOff } from 'lucide-react';
import { useDualTheme } from '@/hooks/use-dual-theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  wrapLines?: boolean;
  className?: string;
  maxHeight?: string;
  customStyle?: Record<string, any>;
}

const languageMap: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  css: 'css',
  html: 'html',
  json: 'json',
  md: 'markdown',
  py: 'python',
  bash: 'bash',
  shell: 'bash',
};

const themeStyles = {
  light: {
    monogeist: oneLight,
    'kodama-grove': vs,
    'cyber-punk': coldarkCold,
  },
  dark: {
    monogeist: oneDark,
    'kodama-grove': atomDark,
    'cyber-punk': vscDarkPlus,
  },
};

const CodeViewer: React.FC<CodeViewerProps> = ({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
  wrapLines = false,
  className,
  maxHeight = '400px',
  customStyle = {},
}) => {
  const { colorScheme, mode } = useDualTheme();
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const normalizedLang = languageMap[selectedLang] || selectedLang;
  const currentTheme = themeStyles[mode]?.[colorScheme] || themeStyles[mode].monogeist;

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.warn('Failed to copy code:', err);
      // Still show success state as fallback might have worked
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Clean theme styles to avoid React background/backgroundColor conflicts
  const cleanThemeStyles = React.useMemo(() => {
    const cleaned = { ...currentTheme };
    
    // Clean ALL background-related properties from pre and code styles
    Object.keys(cleaned).forEach(key => {
      if (typeof cleaned[key] === 'object' && cleaned[key] !== null) {
        const { 
          background, 
          backgroundColor, 
          backgroundImage, 
          backgroundAttachment,
          backgroundClip,
          backgroundOrigin,
          backgroundPosition,
          backgroundRepeat,
          backgroundSize,
          ...rest 
        } = cleaned[key];
        cleaned[key] = rest;
      }
    });
    
    return cleaned;
  }, [currentTheme]);

  const codeStyle = {
    ...cleanThemeStyles,
    'pre[class*="language-"]': {
      ...cleanThemeStyles['pre[class*="language-"]'],
      backgroundColor: 'var(--color-surface-code)',
      border: '1px solid var(--color-border)',
      borderRadius: '8px',
      margin: 0,
      padding: '16px',
      fontSize: '14px',
      lineHeight: '1.5',
      maxHeight: isCollapsed ? '120px' : maxHeight,
      overflow: 'auto',
      ...customStyle,
    },
    'code[class*="language-"]': {
      ...cleanThemeStyles['code[class*="language-"]'],
      color: 'var(--color-foreground)',
      fontSize: '14px',
      fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    },
  };

  return (
    <Card className={cn('overflow-hidden', className)} id="demo-kibo-button">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">
              {title || `Code Preview`}
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {normalizedLang}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Select value={selectedLang} onValueChange={setSelectedLang}>
              <SelectTrigger className="w-20 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(languageMap).map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-xs">
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-7 w-7 p-0"
            >
              {isCollapsed ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 w-7 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <SyntaxHighlighter
            language={normalizedLang}
            style={codeStyle}
            showLineNumbers={showLineNumbers}
            wrapLines={wrapLines}
            customStyle={{
              margin: 0,
              borderRadius: 0,
              border: 'none',
            }}
          >
            {code}
          </SyntaxHighlighter>
          {isCollapsed && (
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[var(--color-surface-code)] to-transparent flex items-end justify-center pb-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                className="text-xs h-6 px-2"
              >
                Show more
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeViewer;

