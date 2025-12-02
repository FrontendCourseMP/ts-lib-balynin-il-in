# JustIlindate

Легковесная, типизированная и модульная библиотека для валидации форм на TypeScript.
Вдохновлена JustValidate, но написана с упором на строгую архитектуру и расширяемость.

## Особенности

* **TypeScript First:** Полная типизация всех параметров.
* **Dual Configuration:** Поддержка HTML5 атрибутов (`required`, `min`, `pattern`) и JS-конфигурации.
* **Conflict Detection:** Умная система предупреждений, если JS правила противоречат HTML атрибутам.
* **Modular Architecture:** Валидаторы, рендеринг ошибок и логика DOM разделены.
* **No Dependencies:** 0 зависимостей.

## Установка

Пока библиотека в разработке, просто скопируйте папку `src` в ваш проект.

## Быстрый старт

### HTML
```html
<form id="myForm">
  <label>
    Имя
    <input type="text" name="name" id="name" required minlength="3">
  </label>

  <label>
    Email
    <input type="email" name="email" id="email">
  </label>

  <button type="submit">Отправить</button>
</form>
```

### Typescript
``` TypeScript
import { JustIlindate } from './core/JustIlindate';

const validate = new JustIlindate('#myForm', {
  errorClass: 'is-invalid',
  validateOnBlur: true,
});

validate
  .addField('name', [
    { 
      type: 'maxLength', 
      value: 15, 
      errorMessage: 'Имя слишком длинное!' 
    }
  ])
  .addField('email', [
    { 
      type: 'required', 
      errorMessage: 'Email обязателен' 
    },
    { 
      type: 'email', 
      errorMessage: 'Некорректный email адрес' 
    }
  ]);
```

## Структура проекта 

* `core/` — Ядро библиотеки (Validator, Event Loop).
* `ui/` — Работа с DOM (FieldManager, ErrorRenderer).
* `validators/` — Чистые функции валидации (String, Number, Array).
* `utils/` — Хелперы.
