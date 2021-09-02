import { TwoFactorDto } from '../../../../model/authentication/twoFactorDto.model';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { TwoStepVerificationService } from '../../../../services/authentication/twoStepVerificationService.service';

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

  constructor(private _route: ActivatedRoute,
    private _router: Router, private toast: ToastAlertService, private twoStepVerificationService: TwoStepVerificationService) { }

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

    const formValue = { ...twoStepFromValue };
    let twoFactorDto: TwoFactorDto = {
      email: this._email,
      provider: this._provider,
      token: formValue.twoFactorCode
    }

    this.twoStepVerificationService.post(twoFactorDto)
      .subscribe(res => {
        if (!res?.error) {
          this.toast.showToast("Đăng nhập thành công", "Hãy khám phá những điều thú vị nào!", "success");

          const token = (<any>res).token;
          const refreshToken = (<any>res).refreshToken;
          localStorage.setItem("jwt", token);
          localStorage.setItem("refreshToken", refreshToken);

          this._router.navigate([this._returnUrl]);
        }
        else {
          this.btnSubmitLocked = false;
        }
      })
  }
}
