import type { JustIlindateOptions } from '../types/types';

export class ErrorRenderer {
  private options: JustIlindateOptions;
  private errorContainers: Map<HTMLElement, HTMLElement>;

  constructor(options: JustIlindateOptions) {
    this.options = options;
    this.errorContainers = new Map();
  }

  /**
   * Показ ошибок под полем
   */
  public showErrors(
    field: HTMLElement,
    errors: string[]
  ): void {
    this.clearErrors(field);

    field.classList.add(this.options.errorClass!);

    const errorContainer = this.createErrorContainer(errors);
    
    this.insertErrorContainer(field, errorContainer);
    
    this.errorContainers.set(field, errorContainer);
  }

  /**
   * Очистка ошибок для поля
   */
  public clearErrors(field: HTMLElement): void {
    field.classList.remove(this.options.errorClass!);

    const existingContainer = this.errorContainers.get(field);
    
    if (existingContainer && existingContainer.parentNode) {
      existingContainer.parentNode.removeChild(existingContainer);
      this.errorContainers.delete(field);
    }
  }

  /**
   * Создание контейнера для ошибок
   */
  private createErrorContainer(errors: string[]): HTMLElement {
    const container = document.createElement('div');
    container.className = this.options.errorContainerClass!;
    container.setAttribute('role', 'alert');
    container.setAttribute('aria-live', 'polite');

    errors.forEach(error => {
      const errorSpan = document.createElement('span');
      errorSpan.className = 'justilin-error-text';
      errorSpan.textContent = error;
      container.appendChild(errorSpan);
    });

    return container;
  }

  /**
   * Вставка контейнера с ошибками после поля
   */
  private insertErrorContainer(
    field: HTMLElement,
    container: HTMLElement
  ): void {
    const label = field.closest('label');
    const targetElement = label || field;

    if (targetElement.nextSibling) {
      targetElement.parentNode!.insertBefore(
        container,
        targetElement.nextSibling
      );
    } else {
      targetElement.parentNode!.appendChild(container);
    }
  }

  /**
   * Очистка всех ошибок
   */
  public clearAll(): void {
    this.errorContainers.forEach((container, field) => {
      this.clearErrors(field);
    });
  }
}