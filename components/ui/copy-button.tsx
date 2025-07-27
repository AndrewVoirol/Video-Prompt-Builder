"use client"

import * as React from "react"
import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  src?: string
  event?: string
}

export async function copyToClipboardWithMeta(value: string, event?: string) {
  navigator.clipboard.writeText(value)
  if (event) {
    // Analytics tracking could be added here if needed
    console.log(`Copy event: ${event}`)
  }
}

export function CopyButton({
  value,
  className,
  src,
  event,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }, [hasCopied])

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "relative z-10 h-6 w-6 text-zinc-50 hover:bg-zinc-700 hover:text-zinc-50",
        className
      )}
      onClick={() => {
        copyToClipboardWithMeta(
          value,
          event ? `${event}_${src || ""}` : undefined
        )
        setHasCopied(true)
        toast.success("Copied to clipboard")
      }}
      aria-label={hasCopied ? "Copied to clipboard" : "Copy to clipboard"}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
    </Button>
  )
}
