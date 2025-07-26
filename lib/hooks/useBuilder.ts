import { useState } from 'react';

/**
 * Builder field configuration interface
 */
export interface BuilderField {
  /** Unique identifier for the field */
  id: string;
  /** Display label for the field */
  label: string;
  /** Field input type */
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea';
  /** Current field value */
  value: string | number | boolean;
  /** Whether the field is required */
  required?: boolean;
  /** Field validation rules */
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: string | number | boolean) => boolean;
  };
  /** Options for select type fields */
  options?: { label: string; value: string | number }[];
  /** Field placeholder text */
  placeholder?: string;
  /** Field help text */
  helpText?: string;
}

/**
 * Builder output configuration interface
 */
export interface BuilderOutput {
  /** Unique identifier for the output */
  id: string;
  /** Output display name */
  name: string;
  /** Generated output content */
  content: string;
  /** Output format type */
  format: 'text' | 'json' | 'xml' | 'markdown' | 'html';
  /** Timestamp of last generation */
  lastGenerated?: Date;
  /** Output validation status */
  isValid: boolean;
  /** Associated metadata */
  metadata?: Record<string, string | number | boolean>;
}

/**
 * Builder step configuration interface
 */
export interface BuilderStep {
  /** Unique step identifier */
  id: string;
  /** Step display title */
  title: string;
  /** Step description */
  description?: string;
  /** Whether step is completed */
  completed: boolean;
  /** Whether step is currently active */
  active: boolean;
  /** Step validation status */
  isValid: boolean;
  /** Associated field IDs for this step */
  fieldIds: string[];
}

/**
 * Hook return type interface
 */
export interface UseBuilderReturn {
  /** Array of builder fields */
  fields: BuilderField[];
  /** Function to update fields */
  setFields: React.Dispatch<React.SetStateAction<BuilderField[]>>;
  /** Array of builder outputs */
  outputs: BuilderOutput[];
  /** Function to update outputs */
  setOutputs: React.Dispatch<React.SetStateAction<BuilderOutput[]>>;
  /** Current builder step */
  step: BuilderStep | null;
  /** Function to update current step */
  setStep: React.Dispatch<React.SetStateAction<BuilderStep | null>>;
}

/**
 * Custom React hook for managing modular builder state
 * 
 * Provides centralized state management for builder components including
 * form fields, outputs, and step progression. This hook is designed to be
 * used within a builder context to maintain consistent state across
 * different builder components.
 * 
 * @example
 * ```tsx
 * function BuilderComponent() {
 *   const { fields, setFields, outputs, setOutputs, step, setStep } = useBuilder();
 *   
 *   const handleFieldUpdate = (fieldId: string, value: any) => {
 *     setFields(prev => prev.map(field => 
 *       field.id === fieldId ? { ...field, value } : field
 *     ));
 *   };
 *   
 *   return (
 *     <div>
 *       {fields.map(field => (
 *         <input 
 *           key={field.id}
 *           value={field.value}
 *           onChange={(e) => handleFieldUpdate(field.id, e.target.value)}
 *         />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @returns {UseBuilderReturn} Object containing builder state and setters
 * 
 * @since 1.0.0
 * @author AndrewVoirol
 */
export function useBuilder(): UseBuilderReturn {
  // Initialize fields with stubbed data
  const [fields, setFields] = useState<BuilderField[]>([
    {
      id: 'sample-text',
      label: 'Sample Text Field',
      type: 'text',
      value: '',
      required: true,
      placeholder: 'Enter text here...',
      helpText: 'This is a sample text field for demonstration'
    },
    {
      id: 'sample-number',
      label: 'Sample Number Field',
      type: 'number',
      value: 0,
      required: false,
      validation: {
        min: 0,
        max: 100
      },
      helpText: 'Enter a number between 0 and 100'
    },
    {
      id: 'sample-select',
      label: 'Sample Select Field',
      type: 'select',
      value: 'option1',
      required: true,
      options: [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' }
      ],
      helpText: 'Choose from available options'
    }
  ]);

  // Initialize outputs with stubbed data
  const [outputs, setOutputs] = useState<BuilderOutput[]>([
    {
      id: 'sample-output-1',
      name: 'Generated Text',
      content: 'This is sample generated content from the builder.',
      format: 'text',
      lastGenerated: new Date(),
      isValid: true,
      metadata: {
        wordCount: 10,
        characterCount: 52
      }
    },
    {
      id: 'sample-output-2',
      name: 'Configuration JSON',
      content: JSON.stringify({ config: 'sample', enabled: true }, null, 2),
      format: 'json',
      lastGenerated: new Date(),
      isValid: true,
      metadata: {
        size: '45 bytes'
      }
    }
  ]);

  // Initialize step with stubbed data
  const [step, setStep] = useState<BuilderStep | null>({
    id: 'step-1',
    title: 'Configuration Setup',
    description: 'Configure your builder settings and input fields',
    completed: false,
    active: true,
    isValid: false,
    fieldIds: ['sample-text', 'sample-number', 'sample-select']
  });

  return {
    fields,
    setFields,
    outputs,
    setOutputs,
    step,
    setStep
  };
}

// Export default for convenience
export default useBuilder;
