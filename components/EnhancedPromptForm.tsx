'use client'

import React, { useOptimistic, useTransition } from 'react'
import { useActionState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { savePromptAction, generatePromptAction } from '@/lib/actions'
import { BuilderState } from '@/lib/formatters'
import { ALL_PRESETS } from '@/lib/presets'

interface EnhancedPromptFormProps {
  initialBuilder: BuilderState
  onBuilderChange: (builder: BuilderState) => void
  className?: string
}

interface OptimisticUpdate {
  type: 'idle' | 'saving' | 'generating' | 'saved' | 'generated' | 'error'
  message?: string
  timestamp: number
}

/**
 * Enhanced form component using React 19 features:
 * - useOptimistic for optimistic UI updates
 * - useActionState for server action state management
 * - Server Actions for form submissions
 */
export function EnhancedPromptForm({ 
  initialBuilder, 
  onBuilderChange, 
  className 
}: EnhancedPromptFormProps) {
  const [isPending, startTransition] = useTransition()
  
  // Server action states using React 19's useActionState
  const [saveState, saveFormAction] = useActionState(savePromptAction, null)
  const [generateState, generateFormAction] = useActionState(generatePromptAction, null)
  
  // Optimistic state for UI updates
  const [optimisticState, addOptimistic] = useOptimistic(
    { type: 'idle' as const, message: '', timestamp: 0 },
    (state: OptimisticUpdate, newState: OptimisticUpdate) => newState
  )

  // Handle form field changes with optimistic updates
  const handleFieldChange = (field: string, value: string) => {
    startTransition(() => {
      // Optimistic update
      addOptimistic({
        type: 'saving',
        message: 'Updating...',
        timestamp: Date.now()
      })

      // Update actual state
      const updatedBuilder: BuilderState = {
        ...initialBuilder,
        parameters: { ...initialBuilder.parameters, [field]: value },
        provenance: {
          ...initialBuilder.provenance,
          [field]: { source: 'user', modified: true }
        }
      }
      onBuilderChange(updatedBuilder)

      // Clear optimistic state after a short delay
      setTimeout(() => {
        addOptimistic({
          type: 'saved',
          message: 'Updated',
          timestamp: Date.now()
        })
      }, 200)
    })
  }

  // Handle preset change with optimistic updates
  const handlePresetChange = (presetId: string) => {
    startTransition(() => {
      addOptimistic({
        type: 'saving',
        message: 'Loading preset...',
        timestamp: Date.now()
      })

      const preset = ALL_PRESETS.find(p => p.id === presetId)
      if (preset) {
        const updatedBuilder: BuilderState = {
          ...initialBuilder,
          presetId: preset.id,
          model: preset.model,
          prompt: preset.promptTemplate,
          parameters: { ...preset.parameters },
          provenance: Object.entries(preset.parameters).reduce(
            (acc, [key]) => ({ ...acc, [key]: { source: 'preset', origin: preset.id } }),
            {}
          )
        }
        onBuilderChange(updatedBuilder)

        setTimeout(() => {
          addOptimistic({
            type: 'generated',
            message: 'Preset loaded',
            timestamp: Date.now()
          })
        }, 300)
      }
    })
  }

  // Enhanced save with optimistic updates
  const handleSaveWithOptimistic = (formData: FormData) => {
    addOptimistic({
      type: 'saving',
      message: 'Saving prompt...',
      timestamp: Date.now()
    })
    saveFormAction(formData)
  }

  // Enhanced generate with optimistic updates
  const handleGenerateWithOptimistic = (formData: FormData) => {
    addOptimistic({
      type: 'generating',
      message: 'Generating output...',
      timestamp: Date.now()
    })
    generateFormAction(formData)
  }

  // Status indicator component
  const StatusIndicator = () => {
    if (isPending || optimisticState.type === 'saving' || optimisticState.type === 'generating') {
      return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>{optimisticState.message || 'Processing...'}</span>
        </div>
      )
    }

    if (saveState?.success || generateState?.success) {
      return (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{saveState?.message || generateState?.message}</span>
        </div>
      )
    }

    if (saveState?.success === false || generateState?.success === false) {
      return (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span>{saveState?.message || generateState?.message}</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Status indicator */}
      <div className="min-h-[1.5rem]">
        <StatusIndicator />
      </div>

      {/* Main form using Server Actions */}
      <form action={handleSaveWithOptimistic} className="space-y-6">
        {/* Preset Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Preset:</label>
          <select
            name="presetId"
            value={initialBuilder.presetId}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            disabled={isPending}
          >
            {ALL_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Model:</label>
          <input
            type="text"
            name="model"
            value={initialBuilder.model}
            onChange={(e) => handleFieldChange('model', e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            disabled={isPending}
          />
          {saveState?.errors?.model && (
            <p className="text-sm text-red-600">{saveState.errors.model[0]}</p>
          )}
        </div>

        {/* Prompt Template */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Prompt Template:</label>
          <textarea
            name="promptTemplate"
            value={initialBuilder.prompt}
            onChange={(e) => handleFieldChange('prompt', e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 min-h-[100px]"
            disabled={isPending}
          />
          {saveState?.errors?.promptTemplate && (
            <p className="text-sm text-red-600">{saveState.errors.promptTemplate[0]}</p>
          )}
        </div>

        {/* Dynamic Parameters */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Parameters</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(initialBuilder.parameters).map(([field, value]) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium capitalize">
                  {field}:
                </label>
                <div className="space-y-1">
                  <input
                    type="text"
                    value={typeof value === 'string' ? value : (typeof value === 'number' ? value.toString() : '')}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    disabled={isPending}
                  />
                  {/* Provenance badge with optimistic updates */}
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs bg-accent text-accent-foreground">
                      {initialBuilder.provenance[field]?.source ?? '—'}
                      {initialBuilder.provenance[field]?.origin ? ` (${initialBuilder.provenance[field]?.origin})` : ''}
                      {initialBuilder.provenance[field]?.modified ? ' (modified)' : ''}
                    </span>
                    {optimisticState.type === 'saving' && (
                      <span className="text-xs text-muted-foreground animate-pulse">
                        updating...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending && optimisticState.type === 'saving' ? 'Saving...' : 'Save Prompt'}
          </Button>
        </div>
      </form>

      {/* Generate Output Form */}
      <form action={handleGenerateWithOptimistic} className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-medium">Generate Output</h3>
        
        <input
          type="hidden"
          name="builderState"
          value={JSON.stringify(initialBuilder)}
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">Output Format:</label>
          <select
            name="outputFormat"
            className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
            disabled={isPending}
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="markdown">Markdown</option>
            <option value="natural">Natural Language</option>
          </select>
        </div>

        <Button
          type="submit"
          variant="secondary"
          disabled={isPending}
          className="min-w-[150px]"
        >
          {isPending && optimisticState.type === 'generating' ? 'Generating...' : 'Generate Output'}
        </Button>

        {/* Display generated content */}
        {generateState?.success && generateState.data && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
            <h4 className="font-medium mb-2">Generated Output:</h4>
            <pre className="text-sm whitespace-pre-wrap">{(generateState.data as { content: string }).content}</pre>
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Format: {(generateState.data as { format: string }).format} | Tokens: {(generateState.data as { tokens: number }).tokens}
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
