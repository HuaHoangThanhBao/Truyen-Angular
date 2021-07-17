import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-story-reading',
  templateUrl: './story-reading.component.html',
  styleUrls: ['./story-reading.component.scss']
})
export class StoryReadingComponent implements OnInit {

  chuongJson: any;
  binhLuanJson: any;
  truyenJson: any;

  currentChap: number;
  first: boolean;
  last: boolean;

  chuongCatagoryList: [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private _router: Router) {

    this.route.paramMap.subscribe((param) => {
      const chuongID = param.get('chuongID');
      const truyenID = param.get('truyenID');
      this.currentChap = parseInt(chuongID);

      this.http.get(environment.apiURL + '/chuong/' + chuongID + `/details`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(chuong => {
          this.chuongJson = chuong;
          console.log(this.chuongJson);
        })

      this.http.get(environment.apiURL + '/truyen/' + truyenID + `/details`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(truyenDetail => {
          this.truyenJson = truyenDetail;
          console.log('truyen json:', this.truyenJson);

          let index;

          for (let i = 0; i < this.truyenJson.chuongs.length; i++) {
            if (this.truyenJson.chuongs[i].chuongID == this.currentChap) {
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

      this.http.get(environment.apiURL + `/binhluan?pageNumber=1&pageSize=10&sorting=true&chuongID=` + chuongID, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(binhLuans => {
          console.log(binhLuans);
          this.binhLuanJson = binhLuans;
        });
    })
  }

  ngOnInit(): void {
    this.scrollMenu();
  }

  redirectToAnotherChap(value) {
    let index;
    let resultID;

    if (this.truyenJson) {
      if (typeof value == 'boolean') {
        for (let i = 0; i < this.truyenJson.chuongs.length; i++) {
          if (this.truyenJson.chuongs[i].chuongID == this.currentChap) {
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
    this._router.navigate([`/story-reading/${this.truyenJson.truyenID}/${value}`]);
  }

  scrollMenu() {
    window.onscroll = function () { fixedOnScroll() };

    var nav_header = document.getElementById("chap__nav__header");
    var whereToActive = document.getElementById("rd__body__area");
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
