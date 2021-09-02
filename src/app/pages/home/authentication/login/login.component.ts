import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { environment } from 'src/environments/environment';
import { UserForLoginDto } from '../../../../model/authentication/userForLoginDto.model';
import { UserForLoginService } from '../../../../services/authentication/userForLoginService.service';

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
  private _returnUrl: string;

  btnSubmitLocked: boolean = false;

  constructor(private _router: Router, private _route: ActivatedRoute,
    private toast: ToastAlertService, private userForLoginService: UserForLoginService) { }

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
    const login = { ...loginFormValue };

    const user: UserForLoginDto = {
      email: login.email,
      password: login.password,
      clientURI: `${environment.host}/authentication/forgot-password`
    }

    this.userForLoginService.post(user)
      .subscribe(res => {
        if (!res?.error) {
          if (res.is2StepVerificationRequired) {
            this.toast.showToast("Xác thực", "Bạn hãy kiểm tra email của mình nhé!", "info");
            this._router.navigate(['/authentication/two-step-verification'],
              { queryParams: { returnUrl: this._returnUrl, provider: res.provider, email: user.email } });
          }
          else {
            this._router.navigate([this._returnUrl]);
          }
        }
        else {
          this.btnSubmitLocked = false;
        }
      })
  }
}
