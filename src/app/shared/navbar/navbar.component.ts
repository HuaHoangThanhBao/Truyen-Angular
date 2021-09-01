import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RequestParam } from '../../model/param/RequestParam.model';
import { TruyenService } from '../../services/model-service/truyenService.service';
import { templateJitUrl } from '@angular/compiler';
import { Truyen } from '../../model/truyen/Truyen.model';
import { TheLoai } from '../../model/theloai/TheLoai.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TheLoaiService } from '../../services/model-service/theLoaiService.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewChecked {
  truyensOnSearch: Truyen[];

  @Input() active: boolean;
  @Input() userLoginID: string;
  theLoais: TheLoai[];
  navBarInit: boolean = false;

  constructor(private truyenService: TruyenService, private theLoaiService: TheLoaiService) { }

  ngOnInit(): void {
    this.theLoaiService.getList().subscribe(theloais => {
      this.theLoais = theloais;
    });
  }

  ngAfterViewChecked(): void{
    this.categoryDropdownInit();
  }

  categoryDropdownInit() {
    if (this.active == true) {
      if(this.navBarInit == false){
        this.navBarInit = true;
        const catBut = document.getElementById('catagory-dropdown');
        if (!catBut) return;
  
        catBut.addEventListener('click', function () {
          showMenuOnTablet();
        });
  
        function showMenuOnTablet() {
          var x = document.getElementById("top__nav");
          if (x.className === "nav__list") {
            x.className += " responsive";
          } else {
            x.className = "nav__list";
          }
        }
      }
    }
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
