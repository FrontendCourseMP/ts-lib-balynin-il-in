# JustIlindate

Современная TypeScript библиотека для валидации форм с полной поддержкой Constraint Validation API.

## Особенности

- **Автоматическая валидация** на основе HTML-атрибутов (required, minlength, maxlength, min, max, pattern, type)
- **Кастомные правила валидации** через JavaScript API
- **Полная типизация** на TypeScript без использования `any`
- **Валидация разных типов данных**: строки, числа, массивы (чекбоксы/радио)
- **Автоматическое создание контейнеров ошибок** под полями формы
- **Умная обработка необязательных полей** - валидация только при наличии значения
- **Гибкая настройка** через опции

---

## Требования к форме

Для корректной работы библиотеки форма должна соответствовать следующим требованиям:

### Обязательные требования

1. **Каждое поле должно иметь атрибут `name` или `id`**

   ```html
   <input type="text" name="username" />
   <!-- или -->
   <input type="text" id="username" />
   ```

2. **Каждое поле должно иметь связанный `<label>`**

   ```html
   <!-- Через атрибут for -->
   <label for="email">Email</label>
   <input type="email" id="email" name="email" />

   <!-- Или как родительский элемент -->
   <label>
     Email
     <input type="email" name="email" />
   </label>
   ```

3. **Для групп чекбоксов/радио все элементы должны иметь одинаковый `name`**
   ```html
   <input type="checkbox" name="interests" value="coding" />
   <input type="checkbox" name="interests" value="design" />
   <input type="checkbox" name="interests" value="music" />
   ```

### Рекомендации

- Оберните группы чекбоксов/радио в контейнер с классом `.checkbox-group` или `.radio-group` для правильного размещения ошибок
- Используйте атрибут `novalidate` на форме, чтобы отключить встроенную браузерную валидацию

---

## Установка

```bash
npm install justilindate
```

---

## Quick Start

### 1. Создайте HTML форму

```html
<form id="registration-form" novalidate>
  <div>
    <label for="username">Имя пользователя</label>
    <input
      type="text"
      id="username"
      name="username"
      required
      minlength="3"
      maxlength="20"
    />
  </div>

  <div>
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required />
  </div>

  <div>
    <label for="age">Возраст</label>
    <input type="number" id="age" name="age" min="18" max="100" />
  </div>

  <button type="submit">Отправить</button>
</form>
```

### 2. Инициализируйте валидатор

```typescript
import { JustIlindate } from "justilindate";

const validator = new JustIlindate("#registration-form", {
  validateOnBlur: true,
  validateOnInput: true,
});

// Обработка успешной валидации
validator.onSuccessSubmit((event) => {
  console.log("Форма валидна!");
  // Отправка данных на сервер
});
```

### 3. Добавьте кастомные правила (опционально)

```typescript
validator.addRule(
  "username",
  (value) => {
    return typeof value === "string" && /^[a-zA-Z0-9_]+$/.test(value);
  },
  "Имя может содержать только буквы, цифры и подчеркивание"
);
```

---

## Примеры использования

### Валидация email с доменом

```typescript
const validator = new JustIlindate("#form");

validator.addRule(
  "email",
  (value) => {
    if (typeof value === "string") {
      return value.endsWith("@company.com");
    }
    return false;
  },
  "Email должен быть от домена @company.com"
);
```

### Валидация пароля с требованиями

```typescript
validator.addRule(
  "password",
  (value) => {
    if (typeof value === "string") {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*]/.test(value);
      return hasUpperCase && hasNumber && hasSpecialChar;
    }
    return false;
  },
  "Пароль должен содержать заглавную букву, цифру и специальный символ"
);
```

### Валидация группы чекбоксов

```html
<div class="checkbox-group">
  <label>Выберите интересы (минимум 2):</label>
  <div>
    <input type="checkbox" id="coding" name="interests" value="coding" />
    <label for="coding">Программирование</label>
  </div>
  <div>
    <input type="checkbox" id="design" name="interests" value="design" />
    <label for="design">Дизайн</label>
  </div>
  <div>
    <input type="checkbox" id="music" name="interests" value="music" />
    <label for="music">Музыка</label>
  </div>
</div>
```

```typescript
validator.addRule(
  "interests",
  (value) => {
    return Array.isArray(value) && value.length >= 2;
  },
  "Выберите минимум 2 интереса"
);
```

### Валидация совпадения паролей

