import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
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

  constructor(private http: HttpClient, private _authService: AuthenticationService, private _router: Router) {
    this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=5&lastestUpdate=true`, {
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

  ngOnInit(): void {
  }

  logoutClick(){
    this._authService.logout('auth/logout')
    .subscribe(res => {
      this._router.navigate(['/index'])
    },
    (error) => {
      console.log(error);
    })
  }
}
