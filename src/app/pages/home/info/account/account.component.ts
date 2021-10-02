import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdatePasswordDto } from 'src/app/model/authentication/updatePasswordDto.model';
import { PasswordConfirmationValidatorService } from 'src/app/services/others/password-confirmation-validator.service';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { UserService } from '../../../../services/model-service/userService.service';
import { User } from '../../../../model/user/User.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { LoginService } from '../../../../services/others/login-service.service';
import { UpdatePasswordService } from '../../../../services/authentication/updatePasswordService.service';
import { JWTTokenService } from '../../../../services/jwt/jwtTokenService.service';
import { Subscription } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { TheoDoiService } from '../../../../services/model-service/theoDoiService.service';
import { TheoDoi } from '../../../../model/theodoi/TheoDoi.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {

  public updatePasswordForm: FormGroup;

  truyensTopView: Truyen[];
  binhLuans: BinhLuan[];
  binhLuansByUser: BinhLuan[];
  theoDoisByUser: TheoDoi[];

  user: User;
  userLoginID: string;

  currentAvatar: string = "";
  btnSubmitLocked: boolean = false;

  private loginSubscription: Subscription;

  constructor(private _router: Router, private toast: ToastAlertService, private _passConfValidator: PasswordConfirmationValidatorService,
    private truyenService: TruyenService, private binhLuanService: BinhLuanService, private userService: UserService, 
    private theoDoiService: TheoDoiService, private loginService: LoginService, private updatePasswordService: UpdatePasswordService,
    private jwtTokenService: JWTTokenService, private confirmationDialogService: ConfirmationDialogService) {
  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginSubscription = this.loginService.currentUser.subscribe(newID => {
      if (newID != "") {
        //console.log(newID);
        this.userLoginID = newID;

        this.userService.getDetail(this.userLoginID).subscribe(user => {
          this.user = user;
        });
        
        this.binhLuanService.getListExtend(`${this.userLoginID}/binhluansbyuser`).subscribe(binhLuans => {
          this.binhLuansByUser = binhLuans;
        });
        
        this.theoDoiService.getListExtend(`${this.userLoginID}/theodoisbyuser`).subscribe(theodois => {
          this.theoDoisByUser = theodois;
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

    const updatePass = { ...updatePasswordFormValue };
    const updatePassDto: UpdatePasswordDto = {
      email: this.user.email,
      oldPassword: updatePass.oldpassword,
      password: updatePass.password,
      confirmPassword: updatePass.confirm
    }

    this.updatePasswordService.update(updatePassDto)
      .subscribe(res => {
        if (!res?.error) {
          this.toast.showToast("Thành công", "Đổi mật khẩu thành công!", "success");
          this.toast.showToast("Lưu ý", "Hãy lưu mật khẩu ở nơi nào đó dễ nhớ nhé!", "warning");
        }
        else {
          this.btnSubmitLocked = false;
        }
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
      const updateAvatarDto: User = {
        userID: this.userLoginID,
        hinhAnh: this.currentAvatar
      }
      console.log(updateAvatarDto);

      this.userService.updateExtendRoute('UpdateUserAvatar', updateAvatarDto)
        .subscribe(res => {
          if (!res?.error) {
            this.toast.showToast("Thành công", "Bạn đã đổi sang avatar mới!", "success");
            this.toast.showToast("Nói nhỏ", "Bạn có thể đổi avatar theo sở thích cá nhân nhé", "info");
          }
        })
    }
  }

  logoutClick() {
    this.openConfirmationDialogForLogout();
  }


  public openConfirmationDialogForLogout() {
    this.confirmationDialogService.confirm('Vui lòng xác nhận', 'Bạn có muốn đăng xuất ngay không?')
      .then((confirmed) => {
        //console.log('User confirmed:', confirmed);
        if (confirmed == true) {
          const token = localStorage.getItem("jwt");
          const refreshToken: string = localStorage.getItem("refreshToken");
          const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
          this.jwtTokenService.post(credentials)
            .subscribe(res => {
              if (!res?.error) {
                localStorage.removeItem("jwt");
                localStorage.removeItem("refreshToken");
                this.toast.showToast("Rất tiếc khi bạn đăng xuất", "Hãy quay lại sớm nhé!", "warning");
                this._router.navigate(['index']);
              }
            });
        }
      })
      .catch(() => { });
  }
}
