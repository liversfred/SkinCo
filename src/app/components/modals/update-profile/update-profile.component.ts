import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import { GenderConstants } from 'src/app/constants/gender.constants';
import { Person } from 'src/app/models/person.model';
import { UserData } from 'src/app/models/user-data.model';
import { GlobalService } from 'src/app/services/global.service';
import { numericInputValidator } from 'src/app/validators/numeric-input-validator.directive';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss'],
})
export class UpdateProfileComponent  implements OnInit {
  @Input() data: any;
  profileForm: FormGroup | undefined;
  genderOptions: string[] = [...GenderConstants.GENDER_OPTIONS];
  maxAge: number = FormConstants.maxAge;
  firstNameMaxLength: number = FormConstants.firstNameMaxLength;
  middleNameMaxLength: number = FormConstants.middleNameMaxLength;
  lastNameMaxLength: number = FormConstants.lastNameMaxLength;
  mobileNumberMaxLength: number = FormConstants.mobileNumberMaxLength;
  emailMaxLength: number = FormConstants.emailMaxLength;
  
  constructor(private _globalService: GlobalService) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup(){
    this.profileForm = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.firstNameMaxLength)] }),
      middleName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.lastNameMaxLength)] }),
      lastName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.middleNameMaxLength)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)] }),
      mobileNumber: new FormControl('', { validators: [Validators.required, Validators.minLength(this.mobileNumberMaxLength), Validators.maxLength(this.mobileNumberMaxLength), numericInputValidator()] }),
      gender: new FormControl(null, { validators: [Validators.required] }),
      age: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(100)] }),
    });

    if(this.data?.userData) {
      const userData: UserData = this.data.userData;
      this.profileForm?.get('firstName')?.setValue(userData.person.firstName);
      this.profileForm?.get('middleName')?.setValue(userData.person.middleName);
      this.profileForm?.get('lastName')?.setValue(userData.person.lastName);
      this.profileForm?.get('email')?.setValue(userData.person.email);
      this.profileForm?.get('mobileNumber')?.setValue(userData.person.mobileNumber);
      this.profileForm?.get('gender')?.setValue(userData.person.gender);
      this.profileForm?.get('age')?.setValue(userData.person.age);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.profileForm?.invalid) {
      this._globalService.showErrorAlert("Please fill in all the fields.");
      return;
    }

    const person: Person = {
      firstName: this.profileForm?.value.firstName.trim(),
      middleName: this.profileForm?.value.middleName.trim(),
      lastName: this.profileForm?.value.lastName.trim(),
      email: this.profileForm?.value.email.trim(),
      mobileNumber: this.profileForm?.value.mobileNumber.trim(),
      gender: this.profileForm?.value.gender.trim(),
      age: this.profileForm?.value.age,
    } 
    const userData: UserData = {  
      ...this.data.userData,
      person 
    };
    
    this.dismiss(userData);
  }
}
