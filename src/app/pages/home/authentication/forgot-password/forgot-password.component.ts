import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordDto} from 'src/app/model/authentication/forgotPasswordDto.model';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { environment } from '../../../../../environments/environment';
import { ForgotPasswordService } from '../../../../services/authentication/forgotPasswordService.service';

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

  constructor(private toast: ToastAlertService,
    private forgotPasswordService: ForgotPasswordService) { }

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
    
    const forgotPass = { ...forgotPasswordFormValue };
    const forgotPassDto: ForgotPasswordDto = {
      email: forgotPass.email,
      clientURI: `${environment.host}/authentication/reset-password`
    }
    
    this.forgotPasswordService.post(forgotPassDto)
    .subscribe(error => {
      if(!error){
        this.toast.showToast("Xác thực", "Bạn vui lòng check mail của mình để tiến hành reset mật khẩu nhé", "info");
        this.showSuccess = true;
        this.successMessage = 'Đường dẫn để reset password đã được gửi qua mail của bạn, vui lòng kiểm tra mail để tiếp tục.'
      }
      else{
        this.btnSubmitLocked = false;
      }
    })
  }
}
