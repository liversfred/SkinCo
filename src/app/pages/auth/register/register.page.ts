import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColorConstants } from 'src/app/constants/color.constants';
import { FormConstants } from 'src/app/constants/form.constants';
import { GenderConstants } from 'src/app/constants/gender.constants';
import { ModifierActions } from 'src/app/constants/modifiers-action.constants';
import { Roles } from 'src/app/constants/roles.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { Role } from 'src/app/models/role.model';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';
import { RoleService } from 'src/app/services/role.service';
import { TrailService } from 'src/app/services/trail.service';
import { numericInputValidator } from 'src/app/validators/numeric-input-validator.directive';
import { passwordStandardValidator } from 'src/app/validators/password-standard-validator.directive';
import { passwordsDoNotMatchValidator } from 'src/app/validators/password-do-not-match-validator.directive';

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

  constructor(
    private _trailService: TrailService, 
    private _globalService: GlobalService, 
    private _router: Router, 
    private _authService: AuthService, 
    private _roleService: RoleService,
    private _errorService: ErrorService
    ) { }

  async ngOnInit() {
    this.initializeFormGroup();
    
    // Redirect if user is logged in
    const isAuthenticated = await this._authService.checkUserAuth(); 
    if(isAuthenticated) {
      this._authService.redirectByUserRole();
      return;
    }

    this._globalService.showLoader('Loading...');
    await this.initializeRoles();
    this._globalService.hideLoader();
  }

  initializeFormGroup(){
    this.registerForm = new FormGroup({
      firstName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.firstNameMaxLength)] }),
      lastName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.middleNameMaxLength)] }),
      middleName: new FormControl('', { validators: [Validators.required, Validators.maxLength(this.lastNameMaxLength)] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email, Validators.maxLength(this.emailMaxLength)] }),
      mobileNumber: new FormControl('', { validators: [Validators.required, Validators.minLength(this.mobileNumberMaxLength), Validators.maxLength(this.mobileNumberMaxLength), numericInputValidator()] }),
      gender: new FormControl(null, { validators: [Validators.required] }),
      age: new FormControl('', { validators: [Validators.required, Validators.min(1), Validators.max(100)] }),
      password: new FormControl('', { validators: [Validators.required, passwordStandardValidator ] }),
      confirmPassword: new FormControl('', { validators: [Validators.required, passwordsDoNotMatchValidator.bind(this)] })
    });
  }

  async initializeRoles(): Promise<void> {
    this.roles = await this._roleService.fetchRoles();
  }

  onOptionSelected(option: string){
    this.userType = option;
  }

  onSubmit(){
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
        roleId: role.id!,
        person: {
          firstName, middleName, lastName,
          email: this.registerForm?.value.email.trim(),
          mobileNumber: this.registerForm?.value.mobileNumber.trim(),
          gender: this.registerForm?.value.gender.trim(),
          age: this.registerForm?.value.age,
        },
        ...(this._trailService.createAudit(action))
      }

      this.register(userData, password);
    }
  }

  async register(userData: UserData, password: string){
    this._globalService.showLoader('Processing registration...');

    await this._authService.registerUser(userData, password).then(() => {
      this._globalService.hideLoader()
      this._globalService.showToast("Registration complete! You can now sign in.", 5000, ColorConstants.SUCCESS);
      this._router.navigateByUrl(RouteConstants.LOGIN, { replaceUrl: true });
      this.registerForm?.reset();
    })
    .catch(e => {
      let errorMessage: string | undefined = undefined;
      if(e.code == 'auth/invalid-credential') errorMessage = 'Check your email and password if correct.';
      else if(e.code == 'auth/email-already-in-use') errorMessage = 'Email already in use. Choose a different email.';
      this._errorService.handleError(e, errorMessage);
    });
  }
}
