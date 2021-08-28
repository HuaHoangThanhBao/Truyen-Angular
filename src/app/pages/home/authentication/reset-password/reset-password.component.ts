import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResetPasswordDto } from 'src/app/model/authentication/resetPasswordDto.model';
import { PasswordConfirmationValidatorService } from 'src/app/services/others/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { ResetPasswordService } from '../../../../services/authentication/resetPasswordService.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  private _token: string;
  private _email: string;
  btnSubmitLocked: boolean = false;

  constructor(private _passConfValidator: PasswordConfirmationValidatorService,
    private _route: ActivatedRoute, private toast: ToastAlertService, private resetPasswordService: ResetPasswordService) { }

  ngOnInit(): void {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.resetPasswordForm.get('confirm').setValidators([Validators.required,
    this._passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password'))]);

    this._token = this._route.snapshot.queryParams['token'];
    this._email = this._route.snapshot.queryParams['email'];
  }

  public validateControl = (controlName: string) => {
    return this.resetPasswordForm.controls[controlName].invalid && this.resetPasswordForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName)
  }

  public resetPassword = (resetPasswordFormValue) => {
    this.btnSubmitLocked = true;
    
    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto: ResetPasswordDto = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this._token,
      email: this._email
    }
    
    this.resetPasswordService.post(resetPassDto)
      .subscribe(error => {
        if(!error){
          this.showSuccess = true;
          this.toast.showToast("Thành công", "Đổi mật khẩu thành công!", "success");
          this.toast.showToast("Lưu ý", "Bảo vệ thông tin cùa mình thật kỹ nhé!", "warning");
        }
        else{
          this.btnSubmitLocked = false;
        }
      })
  }
}
