import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LogInService } from '../services/log-in-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  userLoginID: string;

  @Input() theLoaiJson: any;
  filterTruyenResult: any;
  public userLoginIDSubcription: Subscription;

  constructor(private jwtHelper: JwtHelperService, private http: HttpClient, private loginService: LogInService) { }

  ngOnInit(): void {
    this.userLoginIDSubcription = this.loginService.getUserID().subscribe(id => this.userLoginID = id);
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
