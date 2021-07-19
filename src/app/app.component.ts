import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../environments/environment';
import { LogInService } from './shared/services/log-in-service.service';
import { IndexComponent } from './pages/home/index/index.component';

declare function setUpDarkMode(): void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  jsonTheLoaiArr: any;
  title = 'NgTruyen';
  
  userLoginID: string;
  public userLoginIDSubcription: Subscription;

  @ViewChild(IndexComponent) storyListComponent: IndexComponent;

  constructor(private http: HttpClient, private loginService: LogInService) {
  }

  ngOnInit(): void {
    this.userLoginIDSubcription = this.loginService.getUserID().subscribe(id => this.userLoginID = id);

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

    if (this.userLoginID == undefined) {
      this.http.post(environment.apiURL + `/auth/checklogin`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .subscribe(
          (response) => {
            console.log('check login response:', response);
            console.log('user id: ', response["message"])
            this.loginService.updateUserID(response["message"]);
            console.log('user is logged in')
            return true;
          },
          (error) => {
            console.log(error)
            return false;
          }
        );
    }

    setUpDarkMode();
    this.categoryDropdownInit();
  }


  ngOnDestroy(): void {
    this.userLoginIDSubcription.unsubscribe(); // onDestroy cancels the subscribe request
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
