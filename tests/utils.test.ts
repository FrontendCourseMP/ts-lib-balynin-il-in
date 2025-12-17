// tests/utils.test.ts

import { describe, it, expect } from "vitest";
import {
  getFieldValue,
  isCheckboxOrRadioGroup,
  getConstraintAttributes,
  findLabel,
} from "../src/utils";

describe("Utils - getFieldValue", () => {
  it("должен возвращать значение текстового поля", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = "test value";

    expect(getFieldValue(input)).toBe("test value");
  });

  it('должен возвращать число для type="number"', () => {
    const input = document.createElement("input");
    input.type = "number";
    input.value = "42";

    expect(getFieldValue(input)).toBe(42);
  });

  it('должен возвращать пустую строку для пустого type="number"', () => {
    const input = document.createElement("input");
    input.type = "number";
    input.value = "";

    expect(getFieldValue(input)).toBe("");
  });

  it("должен возвращать массив значений для чекбоксов", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input type="checkbox" name="interests" value="coding" checked>
      <input type="checkbox" name="interests" value="design" checked>
      <input type="checkbox" name="interests" value="music">
    `;
    document.body.appendChild(container);

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[name="interests"]'
    )!;
    const value = getFieldValue(checkbox);

    expect(Array.isArray(value)).toBe(true);
    expect(value).toEqual(["coding", "design"]);

    document.body.removeChild(container);
  });

  it("должен возвращать пустой массив для невыбранных чекбоксов", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input type="checkbox" name="interests" value="coding">
      <input type="checkbox" name="interests" value="design">
    `;
    document.body.appendChild(container);

    const checkbox = container.querySelector<HTMLInputElement>(
      'input[name="interests"]'
    )!;
    const value = getFieldValue(checkbox);

    expect(value).toEqual([]);

    document.body.removeChild(container);
  });

  it("должен возвращать значение выбранной радио-кнопки", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input type="radio" name="gender" value="male">
      <input type="radio" name="gender" value="female" checked>
    `;
    document.body.appendChild(container);

    const radio = container.querySelector<HTMLInputElement>(
      'input[name="gender"]'
    )!;
    expect(getFieldValue(radio)).toBe("female");

    document.body.removeChild(container);
  });

  it("должен возвращать пустую строку для невыбранных радио-кнопок", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <input type="radio" name="gender" value="male">
      <input type="radio" name="gender" value="female">
    `;
    document.body.appendChild(container);

    const radio = container.querySelector<HTMLInputElement>(
      'input[name="gender"]'
    )!;
    expect(getFieldValue(radio)).toBe("");

    document.body.removeChild(container);
  });
});

describe("Utils - isCheckboxOrRadioGroup", () => {
  it("должен определять чекбокс с именем как группу", () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "interests";

    expect(isCheckboxOrRadioGroup(checkbox)).toBe(true);
  });

  it("должен определять радио-кнопку с именем как группу", () => {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "gender";

    expect(isCheckboxOrRadioGroup(radio)).toBe(true);
  });

  it("не должен определять чекбокс без имени как группу", () => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "";

    expect(isCheckboxOrRadioGroup(checkbox)).toBe(false);
  });

  it("не должен определять обычный input как группу", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.name = "username";

    expect(isCheckboxOrRadioGroup(input)).toBe(false);
  });
});

describe("Utils - getConstraintAttributes", () => {
  it("должен извлекать атрибут required", () => {
    const input = document.createElement("input");
    input.setAttribute("required", "");

    const attrs = getConstraintAttributes(input);
    expect(attrs.required).toBe(true);
  });

  it("должен извлекать minlength и maxlength", () => {
    const input = document.createElement("input");
    input.setAttribute("minlength", "5");
    input.setAttribute("maxlength", "20");

    const attrs = getConstraintAttributes(input);
    expect(attrs.minlength).toBe(5);
    expect(attrs.maxlength).toBe(20);
  });

  it("должен извлекать min и max для чисел", () => {
    const input = document.createElement("input");
    input.setAttribute("min", "18");
    input.setAttribute("max", "100");

    const attrs = getConstraintAttributes(input);
    expect(attrs.min).toBe(18);
    expect(attrs.max).toBe(100);
  });

  it("должен извлекать pattern", () => {
    const input = document.createElement("input");
    input.setAttribute("pattern", "[A-Za-z]+");

    const attrs = getConstraintAttributes(input);
    expect(attrs.pattern).toBe("[A-Za-z]+");
  });

  it("должен извлекать type", () => {
    const input = document.createElement("input");
    input.setAttribute("type", "email");

    const attrs = getConstraintAttributes(input);
    expect(attrs.type).toBe("email");
  });

  it("должен извлекать step", () => {
    const input = document.createElement("input");
    input.setAttribute("step", "5");

    const attrs = getConstraintAttributes(input);
    expect(attrs.step).toBe(5);
  });

  it("должен возвращать пустой объект для поля без атрибутов", () => {
    const input = document.createElement("input");
    const attrs = getConstraintAttributes(input);

    expect(Object.keys(attrs).length).toBe(0);
  });
});

describe("Utils - findLabel", () => {
  document.body.innerHTML = "";

  it("должен находить label по for", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <label for="username-test">Username</label>
      <input type="text" id="username-test">
    `;
    document.body.appendChild(container);

    const input = container.querySelector<HTMLInputElement>("#username-test")!;
    const label = findLabel(input);

    expect(label).not.toBeNull();
    expect(label?.textContent).toBe("Username");

    document.body.removeChild(container);
  });

  it("должен находить родительский label", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <label>
        Username
        <input type="text" id="username-parent-test">
      </label>
    `;
    document.body.appendChild(container);

    const input = container.querySelector<HTMLInputElement>(
      "#username-parent-test"
    )!;
    expect(input).not.toBeNull();

    const label = findLabel(input);

    expect(label).not.toBeNull();
    expect(label?.tagName).toBe("LABEL");

    document.body.removeChild(container);
  });

  it("должен возвращать null если label не найден", () => {
    const container = document.createElement("div");
    container.innerHTML = `<input type="text" id="username-no-label">`;
    document.body.appendChild(container);

    const input =
      container.querySelector<HTMLInputElement>("#username-no-label")!;
    expect(input).not.toBeNull();

    const label = findLabel(input);

    expect(label).toBeNull();

    document.body.removeChild(container);
  });
});
