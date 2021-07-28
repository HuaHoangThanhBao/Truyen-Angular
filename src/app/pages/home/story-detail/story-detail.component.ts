import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PubLishTheoDoiOfTruyenDto } from 'src/app/model/publishTheoDoiOfTruyen.model';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { environment } from '../../../../environments/environment';

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
  //commentFilter: ICommentModel[] = [];
  tongLuotXem: number;
  binhLuans: any;
  userLoginID: string;
  truyenID: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private _authService: AuthenticationService,
    private toast: ToastAlertService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.truyenID = param.get('id');

      //console.log(id);
      if (this.userLoginID == undefined) {
        this.http.post(environment.apiURL + `/auth/checklogin`, {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            "Api-Key": environment.apiKey
          })
        })
          .subscribe(
            (response) => {
              this.userLoginID = response["message"];
            },
            (error) => {
              console.log(error);
              return false;
            }
          );
      }

      this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=5&sorting=true&truyenID=${this.truyenID}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(binhLuanData => {
          this.jsonBinhLuanArr = binhLuanData;
          console.log('binhluan in st-DETAIL:', this.jsonBinhLuanArr);
        });


      this.http.get(environment.apiURL + `/truyen/${this.truyenID}/details`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(truyenDetail => {
          this.truyenDetailJson = truyenDetail;
          console.log('truyen detail:', this.truyenDetailJson);
          this.tongLuotXem = this.truyenDetailJson.chuongs.reduce((ac, cur) => { return ac + cur.luotXem }, 0);
        });

      this.http.get(environment.apiURL + `/phuluc/${this.truyenID}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(phuluc => {
          this.phuLucJson = phuluc;
          console.log('phu luc:', this.phuLucJson);
        })

      this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=10&sorting=true&truyenID=${this.truyenID}`, {
        headers: new HttpHeaders({
          "Content-Type": "application/json",
          "Api-Key": environment.apiKey
        })
      })
        .toPromise()
        .then(binhLuans => {
          this.binhLuans = binhLuans;
        });
    })

    expandBtn();
    //truyenUltiInit();
  }

  addToHistory(truyenID: number, tenTruyen: string, chuongID: number, tenChuong: string, hinhAnh: string) {
    //alert(truyenID + "/" + chuongID)
    const data = { "truyenID": truyenID, "tenTruyen": tenTruyen, "chuongID": chuongID, "tenChuong": tenChuong, "hinhAnh": hinhAnh };
    const localHist = JSON.parse(localStorage.getItem("tr_hist"));
    let hist_arr;
    let found;

    if (localHist != null) {
      hist_arr = [...localHist];
      found = checkDuplicate();

      function checkDuplicate() {
        for (let i = 0; i < hist_arr.length; i++) {
          if (hist_arr[i]["truyenID"] === truyenID) {
            hist_arr[i]["tenTruyen"] = tenTruyen;
            hist_arr[i]["chuongID"] = chuongID;
            hist_arr[i]["tenChuong"] = tenChuong;
            hist_arr[i]["hinhAnh"] = hinhAnh;
            return true;
          }
        }
        return false;
      }
    }
    else hist_arr = [];

    if (!found)
      hist_arr.push(data);

    //console.log(hist_arr)
    localStorage.setItem("tr_hist", JSON.stringify(hist_arr));

    window.location.href = "story-reading/" + truyenID + "/" + chuongID;
  }

  addFollowing() {
    if (!this.userLoginID) {
      window.location.href = "authentication/login";
    }
    else {
      const theoDoiDto: PubLishTheoDoiOfTruyenDto = {
        truyenID: parseInt(this.truyenID),
        userID: this.userLoginID
      }

      this._authService.publishTheoDoiOfTruyen('theodoi', theoDoiDto)
        .subscribe(res => {
          this.toast.showToast("Thành công!", "Hệ thống sẽ thông báo cho bạn khi có chap mới", "success")
        },
          (error) => {
            this.toast.showToast("Lỗi", "Hình như bạn đã theo dõi truyện này rồi!", "error");
          })
    }
  }
}
