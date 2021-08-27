import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RequestService } from '../../services/others/request.service';
import { RequestParam } from '../../model/param/RequestParam.model';
import { TruyenService } from '../../services/model-service/truyenService.service';
import { templateJitUrl } from '@angular/compiler';
import { Truyen } from '../../model/truyen/Truyen.model';
import { TheLoai } from '../../model/theloai/TheLoai.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [RequestService]
})
export class NavbarComponent implements OnInit {
  truyensOnSearch: Truyen[];

  @Input() active: boolean;
  @Input() userLoginID: string;
  @Input() theLoais: TheLoai[];

  constructor(private jwtHelper: JwtHelperService, private requestService: RequestService, private truyenService: TruyenService) { }

  ngOnInit(): void {
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
