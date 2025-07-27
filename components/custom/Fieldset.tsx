import { ReactNode } from 'react';

/**
 * Props interface for the Fieldset component
 */
export interface FieldsetProps {
  /** The legend text displayed at the top of the fieldset */
  legend: string;
  /** Child elements to be grouped within the fieldset */
  children: ReactNode;
}

/**
 * Fieldset component provides semantic grouping for related form elements.
 * 
 * This component serves as a wrapper for atomic fields in forms, using the HTML
 * <fieldset> element to provide semantic meaning and accessibility benefits.
 * The legend prop creates a <legend> element that describes the purpose of
 * the grouped fields.
 * 
 * @param props - The component props
 * @param props.legend - Text label describing the group of fields
 * @param props.children - Form elements to be grouped together
 * @returns A fieldset element containing the legend and child elements
 * 
 * @example
 * ```tsx
 * <Fieldset legend="Personal Information">
 *   <Field label="First Name" name="firstName" />
 *   <Field label="Last Name" name="lastName" />
 * </Fieldset>
 * ```
 */
export const Fieldset: React.FC<FieldsetProps> = ({ legend, children }) => {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export default Fieldset;
