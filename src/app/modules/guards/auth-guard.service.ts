import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtHelper: JwtHelperService, private router: Router, private http: HttpClient) {
  }
  async canActivate() {
    const token = localStorage.getItem("jwt");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      //console.log(this.jwtHelper.decodeToken(token));
      return true;
    }

    const isRefreshSuccess = await this.tryRefreshingTokens(token);
    if (!isRefreshSuccess) {
      this.router.navigate(["/authentication/login"]);
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
}