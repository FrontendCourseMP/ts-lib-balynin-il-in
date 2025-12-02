import type { ValidationRule } from '../types/types';
import { Validator } from '../core/Validator';

export class StringValidator {
  /**
   * Валидация строкового значения
   */
  public static validate(value: string, rule: ValidationRule): string | null {
    const stringValue = String(value || '');

    switch (rule.type) {
      case 'required':
        return this.validateRequired(stringValue, rule);

      case 'minLength':
        return this.validateMinLength(stringValue, rule);

      case 'maxLength':
        return this.validateMaxLength(stringValue, rule);

      case 'pattern':
        return this.validatePattern(stringValue, rule);

      case 'email':
        return this.validateEmail(stringValue, rule);

      default:
        return null;
    }
  }

  /**
   * Проверка на обязательность
   */
  private static validateRequired(value: string, rule: ValidationRule): string | null {
    if (Validator.isEmpty(value)) {
      return rule.errorMessage || 'This field is required';
    }
    return null;
  }

  /**
   * Проверка минимальной длины
   * rule.value содержит необходимую длину
   * Если длина value меньше - вернуть rule.errorMessage или дефолтное сообщение
   */
  private static validateMinLength(value: string, rule: ValidationRule): string | null {
    // todo
    return null;
  }

  /**
   * Проверка максимальной длины
   */
  private static validateMaxLength(value: string, rule: ValidationRule): string | null {
    if (Validator.isEmpty(value)) {
      return null;
    }

    const maxLength = Number(rule.value);
    
    if (value.length > maxLength) {
      return rule.errorMessage || `Maximum length is ${maxLength} characters`;
    }
    
    return null;
  }

  /**
   * Проверка по регулярному выражению
   */
  private static validatePattern(value: string, rule: ValidationRule): string | null {
    if (Validator.isEmpty(value)) {
      return null;
    }

    const pattern = new RegExp(rule.value);
    
    if (!pattern.test(value)) {
      return rule.errorMessage || 'Invalid format';
    }
    
    return null;
  }

  /**
   * Проверка email
   * Реализуй проверку через regexp
   */
  private static validateEmail(value: string, rule: ValidationRule): string | null {
    // todo
    return null;
  }
}