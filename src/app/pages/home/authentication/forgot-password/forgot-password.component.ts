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
  public forgotPasswordForm: FormGroup;
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
    .subscribe(res => {
      if (!res?.error) {
        this.toast.showToast("Xác thực", "Bạn vui lòng check mail của mình để tiến hành reset mật khẩu nhé", "info");
      }
      else{
        this.btnSubmitLocked = false;
      }
    })
  }
}
