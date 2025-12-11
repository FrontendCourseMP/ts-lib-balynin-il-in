/* eslint-disable no-alert */
/* eslint-disable no-console */
import { JustIlindate } from "./core/JustIlindate";

document.addEventListener("DOMContentLoaded", () => {
  const validator = new JustIlindate("#registration-form", {
    suppressWarnings: false,
    validateOnBlur: true,
    validateOnInput: true,
    errorClass: "error-message",
    successClass: "success-field",
  });

  validator.addRule(
    "email",
    (value) => {
      if (typeof value === "string") {
        return value.includes("@company.com");
      }
      return false;
    },
    "Email должен быть от домена @company.com"
  );

  validator.addRule(
    "password",
    (value) => {
      if (typeof value === "string") {
        return /[A-Z]/.test(value) && /[0-9]/.test(value);
      }
      return false;
    },
    "Пароль должен содержать заглавную букву и цифру"
  );

  validator.addRule(
    "interests",
    (value) => Array.isArray(value) && value.length >= 2,
    "Выберите минимум 2 интереса"
  );

  validator.onSuccessSubmit((event) => {
    console.log("Форма успешно валидирована!", event);
    alert("Форма успешно отправлена!");
  });

  const resetButton =
    document.querySelector<HTMLButtonElement>("#reset-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      validator.reset();
    });
  }
});
