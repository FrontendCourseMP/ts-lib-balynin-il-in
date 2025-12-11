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