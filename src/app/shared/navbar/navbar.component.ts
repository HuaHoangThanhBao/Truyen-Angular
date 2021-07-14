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
  @Input() isLoggedIn: boolean;

  @Input() theLoaiJson: any;
  filterTruyenResult: any;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient) { }

  ngOnInit(): void {
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
