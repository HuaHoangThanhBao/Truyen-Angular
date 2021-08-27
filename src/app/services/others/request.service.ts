import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RequestService {

    constructor(private _http: HttpClient, private _envUrl: EnvironmentUrlService, private _jwtHelper: JwtHelperService) { }

    public get = (route: string) => {
        return this._http.get(this.createCompleteRoute(route, this._envUrl.urlAddress), {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Api-Key": environment.apiKey
            })
        });
    }

    public post = (route: string, body: any) => {
        return this._http.post(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Api-Key": environment.apiKey
            })
        });
    }


    public put = (route: string, body: any) => {
        return this._http.put(this.createCompleteRoute(route, this._envUrl.urlAddress), body, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Api-Key": environment.apiKey
            })
        });
    }

    public delete = (route: string) => {
        return this._http.delete(this.createCompleteRoute(route, this._envUrl.urlAddress), {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Api-Key": environment.apiKey
            })
        });
    }

    private createCompleteRoute = (route: string, envAddress: string) => {
        return `${envAddress}/${route}`;
    }
}
