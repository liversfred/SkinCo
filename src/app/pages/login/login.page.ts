import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordStandardValidator } from 'src/app/validators/password-standard-validator.directive';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup | undefined;
  showPassword: boolean = false;

  constructor( ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { validators: [Validators.required, passwordStandardValidator ] }),
    });
  }

  onLoginSubmit(){
    console.log("Login Submitted");
  }
}
