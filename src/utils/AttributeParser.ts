import type { HTMLAttributes, ValidationRule } from '../types/types';
import { ErrorCollector } from '../core/ErrorCollector';

export class AttributeParser {
  /**
   * Парсинг HTML атрибутов элемента
   */
  public static parseAttributes(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  ): HTMLAttributes {
    const attrs: HTMLAttributes = {};

    if (element.hasAttribute('required')) {
      attrs.required = true;
    }

    if (element.hasAttribute('minlength')) {
      attrs.minLength = parseInt(element.getAttribute('minlength')!, 10);
    }

    if (element.hasAttribute('maxlength')) {
      attrs.maxLength = parseInt(element.getAttribute('maxlength')!, 10);
    }

    if (element.hasAttribute('min')) {
      const minValue = element.getAttribute('min')!;
      attrs.min = isNaN(Number(minValue)) ? minValue : Number(minValue);
    }

    if (element.hasAttribute('max')) {
      const maxValue = element.getAttribute('max')!;
      attrs.max = isNaN(Number(maxValue)) ? maxValue : Number(maxValue);
    }

    if (element.hasAttribute('pattern')) {
      attrs.pattern = element.getAttribute('pattern')!;
    }

    if (element instanceof HTMLInputElement) {
      attrs.type = element.type;
    }

    return attrs;
  }

  /**
   * Конвертация HTML атрибутов в правила валидации
   */
  public static convertAttributesToRules(
    attributes: HTMLAttributes
  ): ValidationRule[] {
    const rules: ValidationRule[] = [];

    if (attributes.required) {
      rules.push({
        type: 'required',
        errorMessage: 'This field is required'
      });
    }

    if (attributes.minLength !== undefined) {
      rules.push({
        type: 'minLength',
        value: attributes.minLength,
        errorMessage: `Minimum length is ${attributes.minLength} characters`
      });
    }

    if (attributes.maxLength !== undefined) {
      rules.push({
        type: 'maxLength',
        value: attributes.maxLength,
        errorMessage: `Maximum length is ${attributes.maxLength} characters`
      });
    }

    if (attributes.min !== undefined) {
      rules.push({
        type: 'min',
        value: attributes.min,
        errorMessage: `Minimum value is ${attributes.min}`
      });
    }

    if (attributes.max !== undefined) {
      rules.push({
        type: 'max',
        value: attributes.max,
        errorMessage: `Maximum value is ${attributes.max}`
      });
    }

    if (attributes.pattern) {
      rules.push({
        type: 'pattern',
        value: attributes.pattern,
        errorMessage: 'Invalid format'
      });
    }

    if (attributes.type === 'email') {
      rules.push({
        type: 'email',
        errorMessage: 'Invalid email address'
      });
    }

    return rules;
  }

  /**
   * Проверка конфликтов между HTML атрибутами и JS правилами
   */
  public static checkRulesConflict(
    htmlAttributes: HTMLAttributes,
    jsRules: ValidationRule[],
    fieldName: string,
    errorCollector: ErrorCollector
  ): void {
    jsRules.forEach(rule => {
      let conflict = false;
      let message = '';

      switch (rule.type) {
        case 'required':
          if (htmlAttributes.required !== undefined && !htmlAttributes.required) {
            conflict = true;
            message = 'JS rule "required" conflicts with HTML: field is not required in HTML';
          }
          break;

        case 'minLength':
          if (htmlAttributes.minLength !== undefined && htmlAttributes.minLength !== rule.value) {
            conflict = true;
            message = `JS rule "minLength: ${rule.value}" conflicts with HTML attribute "minlength=${htmlAttributes.minLength}"`;
          }
          break;

        case 'maxLength':
          if (htmlAttributes.maxLength !== undefined && htmlAttributes.maxLength !== rule.value) {
            conflict = true;
            message = `JS rule "maxLength: ${rule.value}" conflicts with HTML attribute "maxlength=${htmlAttributes.maxLength}"`;
          }
          break;

        case 'min':
          if (htmlAttributes.min !== undefined && htmlAttributes.min !== rule.value) {
            conflict = true;
            message = `JS rule "min: ${rule.value}" conflicts with HTML attribute "min=${htmlAttributes.min}"`;
          }
          break;

        case 'max':
          if (htmlAttributes.max !== undefined && htmlAttributes.max !== rule.value) {
            conflict = true;
            message = `JS rule "max: ${rule.value}" conflicts with HTML attribute "max=${htmlAttributes.max}"`;
          }
          break;

        case 'pattern':
          if (htmlAttributes.pattern !== undefined && htmlAttributes.pattern !== rule.value) {
            conflict = true;
            message = `JS rule "pattern" conflicts with HTML attribute "pattern"`;
          }
          break;
      }

      if (conflict) {
        errorCollector.addWarning({
          fieldName,
          message,
          type: 'attribute-mismatch'
        });
      }
    });
  }
}