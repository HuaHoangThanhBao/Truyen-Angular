import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chuong } from '../../../../model/chuong/Chuong.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { ChuongService } from '../../../../services/model-service/chuongService.service';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { HistoryManagement } from '../../../../services/others/historyManagement.service';
import { Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TheoDoiService } from '../../../../services/model-service/theoDoiService.service';
import { TheoDoi } from 'src/app/model/theodoi/TheoDoi.model';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';

@Component({
  selector: 'app-story-reading',
  templateUrl: './story-reading.component.html',
  styleUrls: ['./story-reading.component.scss'],
  providers: [HistoryManagement]
})
export class StoryReadingComponent implements OnInit, OnDestroy {

  chuong: Chuong;
  chuongs: Chuong[];
  binhLuans: BinhLuan[];
  truyen: Truyen;

  truyenID: number;
  chuongID: number;
  first: boolean;
  last: boolean;
  currentChapIndex: number;

  private loginSubscription: Subscription;

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }

  constructor(private route: ActivatedRoute, private _router: Router, private historyManagement: HistoryManagement, private truyenService: TruyenService,
    private binhLuanService: BinhLuanService, private chuongService: ChuongService, private jwtHelper: JwtHelperService, private theoDoiService: TheoDoiService,
    private toast: ToastAlertService) {
    this.loginSubscription = this.route.paramMap.subscribe((param) => {
      this.chuongID = parseInt(param.get('chuongID'));
      this.truyenID = parseInt(param.get('truyenID'));

      this.chuongService.getDetail(this.chuongID).subscribe(chuong => {
        this.chuong = chuong;
        //console.log(chuong)
      });

      let binhLuansParams: RequestParam = { pageNumber: 1, pageSize: 10, sorting: true, chuongID: this.chuongID }
      this.binhLuanService.getListWithParams(binhLuansParams).subscribe(binhLuans => {
        this.binhLuans = binhLuans;
        //console.log(truyens)
      });

      this.truyenService.getDetail(this.truyenID).subscribe(truyen => {
        this.truyen = truyen;
        //console.log(truyen);
      })

      this.chuongService.getListExtend(`${this.truyenID}/chuongbytruyenid`).subscribe(chuongs => {
        this.chuongs = chuongs;
        this.chapNavigation(this.chuongID);
        //console.log(chuongs)
      });
    });
  }

  ngOnInit(): void {
  }

  chapNavigation(chuongID) {
    this.chuongs = this.chuongs.filter((c) => {
      return c.trangThai == 1;
    })
    const index = this.chuongs.findIndex((chuong) => {
      return chuong.chuongID == chuongID;
    });
    this.currentChapIndex = index;

    if (index == this.chuongs.length - 1) this.last = true;
    else this.last = false;

    if (index == 0) this.first = true;
    else this.first = false;
  }

  goBackChap() {
    this.currentChapIndex--;
    const chapDirID = this.chuongs[this.currentChapIndex].chuongID;
    const chapDirName = this.chuongs[this.currentChapIndex].tenChuong;
    this.historyManagement.addToHistory(this.truyenID, this.truyen.tenTruyen, chapDirID, chapDirName, this.truyen.hinhAnh);
    this._router.navigate([`details/story-reading/${this.truyen.truyenID}/${chapDirID}`]);
  }

  goContinousChap() {
    this.currentChapIndex++;
    const chapDirID = this.chuongs[this.currentChapIndex].chuongID;
    const chapDirName = this.chuongs[this.currentChapIndex].tenChuong;
    this.historyManagement.addToHistory(this.truyenID, this.truyen.tenTruyen, chapDirID, chapDirName, this.truyen.hinhAnh);
    this._router.navigate([`details/story-reading/${this.truyen.truyenID}/${chapDirID}`]);
  }

  selectedChange(chuongID) {
    if (this.truyen) {
      const c = this.chuongs.find((chuong) => {
        return chuong.chuongID == chuongID;
      });
      this.historyManagement.addToHistory(this.truyenID, this.truyen.tenTruyen, chuongID, c.tenChuong, this.truyen.hinhAnh);
      this._router.navigate([`details/story-reading/${this.truyen.truyenID}/${chuongID}`]);
    }
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

  scrollMenu() {
    window.onscroll = function () { fixedOnScroll() };

    var nav_header = document.getElementById("nav-menu-header");
    var whereToActive = document.getElementById("image-list");
    var sticky = whereToActive.offsetTop;

    function fixedOnScroll() {
      if (window.pageYOffset > sticky) {
        nav_header.classList.add("nav-sticky");
      } else {
        nav_header.classList.remove("nav-sticky");
      }
    }
  }
}
