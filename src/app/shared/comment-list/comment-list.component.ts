import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { ToastAlertService } from '../../services/others/toast-alert-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BinhLuan } from '../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../model/truyen/Truyen.model';
import { Chuong } from '../../model/chuong/Chuong.model';
import { LoginService } from '../../services/others/login-service.service';
import { Router } from '@angular/router';
import { BinhLuanService } from '../../services/model-service/binhLuanService.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit, OnDestroy {

  public publishCommentForm: FormGroup;

  @Input() binhLuans: BinhLuan[];
  @Input() truyen: Truyen;
  @Input() chuong: Chuong;
  @Input() isDetail: boolean;

  userLoginID: string;
  btnSubmitLocked: boolean = false;

  public errorMessage: string = '';
  public showError: boolean;
  
  private loginSubscription: Subscription;

  constructor(private toast: ToastAlertService, private loginService: LoginService,
    private _router: Router, private binhLuanService: BinhLuanService) {

  }
  
  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loginSubscription = this.loginService.currentUser.subscribe(newID => {
      if (newID != "") {
        console.log(newID);
        this.userLoginID = newID;
      }
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

    let binhLuanDto: BinhLuan;
    if (this.isDetail) {
      binhLuanDto = {
        userID: this.userLoginID,
        truyenID: this.truyen?.truyenID,
        noiDung: formValues.noiDung
      }
    }
    else {
      binhLuanDto = {
        userID: this.userLoginID,
        chuongID: this.chuong?.chuongID,
        noiDung: formValues.noiDung
      }
    }
    
    this.binhLuanService.post(binhLuanDto)
      .subscribe(res => {
        console.log(res)
        if (!res?.error) {
          this.toast.showToast("Chúc mừng", "Bạn đã đăng bình luận thành công!", "success");
          this.publishCommentForm.setValue({ noiDung: '' });
          this.btnSubmitLocked = false;
        }
        else{
          this.btnSubmitLocked = false;
        }
      })
  }

  navigateToLoginPage() {
    this._router.navigate(['authentication/login']);
  }
}
