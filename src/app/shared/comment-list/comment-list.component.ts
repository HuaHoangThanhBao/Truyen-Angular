import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { ToastAlertService } from '../../services/others/toast-alert-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../../services/others/request.service';
import { BinhLuan } from '../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../model/truyen/Truyen.model';
import { Chuong } from '../../model/chuong/Chuong.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from '../../services/others/login-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  public publishCommentForm: FormGroup;

  @Input() binhLuans: BinhLuan[];
  @Input() truyen: Truyen;
  @Input() chuong: Chuong;
  @Input() isDetail: boolean;

  userLoginID: string;
  btnSubmitLocked: boolean = false;

  public errorMessage: string = '';
  public showError: boolean;

  constructor(private requestService: RequestService, private toast: ToastAlertService, private loginService: LoginService,
    private _router: Router) {

  }

  ngOnInit(): void {
    this.loginService.currentUser.subscribe(newID => {
      console.log(newID);
      this.userLoginID = newID;
    })

    this.publishCommentForm = new FormGroup({
      noiDung: new FormControl('', [Validators.required]),
    });
  }

  public validateControl = (controlName: string) => {
    return this.publishCommentForm.controls[controlName].invalid && this.publishCommentForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.publishCommentForm.controls[controlName].hasError(errorName)
  }

  publishComment = (publishCommentFormValue) => {
    this.btnSubmitLocked = true;
    this.showError = false;
    const formValues = { ...publishCommentFormValue };

    let binhLuanDto: any = this.isDetail ?
      {
        userID: this.userLoginID,
        truyenID: this.truyen?.truyenID,
        noiDung: formValues.noiDung
      } :
      {
        userID: this.userLoginID,
        chuongID: this.chuong?.chuongID,
        noiDung: formValues.noiDung
      };

    this.requestService.post("binhluan", binhLuanDto)
      .subscribe(_ => {
        this.publishCommentForm.setValue({ noiDung: '' });

        this.toast.showToast("Chúc mừng", "Bạn đã đăng bình luận thành công!", "success");
      },
        error => {
          this.errorMessage = error;
          this.showError = true;
          this.btnSubmitLocked = false;
          console.log(error)
          console.log(error.error.message)
        })
  }

  navigateToLoginPage() {
    this._router.navigate(['authentication/login']);
  }
}
