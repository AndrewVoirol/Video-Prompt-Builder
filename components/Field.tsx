import React from 'react';

/**
 * FieldProps interface defines the contract for atomic form field components.
 * This interface is designed to be extensible for various field types used in registry-driven forms.
 */
export interface FieldProps {
  /** The current value of the field */
  value: string | number | boolean;
  
  /** Display label for the field */
  label: string;
  
  /** Callback function triggered when the field value changes */
  onChange: (value: string | number | boolean) => void;
  
  /** Optional placeholder text for input fields */
  placeholder?: string;
  
  /** Whether the field is required */
  required?: boolean;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Error message to display */
  error?: string;
  
  /** Help text or description for the field */
  helpText?: string;
  
  /** Field type for different input variations */
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  
  /** Options for select fields */
  options?: Array<{ value: string | number; label: string }>;
  
  /** Additional CSS class names */
  className?: string;
  
  /** Unique identifier for the field */
  id?: string;
  
  /** Name attribute for form submission */
  name?: string;
}

/**
 * Field is an atomic form component designed for use in registry-driven form systems.
 * 
 * This component provides a consistent interface for various field types while maintaining
 * extensibility through props. It's intended to be used as a building block in dynamic
 * form generation where field definitions come from a registry or configuration.
 * 
 * @example
 * ```tsx
 * <Field
 *   value={fieldValue}
 *   label="Email Address"
 *   type="email"
 *   placeholder="Enter your email"
 *   onChange={(value) => setFieldValue(value)}
 *   required
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <Field
 *   value={selectedOption}
 *   label="Country"
 *   type="select"
 *   options={[
 *     { value: 'us', label: 'United States' },
 *     { value: 'ca', label: 'Canada' }
 *   ]}
 *   onChange={(value) => setSelectedOption(value)}
 * />
 * ```
 */
const Field: React.FC<FieldProps> = ({
  value,
  label,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  helpText,
  type = 'text',
  options = [],
  className = '',
  id,
  name
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const baseClassName = `field ${className}`;
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = type === 'checkbox' 
      ? (event.target as HTMLInputElement).checked
      : event.target.value;
    onChange(newValue);
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name || fieldId}
            value={value as string}
            placeholder={placeholder}
            onChange={handleInputChange}
            disabled={disabled}
            required={required}
            className={`field__textarea ${error ? 'field__textarea--error' : ''}`}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
        );
      
      case 'select':
        return (
          <select
            id={fieldId}
            name={name || fieldId}
            value={value as string}
            onChange={handleInputChange}
            disabled={disabled}
            required={required}
            className={`field__select ${error ? 'field__select--error' : ''}`}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          >
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={fieldId}
            name={name || fieldId}
            checked={value as boolean}
            onChange={handleInputChange}
            disabled={disabled}
            required={required}
            className={`field__checkbox ${error ? 'field__checkbox--error' : ''}`}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
        );
      
      default:
        return (
          <input
            type={type}
            id={fieldId}
            name={name || fieldId}
            value={value as string}
            placeholder={placeholder}
            onChange={handleInputChange}
            disabled={disabled}
            required={required}
            className={`field__input ${error ? 'field__input--error' : ''}`}
            aria-describedby={error ? `${fieldId}-error` : helpText ? `${fieldId}-help` : undefined}
          />
        );
    }
  };

  return (
    <div className={baseClassName}>
      <label htmlFor={fieldId} className="field__label">
        {label}
        {required && <span className="field__required" aria-label="required">*</span>}
      </label>
      
      {renderInput()}
      
      {helpText && (
        <div id={`${fieldId}-help`} className="field__help-text">
          {helpText}
        </div>
      )}
      
      {error && (
        <div id={`${fieldId}-error`} className="field__error" role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </div>
  );
};

export default Field;
