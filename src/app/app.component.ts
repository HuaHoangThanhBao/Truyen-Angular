import { Component, OnInit} from '@angular/core';
import { TheLoaiService } from './services/model-service/theLoaiService.service';
import { TheLoai } from './model/theloai/TheLoai.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './services/others/login-service.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare function setUpDarkMode(): void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'RanhDocTruyen';
  theLoais: TheLoai[];
  userLoginID: string;
  navBarActive: boolean;

  constructor(private jwtHelper: JwtHelperService, private theLoaiService: TheLoaiService, private loginService: LoginService, private router: Router,
    private http: HttpClient, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if(!url.includes("admin")){
          if(!url.includes("authentication"))
          {
            this.canActivate();
          }
          this.navBarActive = true;
        }
        else{
          this.navBarActive = false;
        }
      }
    })

    this.loginService.currentUser.subscribe(currentID => {
      this.userLoginID = currentID;
    })

    this.theLoaiService.getList().subscribe(theloais => {
      this.theLoais = theloais
    });

    setUpDarkMode();
    this.categoryDropdownInit();
  }

  async canActivate() {
    const token = localStorage.getItem("jwt");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      //console.log(this.jwtHelper.decodeToken(token));
      
      const decode = this.jwtHelper.decodeToken(token);
      const oldUserLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
      this.loginService.setNewID(oldUserLoginID);

      return true;
    }

    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if (!isRefreshSuccess) {
      //this.router.navigate(["/authentication/login"]);
    }

    return isRefreshSuccess;
  }

  private async tryRefreshingTokens(token: string): Promise<boolean> {
    console.log('trying to get refresh token');

    // Try refreshing tokens using refresh token
    const refreshToken: string = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {      
      return false;
    }

    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });

    let isRefreshSuccess: boolean;
    try {
      const response = await this.http.post(`${environment.apiURL}/token/refresh`, credentials, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        }),
        observe: 'response'
      }).toPromise();

      // If token refresh is successful, set new tokens in local storage.
      const newToken = (<any>response).body.accessToken;
      const newRefreshToken = (<any>response).body.refreshToken;
      
      var decode = this.jwtHelper.decodeToken(newToken);
      const newUserLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
      this.loginService.setNewID(newUserLoginID);

      localStorage.setItem("jwt", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      isRefreshSuccess = true;

    }
    catch (ex) {      
      isRefreshSuccess = false;
      console.log(ex);
    }
    return isRefreshSuccess;
  }

  categoryDropdownInit() {
    const catBut = document.getElementById('catagory-dropdown');
    if(!catBut) return;
    
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
