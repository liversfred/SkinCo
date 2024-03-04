import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColorConstants } from 'src/app/constants/color.constants';
import { FormConstants } from 'src/app/constants/form.constants';
import { RouteConstants } from 'src/app/constants/route.constants';
import { UserData } from 'src/app/models/user-data.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotPasswordForm: FormGroup | undefined;
  emailMaxLength: number = FormConstants.emailMaxLength;

  constructor(
    private _authService: AuthService, 
    private _globalService: GlobalService, 
    private _router: Router, 
    private _errorService: ErrorService) { }

  ngOnInit() {
    this.initializeFormGroup();
  }
  
  initializeFormGroup(){
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] })
    });
  }
  
  async onSubmit(){
    const email = this.forgotPasswordForm?.value.email.trim();

    if(!(await this.checkIfUserExists(email))) {
      this._globalService.showToast("Email does not exists.");
      return;
    }

    this.sendForgotPasswordLink(email);
  }

  async checkIfUserExists(email: string): Promise<UserData | null>{
    this._globalService.showLoader('Validating email...');
    const userData = await this._authService.getActiveUserByEmail(email);
    this._globalService.hideLoader();
    return userData;
  }

  async sendForgotPasswordLink(email: string){
    this._globalService.showLoader('Sending email...');
    
    await this._authService.sendForgotPasswordLink(email)
      .then(() => {
        this._globalService.hideLoader();
        this.forgotPasswordForm?.reset();
        this._globalService.showToast("An email has been sent to you.", 3000, ColorConstants.SUCCESS);
        this._router.navigate([RouteConstants.LOGIN]);
      })
      .catch(e => {
        this._errorService.handleError(e);
      })
  }
}
