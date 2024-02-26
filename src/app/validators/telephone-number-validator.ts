import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function telephoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const numericPattern = /^[0-9]+$/;
    const telephoneNumber = control.value;

    if (telephoneNumber && !numericPattern.test(telephoneNumber)) {
      return { invalidTelephoneNumber: true };
    }

    return null;
  };
}
