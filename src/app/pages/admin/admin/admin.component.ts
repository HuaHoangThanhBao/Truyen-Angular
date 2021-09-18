import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordConfirmationValidatorService } from 'src/app/services/others/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { AdminForRegistrationService } from '../../../services/authentication/adminForRegistrationService.service';
import { AdminForRegistrationDto } from '../../../model/authentication/adminForRegistrationDto.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public registerForm: FormGroup;
  public loginForm: FormGroup;
  public errorMessage: string = '';
  invalidLogin: boolean;

  btnSubmitLocked: boolean = false;
  isLoginTab: boolean;

  constructor(private _passConfValidator: PasswordConfirmationValidatorService, private _router: Router, 
    private toast: ToastAlertService, private adminForRegistrationService: AdminForRegistrationService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.registerForm.get('confirm').setValidators([Validators.required,
      this._passConfValidator.validateConfirmPassword(this.registerForm.get('password'))]);

      //
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required])
    })
  }


  public validateControl = (controlName: string) => {
    return this.registerForm.controls[controlName].invalid && this.registerForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.controls[controlName].hasError(errorName)
  }

  public registerUser = (registerFormValue) => {
    this.btnSubmitLocked = true;
    const formValues = { ...registerFormValue };

    const user: AdminForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      quyen: 1,
      confirmPassword: formValues.confirm
    };

    this.adminForRegistrationService.post(user)
    .subscribe(res => {
      if (!res?.error) {
        this.toast.showToast("Thành công", "Bạn vui lòng đợi admin duyệt tài khoản nhé!", "info");
      }
      else{
        this.btnSubmitLocked = false;
      }
    })
  }

  public loginUser = (loginFormValue) => {
    this.btnSubmitLocked = true;
    const login = {... loginFormValue };

    const user: AdminForRegistrationDto = {
      email: login.email,
      password: login.password
    }

    this.adminForRegistrationService.postExtend("login", user)
    .subscribe(res => {
      if(!res?.error){
        this.toast.showToast("Thành công", "Bây giờ bạn có thể xem thông tin dashboard", "info");
        //console.log(res);

        this._router.navigate(["/admin/dashboard"]);
        sessionStorage.setItem('admin-id', res.userID)
        sessionStorage.setItem('admin-username', res.userName)
      }
      else{
        this.btnSubmitLocked = false;
      }
    })
  }

  changeStatus(status: boolean){
    this.isLoginTab = status;
  }
}
