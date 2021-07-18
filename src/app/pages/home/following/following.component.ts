import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LogInService } from 'src/app/shared/services/log-in-service.service';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  title="Truyện đang theo dõi"

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;
  truyenPaginationData: any;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private http: HttpClient, private loginService: LogInService) {
  }

  ngOnInit(): void {
    this.fetchCorsPagination(1).then(headers => {
      this.setPaginationVar(headers);
      console.log('header:', this.getPaginationVar());
      this.storyListComponent.passPagingData(this.getPaginationVar());
    });
    
    this.http.get(environment.apiURL + `/theodoi/pagination?userid=${this.loginService.getUserID()}&pageNumber=1&pageSize=20&getall=true`, {
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
  }
  
  setPaginationVar(newVal) {
    this.truyenPaginationData = newVal;
  }

  getPaginationVar() {
    return this.truyenPaginationData;
  }
  
  async fetchCorsPagination(number) {
    const username = localStorage.getItem("username");
    const response = await fetch(environment.apiURL + `/theodoi/pagination?tenuser=${username}&pageNumber=${number}&pageSize=20&getall=true`, {
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
    console.log(value);
    const username = localStorage.getItem("username");

    this.fetchCorsPagination(value).then(headers => {
      this.setPaginationVar(headers);
      console.log('header:', this.getPaginationVar());
      this.storyListComponent.passPagingData(this.getPaginationVar());
    });

    this.http.get(environment.apiURL + `/theodoi/pagination?tenuser=${username}&pageNumber=${value}&pageSize=20&getall=true`, {
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
