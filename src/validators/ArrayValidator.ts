import type { ValidationRule } from '../types/types';

export class ArrayValidator {
  /**
   * Валидация массива значений
   */
  public static validate(value: any[], rule: ValidationRule): string | null {
    if (!Array.isArray(value)) {
      return 'Invalid array value';
    }

    switch (rule.type) {
      case 'required':
        return this.validateRequired(value, rule);

      case 'minCount':
        return this.validateMinCount(value, rule);

      case 'maxCount':
        return this.validateMaxCount(value, rule);

      default:
        return null;
    }
  }

  /**
   * Проверка на обязательность (хотя бы один элемент)
   */
  private static validateRequired(value: any[], rule: ValidationRule): string | null {
    if (value.length === 0) {
      return rule.errorMessage || 'Please select at least one option';
    }
    return null;
  }

  /**
   * Проверка минимального количества выбранных элементов
   */
  private static validateMinCount(value: any[], rule: ValidationRule): string | null {
    const minCount = Number(rule.value);
    
    if (value.length < minCount) {
      return rule.errorMessage || `Please select at least ${minCount} option(s)`;
    }
    
    return null;
  }

  /**
   * Проверка максимального количества выбранных элементов
   */
  private static validateMaxCount(value: any[], rule: ValidationRule): string | null {
    const maxCount = Number(rule.value);
    
    if (value.length > maxCount) {
      return rule.errorMessage || `Please select no more than ${maxCount} option(s)`;
    }
    
    return null;
  }
}