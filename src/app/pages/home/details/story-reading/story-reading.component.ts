import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chuong } from '../../../../model/chuong/Chuong.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { ChuongService } from '../../../../services/model-service/chuongService.service';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { HistoryManagement } from '../../../../services/others/historyManagement.service';

@Component({
  selector: 'app-story-reading',
  templateUrl: './story-reading.component.html',
  styleUrls: ['./story-reading.component.scss'],
  providers: [HistoryManagement]
})
export class StoryReadingComponent implements OnInit {

  chuong: Chuong;
  binhLuans: BinhLuan[];
  truyen: Truyen;

  truyenID: number;
  chuongID: number;
  first: boolean;
  last: boolean;
  currentChapIndex: number;

  chuongCatagoryList: [];

  constructor(private route: ActivatedRoute, private _router: Router, private historyManagement: HistoryManagement, private truyenService: TruyenService,
    private binhLuanService: BinhLuanService, private chuongService: ChuongService) {
    this.route.paramMap.subscribe((param) => {
      this.chuongID = parseInt(param.get('chuongID'));
      this.truyenID = parseInt(param.get('truyenID'));

      this.chapNavigation(this.chuongID);

      this.chuongService.getDetail(this.chuongID).subscribe(chuong => {
        this.chuong = chuong;
        //console.log(chuong)
      });

      let binhLuansParams: RequestParam = { pageNumber: 1, pageSize: 10, sorting: true, chuongID: this.chuongID }
      this.binhLuanService.getListWithParams(binhLuansParams).subscribe(binhLuans => {
        this.binhLuans = binhLuans;
        //console.log(truyens)
      });
    });
  }

  ngOnInit(): void {
    this.truyenService.getDetail(this.truyenID).subscribe(truyen => {
      this.truyen = truyen;
      console.log(truyen);
      this.chapNavigation(this.chuongID);
    })

    //this.scrollMenu();
  }

  chapNavigation(chuongID) {
    if (this.truyen) {
      const index = this.truyen.chuongs.findIndex((chuong) => {
        return chuong.chuongID == chuongID;
      });
      this.currentChapIndex = index;

      if (index == this.truyen.chuongs.length - 1) this.last = true;
      else this.last = false;

      if (index == 0) this.first = true;
      else this.first = false;
    }
  }

  goBackChap() {
    this.currentChapIndex--;
    const chapDirID = this.truyen.chuongs[this.currentChapIndex].chuongID;
    const chapDirName = this.truyen.chuongs[this.currentChapIndex].tenChuong;
    this.historyManagement.addToHistory(this.truyenID, this.truyen.tenTruyen, chapDirID, chapDirName, this.truyen.hinhAnh);
    this._router.navigate([`details/story-reading/${this.truyen.truyenID}/${chapDirID}`]);
  }

  goContinousChap() {
    this.currentChapIndex++;
    const chapDirID = this.truyen.chuongs[this.currentChapIndex].chuongID;
    const chapDirName = this.truyen.chuongs[this.currentChapIndex].tenChuong;
    this.historyManagement.addToHistory(this.truyenID, this.truyen.tenTruyen, chapDirID, chapDirName, this.truyen.hinhAnh);
    this._router.navigate([`details/story-reading/${this.truyen.truyenID}/${chapDirID}`]);
  }

  selectedChange(chuongID) {
    if (this.truyen) {
      const c = this.truyen.chuongs.find((chuong) => {
        return chuong.chuongID == chuongID;
      });
      this.historyManagement.addToHistory(this.truyenID, this.truyen.tenTruyen, chuongID, c.tenChuong, this.truyen.hinhAnh);
      this._router.navigate([`details/story-reading/${this.truyen.truyenID}/${chuongID}`]);
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
