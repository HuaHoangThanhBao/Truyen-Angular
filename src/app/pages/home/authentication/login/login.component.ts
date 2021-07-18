import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

import { UserForAuthenticationDto } from '../../../../model/userForAuthenticationDto.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../../shared/services/authentication.service';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  jsonTheLoaiArr: any;
  invalidLogin: boolean;
  
  public loginForm: FormGroup;
  public errorMessage: string = '';
  public showError: boolean;
  private _returnUrl: string;
  
  btnSubmitLocked: boolean = false;

  constructor(private http: HttpClient, private _authService: AuthenticationService, private _router: Router, private _route: ActivatedRoute,
    private toast: ToastAlertService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    })

    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
  }

  ////////
  public validateControl = (controlName: string) => {
    return this.loginForm.controls[controlName].invalid && this.loginForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName)
  }

  public loginUser = (loginFormValue) => {
    this.btnSubmitLocked = true;
    this.showError = false;
    const login = {... loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password,
      clientURI: 'https://www.ranhdoctruyen.com/unimozy/authentication/forgot-password'
    }

    this._authService.loginUser('auth/login', userForAuth)
    .subscribe(res => {
      if(res.is2StepVerificationRequired) {
        this.toast.showToast("Xác thực", "Bạn hãy kiểm tra email của mình nhé!", "info");
        this._router.navigate(['/authentication/two-step-verification'], 
          { queryParams: { returnUrl: this._returnUrl, provider: res.provider, email: userForAuth.email }});
      }
      else {
        this._authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
        this._router.navigate([this._returnUrl]);
      }
    },
    (error) => {
      this.errorMessage = error;
      this.showError = true;
      this.btnSubmitLocked = false;
    })
  }
}
