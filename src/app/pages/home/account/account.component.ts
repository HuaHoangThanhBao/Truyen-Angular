import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LogInService } from 'src/app/shared/services/log-in-service.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;

  userData: any;

  constructor(private http: HttpClient, private _authService: AuthenticationService, private _router: Router, private loginService: LogInService,
    private toast: ToastAlertService) {
  }

  ngOnInit(): void {
    console.log(this.loginService);

    if (this.loginService.getUserID() != "") {
      this.http.get(environment.apiURL + `/user/${this.loginService.getUserID()}/details`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(userInfo => {
          this.userData = userInfo;
          console.log('userinfo: ', userInfo);
        })
    }

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

  logoutClick() {
    this._authService.logout('auth/logout')
      .subscribe(res => {
        this.toast.showToast("Rất tiếc khi bạn đăng xuất", "Hãy quay lại sớm nhé!", "warning");
        this.loginService.updateLoginStatus(false);
        this._router.navigate(['/index']);
      },
        (error) => {
          console.log(error);
        })
  }
}
