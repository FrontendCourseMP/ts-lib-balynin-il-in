import type { FieldType, JustIlindateOptions } from '../types/types';

export class FieldManager {
  private form: HTMLFormElement;
  private options: JustIlindateOptions;

  constructor(form: HTMLFormElement, options: JustIlindateOptions) {
    this.form = form;
    this.options = options;
  }

  /**
   * Получение значения поля в зависимости от его типа
   */
  public getFieldValue(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    fieldType: FieldType
  ): any {
    if (fieldType === 'checkbox') {
      return this.getCheckboxValue(element as HTMLInputElement);
    }

    if (fieldType === 'radio') {
      return this.getRadioValue(element as HTMLInputElement);
    }

    if (element instanceof HTMLSelectElement && element.multiple) {
      return this.getMultiSelectValue(element);
    }

    if (fieldType === 'number') {
      const value = element.value.trim();
      return value === '' ? null : Number(value);
    }

    return element.value;
  }

  /**
   * Получение значения чекбоксов с одинаковым name
   * Вернуть нужно МАССИВ значений выбранных чекбоксов
   * 1. Получить name элемента
   * 2. Найти все чекбоксы в форме с таким же name
   * 3. Собрать value тех, у кого .checked === true
   */
  private getCheckboxValue(element: HTMLInputElement): string[] {
    // todo
    return [];
  }

  /**
   * Получение значения радио-кнопок
   * Вернуть значение выбранной или null
   */
  private getRadioValue(element: HTMLInputElement): string | null {
    // todo
    return null;
  }

  /**
   * Получение значений multiple select
   */
  private getMultiSelectValue(select: HTMLSelectElement): string[] {
    const values: string[] = [];
    const options = select.selectedOptions;

    for (let i = 0; i < options.length; i++) {
      values.push(options[i].value);
    }

    return values;
  }

  /**
   * Установка значения поля
   */
  public setFieldValue(
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    value: any,
    fieldType: FieldType
  ): void {
    if (fieldType === 'checkbox' && Array.isArray(value)) {
      this.setCheckboxValue(element as HTMLInputElement, value);
    } else if (element instanceof HTMLSelectElement && element.multiple && Array.isArray(value)) {
      this.setMultiSelectValue(element, value);
    } else {
      element.value = String(value);
    }
  }

  /**
   * Установка значений чекбоксов
   */
  private setCheckboxValue(element: HTMLInputElement, values: string[]): void {
    const name = element.name;
    const checkboxes = this.form.querySelectorAll<HTMLInputElement>(
      `input[type="checkbox"][name="${name}"]`
    );

    checkboxes.forEach(checkbox => {
      checkbox.checked = values.includes(checkbox.value);
    });
  }

  /**
   * Установка значений multiple select
   */
  private setMultiSelectValue(select: HTMLSelectElement, values: string[]): void {
    const options = select.options;

    for (let i = 0; i < options.length; i++) {
      options[i].selected = values.includes(options[i].value);
    }
  }
}