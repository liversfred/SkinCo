import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouteConstants } from 'src/app/constants/route.constants';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
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

  constructor(private _authService: AuthService, private _globalService: GlobalService, private _router: Router, private _errorService: ErrorService) { }

  async ngOnInit() {
    this.initializeFormGroup();
    
    // Redirect if user is logged in
    const isAuthenticated = await this._authService.checkUserAuth(); 
    if(isAuthenticated) {
      this._authService.redirectIfLoggedIn();
      return;
    }
  }

  initializeFormGroup() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, passwordStandardValidator ] }),
    });
  }

  onSubmit(){
    if(this.loginForm?.valid){
      const email = this.loginForm?.value.email.trim();
      const password = this.loginForm?.value.password.trim();

      this.login(email, password);
    }
  }

  async login(email: string, password: string) {
    this._globalService.showLoader('Logging in...');

    await this._authService.login(email, password).then(() => {
        this._globalService.hideLoader();
        this._router.navigateByUrl(RouteConstants.HOME, { replaceUrl: true });
        this.loginForm?.reset();
      })
      .catch(e => {
        let errorMessage: string | undefined = undefined;
        if(e.code == 'auth/invalid-credential') errorMessage = 'Check your email and password if correct.';
        this._errorService.handleError(e, errorMessage);
      });
  }
}
