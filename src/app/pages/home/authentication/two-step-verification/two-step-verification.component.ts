import { TwoFactorDto } from '../../../../model/twoFactorDto.model';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LogInService } from 'src/app/shared/services/log-in-service.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';

@Component({
  selector: 'app-two-step-verification',
  templateUrl: './two-step-verification.component.html',
  styleUrls: ['./two-step-verification.component.scss']
})
export class TwoStepVerificationComponent implements OnInit {

  public twoStepForm: FormGroup;
  public showError: boolean;
  public errorMessage: string;

  private _provider: string;
  private _email: string;
  private _returnUrl: string;

  btnSubmitLocked: boolean = false;

  constructor(private _authService: AuthenticationService, private _route: ActivatedRoute, 
    private _router: Router, private loginService: LogInService, private toast: ToastAlertService) { }

  ngOnInit(): void {
    this.twoStepForm = new FormGroup({
      twoFactorCode: new FormControl('', [Validators.required]),
    });
    
      this._provider = this._route.snapshot.queryParams['provider'];
      this._email = this._route.snapshot.queryParams['email'];
      this._returnUrl = this._route.snapshot.queryParams['returnUrl'];
  }

  public validateControl = (controlName: string) => {
    return this.twoStepForm.controls[controlName].invalid && this.twoStepForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.twoStepForm.controls[controlName].hasError(errorName)
  }

  public loginUser = (twoStepFromValue) => {
    this.btnSubmitLocked = true;
    this.showError = false;
    
    const formValue = { ...twoStepFromValue };
    let twoFactorDto: TwoFactorDto = {
      email: this._email,
      provider: this._provider,
      token: formValue.twoFactorCode
    }

    this._authService.twoStepLogin('auth/LoginVerification', twoFactorDto)
    .subscribe(res => {
      this.toast.showToast("Đăng nhập thành công", "Hãy khám phá những điều thú vị nào!", "success");

      //console.log(res.token);
      this.loginService.updateUserID(res.token);
      
      this._authService.sendAuthStateChangeNotification(res.isAuthSuccessful);
      this._router.navigate([this._returnUrl]);
    },
    error => {
      this.errorMessage = error;
      this.showError = true;
      this.btnSubmitLocked = false;
    })
  }
}
