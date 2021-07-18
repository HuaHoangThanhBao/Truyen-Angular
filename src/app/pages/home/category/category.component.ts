import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  title: string;

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

      
      this.http.get(environment.apiURL + `/theloai/` + id, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(theLoai => {
          this.title = `Danh mục: ${theLoai["tenTheLoai"]}`
        })
        

      this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=1&pageSize=20&sorting=true&theloaiID=` + id, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(danhMuc => {
          this.truyenTheoDanhMucArr = danhMuc;
          console.log(this.truyenTheoDanhMucArr);
        })

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

      this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`, {
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
    });
  }

  ngOnInit(): void {
  }

  setPaginationVar(newVal) {
    this.truyenPaginationData = newVal;
  }

  getPaginationVar() {
    return this.truyenPaginationData;
  }

  async fetchCorsPagination(number) {
    const response = await fetch(environment.apiURL + `/truyen/pagination?pageNumber=${number}&pageSize=20&sorting=true&theloaiID=` + this.theLoaiId, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      }
    });
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

    this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=${value}&pageSize=20&sorting=true&theloaiID=` + this.theLoaiId, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(truyenData => {
        this.truyenTheoDanhMucArr = truyenData;
        console.log("refresh list: ", this.truyenTheoDanhMucArr);
      })
  }
}
