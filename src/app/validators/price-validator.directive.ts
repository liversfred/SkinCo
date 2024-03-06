import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const priceValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const pricePattern = /^-?\d*[.,]?\d{0,2}$/;

  if (control.value && !pricePattern.test(control.value)) {
    return { 'invalidPriceFormat': { value: control.value } };
  }

  return null;
};