import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RequestService } from '../services/request.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [RequestService]
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  filterTruyenResult: any;

  @Input() theLoaiJson: any;

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.requestService.post('auth/checklogin', null)
      .subscribe(response => {
        console.log(response)
        if (response["statusCode"] == 200)
          this.loggedIn = true;
      })
  }

  filterOnSearch(value) {
    if(value != "") {
      this.requestService.get(`truyen/pagination?TenTruyen=${value}&sorting=true`)
        .toPromise()
        .then(truyenFilter => {
          this.filterTruyenResult = truyenFilter;
          //console.log(this.filterTruyenResult);
        })
    }
    else this.filterTruyenResult = "";
  }
}
