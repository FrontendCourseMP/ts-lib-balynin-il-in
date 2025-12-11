# JustIlindate

Легковесная, типизированная и модульная библиотека для валидации форм на TypeScript.

## Особенности

- **TypeScript First:** Полная типизация всех параметров.
- **Dual Configuration:** Поддержка HTML5 атрибутов (`required`, `min`, `pattern`) и JS-конфигурации.
- **Conflict Detection:** Умная система предупреждений, если JS правила противоречат HTML атрибутам.
- **Modular Architecture:** Валидаторы, рендеринг ошибок и логика DOM разделены.
- **No Dependencies:** 0 зависимостей.

## Установка

Пока библиотека в разработке, просто скопируйте папку `src` в ваш проект.

## Быстрый старт

### HTML

```html
<form id="myForm">
  <label>
    Имя
    <input type="text" name="name" id="name" required minlength="3" />
  </label>

  <label>
    Email
    <input type="email" name="email" id="email" />
  </label>

  <button type="submit">Отправить</button>
</form>
```

### Typescript

```typescript
import { JustIlindate } from "./core/JustIlindate";
import { validators, errorMessages, formatErrorMessage } from "./validators"; // Нужен для создания кастомных правил

const validate = new JustIlindate("#myForm", {
  errorClass: "is-invalid",
  validateOnBlur: true,
});

// Добавляем кастомное правило для поля 'name'
validate.addRule(
  "name",
  (value) => validators.maxLength(value, 15),
  formatErrorMessage("Имя должно быть не длиннее {0} символов", 15)
);

// Добавляем кастомное правило (которое переопределяет или дополняет required) для 'email'
validate.addRule(
  "email",
  (value) => validators.required(value),
  errorMessages.required
);
```

## Структура проекта

- #### core/ — Ядро библиотеки (Основной класс, логика Event Loop).

- #### utils/ — Хелперы (Работа с DOM, извлечение значений, атрибутов).

- #### validators/ — Чистые функции валидации и сообщения об ошибках.