```typescript
validator.addRule(
  "password_confirm",
  (value) => {
    const password =
      document.querySelector<HTMLInputElement>("#password")?.value;
    return value === password;
  },
  "Пароли не совпадают"
);
```

### Валидация телефона

```html
<input type="tel" name="phone" pattern="[0-9]{10}" placeholder="9991234567" />
```

```typescript
validator.addRule(
  "phone",
  (value) => {
    return typeof value === "string" && /^[0-9]{10}$/.test(value);
  },
  "Введите 10 цифр без пробелов и дефисов"
);
```

---

## API Reference

### Constructor

```typescript
new JustIlindate(
  formSelector: string | HTMLFormElement,
  options?: ValidatorOptions
)
```

**Параметры:**

- `formSelector` - CSS селектор формы (например, `#myForm`) или HTMLFormElement
- `options` - объект настроек (опционально)

**Опции:**

```typescript
interface ValidatorOptions {
  suppressWarnings?: boolean; // Отключить предупреждения в консоли (по умолчанию: false)
  validateOnBlur?: boolean; // Валидация при потере фокуса (по умолчанию: true)
  validateOnInput?: boolean; // Валидация при вводе (по умолчанию: false)
  errorClass?: string; // CSS класс для контейнера ошибок (по умолчанию: 'justilindate-error')
  successClass?: string; // CSS класс для валидного поля (по умолчанию: 'justilindate-success')
}
```

**Пример:**

```typescript
const validator = new JustIlindate("#form", {
  suppressWarnings: true,
  validateOnBlur: true,
  validateOnInput: false,
  errorClass: "error-message",
  successClass: "valid-field",
});
```

---

### Методы

#### `addRule(fieldName, validator, errorMessage)`

Добавляет кастомное правило валидации для поля.

**Параметры:**

- `fieldName: string` - имя поля (значение атрибута `name` или `id`)
- `validator: (value: FieldValue) => boolean` - функция валидации, возвращает `true` если значение валидно
- `errorMessage: string` - сообщение об ошибке

**Возвращает:** `this` (для цепочки вызовов)

**Пример:**

```typescript
validator
  .addRule(
    "username",
    (value) => {
      return typeof value === "string" && value.length >= 3;
    },
    "Минимум 3 символа"
  )
  .addRule(
    "username",
    (value) => {
      return typeof value === "string" && /^[a-zA-Z]/.test(value);
    },
    "Должно начинаться с буквы"
  );
```

**Типы значений:**

```typescript
type FieldValue = string | number | string[];

// Для текстовых полей: string
// Для type="number": number
// Для чекбоксов/радио: string[]
```

---

#### `validate()`

Валидирует всю форму.

**Возвращает:**

```typescript
interface ValidationResult {
  isValid: boolean; // true если форма валидна
  errors: Record<string, string[]>; // объект с ошибками по полям
}
```

**Пример:**

```typescript
const result = validator.validate();

if (result.isValid) {
  console.log("Форма валидна!");
} else {
  console.log("Ошибки:", result.errors);
  // {
  //   username: ['Минимум 3 символа', 'Должно начинаться с буквы'],
  //   email: ['Введите корректный email']
  // }
}
```

---

#### `reset()`

Сбрасывает форму и очищает все ошибки.

**Пример:**

```typescript
validator.reset();
```

---

#### `onSuccessSubmit(callback)`

Регистрирует callback, который вызывается при успешной валидации формы после submit.

**Параметры:**

- `callback: (event: Event) => void` - функция обработчик

**Пример:**

```typescript
validator.onSuccessSubmit((event) => {
  console.log("Форма отправлена!", event);

  // Получить данные формы
  const formData = new FormData(event.target as HTMLFormElement);

  // Отправить на сервер
  fetch("/api/submit", {
    method: "POST",
    body: formData,
  });
});
```

---

## Поддерживаемые HTML атрибуты

Библиотека автоматически создает правила валидации на основе следующих атрибутов:

| Атрибут         | Описание                        | Пример                            |
| --------------- | ------------------------------- | --------------------------------- |
| `required`      | Поле обязательно для заполнения | `<input required>`                |
| `minlength`     | Минимальная длина строки        | `<input minlength="3">`           |
| `maxlength`     | Максимальная длина строки       | `<input maxlength="20">`          |
| `min`           | Минимальное значение числа      | `<input type="number" min="18">`  |
| `max`           | Максимальное значение числа     | `<input type="number" max="100">` |
| `pattern`       | Регулярное выражение            | `<input pattern="[A-Z]{3}">`      |
| `step`          | Шаг для числовых значений       | `<input type="number" step="5">`  |
| `type="email"`  | Валидация email                 | `<input type="email">`            |
| `type="url"`    | Валидация URL                   | `<input type="url">`              |
| `type="number"` | Валидация числа                 | `<input type="number">`           |

