import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { HistoryManagement } from '../../../../services/others/historyManagement.service';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { PhuLucService } from '../../../../services/model-service/phuLucService.service';
import { PhuLuc } from '../../../../model/phuluc/PhuLuc.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TheoDoiService } from '../../../../services/model-service/theoDoiService.service';
import { TheoDoi } from '../../../../model/theodoi/TheoDoi.model';
import { Chuong } from 'src/app/model/chuong/Chuong.model';
import { ChuongService } from '../../../../services/model-service/chuongService.service';

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

  tongSao: unknown;
  tongTheoDoi: unknown;
  tongLuotXem: number;
  truyenID: number;
  ultiliesInit: boolean = false;

  constructor(private jwtHelper: JwtHelperService, private route: ActivatedRoute, private _router: Router, private historyManagement: HistoryManagement,
    private toast: ToastAlertService, private truyenService: TruyenService, private chuongService: ChuongService,
    private binhLuanService: BinhLuanService, private phuLucService: PhuLucService, private theoDoiService: TheoDoiService) {

    this.route.paramMap.subscribe((param) => {
      this.truyenID = parseInt(param.get('truyenID'));

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
      
      this.truyenService.getListExtend(`${this.truyenID}/danhgiasao`).subscribe(soSao => {
        this.tongSao = soSao;
        //console.log(this.tongSao)
      });

      this.theoDoiService.getListExtend(`${this.truyenID}/soluottheodoibytruyen`).subscribe(soLuotTheoDoi => {
        this.tongTheoDoi = soLuotTheoDoi;
        //console.log(soLuotTheoDoi)
      });

      this.phuLucService.get(this.truyenID).subscribe(phulucs => {
        this.phuLucs = phulucs;
        //console.log(phulucs)
      });

      if (this.ultiliesInit) {
        const chap = document.getElementById('chapter-list');
        const expand = document.getElementById('expand');
        chap.classList.remove('active');
        expand.classList.remove('active');
      }
    });
  }

  ngOnInit(): void {
    //truyenUltiInit();
    expandBtn();
    this.ultiliesInit = true;
  }
  
  postLuotXem(chuong: Chuong){
    const newChuong: Chuong = {...chuong}
    newChuong.luotXem += 1;
    
    this.chuongService.updateWithID(chuong.chuongID.toString(), newChuong)
    .subscribe(_ => {}
    );

    this.historyManagement.addToHistory(chuong?.truyenID, this.truyen?.tenTruyen, chuong?.chuongID, chuong?.tenChuong, this.truyen?.hinhAnh)
  }

  addFollowing() {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      var decode = this.jwtHelper.decodeToken(token);

      const userLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
      const theoDoiDto: TheoDoi = {
        truyenID: this.truyenID,
        userID: userLoginID
      }

      this.theoDoiService.post(theoDoiDto)
        .subscribe(res => {
          if (!res?.error) {
            this.toast.showToast("Thành công!", "Hệ thống sẽ thông báo cho bạn khi có chap mới", "success")
          }
        })
    }
    else {
      this._router.navigate(["authentication/login"]);
    }
  }
}
