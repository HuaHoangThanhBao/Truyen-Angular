import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordDto} from 'src/app/model/forgotPasswordDto.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;
  btnSubmitLocked: boolean = false;

  constructor(private _authService: AuthenticationService, private toast: ToastAlertService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    })
  }

  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.controls[controlName].invalid && this.forgotPasswordForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName)
  }

  public forgotPassword = (forgotPasswordFormValue) => {
    this.btnSubmitLocked = true;
    this.showError = this.showSuccess = false;
    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: ForgotPasswordDto = {
      email: forgotPass.email,
      clientURI: 'https://www.ranhdoctruyen.com/unimozy/authentication/reset-password'
    }
    this._authService.forgotPassword('auth/forgotpassword', forgotPassDto)
    .subscribe(_ => {
      this.toast.showToast("Xác thực", "Bạn vui lòng check mail của mình để tiến hành reset mật khẩu nhé", "info");
      this.showSuccess = true;
      this.successMessage = 'Đường dẫn để reset password đã được gửi qua mail của bạn, vui lòng kiểm tra mail để tiếp tục.'
    },
    err => {
      this.showError = true;
      this.errorMessage = err;
      this.btnSubmitLocked = false;
    })
  }
}
