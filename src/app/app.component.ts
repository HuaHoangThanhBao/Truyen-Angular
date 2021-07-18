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
export class AppComponent implements OnInit, OnDestroy {
  jsonTheLoaiArr: any;
  isLoggedIn: boolean;

  title = 'NgTruyen';
  public subscription: Subscription;

  @ViewChild(IndexComponent) storyListComponent: IndexComponent;

  constructor(private http: HttpClient, private loginService: LogInService) {
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
          this.isLoggedIn = true;
          loginService.setUserID(response["message"]);
          return true;
        },
        (error) => {
          console.log(error)
          this.isLoggedIn = false;
          return false;
        }
      );
  }

  ngOnInit(): void {
    this.subscription = this.loginService.getLoginStatus().subscribe(status => this.isLoggedIn = status);
    setUpDarkMode();
    this.categoryDropdownInit();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // onDestroy cancels the subscribe request
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
