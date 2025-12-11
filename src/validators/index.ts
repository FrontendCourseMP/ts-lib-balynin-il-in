import type { FieldValue, ValidatorFunction } from "../types";

export const validators: Record<string, ValidatorFunction> = {
  required: (value: FieldValue): boolean => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === "number") {
      return true;
    }
    return value.trim().length > 0;
  },

  minLength: (value: FieldValue, min?: number | string | boolean): boolean => {
    if (typeof min !== "number") return true;
    if (Array.isArray(value)) {
      return value.length >= min;
    }
    return String(value).length >= min;
  },

  maxLength: (value: FieldValue, max?: number | string | boolean): boolean => {
    if (typeof max !== "number") return true;
    if (Array.isArray(value)) {
      return value.length <= max;
    }
    return String(value).length <= max;
  },

  min: (value: FieldValue, min?: number | string | boolean): boolean => {
    if (typeof min !== "number") return true;
    if (Array.isArray(value)) {
      return value.length >= min;
    }
    const numValue = typeof value === "number" ? value : Number(value);
    return !isNaN(numValue) && numValue >= min;
  },

  max: (value: FieldValue, max?: number | string | boolean): boolean => {
    if (typeof max !== "number") return true;
    if (Array.isArray(value)) {
      return value.length <= max;
    }
    const numValue = typeof value === "number" ? value : Number(value);
    return !isNaN(numValue) && numValue <= max;
  },

  pattern: (
    value: FieldValue,
    pattern?: number | string | boolean
  ): boolean => {
    if (typeof pattern !== "string") return true;
    if (Array.isArray(value)) return true;
    const regex = new RegExp(pattern);
    return regex.test(String(value));
  },

  email: (value: FieldValue): boolean => {
    if (Array.isArray(value)) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value));
  },

  url: (value: FieldValue): boolean => {
    if (Array.isArray(value)) return false;
    try {
      new URL(String(value));
      return true;
    } catch {
      return false;
    }
  },

  number: (value: FieldValue): boolean => {
    if (Array.isArray(value)) return false;
    return !isNaN(Number(value)) && String(value).trim() !== "";
  },

  integer: (value: FieldValue): boolean => {
    if (Array.isArray(value)) return false;
    return Number.isInteger(Number(value)) && String(value).trim() !== "";
  },

  step: (value: FieldValue, step?: number | string | boolean): boolean => {
    if (typeof step !== "number" || Array.isArray(value)) return true;
    const numValue = typeof value === "number" ? value : Number(value);
    if (isNaN(numValue)) return false;
    return numValue % step === 0;
  },
};

export const errorMessages: Record<string, string> = {
  required: "Это поле обязательно для заполнения",
  minLength: "Минимальная длина: {0}",
  maxLength: "Максимальная длина: {0}",
  min: "Минимальное значение: {0}",
  max: "Максимальное значение: {0}",
  pattern: "Значение не соответствует формату",
  email: "Введите корректный email",
  url: "Введите корректный URL",
  number: "Введите число",
  integer: "Введите целое число",
  step: "Значение должно быть кратно {0}",
};

export function formatErrorMessage(
  message: string,
  param?: number | string
): string {
  if (param !== undefined) {
    return message.replace("{0}", String(param));
  }
  return message;
}
