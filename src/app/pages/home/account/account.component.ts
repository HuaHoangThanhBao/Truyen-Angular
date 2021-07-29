import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UpdatePasswordDto } from 'src/app/model/updatePasswordDto.model';
import { UpdateUserAvatarDto } from 'src/app/model/updateUserAvatar.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LogInService } from 'src/app/shared/services/log-in-service.service';
import { PasswordConfirmationValidatorService } from 'src/app/shared/services/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public updatePasswordForm: FormGroup;

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;

  userData: any;
  currentAvatar: string = "";

  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  btnSubmitLocked: boolean = false;

  constructor(private http: HttpClient, private _authService: AuthenticationService, private _router: Router, private loginService: LogInService,
    private toast: ToastAlertService, private _passConfValidator: PasswordConfirmationValidatorService) {
  }

  ngOnInit(): void {

    console.log('account component')
    this.http.post(environment.apiURL + `/auth/checklogin`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .subscribe(
        (response) => {
          this.http.get(environment.apiURL + `/user/${ response["message"] }/details`, {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
              "Api-Key": environment.apiKey
            })
          })
          .subscribe(
            (response) => {
              this.userData = response;
              console.log('user info: ', this.userData);
            },
            (error) => {
              console.log('eror:', error);
            }
          );
        },
        (error) => {
          console.log(error);
          window.location.href = 'authentication/login';
          return false;
        }
      );

    /*Form*/
    this.updatePasswordForm = new FormGroup({
      oldpassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.updatePasswordForm.get('confirm').setValidators([Validators.required,
    this._passConfValidator.validateConfirmPassword(this.updatePasswordForm.get('password'))]);
    /**/


    this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        console.log(this.jsonBinhLuanArr);
      })

    this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=1&pageSize=5&topview=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(mostViewData => {
        this.mostViews = mostViewData;
        console.log(this.mostViews);
      })
  }

  public validateControl = (controlName: string) => {
    return this.updatePasswordForm.controls[controlName].invalid && this.updatePasswordForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.updatePasswordForm.controls[controlName].hasError(errorName)
  }

  public updatePassword = (updatePasswordFormValue) => {
    this.btnSubmitLocked = true;
    this.showError = this.showSuccess = false;
    const updatePass = { ...updatePasswordFormValue };
    const updatePassDto: UpdatePasswordDto = {
      email: this.userData.email,
      oldPassword: updatePass.oldpassword,
      password: updatePass.password,
      confirmPassword: updatePass.confirm
    }
    console.log(updatePassDto);
    this._authService.updatePassword('auth/updatepassword', updatePassDto)
      .subscribe(_ => {
        this.showSuccess = true;
        this.toast.showToast("Thành công", "Đổi mật khẩu thành công!", "success");
        this.toast.showToast("Lưu ý", "Hãy lưu mật khẩu ở nơi nào đó dễ nhớ nhé!", "warning");
        this._router.navigate(['/index']);
      },
        error => {
          this.showError = true;
          this.errorMessage = error;
          this.btnSubmitLocked = false;
        })
  }

  setCurrentAvatar(path_name) {
    this.currentAvatar = path_name;
  }

  public updateAvatar = () => {
    console.log('save ảnh đại diện');
    console.log(this.currentAvatar);
    if (this.currentAvatar == "") {
      this.toast.showToast("Ôi không", "Bạn chưa chọn avatar!", "error");
    }
    else {
      const updateAvatarDto: UpdateUserAvatarDto = {
        email: this.userData.email,
        hinhAnh: this.currentAvatar
      }
      this._authService.updateUserAvatar('user/UpdateUserAvatar', updateAvatarDto)
        .subscribe(_ => {
          this.showSuccess = true;
          this.toast.showToast("Thành công", "Bạn đã đổi sang avatar mới!", "success");
          this.toast.showToast("Nói nhỏ", "Bạn có thể đổi avatar theo sở thích cá nhân nhé", "info");
        },
          error => {
            this.showError = true;
            this.errorMessage = error;
            this.btnSubmitLocked = false;
            console.log(error);
          })
    }
  }

  logoutClick() {
    this._authService.logout('auth/logout')
      .subscribe(res => {
        this.toast.showToast("Rất tiếc khi bạn đăng xuất", "Hãy quay lại sớm nhé!", "warning");
        window.location.href = 'index';
      },
        (error) => {
          console.log(error);
        })
  }
}
