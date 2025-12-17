// tests/validators.test.ts

import { describe, it, expect } from "vitest";
import { validators, formatErrorMessage } from "../src/validators";

describe("Validators - required", () => {
  it("должен возвращать true для непустой строки", () => {
    expect(validators.required("test")).toBe(true);
  });

  it("должен возвращать false для пустой строки", () => {
    expect(validators.required("")).toBe(false);
    expect(validators.required("   ")).toBe(false);
  });

  it("должен возвращать true для числа", () => {
    expect(validators.required(0)).toBe(true);
    expect(validators.required(42)).toBe(true);
  });

  it("должен возвращать true для непустого массива", () => {
    expect(validators.required(["value"])).toBe(true);
  });

  it("должен возвращать false для пустого массива", () => {
    expect(validators.required([])).toBe(false);
  });
});

describe("Validators - minLength", () => {
  it("должен проверять минимальную длину строки", () => {
    expect(validators.minLength("test", 3)).toBe(true);
    expect(validators.minLength("test", 4)).toBe(true);
    expect(validators.minLength("test", 5)).toBe(false);
  });

  it("должен проверять минимальную длину массива", () => {
    expect(validators.minLength(["a", "b"], 2)).toBe(true);
    expect(validators.minLength(["a", "b"], 3)).toBe(false);
  });

  it("должен возвращать true если параметр не передан", () => {
    expect(validators.minLength("test")).toBe(true);
  });
});

describe("Validators - maxLength", () => {
  it("должен проверять максимальную длину строки", () => {
    expect(validators.maxLength("test", 5)).toBe(true);
    expect(validators.maxLength("test", 4)).toBe(true);
    expect(validators.maxLength("test", 3)).toBe(false);
  });

  it("должен проверять максимальную длину массива", () => {
    expect(validators.maxLength(["a", "b"], 2)).toBe(true);
    expect(validators.maxLength(["a", "b"], 1)).toBe(false);
  });
});

describe("Validators - min", () => {
  it("должен проверять минимальное значение числа", () => {
    expect(validators.min(10, 5)).toBe(true);
    expect(validators.min(10, 10)).toBe(true);
    expect(validators.min(10, 15)).toBe(false);
  });

  it("должен проверять минимальную длину массива", () => {
    expect(validators.min(["a", "b", "c"], 2)).toBe(true);
    expect(validators.min(["a"], 2)).toBe(false);
  });

  it("должен работать с числами в виде строк", () => {
    expect(validators.min("20", 10)).toBe(true);
    expect(validators.min("5", 10)).toBe(false);
  });
});

describe("Validators - max", () => {
  it("должен проверять максимальное значение числа", () => {
    expect(validators.max(10, 15)).toBe(true);
    expect(validators.max(10, 10)).toBe(true);
    expect(validators.max(10, 5)).toBe(false);
  });

  it("должен проверять максимальную длину массива", () => {
    expect(validators.max(["a", "b"], 3)).toBe(true);
    expect(validators.max(["a", "b", "c"], 2)).toBe(false);
  });
});

describe("Validators - pattern", () => {
  it("должен проверять соответствие паттерну", () => {
    expect(validators.pattern("abc123", "[a-z]+[0-9]+")).toBe(true);
    expect(validators.pattern("123abc", "[a-z]+[0-9]+")).toBe(false);
  });

  it("должен возвращать true для массивов", () => {
    expect(validators.pattern(["test"], "pattern")).toBe(true);
  });

  it("должен возвращать true если паттерн не передан", () => {
    expect(validators.pattern("test")).toBe(true);
  });
});

describe("Validators - email", () => {
  it("должен проверять корректные email", () => {
    expect(validators.email("test@example.com")).toBe(true);
    expect(validators.email("user.name@domain.co.uk")).toBe(true);
  });

  it("должен отклонять некорректные email", () => {
    expect(validators.email("invalid")).toBe(false);
    expect(validators.email("test@")).toBe(false);
    expect(validators.email("@example.com")).toBe(false);
    expect(validators.email("test @example.com")).toBe(false);
  });

  it("должен возвращать false для массивов", () => {
    expect(validators.email(["test@example.com"])).toBe(false);
  });
});

describe("Validators - url", () => {
  it("должен проверять корректные URL", () => {
    expect(validators.url("https://example.com")).toBe(true);
    expect(validators.url("http://test.org")).toBe(true);
    expect(validators.url("https://sub.domain.com/path")).toBe(true);
  });

  it("должен отклонять некорректные URL", () => {
    expect(validators.url("invalid")).toBe(false);
    expect(validators.url("example.com")).toBe(false);
  });

  it("должен возвращать false для массивов", () => {
    expect(validators.url(["https://example.com"])).toBe(false);
  });
});

describe("Validators - number", () => {
  it("должен проверять корректные числа", () => {
    expect(validators.number(42)).toBe(true);
    expect(validators.number("42")).toBe(true);
    expect(validators.number("3.14")).toBe(true);
  });

  it("должен отклонять некорректные числа", () => {
    expect(validators.number("abc")).toBe(false);
    expect(validators.number("")).toBe(false);
    expect(validators.number("  ")).toBe(false);
  });
});

describe("Validators - integer", () => {
  it("должен проверять целые числа", () => {
    expect(validators.integer(42)).toBe(true);
    expect(validators.integer("42")).toBe(true);
  });

  it("должен отклонять нецелые числа", () => {
    expect(validators.integer(3.14)).toBe(false);
    expect(validators.integer("3.14")).toBe(false);
  });

  it("должен отклонять некорректные значения", () => {
    expect(validators.integer("abc")).toBe(false);
  });
});

describe("Validators - step", () => {
  it("должен проверять кратность числа", () => {
    expect(validators.step(10, 5)).toBe(true);
    expect(validators.step(15, 5)).toBe(true);
    expect(validators.step(7, 5)).toBe(false);
  });

  it("должен работать с дробными шагами", () => {
    expect(validators.step(3, 1.5)).toBe(true);
    expect(validators.step(4.5, 1.5)).toBe(true);
    expect(validators.step(4, 1.5)).toBe(false);
  });
});

describe("formatErrorMessage", () => {
  it("должен форматировать сообщение с параметром", () => {
    const message = "Минимальная длина: {0}";
    expect(formatErrorMessage(message, 5)).toBe("Минимальная длина: 5");
  });

  it("должен возвращать сообщение без изменений если параметр не передан", () => {
    const message = "Это поле обязательно";
    expect(formatErrorMessage(message)).toBe("Это поле обязательно");
  });

  it("должен работать со строковыми параметрами", () => {
    const message = "Паттерн: {0}";
    expect(formatErrorMessage(message, "[A-Z]+")).toBe("Паттерн: [A-Z]+");
  });
});
