export type FieldType = 'text' | 'email' | 'password' | 'number' | 'checkbox' | 'radio' | 'tel' | 'url';

export type RuleType  = 
| 'required' 
| 'minLength' 
| 'maxLength' 
| 'min'
| 'max'
| 'pattern'
| 'email'
| 'custom'
| 'minCount'
| 'maxCount'

export type ValidationRule = {
  type: RuleType;
  value?: any;
  errorMessage?: string;
}

export type FieldConfig = {
  fieldName: string;
  rules: ValidationRule[];
}

export type FieldError = {
  fieldName: string;
  errors: string[];
}

export type ValidationResult = {
  isValid: boolean;
  errors: FieldError[];
}

export type JustIlindateOptions = {
  suppressWarnings?: boolean;
  validateOnBlur?: boolean;
  validateOnInput?: boolean;
  errorClass?: string;
  errorContainerClass?: string;
  locale?: string;
}

export type HTMLAttributes = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number | string;
  max?: number | string;
  pattern?: string;
  type?: string;
}

export type FieldMetaData = {
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  label: HTMLLabelElement | null;
  type: FieldType;
  htmlAttributes: HTMLAttributes;
  jsRules: ValidationRule[];
}

export type Warnings = {
  fieldName: string;
  message: string;
  type: 'attribute-mismatch' | 'missing-label'
}

export type CustomValidator = (value: any, rule: ValidationRule) => boolean | string;

export type ValidationFunctions = {
  [key:string]: CustomValidator;
}
