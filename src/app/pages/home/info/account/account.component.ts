import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdatePasswordDto } from 'src/app/model/authentication/updatePasswordDto.model';
import { UpdateUserAvatarDto } from 'src/app/model/authentication/updateUserAvatar.model';
import { PasswordConfirmationValidatorService } from 'src/app/services/others/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { RequestService } from '../../../../services/others/request.service';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { UserService } from '../../../../services/model-service/userService.service';
import { User } from '../../../../model/user/User.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../../../../services/others/login-service.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [RequestService]
})
export class AccountComponent implements OnInit {

  public updatePasswordForm: FormGroup;

  truyensTopView: Truyen[];
  binhLuans: BinhLuan[];
  user: User;
  userLoginID: string;

  currentAvatar: string = "";

  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  btnSubmitLocked: boolean = false;

  constructor(private jwtHelper: JwtHelperService, private _router: Router, private toast: ToastAlertService, private _passConfValidator: PasswordConfirmationValidatorService,
    private requestService: RequestService, private truyenService: TruyenService, private binhLuanService: BinhLuanService,
    private userService: UserService, private loginService: LoginService) {
  }

  ngOnInit(): void {
    this.loginService.currentUser.subscribe(newID => {
      console.log(newID);
      
      if(newID != "")
      {
        this.userLoginID = newID;
        this.userService.getDetail(this.userLoginID).subscribe(user => {
          this.user = user;
        });
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


    let truyenTopViewParams: RequestParam = { pageNumber: 1, pageSize: 5, topView: true }
    this.truyenService.getListWithParams(truyenTopViewParams).subscribe(truyens => {
      this.truyensTopView = truyens;
      //console.log(truyens)
    });

    let binhLuanUpdateParams: RequestParam = { pageNumber: 1, pageSize: 20, lastestUpdate: true }
    this.binhLuanService.getListWithParams(binhLuanUpdateParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(this.binhLuans)
    });
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
      email: this.user.email,
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
        userID: this.userLoginID,
        hinhAnh: this.currentAvatar
      }
      console.log(updateAvatarDto);
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
    const token = localStorage.getItem("jwt");
    const refreshToken: string = localStorage.getItem("refreshToken");
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    this.requestService.post('token/revoke', credentials)
      .subscribe(res => {
        localStorage.removeItem("jwt");
        localStorage.removeItem("refreshToken");
        this.toast.showToast("Rất tiếc khi bạn đăng xuất", "Hãy quay lại sớm nhé!", "warning");
        window.location.href = 'index';
      },
        (error) => {
          console.log(error);
        })
  }
}
