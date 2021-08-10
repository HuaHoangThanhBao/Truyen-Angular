import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../../../shared/services/request.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
  providers: [RequestService]
})
export class FollowingComponent implements OnInit {
  title = "Truyện đang theo dõi"

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;
  truyenPaginationData: any;

  userLoginID: string;
  loggedIn: boolean = false;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private _router: Router, private toast: ToastAlertService, private requestService: RequestService) {
  }


  ngOnInit(): void {
    console.log('following component');

    this.requestService.post(`auth/checklogin`, null)
      .subscribe(
        (response) => {
          console.log(response)
          if (response["statusCode"] == 200) {
            this.loggedIn = true;
            this.userLoginID = response["message"];

            this.fetchCorsPagination(1).then(headers => {
              this.truyenPaginationData = headers;
              //console.log('header:', this.truyenPaginationData);
              this.storyListComponent.passPagingData(this.truyenPaginationData);
            });

            this.requestService.get(`theodoi/pagination?userid=${this.userLoginID}&pageNumber=${1}&pageSize=20&getall=true`)
              .toPromise()
              .then(truyenData => {
                this.jsonTruyenArr = truyenData;
                //console.log("refresh list: ", this.jsonTruyenArr);
              })
          }
          else{
            this._router.navigate(['authentication/login']);
          }
        }
      );

    this.requestService.get(`binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`)
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        //console.log(this.jsonBinhLuanArr);
      })

    this.requestService.get(`truyen/pagination?pageNumber=1&pageSize=5&topview=true`)
      .toPromise()
      .then(mostViewData => {
        this.mostViews = mostViewData;
        //console.log(this.mostViews);
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

    this.requestService.get(`theodoi/pagination?userid=${this.userLoginID}&pageNumber=${value}&pageSize=20&getall=true`)
      .toPromise()
      .then(truyenData => {
        this.jsonTruyenArr = truyenData;
        //console.log("refresh list: ", this.jsonTruyenArr);
      })
  }

  deleteFollowingItem(truyenID) {
    this.requestService.delete(`theodoi/deleteforuser?userid=${this.userLoginID}&truyenID=${truyenID}`)
      .toPromise()
      .then(res => {
        this.toast.showToast("Thành công", "Bỏ theo dõi truyện thành công!", "success");

        this.requestService.get(`theodoi/pagination?userid=${this.userLoginID}&pageNumber=${1}&pageSize=20&getall=true`)
          .toPromise()
          .then(truyenData => {
            this.jsonTruyenArr = truyenData;
            //console.log("refresh list: ", this.jsonTruyenArr);
          })
      })
  }
}
