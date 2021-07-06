import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ICommentModel, ICommentModelJsonType } from '../../../model/truyenModel';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../environments/environment';

declare function setUpDarkMode(): void;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  jsonTheLoaiArr: any;

  mostViews: any;
  truyenPaginationData: any;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  //commentJsonLimited: any;
  commentFilter: ICommentModel[] = [];

  constructor(private http: HttpClient) {

    this.fetchCorsPagination(1).then(headers => {
      this.setPaginationVar(headers);
      console.log('header:', this.getPaginationVar());
      this.storyListComponent.passPagingData(this.getPaginationVar());
    });

    this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=1&pageSize=5&topview=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(mostViewData => {
        this.mostViews = mostViewData;
        console.log(this.mostViews);
      })

    this.http.get(environment.apiURL + `/theloai`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(theLoaiData => {
        this.jsonTheLoaiArr = theLoaiData;
        console.log(this.jsonTheLoaiArr);
      })

    this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=1&pageSize=20&getall=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(truyenData => {
        this.jsonTruyenArr = truyenData;
        console.log(this.jsonTruyenArr);
      })

    this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=5&lastestUpdate=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        console.log(this.jsonBinhLuanArr);
      })
  }

  ngOnInit(): void {
    this.categoryDropdownInit();
    setUpDarkMode();
  }

  setPaginationVar(newVal) {
    this.truyenPaginationData = newVal;
  }

  getPaginationVar() {
    return this.truyenPaginationData;
  }

  async fetchCorsPagination(number) {
    const response = await fetch(environment.apiURL + `/truyen/pagination?pageNumber=${number}&pageSize=20&getall=true`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      }
    });
    const headers = JSON.parse(response.headers.get('X-Pagination'));
    return headers;
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

  refreshFetchList(value) {
    console.log(value)

    this.fetchCorsPagination(value).then(headers => {
      this.setPaginationVar(headers);
      console.log('header:', this.getPaginationVar());
      this.storyListComponent.passPagingData(this.getPaginationVar());
    });

    this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=${value}&pageSize=20&getall=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(truyenData => {
        this.jsonTruyenArr = truyenData;
        console.log("refresh list: ", this.jsonTruyenArr);
      })
  }
}
