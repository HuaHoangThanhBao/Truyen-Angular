import { TwoFactorDto } from './../../model/twoFactorDto.model';
// import { ResetPasswordDto } from './../../_interfaces/resetPassword/resetPasswordDto.model';
// import { ForgotPasswordDto } from '../../_interfaces/resetPassword/forgotPasswordDto.model';
import { AuthResponseDto } from './../../model/authResponseDto.model';
import { RegistrationResponseDto } from './../../model/registrationResponseDto.model';
import { UserForAuthenticationDto } from './../../model/userForAuthenticationDto.model';
import { UserForRegistrationDto } from './../../model/userForRegistrationDto.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EnvironmentUrlService } from './environment-url.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomEncoder } from './custome-encoder';
import { environment } from '../../../environments/environment';
import { ForgotPasswordDto } from 'src/app/model/forgotPasswordDto.model';
import { ResetPasswordDto } from 'src/app/model/resetPasswordDto.model';
import { UpdatePasswordDto } from 'src/app/model/updatePasswordDto.model';
import { UpdateUserAvatarDto } from 'src/app/model/updateUserAvatar.model';
import { PubLishBinhLuanOfTruyenDto } from 'src/app/model/publishBinhLuanOfTruyenDto.model';
import { PubLishBinhLuanOfChuongDto } from 'src/app/model/publishBinhLuanOfChuong.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private _authChangeSub = new Subject<boolean>()
  public authChanged = this._authChangeSub.asObservable();
  
  constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService, private _jwtHelper: JwtHelperService) {}

  public registerUser = (route: string, body: UserForRegistrationDto) => {
    console.log(this.createCompleteRoute(route, this._envUrl.urlAddress));
    return this._http.post<RegistrationResponseDto>(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public loginUser = (route: string, body: UserForAuthenticationDto) => {
    return this._http.post<AuthResponseDto>(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      });
  }

  public logout = (route: string) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), null, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }

  public forgotPassword = (route: string, body: ForgotPasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }

  public resetPassword = (route: string, body: ResetPasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }
  
  public updatePassword = (route: string, body: UpdatePasswordDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }
  
  public updateUserAvatar = (route: string, body: UpdateUserAvatarDto) => {
    return this._http.put(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }

  public publishBinhLuanOfTruyen = (route: string, body: PubLishBinhLuanOfTruyenDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }
  
  public publishBinhLuanOfChuong = (route: string, body: PubLishBinhLuanOfChuongDto) => {
    return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    });
  }

  public confirmEmail = (route: string, token: string, email: string) => {
    let params = new HttpParams({ encoder: new CustomEncoder() })
    params = params.append('token', token);
    params = params.append('email', email);

    return this._http.get(this.createCompleteRoute(route, this._envUrl.urlAddress), { params: params });
  }

  public twoStepLogin = (route: string, body: TwoFactorDto) => {
    return this._http.post<AuthResponseDto>(this.createCompleteRoute(route, this._envUrl.urlAddress), body);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this._authChangeSub.next(isAuthenticated);
  }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
 
    return token && !this._jwtHelper.isTokenExpired(token);
  }

  public isUserAdmin = (): boolean => {
    const token = localStorage.getItem("token");
    const decodedToken = this._jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    return role === 'Administrator';
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
}
