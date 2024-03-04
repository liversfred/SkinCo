import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numericInputValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const numericPattern = /^[0-9]+$/;
    const input = control.value;

    if (input && !numericPattern.test(input)) {
      return { invalidNumericInput: true };
    }

    return null;
  };
}
