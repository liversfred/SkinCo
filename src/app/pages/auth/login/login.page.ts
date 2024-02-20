import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutesConstants } from 'src/app/constants/routes.constants';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalService } from 'src/app/services/global.service';
import { passwordStandardValidator } from 'src/app/validators/password-standard-validator.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup | undefined;
  showPassword: boolean = false;

  constructor(private _authService: AuthService, private _globalService: GlobalService, private _router: Router) { }

  ngOnInit() {
    this.initializeFormGroup();
  }

  initializeFormGroup() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, passwordStandardValidator ] }),
    });
  }

  onSubmit(){
    this._globalService.showLoader('Logging in...');

    if(this.loginForm?.valid){
      const email = this.loginForm?.value.email.trim();
      const password = this.loginForm?.value.password.trim();

      this.login(email, password);
    }
  }

  login(email: string, password: string) {
    this._authService.login(email, password).then(() => {
      this._router.navigateByUrl(`/${RoutesConstants.HOME}`);
      this.loginForm?.reset();
      this._globalService.hideLoader();
    })
    .catch(e => {
      this._globalService.hideLoader();
      let errorMessage: string = 'Failed to sign in.';
      if(e.code == 'auth/invalid-credential') errorMessage = 'Check your email and password if correct.';
      this._globalService.showToast(errorMessage);
    });
  }
}
