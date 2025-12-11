import type {
  ValidatorOptions,
  FieldState,
  ValidationResult,
  ValidationRule,
  FieldValue,
} from "../types";
import {
  getFieldValue,
  getConstraintAttributes,
  createErrorContainer,
  findLabel,
  isCheckboxOrRadioGroup,
} from "../utils";
import { validators, errorMessages, formatErrorMessage } from "../validators";

export class JustIlindate {
  private form: HTMLFormElement;
  private fields: Map<string, FieldState>;
  private options: Required<ValidatorOptions>;
  private processedCheckboxGroups: Set<string>;

  constructor(
    formSelector: string | HTMLFormElement,
    options: ValidatorOptions = {}
  ) {
    this.fields = new Map();
    this.processedCheckboxGroups = new Set();
    this.options = {
      suppressWarnings: options.suppressWarnings ?? false,
      validateOnBlur: options.validateOnBlur ?? true,
      validateOnInput: options.validateOnInput ?? false,
      errorClass: options.errorClass ?? "justilindate-error",
      successClass: options.successClass ?? "justilindate-success",
    };

    if (typeof formSelector === "string") {
      const formElement = document.querySelector<HTMLFormElement>(formSelector);
      if (!formElement) {
        throw new Error(`Форма с селектором "${formSelector}" не найдена`);
      }
      this.form = formElement;
    } else {
      this.form = formSelector;
    }

    this.validateFormStructure();
    this.initializeFields();
    this.attachEventListeners();
  }

  private validateFormStructure(): void {
    const fields = this.form.querySelectorAll("input, select, textarea");

    fields.forEach((field) => {
      if (!field.getAttribute("name") && !field.getAttribute("id")) {
        if (!this.options.suppressWarnings) {
          // eslint-disable-next-line no-console
          console.warn(
            "JustIlindate: Поле без атрибутов name или id будет проигнорировано",
            field
          );
        }
        return;
      }

      const label = findLabel(field as HTMLElement);
      if (!label && !this.options.suppressWarnings) {
        // eslint-disable-next-line no-console
        console.warn(
          `JustIlindate: Для поля "${field.getAttribute("name") || field.getAttribute("id")}" не найден label`,
          field
        );
      }
    });
  }

  private initializeFields(): void {
    const fields = this.form.querySelectorAll<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >("input, select, textarea");

    fields.forEach((field) => {
      const name = field.getAttribute("name") || field.getAttribute("id");
      if (!name) return;

      if (field instanceof HTMLInputElement && isCheckboxOrRadioGroup(field)) {
        if (this.processedCheckboxGroups.has(name)) return;
        this.processedCheckboxGroups.add(name);
      }

      const errorContainer = createErrorContainer(
        field,
        this.options.errorClass
      );
      const rules = this.buildRulesFromAttributes(field);

      this.fields.set(name, {
        element: field,
        errorContainer,
        isValid: true,
        rules,
      });
    });
  }

  private buildRulesFromAttributes(
    element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  ): ValidationRule[] {
    const rules: ValidationRule[] = [];
    const attrs = getConstraintAttributes(element);

    if (attrs.required) {
      rules.push({
        validator: (value: FieldValue) => validators.required(value),
        errorMessage: errorMessages.required,
      });
    }

    if (attrs.minlength) {
      rules.push({
        validator: (value: FieldValue) =>
          validators.minLength(value, attrs.minlength),
        errorMessage: formatErrorMessage(
          errorMessages.minLength,
          attrs.minlength
        ),
      });
    }

    if (attrs.maxlength) {
      rules.push({
        validator: (value: FieldValue) =>
          validators.maxLength(value, attrs.maxlength),
        errorMessage: formatErrorMessage(
          errorMessages.maxLength,
          attrs.maxlength
        ),
      });
    }

    if (attrs.min !== undefined) {
      rules.push({
        validator: (value: FieldValue) => validators.min(value, attrs.min),
        errorMessage: formatErrorMessage(errorMessages.min, attrs.min),
      });
    }

    if (attrs.max !== undefined) {
      rules.push({
        validator: (value: FieldValue) => validators.max(value, attrs.max),
        errorMessage: formatErrorMessage(errorMessages.max, attrs.max),
      });
    }

    if (attrs.pattern) {
      rules.push({
        validator: (value: FieldValue) =>
          validators.pattern(value, attrs.pattern),
        errorMessage: errorMessages.pattern,
      });
    }

    if (attrs.type === "email") {
      rules.push({
        validator: (value: FieldValue) => validators.email(value),
        errorMessage: errorMessages.email,
      });
    }

    if (attrs.type === "url") {
      rules.push({
        validator: (value: FieldValue) => validators.url(value),
        errorMessage: errorMessages.url,
      });
    }

    if (attrs.type === "number") {
      rules.push({
        validator: (value: FieldValue) => validators.number(value),
        errorMessage: errorMessages.number,
      });
    }

    if (attrs.step) {
      rules.push({
        validator: (value: FieldValue) => validators.step(value, attrs.step),
        errorMessage: formatErrorMessage(errorMessages.step, attrs.step),
      });
    }

    return rules;
  }

