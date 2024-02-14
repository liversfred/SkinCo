import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from 'src/app/constants/constants';
import { UserConstants } from 'src/app/constants/user.constants';
import { mobileNumberValidator } from 'src/app/validators/mobile-number-validator';
import { passwordStandardValidator } from 'src/app/validators/password-standard-validator.directive';
import { passwordsDoNotMatchValidator } from 'src/app/validators/passwordsDoNotMatchValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup | undefined;
  showPassword: boolean = false;
  genderOptions: string[] = [...Constants.genderOptions];
  maxAge: number = Constants.maxAge;
  firstNameMaxLength: number = Constants.firstNameMaxLength;
  middleNameMaxLength: number = Constants.middleNameMaxLength;
  lastNameMaxLength: number = Constants.lastNameMaxLength;
  mobileNumberMaxLength: number = Constants.mobileNumberMaxLength;
  emailMaxLength: number = Constants.emailMaxLength;
  userType: string = UserConstants.patient;
  roles: string[] = [UserConstants.patient, UserConstants.staff];

  constructor( ) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.registerForm = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.firstNameMaxLength)] }),
      lastName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.middleNameMaxLength)] }),
      middleName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.lastNameMaxLength)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)] }),
      mobileNumber: new FormControl('', { validators: [Validators.required, Validators.minLength(this.mobileNumberMaxLength), Validators.maxLength(this.mobileNumberMaxLength), mobileNumberValidator()] }),
      gender: new FormControl(null, { validators: [Validators.required] }),
      age: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(100)] }),
      password: new FormControl('', { validators: [Validators.required, passwordStandardValidator ] }),
      confirmPassword: new FormControl('', { validators: [Validators.required, passwordsDoNotMatchValidator.bind(this)] })
    });
  }

  onOptionSelected(option: string){
    this.userType = option;
  }

  onSubmit(){
    console.log("Register Submitted");
    console.log(this.registerForm);
  }
}
