import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PubLishTheoDoiOfTruyenDto } from 'src/app/model/publishTheoDoiOfTruyen.model';
import { ToastAlertService } from 'src/app/shared/services/toast-alert-service.service';
import { HistoryManagement } from '../../../../shared/services/historyManagement.service';
import { RequestService } from '../../../../shared/services/request.service';

declare function expandBtn(): void;

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.scss'],
  providers: [HistoryManagement]
})
export class StoryDetailComponent implements OnInit {

  truyenDetailJson: any;
  phuLucJson: any;

  jsonBinhLuanArr: any;
  tongLuotXem: number;
  binhLuans: any;
  truyenID: string;

  constructor(private route: ActivatedRoute, private _router: Router, private historyManagement: HistoryManagement,
    private toast: ToastAlertService, private requestService: RequestService) {

    this.route.paramMap.subscribe((param) => {
      this.truyenID = param.get('truyenID');
    });

  }

  ngOnInit(): void {
    this.requestService.get(`binhluan/pagination?pageNumber=1&pageSize=5&sorting=true&truyenID=${this.truyenID}`)
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        //console.log('binhluan in st-DETAIL:', this.jsonBinhLuanArr);
      });


    this.requestService.get(`truyen/${this.truyenID}/details`)
      .toPromise()
      .then(truyenDetail => {
        this.truyenDetailJson = truyenDetail;
        //console.log('truyen detail:', this.truyenDetailJson);
        this.tongLuotXem = this.truyenDetailJson.chuongs.reduce((ac, cur) => { return ac + cur.luotXem }, 0);
      });

    this.requestService.get(`phuluc/${this.truyenID}`)
      .toPromise()
      .then(phuluc => {
        this.phuLucJson = phuluc;
        //console.log('phu luc:', this.phuLucJson);
      })

    this.requestService.get(`binhluan/pagination?pageNumber=1&pageSize=10&sorting=true&truyenID=${this.truyenID}`)
      .toPromise()
      .then(binhLuans => {
        this.binhLuans = binhLuans;
      });

    expandBtn();
    //truyenUltiInit();
  }

  addFollowing() {
    this.requestService.post('auth/checklogin', null)
      .subscribe(response => {
        console.log(response)
        if (response["statusCode"] == 200) {
          const theoDoiDto: PubLishTheoDoiOfTruyenDto = {
            truyenID: parseInt(this.truyenID),
            userID: response["message"]
          }

          this.requestService.post('theodoi', theoDoiDto)
            .subscribe(res => {
              this.toast.showToast("Thành công!", "Hệ thống sẽ thông báo cho bạn khi có chap mới", "success")
            },
              (error) => {
                this.toast.showToast("Lỗi", "Hình như bạn đã theo dõi truyện này rồi!", "error");
              })
        }
        else {
          this._router.navigate(["authentication/login"]);
        }
      })
  }
}
