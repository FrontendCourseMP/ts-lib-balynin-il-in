import type { FieldValue, ConstraintValidationAttributes } from "../types";

export function getFieldValue(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
): FieldValue {
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox") {
      const name = element.name;
      if (name) {
        const checkboxes = document.querySelectorAll<HTMLInputElement>(
          `input[type="checkbox"][name="${name}"]`
        );
        return Array.from(checkboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.value);
      }
      return element.checked ? [element.value] : [];
    }
    if (element.type === "radio") {
      const name = element.name;
      const checked = document.querySelector<HTMLInputElement>(
        `input[type="radio"][name="${name}"]:checked`
      );
      return checked ? checked.value : "";
    }
    if (element.type === "number") {
      return element.value === "" ? "" : Number(element.value);
    }
  }
  return element.value;
}

export function isCheckboxOrRadioGroup(element: HTMLInputElement): boolean {
  return (
    (element.type === "checkbox" || element.type === "radio") &&
    element.name !== ""
  );
}

export function getConstraintAttributes(
  element: HTMLElement
): ConstraintValidationAttributes {
  const attrs: ConstraintValidationAttributes = {};

  if (element.hasAttribute("required")) {
    attrs.required = true;
  }
  if (element.hasAttribute("minlength")) {
    attrs.minlength = Number(element.getAttribute("minlength"));
  }
  if (element.hasAttribute("maxlength")) {
    attrs.maxlength = Number(element.getAttribute("maxlength"));
  }
  if (element.hasAttribute("min")) {
    attrs.min = Number(element.getAttribute("min"));
  }
  if (element.hasAttribute("max")) {
    attrs.max = Number(element.getAttribute("max"));
  }
  if (element.hasAttribute("pattern")) {
    attrs.pattern = element.getAttribute("pattern") || "";
  }
  if (element.hasAttribute("type")) {
    attrs.type = element.getAttribute("type") || "";
  }
  if (element.hasAttribute("step")) {
    attrs.step = Number(element.getAttribute("step"));
  }

  return attrs;
}

export function createErrorContainer(
  field: HTMLElement,
  errorClass: string
): HTMLElement {
  const container = document.createElement("div");
  container.className = errorClass;
  container.style.display = "none";

  if (field instanceof HTMLInputElement && isCheckboxOrRadioGroup(field)) {
    const name = field.name;
    const group = document.querySelectorAll<HTMLInputElement>(
      `input[name="${name}"]`
    );
    const lastElement = group[group.length - 1];

    if (lastElement && lastElement.parentNode) {
      const groupContainer =
        lastElement.closest(".checkbox-group, .radio-group") || lastElement;
      if (groupContainer.parentNode) {
        groupContainer.parentNode.insertBefore(
          container,
          groupContainer.nextSibling
        );
      }
    }
  } else {
    if (field.parentNode) {
      field.parentNode.insertBefore(container, field.nextSibling);
    }
  }

  return container;
}

export function findLabel(field: HTMLElement): HTMLLabelElement | null {
  const id = field.getAttribute("id");
  if (id) {
    return document.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
  }

  let parent = field.parentElement;
  while (parent) {
    if (parent.tagName === "LABEL") {
      return parent as HTMLLabelElement;
    }
    parent = parent.parentElement;
  }

  return null;
}
