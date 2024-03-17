import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormConstants } from 'src/app/constants/form.constants';
import { GenderConstants } from 'src/app/constants/gender.constants';
import { Doctor } from 'src/app/models/doctor.model';
import { Person } from 'src/app/models/person.model';
import { Specialization } from 'src/app/models/speicialization.model';
import { GlobalService } from 'src/app/services/global.service';
import { SpecializationService } from 'src/app/services/specialization.service';
import { numericInputValidator } from 'src/app/validators/numeric-input-validator.directive';

@Component({
  selector: 'app-add-doctor',
  templateUrl: './add-doctor.component.html',
  styleUrls: ['./add-doctor.component.scss'],
})
export class AddDoctorComponent  implements OnInit {
  @Input() data: any;
  addDoctorForm: FormGroup | undefined;
  specializations: Specialization[] = [];
  genderOptions: string[] = [...GenderConstants.GENDER_OPTIONS];
  maxAge: number = FormConstants.maxAge;
  firstNameMaxLength: number = FormConstants.firstNameMaxLength;
  middleNameMaxLength: number = FormConstants.middleNameMaxLength;
  lastNameMaxLength: number = FormConstants.lastNameMaxLength;
  mobileNumberMaxLength: number = FormConstants.mobileNumberMaxLength;
  emailMaxLength: number = FormConstants.emailMaxLength;

  constructor(private _globalService: GlobalService, private _specializationService: SpecializationService) { }

  async ngOnInit() {
    this._globalService.showLoader('Preparing the form...');

    this.initializeFormGroup();

    await this.fetchSpecializations();

    this._globalService.hideLoader();
  }

  async fetchSpecializations(){
    this.specializations = await this._specializationService.fetchSpecializations();
  }

  initializeFormGroup(){
    this.addDoctorForm = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.firstNameMaxLength)] }),
      middleName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.lastNameMaxLength)] }),
      lastName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.middleNameMaxLength)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)] }),
      mobileNumber: new FormControl('', { validators: [Validators.required, Validators.minLength(this.mobileNumberMaxLength), Validators.maxLength(this.mobileNumberMaxLength), numericInputValidator()] }),
      gender: new FormControl(null, { validators: [Validators.required] }),
      age: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(100)] }),
      specializationId: new FormControl(null, { validators: [Validators.required] }),
    });

    if(this.data?.doctor) {
      const doctor: Doctor = this.data.doctor;
      this.addDoctorForm?.get('firstName')?.setValue(doctor.person.firstName);
      this.addDoctorForm?.get('middleName')?.setValue(doctor.person.middleName);
      this.addDoctorForm?.get('lastName')?.setValue(doctor.person.lastName);
      this.addDoctorForm?.get('email')?.setValue(doctor.person.email);
      this.addDoctorForm?.get('mobileNumber')?.setValue(doctor.person.mobileNumber);
      this.addDoctorForm?.get('gender')?.setValue(doctor.person.gender);
      this.addDoctorForm?.get('age')?.setValue(doctor.person.age);
      this.addDoctorForm?.get('specializationId')?.setValue(doctor.specialization.id);
    }
  }
  
  dismiss(val?: any) {
    this._globalService.dismissModal(val);
  }

  done(){
    if(this.addDoctorForm?.invalid) {
      this._globalService.showCloseAlert("Please fill in all the fields.");
      return;
    }

    const person: Person = {
      firstName: this.addDoctorForm?.value.firstName.trim(),
      middleName: this.addDoctorForm?.value.middleName.trim(),
      lastName: this.addDoctorForm?.value.lastName.trim(),
      email: this.addDoctorForm?.value.email.trim(),
      mobileNumber: this.addDoctorForm?.value.mobileNumber.trim(),
      gender: this.addDoctorForm?.value.gender.trim(),
      age: this.addDoctorForm?.value.age,
    } 
    const specialization = this.specializations.find(x => x.id == this.addDoctorForm?.value.specializationId);
    const doctor: any = {  person, specialization };
    
    this.dismiss(doctor);
  }
}
