// Точка входа в ваше решение
import type {FieldValidation, ValidateRule, ValidationSchema} from "./types/types"

interface CheckFormValidate {
    formElement: HTMLFormElement | string;
}

class JustIlindate {
    form: ValidationSchema;

    constructor(form: ValidationSchema) {
        this.form = form;
        this.CheckForm;
    }

    private CheckForm(params: CheckFormValidate): boolean {
        const { formElement } = params;

        const form = typeof formElement === "string"
        ? document.querySelector(formElement)
        : formElement;

        if (!form) {
            console.error("Форма не найдена");
            return false;
        }

        let isValid = true;

        for ( const FieldValidation of this.form ) {
            const { fieldName, rules } = FieldValidation;


            const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`) as HTMLInputElement | null;

            if(!field) {
                console.error('Поле для ввода не найдено ');
                isValid = false;
                continue;
            }

            const label = form.querySelector(`label[for="${fieldName || field.id}"]`) || field.closest('label') || null;

            if (!label && !field.labels?.length) {
                console.warn(`Label для поля ${fieldName} не найдено!`);
            }

            

        }


        return isValid;
    }

}