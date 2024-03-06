import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordsDoNotMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.root.get('password');
  const confirmPassword = control.root.get('confirmPassword');
  
  if (password && confirmPassword && password?.value !== confirmPassword?.value) {
    return { 'passwordsDoNotMatch': true };
  }

  return null;
};