import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
declare function setUpDarkMode(): void;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  jsonTheLoaiArr: any;
  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;

  constructor(private http: HttpClient) {
    this.http.get(environment.apiURL + `/theloai`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(theLoaiData => {
        this.jsonTheLoaiArr = theLoaiData;
        console.log(this.jsonTheLoaiArr);
      })


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
    this.categoryDropdownInit();
    setUpDarkMode();
  }

  categoryDropdownInit() {
    const catBut = document.getElementById('catagory-dropdown');
    catBut.addEventListener('click', function () {
      showMenuOnTablet();
    });

    function showMenuOnTablet() {
      var x = document.getElementById("top__nav");
      if (x.className === "nav__list") {
        x.className += " responsive";
      } else {
        x.className = "nav__list";
      }
    }
  }
}
