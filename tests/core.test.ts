// tests/core.test.ts

import { describe, it, expect, vi, afterEach } from "vitest";
import { JustIlindate } from "../src/core/JustIlindate";

describe("JustIlindate - Инициализация", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("должен создать инстанс с селектором формы", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form");
    expect(validator).toBeInstanceOf(JustIlindate);
  });

  it("должен создать инстанс с элементом формы", () => {
    const form = document.createElement("form");
    form.innerHTML = `
      <label for="email">Email</label>
      <input type="email" id="email" name="email">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate(form);
    expect(validator).toBeInstanceOf(JustIlindate);
  });

  it("должен выбросить ошибку если форма не найдена", () => {
    expect(() => {
      new JustIlindate("#non-existent-form");
    }).toThrow('Форма с селектором "#non-existent-form" не найдена');
  });

  it("должен принимать опции", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
      validateOnBlur: false,
      errorClass: "custom-error",
    });

    expect(validator).toBeInstanceOf(JustIlindate);
  });
});

describe("JustIlindate - Валидация HTML атрибутов", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("должен валидировать required поле", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required>
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });

  it("должен валидировать minlength", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username" minlength="5" value="abc">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors.username).toBeDefined();
  });

  it("должен валидировать maxlength", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username" maxlength="5" value="toolongvalue">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });

  it("должен валидировать min для чисел", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="age">Age</label>
      <input type="number" id="age" name="age" min="18" value="10">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });

  it("должен валидировать max для чисел", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="age">Age</label>
      <input type="number" id="age" name="age" max="100" value="150">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });

  it("должен валидировать pattern", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="code">Code</label>
      <input type="text" id="code" name="code" pattern="[A-Z]{3}" value="abc">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });

  it('должен валидировать type="email"', () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="email">Email</label>
      <input type="email" id="email" name="email" value="invalid-email">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });

  it('должен валидировать type="url"', () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="website">Website</label>
      <input type="url" id="website" name="website" value="not-a-url">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });
});

describe("JustIlindate - Валидация чекбоксов", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("должен валидировать группу чекбоксов", () => {
    const form = document.createElement("form");
    form.id = "test-form-checkboxes";
    form.innerHTML = `
      <label>Interests</label>
      <div class="checkbox-group">
        <input type="checkbox" id="cb1" name="interests" value="coding" checked>
        <input type="checkbox" id="cb2" name="interests" value="design">
        <input type="checkbox" id="cb3" name="interests" value="music" checked>
      </div>
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form-checkboxes", {
      suppressWarnings: true,
    });

    validator.addRule(
      "interests",
      (value) => {
        return Array.isArray(value) && value.length >= 2;
      },
      "Выберите минимум 2 варианта"
    );

    const result = validator.validate();
    expect(result.isValid).toBe(true);
    expect(result.errors.interests).toBeUndefined();
  });

  it("должен пройти валидацию при выборе достаточного количества", () => {
    const form = document.createElement("form");
    form.id = "test-form-checkboxes-valid";
    form.innerHTML = `
      <label>Interests</label>
      <div class="checkbox-group">
        <input type="checkbox" id="cb1" name="interests" value="coding" checked>
        <input type="checkbox" id="cb2" name="interests" value="design" checked>
        <input type="checkbox" id="cb3" name="interests" value="music">
      </div>
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form-checkboxes-valid", {
      suppressWarnings: true,
    });

    validator.addRule(
      "interests",
      (value) => {
        return Array.isArray(value) && value.length >= 2;
      },
      "Выберите минимум 2 варианта"
    );

    const result = validator.validate();
    expect(result.isValid).toBe(true);
  });
});

describe("JustIlindate - Кастомные правила", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("должен добавлять кастомное правило", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="password">Password</label>
      <input type="password" id="password" name="password" value="short">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });

    validator.addRule(
      "password",
      (value) => {
        return typeof value === "string" && value.length >= 8;
      },
      "Пароль должен быть минимум 8 символов"
    );

    const result = validator.validate();
    expect(result.isValid).toBe(false);
  });

  it("должен выбросить ошибку при добавлении правила для несуществующего поля", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });

    expect(() => {
      validator.addRule("nonexistent", () => true, "Error");
    }).toThrow('Поле "nonexistent" не найдено');
  });
});

describe("JustIlindate - Необязательные поля", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("не должен валидировать пустое необязательное поле", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="website">Website</label>
      <input type="url" id="website" name="website">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(true);
  });

  it("должен валидировать заполненное необязательное поле", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="website">Website</label>
      <input type="url" id="website" name="website" value="not-a-url">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(false);
  });

  it("должен пройти валидацию для корректного необязательного поля", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="website">Website</label>
      <input type="url" id="website" name="website" value="https://example.com">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const result = validator.validate();

    expect(result.isValid).toBe(true);
  });
});

describe("JustIlindate - Методы", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("должен сбрасывать форму", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username">
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const input = form.querySelector<HTMLInputElement>("#username")!;

    input.value = "test";
    expect(input.value).toBe("test");

    validator.reset();
    expect(input.value).toBe("");
  });

  it("должен вызывать callback при успешной валидации", () => {
    const form = document.createElement("form");
    form.id = "test-form";
    form.innerHTML = `
      <label for="username">Username</label>
      <input type="text" id="username" name="username" required>
      <button type="submit">Submit</button>
    `;
    document.body.appendChild(form);

    const validator = new JustIlindate("#test-form", {
      suppressWarnings: true,
    });
    const input = form.querySelector<HTMLInputElement>("#username")!;

    const callback = vi.fn();
    validator.onSuccessSubmit(callback);

    input.value = "testuser";
    form.dispatchEvent(new Event("submit"));

    expect(callback).toHaveBeenCalled();
  });
});
