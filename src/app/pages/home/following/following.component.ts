import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogInService } from 'src/app/shared/services/log-in-service.service';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss']
})
export class FollowingComponent implements OnInit {
  title = "Truyện đang theo dõi"

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;
  truyenPaginationData: any;

  userLoginID: string;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private http: HttpClient, private router: Router, private loginService: LogInService) {
  }


  ngOnInit(): void {
    console.log('following component');

    this.http.post(environment.apiURL + `/auth/checklogin`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .subscribe(
        (response) => {
          this.userLoginID = response["message"];

          this.fetchCorsPagination(1).then(headers => {
            this.truyenPaginationData = headers;
            console.log('header:', this.truyenPaginationData);
            this.storyListComponent.passPagingData(this.truyenPaginationData);
          });
    
          this.http.get(environment.apiURL + `/theodoi/pagination?userid=${this.userLoginID}&pageNumber=${1}&pageSize=20&getall=true`, {
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
        },
        (error) => {
          console.log(error);
          this.router.navigate(['/authentication/login']);
          return false;
        }
      );

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

  async fetchCorsPagination(number) {
    const response = await fetch(environment.apiURL + `/theodoi/pagination?userid=B4298A95-6646-46C8-9F46-08D94B5B53E1&pageNumber=1&pageSize=20&getall=true`, {
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

    this.fetchCorsPagination(value).then(headers => {
      this.truyenPaginationData = headers;
      console.log('header:', this.truyenPaginationData);
      this.storyListComponent.passPagingData(this.truyenPaginationData);
    });

    this.http.get(environment.apiURL + `/theodoi/pagination?userid=${this.userLoginID}&pageNumber=${value}&pageSize=20&getall=true`, {
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
