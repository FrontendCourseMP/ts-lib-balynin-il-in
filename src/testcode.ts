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