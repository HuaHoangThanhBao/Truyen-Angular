import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../../../shared/services/request.service';

@Component({
  selector: 'app-story-reading',
  templateUrl: './story-reading.component.html',
  styleUrls: ['./story-reading.component.scss'],
  providers: [RequestService]
})
export class StoryReadingComponent implements OnInit {

  chuongJson: any;
  binhLuanJson: any;
  truyenJson: any;

  truyenID: number;
  chuongID: number;
  first: boolean;
  last: boolean;

  chuongCatagoryList: [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private _router: Router, private requetService: RequestService) {
    this.route.paramMap.subscribe((param) => {
      this.chuongID = parseInt(param.get('chuongID'));
      this.truyenID = parseInt(param.get('truyenID'));
    });
  }

  ngOnInit(): void {
    this.requetService.get(`chuong/${this.chuongID}/details`)
      .toPromise()
      .then(chuong => {
        this.chuongJson = chuong;
        //console.log(this.chuongJson);
      })

    this.requetService.get(`truyen/${this.truyenID}/details`)
      .toPromise()
      .then(truyenDetail => {
        this.truyenJson = truyenDetail;
        //console.log('truyen json:', this.truyenJson);

        let index;

        for (let i = 0; i < this.truyenJson.chuongs.length; i++) {
          if (this.truyenJson.chuongs[i].chuongID == this.chuongID) {
            index = i;
            break;
          }
        }

        if (index == 0) {
          this.first = true;
          this.last = false;
        }
        if (index == this.truyenJson.chuongs.length - 1) {
          this.first = false;
          this.last = true;
        }
      });

    this.requetService.get(`binhluan/pagination?pageNumber=1&pageSize=10&sorting=true&chuongID=${this.chuongID}`)
      .toPromise()
      .then(binhLuans => {
        //console.log('binh luan of reading:', binhLuans);
        this.binhLuanJson = binhLuans;
      });

    this.scrollMenu();
  }

  redirectToAnotherChap(value) {
    let index;
    let resultID;

    if (this.truyenJson) {
      if (typeof value == 'boolean') {
        for (let i = 0; i < this.truyenJson.chuongs.length; i++) {
          if (this.truyenJson.chuongs[i].chuongID == this.chuongID) {
            index = i;
            break;
          }
        }

        index = value === true ? index + 1 : index - 1;
        if (index >= this.truyenJson.chuongs.length - 1) index = this.truyenJson.chuongs.length - 1;
        if (index <= 0) index = 0;

        for (let i = 0; i < this.truyenJson.chuongs.length; i++) {
          if (i == index) {
            resultID = this.truyenJson.chuongs[i].chuongID;
            break;
          }
        }
      }
      else index = value;
    }
    //console.log(index);
    if (resultID) this._router.navigate([`/story-reading/${this.truyenJson.truyenID}/${resultID}`]);
  }

  selectedChange(value) {
    this._router.navigate([`story-reading/${this.truyenJson.truyenID}/${value}`]);
  }

  scrollMenu() {
    window.onscroll = function () { fixedOnScroll() };

    var nav_header = document.getElementById("nav__menu--header");
    var whereToActive = document.getElementById("image__list");
    var sticky = whereToActive.offsetTop;

    function fixedOnScroll() {
      if (window.pageYOffset > sticky) {
        nav_header.classList.add("nav-sticky");
      } else {
        nav_header.classList.remove("nav-sticky");
      }
    }
  }
}
