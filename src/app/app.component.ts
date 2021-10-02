import { Component, OnInit } from '@angular/core';
import { TheLoai } from './model/theloai/TheLoai.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './services/others/login-service.service';
import { Router, NavigationEnd } from '@angular/router';
import { RefreshTokenService } from './services/jwt/refreshTokenService.service';
import { RefreshToken } from './model/refresh-token/RefreshToken.model';

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

  constructor(private jwtHelper: JwtHelperService, private loginService: LoginService, private router: Router, private refreshTokenService: RefreshTokenService) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        if (!url.includes("admin")) {
          if (!url.includes("authentication")) {
            this.canActivate();
          }
          this.navBarActive = true;
        }
        else {
          this.navBarActive = false;
        }
      }
    })

    this.loginService.currentUser.subscribe(currentID => {
      this.userLoginID = currentID;
    })

    this.setUpDarkMode();
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
    //console.log('trying to get refresh token');

    // Try refreshing tokens using refresh token
    const refreshToken: string = localStorage.getItem("refreshToken");

    if (!token || !refreshToken) {
      return false;
    }

    const credentials: RefreshToken = { accessToken: token, refreshToken: refreshToken };
    let isRefreshSuccess: boolean;

    this.refreshTokenService.postExtendNonCatchError('refresh', credentials).subscribe(response => {
      if (response?.accessToken) {
        // If token refresh is successful, set new tokens in local storage.
        const newToken = response.accessToken;
        const newRefreshToken = response.refreshToken;

        var decode = this.jwtHelper.decodeToken(newToken);
        const newUserLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
        this.loginService.setNewID(newUserLoginID);

        localStorage.setItem("jwt", newToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        isRefreshSuccess = true;
      }
      else {
        isRefreshSuccess = false;
      }
    })
    return isRefreshSuccess;
  }

  setUpDarkMode(){
    const btnSwitch = document.getElementById('theme-switch-btn');
    const currentTheme = localStorage.getItem("theme");
  
    if(currentTheme == null){
      localStorage.setItem("theme", "light");
      
      document.documentElement.classList.remove("darkTheme");
      document.documentElement.classList.add("lightTheme");
  
      btnSwitch.parentElement.classList.add('dark-mode');
      btnSwitch.parentElement.classList.remove('light-mode');
    }
    else if (currentTheme) {
      if (currentTheme === "dark") {
        document.documentElement.classList.add("darkTheme");
        document.documentElement.classList.remove("lightTheme");
  
        btnSwitch.parentElement.classList.remove('dark-mode');
        btnSwitch.parentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove("darkTheme");
        document.documentElement.classList.add("lightTheme");
  
        btnSwitch.parentElement.classList.add('dark-mode');
        btnSwitch.parentElement.classList.remove('light-mode');
      }
    }
  
    function switchTheme() {
      const currentTheme = document.documentElement.className;
  
      if(currentTheme == "lightTheme"){
        localStorage.setItem("theme", "dark");
        document.documentElement.classList.add("darkTheme");
        document.documentElement.classList.remove("lightTheme");
  
        this.parentElement.classList.remove('dark-mode');
        this.parentElement.classList.add('light-mode');
  
      } else {
        localStorage.setItem("theme", "light");
        document.documentElement.classList.remove("darkTheme");
        document.documentElement.classList.add("lightTheme");
  
        this.parentElement.classList.add('dark-mode');
        this.parentElement.classList.remove('light-mode');
      }
    }
  
    btnSwitch.addEventListener("click", switchTheme);
  }  
}
