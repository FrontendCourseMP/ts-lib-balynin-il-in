import type { ValidationRule } from '../types/types';
import { Validator } from '../core/Validator';

export class NumberValidator {
  /**
   * Валидация числового значения
   */
  public static validate(value: any, rule: ValidationRule): string | null {
    const numValue = Number(value);

    if (Validator.isEmpty(value) && rule.type !== 'required') {
      return null;
    }

    switch (rule.type) {
      case 'required':
        return this.validateRequired(value, rule);

      case 'min':
        return this.validateMin(numValue, rule);

      case 'max':
        return this.validateMax(numValue, rule);

      default:
        return null;
    }
  }

  /**
   * Проверка на обязательность
   */
  private static validateRequired(value: any, rule: ValidationRule): string | null {
    if (Validator.isEmpty(value)) {
      return rule.errorMessage || 'This field is required';
    }
    return null;
  }

  /**
   * Проверка минимального значения
   */
  private static validateMin(value: number, rule: ValidationRule): string | null {
    if (isNaN(value)) {
      return rule.errorMessage || 'Invalid number';
    }

    const min = Number(rule.value);
    
    if (value < min) {
      return rule.errorMessage || `Minimum value is ${min}`;
    }
    
    return null;
  }

  /**
   * Проверка максимального значения
   */
  private static validateMax(value: number, rule: ValidationRule): string | null {
    if (isNaN(value)) {
      return rule.errorMessage || 'Invalid number';
    }

    const max = Number(rule.value);
    
    if (value > max) {
      return rule.errorMessage || `Maximum value is ${max}`;
    }
    
    return null;
  }
}