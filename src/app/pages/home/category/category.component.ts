import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../environments/environment';

declare function setUpDarkMode(): void;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  jsonBinhLuanArr: any;
  jsonTheLoaiArr: any;
  
  truyenTheoDanhMucArr: any;
  mostViews: any;
  truyenPaginationData: any;
  theLoaiId: number;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private route: ActivatedRoute, private http: HttpClient) { 
    
    this.route.paramMap.subscribe((param) => {
      const id = param.get('id');
      this.theLoaiId = parseInt(id);
      
      this.fetchCorsPagination(1).then(headers => {
        this.setPaginationVar(headers);
        console.log('header:', this.getPaginationVar());
        this.storyListComponent.passPagingData(this.getPaginationVar());
      });

      this.http.get(environment.apiURL + `/theloai/${environment.apiKey}`)
        .toPromise()
        .then(theLoaiData => {
          this.jsonTheLoaiArr = theLoaiData;
          console.log(this.jsonTheLoaiArr);
        })

      this.http.get(environment.apiURL + `/truyen?pageNumber=1&pageSize=20&apiKey=${environment.apiKey}&sorting=true&theloaiID=` + id)
        .toPromise()
        .then(danhMuc => {
          this.truyenTheoDanhMucArr = danhMuc;
          console.log(this.truyenTheoDanhMucArr);
        })

      this.http.get(environment.apiURL + `/truyen?pageNumber=1&pageSize=5&apiKey=${environment.apiKey}&topview=true`)
        .toPromise()
        .then(mostViewData => {
          this.mostViews = mostViewData;
          console.log(this.mostViews);
        })

      this.http.get(environment.apiURL + `/binhluan?pageNumber=1&pageSize=5&apiKey=${environment.apiKey}&lastestUpdate=true`)
        .toPromise()
        .then(binhLuanData => {
          this.jsonBinhLuanArr = binhLuanData;
          console.log(this.jsonBinhLuanArr);
        })
    });
  }

  ngOnInit(): void {
    setUpDarkMode();
    this.categoryDropdownInit();
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

  setPaginationVar(newVal) {
    this.truyenPaginationData = newVal;
  }

  getPaginationVar() {
    return this.truyenPaginationData;
  }

  async fetchCorsPagination(number) {
    const response = await fetch(environment.apiURL + `/truyen?pageNumber=${number}&pageSize=20&apiKey=${environment.apiKey}&sorting=true&theloaiID=` + this.theLoaiId);
    const headers = JSON.parse(response.headers.get('X-Pagination'));
    return headers;
  }

  refreshFetchList(value) {
    console.log(value)

    this.fetchCorsPagination(value).then(headers => {
      this.setPaginationVar(headers);
      console.log('header:', this.getPaginationVar());
      this.storyListComponent.passPagingData(this.getPaginationVar());
    });

    this.http.get(environment.apiURL + `/truyen?pageNumber=${value}&pageSize=20&apiKey=${environment.apiKey}&sorting=true&theloaiID=` + this.theLoaiId)
      .toPromise()
      .then(truyenData => {
        this.truyenTheoDanhMucArr = truyenData;
        console.log("refresh list: ", this.truyenTheoDanhMucArr);
      })
  }
}
