import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
declare function setUpDarkMode(): void;
declare function loginFormSetUp(): void;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  jsonTheLoaiArr: any;
  invalidLogin: boolean;

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
    }

  ngOnInit(): void {
    this.categoryDropdownInit();
    loginFormSetUp();
    setUpDarkMode();
  }
  
  login(form: NgForm) {
    const credentials = JSON.stringify(form.value);
    this.http.post(environment.apiURL + `/auth/login`, credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    }).subscribe(response => {
      const token = (<any>response).token;
      console.log(token);
      localStorage.setItem("username", form.value["tenuser"]);
      localStorage.setItem("jwt", token);
      this.invalidLogin = false;
      window.location.href = '/index';
      //this.router.navigate(["/"]);
    }, err => {
      this.invalidLogin = true;
    });
  }

  logOut() {
    localStorage.removeItem("jwt");
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
