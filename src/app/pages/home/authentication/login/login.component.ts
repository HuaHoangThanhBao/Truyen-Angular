import { Component, OnInit, NgZone } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { environment } from 'src/environments/environment';
import { UserForLoginDto } from '../../../../model/authentication/userForLoginDto.model';
import { UserForLoginService } from '../../../../services/authentication/userForLoginService.service';
import { SocialUser } from 'src/app/model/social/SocialUser.model';
import { ExternalAuthDto } from 'src/app/model/authentication/externalAuthDto.model';
import { SocialLoginGoogleService } from 'src/app/services/authentication/socialLoginGoogleService.service';
import { LoginService } from '../../../../services/others/login-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

declare function getGAPIInstance(): void;

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
  gapi: any;
  auth2: any;

  constructor(private _router: Router, private _route: ActivatedRoute, private socialLoginGoogleService: SocialLoginGoogleService,
    private toast: ToastAlertService, private userForLoginService: UserForLoginService, private loginService: LoginService,
    private jwtHelper: JwtHelperService, private _ngZone: NgZone) {
    this.gapi = getGAPIInstance();
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    })

    this._returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

    this.googleSignInInit();
  }

  googleSignInInit() {
    this.auth2 = this.gapi.auth2.init({
      client_id: `${environment.clientId}`,
      cookiepolicy: 'single_host_origin',
      // Request scopes in addition to 'profile' and 'email'
      //scope: 'additional_scope'
    });
    this.attachSignIn();
  }

  attachSignIn() {
    this.auth2.attachClickHandler(document.getElementById('signInGoogleBtn'), {},
      () => {
        this.signInWithGoogle();
      }, function (error) {
        console.log(error);
      });
  }

  signInWithGoogle() {
    this.gapi.client.load('oauth2', 'v2', () => {
      //var profile = googleUser.getBasicProfile();

      var request = this.gapi.client.oauth2.userinfo.get({
        'userId': 'me'
      });
      request.execute((res) => {
        const user: SocialUser = { ...res };
        //console.log(user);

        const externalAuth: ExternalAuthDto = {
          email: user.email,
          provider: 'GOOGLE',
          idToken: user.id,
          quyen: 0,
          userName: user.name,
          clientURI: `${environment.host}/authentication/email-confirmation`
        }
        //console.log(externalAuth);

        this.validateExternalAuth(externalAuth);
      });
    });
  }

  private validateExternalAuth(externalAuth: ExternalAuthDto) {
    this.socialLoginGoogleService.post(externalAuth)
      .subscribe(res => {
        //console.log(res);
        if (!res?.error) {
          this.toast.showToast("Đăng nhập thành công", "Hãy khám phá những điều thú vị nào!", "success");

          const token = (<any>res).token;
          const refreshToken = (<any>res).refreshToken;
          localStorage.setItem("jwt", token);
          localStorage.setItem("refreshToken", refreshToken);

          const decode = this.jwtHelper.decodeToken(token);
          const userLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
          this.loginService.setNewID(userLoginID);

          this._ngZone.run(() => {
            this._router.navigate(['/index'])
          });
        }
      });
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
        console.log(res);
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
