import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdatePasswordDto } from 'src/app/model/updatePasswordDto.model';
import { UpdateUserAvatarDto } from 'src/app/model/updateUserAvatar.model';
import { PasswordConfirmationValidatorService } from 'src/app/shared/services/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { RequestService } from '../../../../shared/services/request.service';
import { TruyenService } from '../../../../services/truyenService.service';
import { BinhLuanService } from '../../../../services/binhLuanService.service';
import { UserService } from '../../../../services/userService.service';
import { User } from '../../../../model/user/User.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { RequestParam } from '../../../../model/param/RequestParam.model';

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

  currentAvatar: string = "";

  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  btnSubmitLocked: boolean = false;

  constructor(private _router: Router, private toast: ToastAlertService, private _passConfValidator: PasswordConfirmationValidatorService,
     private requestService: RequestService, private truyenService: TruyenService, private binhLuanService: BinhLuanService,
     private userService: UserService) {
  }

  ngOnInit(): void {

    console.log('account component')

    this.requestService.post('auth/checklogin', null)
      .subscribe(response => {
        console.log(response)
        
        if (response["statusCode"] == 200)
        {
          this.userService.getDetail(response["message"]).subscribe(user => {
            this.user = user;
          })
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


    let truyenTopViewParams: RequestParam = {pageNumber: 1, pageSize: 5, topView: true}
    this.truyenService.getListWithParams(truyenTopViewParams).subscribe(truyens => {
      this.truyensTopView = truyens;
      //console.log(truyens)
    });

    let binhLuanUpdateParams: RequestParam = {pageNumber: 1, pageSize: 20, lastestUpdate: true}
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
        email: this.user.email,
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
