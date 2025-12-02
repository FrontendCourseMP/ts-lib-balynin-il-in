import type { FieldType } from '../types/types';

export class DOMHelpers {
  /**
   * Получение всех полей формы
   */
  public static getAllFormFields(
    form: HTMLFormElement
  ): Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    const fields: Array<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> = [];

    const inputs = form.querySelectorAll<HTMLInputElement>('input');
    inputs.forEach(input => {
      if (!['submit', 'reset', 'button', 'image'].includes(input.type)) {
        fields.push(input);
      }
    });

    const textareas = form.querySelectorAll<HTMLTextAreaElement>('textarea');
    textareas.forEach(textarea => fields.push(textarea));

    const selects = form.querySelectorAll<HTMLSelectElement>('select');
    selects.forEach(select => fields.push(select));

    return fields;
  }

  /**
   * Поиск label для поля
   */
  public static findLabelForField(
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  ): HTMLLabelElement | null {
    if (field.id) {
      const label = document.querySelector<HTMLLabelElement>(
        `label[for="${field.id}"]`
      );
      if (label) return label;
    }

    const parentLabel = field.closest('label');
    if (parentLabel) return parentLabel as HTMLLabelElement;

    return null;
  }

  /**
   * Определение типа поля
   */
  public static getFieldType(
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  ): FieldType {
    if (field instanceof HTMLInputElement) {
      const type = field.type.toLowerCase();
      
      const typeMap: { [key: string]: FieldType } = {
        'text': 'text',
        'email': 'email',
        'number': 'number',
        'checkbox': 'checkbox',
        'radio': 'radio',
        'tel': 'tel',
        'url': 'url',
        'password': 'password'
      };

      return typeMap[type] || 'text';
    }

    if (field instanceof HTMLTextAreaElement) {
      return 'text';
    }

    return 'text';
  }

  /**
   * Проверка, виден ли элемент
   */
  public static isVisible(element: HTMLElement): boolean {
    return !!(
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  /**
   * Получение читаемого имени поля
   */
  public static getFieldLabel(
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  ): string {
    const label = this.findLabelForField(field);
    
    if (label && label.textContent) {
      return label.textContent.trim();
    }

    return field.name || field.id || 'Field';
  }
}