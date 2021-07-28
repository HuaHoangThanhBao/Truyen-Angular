import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogInService } from '../services/log-in-service.service';
import { ToastAlertService } from '../services/toast-alert-service.service';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PubLishBinhLuanOfTruyenDto } from 'src/app/model/publishBinhLuanOfTruyenDto.model';
import { AuthenticationService } from '../services/authentication.service';
import { PubLishBinhLuanOfChuongDto } from 'src/app/model/publishBinhLuanOfChuong.model';

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

  btnSubmitLocked: boolean = false;

  public errorMessage: string = '';
  public showError: boolean;

  userLoginID: string;

  constructor(private _authService: AuthenticationService, private router: Router, private http: HttpClient, private loginService: LogInService,
    private toast: ToastAlertService) { }

  ngOnInit(): void {
    if (this.userLoginID == undefined) {
      this.http.post(environment.apiURL + `/auth/checklogin`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .subscribe(
          (response) => {
            this.userLoginID = response["message"];
          },
          (error) => {
            console.log(error);
            return false;
          }
        );
    }

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

    if (this.isDetail) {
      let binhLuan: PubLishBinhLuanOfTruyenDto;
  
      binhLuan = {
        userID: this.userLoginID,
        truyenID: this.jsonTruyen?.truyenID,
        noiDung: formValues.noiDung
      };

      this._authService.publishBinhLuanOfTruyen("binhluan", binhLuan)
        .subscribe(_ => {
          this.publishCommentForm.setValue({noiDung: ''});
          
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
    else {
      let binhLuan: PubLishBinhLuanOfChuongDto;
      
      binhLuan = {
        userID: this.userLoginID,
        chuongID: this.jsonChuong?.chuongID,
        noiDung: formValues.noiDung
      };

      this._authService.publishBinhLuanOfChuong("binhluan", binhLuan)
        .subscribe(_ => {
          this.publishCommentForm.setValue({noiDung: ''});

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
  }

  addToHistory(truyenID: number, tenTruyen: string, chuongID: number, tenChuong: string, hinhAnh: string) {
    //alert(truyenID + "/" + chuongID)
    const data = { "truyenID": truyenID, "tenTruyen": tenTruyen, "chuongID": chuongID, "tenChuong": tenChuong, "hinhAnh": hinhAnh };
    const localHist = JSON.parse(localStorage.getItem("tr_hist"));
    let hist_arr;
    let found;

    if (localHist != null) {
      hist_arr = [...localHist];
      found = checkDuplicate();

      function checkDuplicate() {
        for (let i = 0; i < hist_arr.length; i++) {
          if (hist_arr[i]["truyenID"] === truyenID) {
            hist_arr[i]["tenTruyen"] = tenTruyen;
            hist_arr[i]["chuongID"] = chuongID;
            hist_arr[i]["tenChuong"] = tenChuong;
            hist_arr[i]["hinhAnh"] = hinhAnh;
            return true;
          }
        }
        return false;
      }
    }
    else hist_arr = [];

    if (!found)
      hist_arr.push(data);

    //console.log(hist_arr)
    localStorage.setItem("tr_hist", JSON.stringify(hist_arr));

    window.location.href = `story-reading/${truyenID}/${chuongID}`;
  }

  navigateToLoginPage(){
    window.location.href = 'authentication/login';
  }
}
