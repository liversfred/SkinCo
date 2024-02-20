import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColorConstants } from 'src/app/constants/color.constants';
import { FormConstants } from 'src/app/constants/form.constants';
import { GenderConstants } from 'src/app/constants/gender.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { RoutesConstants } from 'src/app/constants/routes.constants';
import { Role } from 'src/app/models/role.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { RoleService } from 'src/app/services/role.service';
import { TrailService } from 'src/app/services/trail.service';
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
  genderOptions: string[] = [...GenderConstants.GENDER_OPTIONS];
  maxAge: number = FormConstants.maxAge;
  firstNameMaxLength: number = FormConstants.firstNameMaxLength;
  middleNameMaxLength: number = FormConstants.middleNameMaxLength;
  lastNameMaxLength: number = FormConstants.lastNameMaxLength;
  mobileNumberMaxLength: number = FormConstants.mobileNumberMaxLength;
  emailMaxLength: number = FormConstants.emailMaxLength;
  userType: string = Roles.PATIENT;
  rolesOptions: string[] = [Roles.PATIENT, Roles.STAFF];
  roles: Role[] = [];

  constructor(private _trailService: TrailService, private _globalService: GlobalService, private _authService: AuthService, private _router: Router, 
    private _roleService: RoleService) { }

  async ngOnInit() {
    this._globalService.showLoader('Loading...', );
    this.initializeFormGroup();
    await this.initializeRoles();

    // this.registerForm?.get('firstName')?.setValue('User1');
    // this.registerForm?.get('middleName')?.setValue('Middle1');
    // this.registerForm?.get('lastName')?.setValue('Last1');
    // this.registerForm?.get('email')?.setValue('user1@gmail.com');
    // this.registerForm?.get('mobileNumber')?.setValue('09878394938');
    // this.registerForm?.get('gender')?.setValue('Male');
    // this.registerForm?.get('age')?.setValue(23);
    // this.registerForm?.get('password')?.setValue('Password123!');
    // this.registerForm?.get('confirmPassword')?.setValue('Password123!');
    
    this._globalService.hideLoader();
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

  async initializeRoles(): Promise<void> {
    this._roleService.roles.subscribe({
        next: (roles: Role[]) => {
          this.roles = roles
        },
        error: (err: any) => {
          this._globalService.showToast(`Error fetching roles: ${err}`)
        }
      })

    await this._roleService.fetchRoles();
  }

  onOptionSelected(option: string){
    this.userType = option;
  }

  async onSubmit(){
    this._globalService.showLoader('Processing registration...');

    if(this.registerForm?.valid){
      const firstName = this.registerForm?.value.firstName.trim();
      const middleName = this.registerForm?.value.middleName.trim();
      const lastName = this.registerForm?.value.lastName.trim();
      const fullName = this._globalService.formatFullName(firstName, middleName, lastName);
      const action = `${ModifierActions.CREATED} User ${fullName}`;
      const password = this.registerForm?.value.password.trim();
      const role = this.roles.find(x => x.name == this.userType);

      if(!role) {
        this._globalService.showToast("Role cannot be found.");
        return; 
      }

      const userData: UserData = {
        authId: null,
        roleId: role?.id!,
        person: {
          firstName, middleName, lastName,
          email: this.registerForm?.value.email.trim(),
          mobileNumber: this.registerForm?.value.mobileNumber.trim(),
          gender: this.registerForm?.value.gender.trim(),
          age: this.registerForm?.value.age,
        },
        ...(this._trailService.createAudit(action))
      }

      await this.register(userData, password);
    }

    this._globalService.hideLoader()
  }

  async register(userData: UserData, password: string){
    await this._authService.registerUser(userData, password).then(res => {
      this._globalService.showToast("Registration complete! You can now sign in.", 5000, ColorConstants.SUCCESS);
      this._router.navigateByUrl(`/${RoutesConstants.LOGIN}`);
      this.registerForm?.reset();
    })
    .catch(e => {
      let errorMessage: string = 'Failed to register.';
      if(e.code == 'auth/invalid-credential') errorMessage = 'Check your email and password if correct.';
      this._globalService.showToast(errorMessage);
      this.registerForm?.reset();
    });
  }
}
