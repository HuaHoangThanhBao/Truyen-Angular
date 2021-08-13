import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RequestService } from '../services/request.service';
import { RequestParam } from '../../model/param/RequestParam.model';
import { TruyenService } from '../../services/truyenService.service';
import { templateJitUrl } from '@angular/compiler';
import { Truyen } from '../../model/truyen/Truyen.model';
import { TheLoai } from '../../model/theloai/TheLoai.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [RequestService]
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;

  truyensOnSearch: Truyen[];

  @Input() theLoais: TheLoai[];

  constructor(private requestService: RequestService, private truyenService: TruyenService) { }

  ngOnInit(): void {
    this.requestService.post('auth/checklogin', null)
      .subscribe(response => {
        console.log(response)
        if (response["statusCode"] == 200)
          this.loggedIn = true;
      })
  }

  filterOnSearch(value) {
    if (value != "") {
      let truyenLatestUpdateParams: RequestParam = { sorting: true, tenTruyen: value }
      this.truyenService.getListWithParams(truyenLatestUpdateParams).subscribe(truyens => {
        this.truyensOnSearch = truyens;
        //console.log(truyens)
      });
    }
    else this.truyensOnSearch = [];
  }
}
