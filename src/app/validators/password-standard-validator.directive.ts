import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordStandardValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.root.get('password');
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Test the password against the regular expression
  if (password && password.value && !passwordRegex.test(password.value)) {
    return { passwordStandard: true };
  }

  return null;
};