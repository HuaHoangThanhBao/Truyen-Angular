import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogInService } from '../services/log-in-service.service';
import { ToastAlertService } from '../services/toast-alert-service.service';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PubLishBinhLuanDto } from 'src/app/model/publishBinhLuanDto.model';
import { AuthenticationService } from '../services/authentication.service';

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
  public userLoginIDSubcription: Subscription;

  constructor(private _authService: AuthenticationService, private router: Router, private http: HttpClient, private loginService: LogInService,
    private toast: ToastAlertService) { }

  ngOnInit(): void {
    this.userLoginIDSubcription = this.loginService.getUserID().subscribe(id => this.userLoginID = id);

    if (this.userLoginID == undefined) {
      this.http.post(environment.apiURL + `/auth/checklogin`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .subscribe(
          (response) => {

            this.loginService.updateUserID(response["message"]);
            this.userLoginID = response["message"];
            console.log('account page, user id:', this.userLoginID);

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

    let binhLuan: PubLishBinhLuanDto;

    if(this.isDetail){
      binhLuan = {
        userID: this.userLoginID,
        chuongID: this.jsonTruyen?.chuongs[0].chuongID,
        noiDung: formValues.noiDung
      };
    }
    else{
      binhLuan = {
        userID: this.userLoginID,
        chuongID: this.jsonChuong?.chuongID,
        noiDung: formValues.noiDung
      };
    }

    this._authService.publishBinhLuan("binhluan", binhLuan)
      .subscribe(_ => {
        this.toast.showToast("Thành công", "Bạn đã đăng bình luận thành công!", "success");
      },
        error => {
          this.errorMessage = error;
          this.showError = true;
          this.btnSubmitLocked = false;
          console.log(error)
          console.log(error.error.errorMessage)
        })
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

    this.router.navigate([`/story-reading/${truyenID}/${chuongID}`]);
  }
}
