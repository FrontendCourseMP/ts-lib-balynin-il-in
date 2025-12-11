export type FieldValue = string | number | string[];

export type ValidationRule = {
  validator: (value: FieldValue) => boolean;
  errorMessage: string;
};

export type FieldConfig = {
  rules: ValidationRule[];
  errorContainer?: HTMLElement | string;
};

export interface ValidatorOptions {
  suppressWarnings?: boolean;
  validateOnBlur?: boolean;
  validateOnInput?: boolean;
  errorClass?: string;
  successClass?: string;
}

export interface FieldState {
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  errorContainer: HTMLElement;
  isValid: boolean;
  rules: ValidationRule[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

export type ConstraintValidationAttributes = {
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  type?: string;
  step?: number;
};

export type ValidatorFunction = (
  value: FieldValue,
  params?: number | string | boolean
) => boolean;
