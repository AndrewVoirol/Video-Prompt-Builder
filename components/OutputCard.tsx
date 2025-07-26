import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OutputCardProps {
  title: string;
  content: string;
  metadata?: {
    timestamp?: string;
    model?: string;
    duration?: string;
    tokens?: number;
  };
  actions?: {
    onCopy?: () => void;
    onDownload?: () => void;
    onShare?: () => void;
    onRegenerate?: () => void;
  };
  className?: string;
  children?: React.ReactNode;
}

const OutputCard: React.FC<OutputCardProps> = ({
  title,
  content,
  metadata,
  actions,
  className,
  children
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      actions?.onCopy?.();
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {metadata?.model && <CardDescription>Model: {metadata.model}</CardDescription>}
        <CardAction>
          <div className="flex gap-2">
            {actions?.onCopy && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
                aria-label="Copy to clipboard"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </Button>
            )}
            {actions?.onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={actions.onShare}
                className="h-8 w-8 p-0"
                aria-label="Share"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </Button>
            )}
            {actions?.onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={actions.onDownload}
                className="h-8 w-8 p-0"
                aria-label="Download"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </Button>
            )}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="rounded-md bg-muted p-3 font-mono text-sm">
          <pre className="whitespace-pre-wrap break-words">{content}</pre>
        </div>
        {children && <div className="mt-3">{children}</div>}
      </CardContent>

      {(metadata || actions?.onRegenerate) && (
        <CardFooter className="flex items-center justify-between border-t">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {metadata?.timestamp && (
              <Badge variant="outline">Generated: {metadata.timestamp}</Badge>
            )}
            {metadata?.duration && <Badge variant="outline">Duration: {metadata.duration}</Badge>}
            {metadata?.tokens && <Badge variant="outline">Tokens: {metadata.tokens}</Badge>}
          </div>
          {actions?.onRegenerate && (
            <Button
              variant="outline"
              size="sm"
              onClick={actions.onRegenerate}
            >
              Regenerate
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export { OutputCard };
export type { OutputCardProps };