---

## Встроенные валидаторы

Библиотека предоставляет набор встроенных валидаторов, которые можно использовать в кастомных правилах:

```typescript
import { validators } from "justilindate";

// Доступные валидаторы:
validators.required(value); // Проверка на обязательность
validators.minLength(value, min); // Минимальная длина
validators.maxLength(value, max); // Максимальная длина
validators.min(value, min); // Минимальное значение
validators.max(value, max); // Максимальное значение
validators.pattern(value, pattern); // Соответствие паттерну
validators.email(value); // Email формат
validators.url(value); // URL формат
validators.number(value); // Является ли числом
validators.integer(value); // Является ли целым числом
validators.step(value, step); // Кратность числа
```

**Пример использования:**

```typescript
import { validators } from "justilindate";

validator.addRule(
  "age",
  (value) => {
    return (
      validators.number(value) &&
      validators.min(value, 18) &&
      validators.max(value, 100)
    );
  },
  "Возраст должен быть числом от 18 до 100"
);
```

---

## Стилизация

Библиотека автоматически добавляет классы к полям и контейнерам ошибок:

### CSS классы по умолчанию

```css
/* Контейнер с ошибками */
.justilindate-error {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: none; /* Показывается автоматически при ошибке */
}

/* Невалидное поле */
input.justilindate-error,
select.justilindate-error,
textarea.justilindate-error {
  border-color: #e74c3c;
}

/* Валидное поле */
input.justilindate-success,
select.justilindate-success,
textarea.justilindate-success {
  border-color: #27ae60;
}
```

### Кастомная стилизация

Вы можете изменить классы через опции:

```typescript
const validator = new JustIlindate("#form", {
  errorClass: "my-error",
  successClass: "my-success",
});
```

Затем определите свои стили:

```css
.my-error {
  color: red;
  background: #ffe6e6;
  padding: 10px;
  border-radius: 4px;
}

.my-success {
  border: 2px solid green;
}
```

---

## Обработка необязательных полей

Библиотека умно обрабатывает необязательные поля:

- **Пустое необязательное поле** - валидация пропускается, поле считается валидным
- **Заполненное необязательное поле** - проверяются все правила валидации

**Пример:**

```html
<!-- Поле URL необязательно, но если заполнено - должно быть валидным -->
<input type="url" name="website" placeholder="https://example.com" />
```

```typescript
const validator = new JustIlindate("#form");

// Если поле пустое - валидация пройдет
// Если введено "invalid" - ошибка
// Если введено "https://site.com" - валидация пройдет
```

---

## Предупреждения

Библиотека выводит предупреждения в консоль в следующих случаях:

1. **Поле без `name` или `id`**

```
JustIlindate: Поле без атрибутов name или id будет проигнорировано
```

2. **Поле без связанного `label`**

```
JustIlindate: Для поля "username" не найден label
```

3. **Конфликт между JS-правилами и HTML-атрибутами**

```
JustIlindate: Правило для поля "username" конфликтует с HTML-атрибутами
```

Чтобы отключить предупреждения:

```typescript
const validator = new JustIlindate("#form", {
  suppressWarnings: true,
});
```

---

## TypeScript поддержка

Библиотека полностью типизирована:

```typescript
import {
  JustIlindate,
  ValidatorOptions,
  ValidationResult,
  FieldValue,
} from "justilindate";

const options: ValidatorOptions = {
  validateOnBlur: true,
  errorClass: "error",
};

const validator = new JustIlindate("#form", options);

const result: ValidationResult = validator.validate();

// Типизация в кастомных валидаторах
validator.addRule(
  "age",
  (value: FieldValue): boolean => {
    if (typeof value === "number") {
      return value >= 18;
    }
    return false;
  },
  "Минимальный возраст: 18"
);
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Лицензия

MIT

---

## Разработка

### Установка зависимостей

```bash
npm install
```

### Запуск в режиме разработки

```bash
npm run dev
```

### Запуск тестов

```bash
npm test
```

### Запуск тестов с UI

```bash
npm run test:ui
```

### Проверка покрытия тестами

```bash
npm run test:coverage
```

### Сборка

```bash
npm run build
```

---
