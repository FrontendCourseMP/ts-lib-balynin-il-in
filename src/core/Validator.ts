import type { ValidationRule, FieldType, CustomValidator } from '../types/types';
import { ErrorCollector } from './ErrorCollector';
import { StringValidator } from '../validators/StringValidator';
import { NumberValidator } from '../validators/NumberValidator';
import { ArrayValidator } from '../validators/ArrayValidator';

export class Validator {
  private errorCollector: ErrorCollector;
  private customValidators: Map<string, CustomValidator>;

  constructor(errorCollector: ErrorCollector) {
    this.errorCollector = errorCollector;
    this.customValidators = new Map();
  }

  /**
   * Регистрация кастомного валидатора
   */
  public registerCustomValidator(name: string, validator: CustomValidator): void {
    this.customValidators.set(name, validator);
  }

  /**
   * Валидация значения по правилам
   */
  public validateValue(
    value: any,
    rules: ValidationRule[],
    fieldType: FieldType
  ): string[] {
    const errors: string[] = [];

    for (const rule of rules) {
      const error = this.validateRule(value, rule, fieldType);
      
      if (error) {
        errors.push(error);
      }
    }

    return errors;
  }

  /**
   * Валидация отдельного правила
   */
  private validateRule(
    value: any,
    rule: ValidationRule,
    fieldType: FieldType
  ): string | null {
    if (rule.type === 'custom') {
      const customValidator = this.customValidators.get(rule.value);
      
      if (!customValidator) {
        console.error(`Custom validator "${rule.value}" not found`);
        return null;
      }

      const result = customValidator(value, rule);
      
      if (result === true) {
        return null;
      }
      
      return typeof result === 'string' ? result : rule.errorMessage || 'Validation failed';
    }

    if (Array.isArray(value)) {
      return ArrayValidator.validate(value, rule);
    }

    if (fieldType === 'number' || typeof value === 'number') {
      return NumberValidator.validate(value, rule);
    }

    return StringValidator.validate(value, rule);
  }

  /**
   * Проверка, является ли значение пустым
   */
  public static isEmpty(value: any): boolean {
    if (value === null || value === undefined) {
      return true;
    }

    if (typeof value === 'string') {
      return value.trim().length === 0;
    }

    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return false;
  }
}