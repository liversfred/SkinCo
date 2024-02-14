import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mobileNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const numericPattern = /^[0-9]+$/;
    const mobileNumber = control.value;

    if (mobileNumber && !numericPattern.test(mobileNumber)) {
      return { invalidMobileNumber: true };
    }

    return null;
  };
}
