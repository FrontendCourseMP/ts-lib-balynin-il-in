import type { Warnings } from '../types/types';

export class ErrorCollector {
  private warnings: Warnings[] = [];
  private suppressWarnings: boolean;

  constructor(suppressWarnings: boolean = false) {
    this.suppressWarnings = suppressWarnings;
  }

  /**
   * Добавление предупреждения
   */
  public addWarning(warning: Warnings): void {
    this.warnings.push(warning);
  }

  /**
   * Получение всех предупреждений
   */
  public getWarnings(): Warnings[] {
    return [...this.warnings];
  }

  /**
   * Вывод предупреждений в консоль
   */
  public logWarnings(): void {
    if (this.suppressWarnings || this.warnings.length === 0) {
      return;
    }

    console.group('JustIlindate Warnings:');
    this.warnings.forEach(warning => {
      console.warn(
        `[${warning.type}] ${warning.fieldName}: ${warning.message}`
      );
    });
    console.groupEnd();
  }

  /**
   * Очистка всех предупреждений
   */
  public clearWarnings(): void {
    this.warnings = [];
  }

  /**
   * Проверка наличия предупреждений для конкретного поля
   */
  public hasWarningsForField(fieldName: string): boolean {
    return this.warnings.some(w => w.fieldName === fieldName);
  }
}