  private attachEventListeners(): void {
    this.fields.forEach((fieldState, name) => {
      const elements = this.form.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >(`[name="${name}"]`);

      elements.forEach((element) => {
        if (this.options.validateOnBlur) {
          element.addEventListener("blur", () => {
            this.validateField(name);
          });
        }

        const eventType =
          element.type === "checkbox" || element.type === "radio"
            ? "change"
            : "input";

        if (this.options.validateOnInput) {
          element.addEventListener(eventType, () => {
            if (!fieldState.isValid) {
              this.validateField(name);
            }
          });
        }
      });
    });

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const result = this.validate();
      if (result.isValid) {
        this.onSuccess();
      }
    });
  }

  public addRule(
    fieldName: string,
    validator: (value: FieldValue) => boolean,
    errorMessage: string
  ): this {
    const fieldState = this.fields.get(fieldName);
    if (!fieldState) {
      throw new Error(`Поле "${fieldName}" не найдено`);
    }

    const htmlAttrs = getConstraintAttributes(fieldState.element);
    const hasConflict = this.checkRuleConflict(validator, htmlAttrs);

    if (hasConflict && !this.options.suppressWarnings) {
      // eslint-disable-next-line no-console
      console.warn(
        `JustIlindate: Правило для поля "${fieldName}" конфликтует с HTML-атрибутами`,
        { customRule: validator.toString(), htmlAttributes: htmlAttrs }
      );
    }

    fieldState.rules.push({ validator, errorMessage });
    return this;
  }

  private checkRuleConflict(
    validator: (value: FieldValue) => boolean,
    attrs: Record<string, unknown>
  ): boolean {
    const validatorStr = validator.toString();

    if (validatorStr.includes("required") && attrs.required !== undefined) {
      return true;
    }
    if (
      validatorStr.includes("length") &&
      (attrs.minlength || attrs.maxlength)
    ) {
      return true;
    }
    if (validatorStr.includes("min") && attrs.min !== undefined) {
      return true;
    }
    if (validatorStr.includes("max") && attrs.max !== undefined) {
      return true;
    }

    return false;
  }

  private validateField(fieldName: string): boolean {
    const fieldState = this.fields.get(fieldName);
    if (!fieldState) return true;

    const value = getFieldValue(fieldState.element);
    const errors: string[] = [];

    const isRequired = fieldState.rules.some(
      (rule) => rule.errorMessage === errorMessages.required
    );

    const isEmpty = this.isValueEmpty(value);

    if (!isRequired && isEmpty) {
      fieldState.isValid = true;
      this.clearErrors(fieldState);
      return true;
    }

    for (const rule of fieldState.rules) {
      if (!rule.validator(value)) {
        errors.push(rule.errorMessage);
      }
    }

    fieldState.isValid = errors.length === 0;

    if (errors.length > 0) {
      this.showErrors(fieldState, errors);
    } else {
      this.clearErrors(fieldState);
    }

    return fieldState.isValid;
  }

  private isValueEmpty(value: FieldValue): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === "number") {
      return false;
    }
    return String(value).trim() === "";
  }

  private showErrors(fieldState: FieldState, errors: string[]): void {
    fieldState.errorContainer.innerHTML = errors.join("<br>");
    fieldState.errorContainer.style.display = "block";
    fieldState.element.classList.add(this.options.errorClass);
    fieldState.element.classList.remove(this.options.successClass);
  }

  private clearErrors(fieldState: FieldState): void {
    // Очищаем контейнер ошибок
    fieldState.errorContainer.innerHTML = "";
    fieldState.errorContainer.style.display = "none";

    // Удаляем класс ошибки
    fieldState.element.classList.remove(this.options.errorClass);

    // Добавляем класс успеха
    fieldState.element.classList.add(this.options.successClass);
  }

  public validate(): ValidationResult {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    this.fields.forEach((fieldState, name) => {
      const fieldValid = this.validateField(name);
      if (!fieldValid) {
        isValid = false;
        const fieldErrors: string[] = [];
        const value = getFieldValue(fieldState.element);

        for (const rule of fieldState.rules) {
          if (!rule.validator(value)) {
            fieldErrors.push(rule.errorMessage);
          }
        }
        errors[name] = fieldErrors;
      }
    });

    return { isValid, errors };
  }

  public reset(): void {
    this.form.reset();
    this.fields.forEach((fieldState) => {
      fieldState.isValid = true;
      this.clearErrors(fieldState);
    });
  }

  private onSuccess(): void {
    const event = new CustomEvent("justilindate:success", {
      detail: { form: this.form },
    });
    this.form.dispatchEvent(event);
  }

  public onSuccessSubmit(callback: (event: Event) => void): void {
    this.form.addEventListener("justilindate:success", callback);
  }
}
