
export type ValidateRule =
  | { rule: 'required'; errorMessage: string }
  | { rule: 'minLength'; value: number; errorMessage: string }
  | { rule: 'maxLength'; value: number; errorMessage: string }
  | { rule: 'email'; errorMessage: string }
  | { rule: 'custom'; validator: (value: string) => boolean; errorMessage: string };

export interface FieldValidation {
  fieldName: string;
  rules: ValidateRule[];
};

export type ValidationSchema = FieldValidation[];
