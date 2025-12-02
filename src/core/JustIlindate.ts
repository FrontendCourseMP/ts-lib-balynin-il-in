import type { JustIlindateOptions, ValidationRule,  FieldConfig, ValidationResult, FieldMetaData, FieldError } from '../types/types';
import { ErrorCollector } from './ErrorCollector';
import { Validator } from './Validator';
import { FieldManager } from '../ui/FieldManager';
import { ErrorRenderer } from '../ui/ErrorRenderer';
import { DOMHelpers } from '../utils/DOMHelpers';
import { AttributeParser } from '../utils/AttributeParser';

export class JustIlindate {
  private form: HTMLFormElement;
  private options: JustIlindateOptions;
  
  private errorCollector: ErrorCollector;
  
  private validator: Validator;
  
  private fieldManager: FieldManager;
  private errorRenderer: ErrorRenderer;
  
  private fieldsMetadata: Map<string, FieldMetaData>;
  
  private customRules: Map<string, FieldConfig>;

  constructor(form: HTMLFormElement | string, options: JustIlindateOptions = {}) {
    this.form = typeof form === 'string' 
      ? document.querySelector(form) as HTMLFormElement
      : form;

    if (!this.form || !(this.form instanceof HTMLFormElement)) {
      throw new Error('JustIlin: Invalid form element provided');
    }

    this.options = {
      suppressWarnings: false,
      validateOnBlur: false,
      validateOnInput: false,
      errorClass: 'justilin-error',
      errorContainerClass: 'justilin-error-message',
      locale: 'en',
      ...options
    };

    this.fieldsMetadata = new Map();
    this.customRules = new Map();
    
    this.errorCollector = new ErrorCollector(this.options.suppressWarnings);
    
    this.validator = new Validator(this.errorCollector);
    
    this.fieldManager = new FieldManager(this.form, this.options);
    this.errorRenderer = new ErrorRenderer(this.options);

    this.init();
  }

  /**
   * Инициализация библиотеки
   * Сканирует форму, собирает метаданные, настраивает обработчики
   */
  private init(): void {
    try {
      this.scanFormFields();

      this.validateLabels();

      this.parseHTMLAttributes();

      this.setupEventListeners();

      this.errorCollector.logWarnings();

    } catch (error) {
      console.error('JustIlin initialization error:', error);
      throw error;
    }
  }

  /**
   * Сканирование всех полей формы
   * Создаёт FieldMetadata для каждого поля
   */
  private scanFormFields(): void {
    const fields = DOMHelpers.getAllFormFields(this.form);
    
    fields.forEach(field => {
      const fieldName = field.name || field.id;
      
      if (!fieldName) {
        this.errorCollector.addWarning({
          fieldName: 'unknown',
          message: 'Field without name or id attribute found',
          type: 'missing-label'
        });
        return;
      }

      const metadata: FieldMetaData = {
        element: field,
        label: DOMHelpers.findLabelForField(field),
        type: DOMHelpers.getFieldType(field),
        htmlAttributes: AttributeParser.parseAttributes(field),
        jsRules: []
      };

      this.fieldsMetadata.set(fieldName, metadata);
    });
  }

  /**
   * Проверка наличия labels (Правило 1)
   * Добавляет warning для полей без label
   */
  private validateLabels(): void {
    this.fieldsMetadata.forEach((metadata, fieldName) => {
      if (!metadata.label) {
        this.errorCollector.addWarning({
          fieldName,
          message: `Field "${fieldName}" does not have an associated label`,
          type: 'missing-label'
        });
      }
    });
  }

  /**
   * Парсинг HTML5 атрибутов валидации
   * Конвертирует HTML атрибуты в ValidationRule[]
   */
  private parseHTMLAttributes(): void {
    this.fieldsMetadata.forEach((metadata, fieldName) => {
      const rulesFromAttrs = AttributeParser.convertAttributesToRules(
        metadata.htmlAttributes
      );
      
      metadata.jsRules = rulesFromAttrs;
    });
  }

  /**
   * Настройка обработчиков событий
   */
  private setupEventListeners(): void {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const result = this.validate();
      
      if (result.isValid) {
        this.form.submit();
      }
    });

    if (this.options.validateOnBlur) {
      this.fieldsMetadata.forEach((metadata, fieldName) => {
        metadata.element.addEventListener('blur', () => {
          this.validateField(fieldName);
        });
      });
    }

    if (this.options.validateOnInput) {
      this.fieldsMetadata.forEach((metadata, fieldName) => {
        metadata.element.addEventListener('input', () => {
          this.validateField(fieldName);
        });
      });
    }
  }

  /**
   * Добавление правил валидации для поля
   * Позволяет добавить JS правила поверх HTML атрибутов
   */
  public addField(fieldName: string, rules: ValidationRule[]): this {
    const metadata = this.fieldsMetadata.get(fieldName);
    
    if (!metadata) {
      throw new Error(`Field "${fieldName}" not found in form`);
    }

    AttributeParser.checkRulesConflict(
      metadata.htmlAttributes,
      rules,
      fieldName,
      this.errorCollector
    );

    metadata.jsRules = [...metadata.jsRules, ...rules];
    
    this.customRules.set(fieldName, { fieldName, rules });
    
    return this;
  }

  /**
   * Валидация конкретного поля
   * Используется для validateOnBlur/validateOnInput и внутри validate()
   */
  private validateField(fieldName: string): ValidationResult {
    const metadata = this.fieldsMetadata.get(fieldName);
    
    if (!metadata) {
      return { isValid: true, errors: [] };
    }

    const value = this.fieldManager.getFieldValue(metadata.element, metadata.type);
    
    const errors = this.validator.validateValue(value, metadata.jsRules, metadata.type);

    if (errors.length > 0) {
      this.errorRenderer.showErrors(metadata.element, errors);
      return { 
        isValid: false, 
        errors: [{ fieldName, errors }] 
      };
    } else {
      this.errorRenderer.clearErrors(metadata.element);
      return { 
        isValid: true, 
        errors: [] 
      };
    }
  }

  /**
   * Валидация всей формы
   * Собирает ошибки со всех полей
   */
  public validate(): ValidationResult {
    const allErrors: FieldError[] = [];

    this.fieldsMetadata.forEach((metadata, fieldName) => {
      const result = this.validateField(fieldName);
      
      if (!result.isValid) {
        allErrors.push(...result.errors);
      }
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }

  /**
   * Очистка всех ошибок валидации
   */
  public clearErrors(): void {
    this.fieldsMetadata.forEach((metadata) => {
      this.errorRenderer.clearErrors(metadata.element);
    });
  }

  /**
   * Получение экземпляра Validator для регистрации кастомных валидаторов
   */
  public getValidator(): Validator {
    return this.validator;
  }

  /**
   * Уничтожение экземпляра
   * Очищает всё, удаляет обработчики
   */
  public destroy(): void {
    this.clearErrors();
    this.fieldsMetadata.clear();
    this.customRules.clear();
    // потом надо добавить удаление event listeners
  }
}