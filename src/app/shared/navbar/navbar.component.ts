import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() theLoaiJson: any;
  filterTruyenResult: any;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) { }

  ngOnInit(): void {
  }

  checkLogedIn() {
    const token = localStorage.getItem("token");

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  filterOnSearch(value) {
    if(value != "") {
      this.http.get(environment.apiURL + `/truyen/pagination?TenTruyen=${value}&sorting=true`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(truyenFilter => {
          this.filterTruyenResult = truyenFilter;
          //console.log(this.filterTruyenResult);
        })
    }
    else this.filterTruyenResult = "";
  }
}
