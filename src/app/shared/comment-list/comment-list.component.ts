import { Component, Input, OnInit } from '@angular/core';
import { ToastAlertService } from '../services/toast-alert-service.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent implements OnInit {

  public publishCommentForm: FormGroup;

  @Input() jsonBinhLuan: any;
  @Input() jsonTruyen: any;
  @Input() jsonChuong: any;
  @Input() isDetail: boolean;
  userLoginID: string;

  btnSubmitLocked: boolean = false;

  public errorMessage: string = '';
  public showError: boolean;

  constructor(private requestService: RequestService, private toast: ToastAlertService) { }

  ngOnInit(): void {
    this.requestService.post('auth/checklogin', null)
      .subscribe(response => {
        console.log(response)
        if (response["statusCode"] == 200)
          this.userLoginID = response["message"];
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
      truyenID: this.jsonTruyen?.truyenID,
      noiDung: formValues.noiDung
    }:
    {
      userID: this.userLoginID,
      chuongID: this.jsonChuong?.chuongID,
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
        console.log(error.error.errorMessage)
      })
  }

  navigateToLoginPage() {
    window.location.href = 'authentication/login';
  }
}
