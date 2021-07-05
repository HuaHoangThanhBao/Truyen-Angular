import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';

declare function setUpDarkMode(): void;
declare function expandBtn(): void;

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.scss']
})
export class StoryDetailComponent implements OnInit {

  truyenDetailJson: any;
  phuLucJson: any;

  jsonBinhLuanArr: any;
  jsonTheLoaiArr: any;
  //commentFilter: ICommentModel[] = [];
  tongLuotXem: number;
  binhLuans: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.paramMap.subscribe((param) => {
      const truyenID = param.get('id');
      //console.log(id);

      this.http.get(environment.apiURL + `/binhluan?pageNumber=1&pageSize=5&apiKey=${environment.apiKey}&sorting=true&truyenID=` + truyenID)
        .toPromise()
        .then(binhLuanData => {
          this.jsonBinhLuanArr = binhLuanData;
          console.log('binhluan in st-DETAIL:', this.jsonBinhLuanArr);
        });


      this.http.get(environment.apiURL + '/truyen/' + truyenID + `/${environment.apiKey}/details`)
        .toPromise()
        .then(truyenDetail => {
          this.truyenDetailJson = truyenDetail;
          console.log('truyen detail:', this.truyenDetailJson);
          this.tongLuotXem = this.truyenDetailJson.chuongs.reduce((ac, cur) => { return ac + cur.luotXem }, 0);
        });

      this.http.get(environment.apiURL + '/phuluc/' + truyenID + `/${environment.apiKey}`)
        .toPromise()
        .then(phuluc => {
          this.phuLucJson = phuluc;
          console.log('phu luc:', this.phuLucJson);
        })

      this.http.get(environment.apiURL + `/theloai/${environment.apiKey}`)
        .toPromise()
        .then(theLoaiData => {
          this.jsonTheLoaiArr = theLoaiData;
          console.log(this.jsonTheLoaiArr);
        })

      this.http.get(environment.apiURL + `/binhluan?pageNumber=1&pageSize=10&apiKey=${environment.apiKey}&sorting=true&truyenID=` + truyenID)
        .toPromise()
        .then(binhLuans => {
          this.binhLuans = binhLuans;
        });
    })
  }

  ngOnInit(): void {
    this.categoryDropdownInit();
    setUpDarkMode();
    expandBtn();
    //truyenUltiInit();
  }

  categoryDropdownInit() {
    const catBut = document.getElementById('catagory-dropdown');
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
