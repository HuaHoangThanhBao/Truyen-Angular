import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private http: HttpClient) {
  }

  async canActivate() {
    const token = sessionStorage.getItem("admin-id");

    if (!token) {
        this.router.navigate(["/admin"]);
        return false;
    }

    return true;
  }
}