import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PubLishTheoDoiOfTruyenDto } from 'src/app/model/authentication/publishTheoDoiOfTruyen.model';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { HistoryManagement } from '../../../../services/others/historyManagement.service';
import { RequestService } from '../../../../services/others/request.service';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { PhuLucService } from '../../../../services/model-service/phuLucService.service';
import { PhuLuc } from '../../../../model/phuluc/PhuLuc.model';
import { JwtHelperService } from '@auth0/angular-jwt';

declare function expandBtn(): void;

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
  styleUrls: ['./story-detail.component.scss'],
  providers: [HistoryManagement]
})
export class StoryDetailComponent implements OnInit {
  binhLuans: BinhLuan[];
  truyen: Truyen;
  phuLucs: PhuLuc;

  tongLuotXem: number;
  truyenID: number;

  constructor(private jwtHelper: JwtHelperService, private route: ActivatedRoute, private _router: Router, private historyManagement: HistoryManagement,
    private toast: ToastAlertService, private requestService: RequestService, private truyenService: TruyenService,
    private binhLuanService: BinhLuanService, private phuLucService: PhuLucService) {

    this.route.paramMap.subscribe((param) => {
      this.truyenID = parseInt(param.get('truyenID'));
    });

  }

  ngOnInit(): void {
    let binhLuansParams: RequestParam = { pageNumber: 1, pageSize: 5, sorting: true, truyenID: this.truyenID }
    this.binhLuanService.getListWithParams(binhLuansParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(binhLuans)
    });

    this.truyenService.getDetail(this.truyenID).subscribe(truyen => {
      this.truyen = truyen;
      this.tongLuotXem = truyen.chuongs.reduce((ac, cur) => { return ac + cur.luotXem }, 0);
      //console.log(truyen)
    });

    this.phuLucService.get(this.truyenID).subscribe(phulucs => {
      this.phuLucs = phulucs;
      //console.log(phulucs)
    });

    expandBtn();
    //truyenUltiInit();
  }

  addFollowing() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      var decode = this.jwtHelper.decodeToken(token);

      const userLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
      const theoDoiDto: PubLishTheoDoiOfTruyenDto = {
        truyenID: this.truyenID,
        userID: userLoginID
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
  }
}