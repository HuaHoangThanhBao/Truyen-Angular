import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

  isLoggedIn: boolean;

  constructor(private jwtHelper: JwtHelperService, private router: Router, private http: HttpClient) {
  }

  canActivate() {
    
    this.http.post(environment.apiURL + `/auth/checklogin`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .subscribe(
        (response) => {  
          this.isLoggedIn = true;
          return true;
        },
        (error) => {
          this.isLoggedIn = false;
          return false;
        }
      );

      return this.isLoggedIn;
  }

}