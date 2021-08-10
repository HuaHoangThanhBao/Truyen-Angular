import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdatePasswordDto } from 'src/app/model/updatePasswordDto.model';
import { UpdateUserAvatarDto } from 'src/app/model/updateUserAvatar.model';
import { PasswordConfirmationValidatorService } from 'src/app/shared/services/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { RequestService } from '../../../../shared/services/request.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [RequestService]
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

  constructor(private _router: Router, private toast: ToastAlertService, private _passConfValidator: PasswordConfirmationValidatorService,
     private requestService: RequestService) {
  }

  ngOnInit(): void {

    console.log('account component')

    this.requestService.post('auth/checklogin', null)
      .subscribe(response => {
        console.log(response)
        
        if (response["statusCode"] == 200)
        {
          this.requestService.get(`user/${response["message"]}/details`)
          .subscribe(
            (response) => {
              this.userData = response;
              console.log('user info: ', this.userData);
            },
            (error) => {
              console.log('eror:', error);
            }
          );
        }
        else{
          this._router.navigate(['/authentication/login']);
        }
      })

    /*Form*/
    this.updatePasswordForm = new FormGroup({
      oldpassword: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('')
    });
    this.updatePasswordForm.get('confirm').setValidators([Validators.required,
    this._passConfValidator.validateConfirmPassword(this.updatePasswordForm.get('password'))]);
    /**/


    this.requestService.get(`binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`)
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        console.log(this.jsonBinhLuanArr);
      })

    this.requestService.get(`truyen/pagination?pageNumber=1&pageSize=5&topview=true`)
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
    this.requestService.put('auth/updatepassword', updatePassDto)
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
    if (this.currentAvatar == "") {
      this.toast.showToast("Ôi không", "Bạn chưa chọn avatar!", "error");
    }
    else {
      const updateAvatarDto: UpdateUserAvatarDto = {
        email: this.userData.email,
        hinhAnh: this.currentAvatar
      }
      this.requestService.put('user/UpdateUserAvatar', updateAvatarDto)
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
    this.requestService.post('auth/logout', null)
      .subscribe(res => {
        this.toast.showToast("Rất tiếc khi bạn đăng xuất", "Hãy quay lại sớm nhé!", "warning");
        window.location.href = 'index';
      },
        (error) => {
          console.log(error);
        })
  }
}
