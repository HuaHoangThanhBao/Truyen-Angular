import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../../../shared/services/request.service';
import { Chuong } from '../../../../model/chuong/Chuong.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { ChuongService } from '../../../../services/chuongService.service';
import { TruyenService } from '../../../../services/truyenService.service';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { BinhLuanService } from '../../../../services/binhLuanService.service';
import { HistoryManagement } from '../../../../shared/services/historyManagement.service';

@Component({
  selector: 'app-story-reading',
  templateUrl: './story-reading.component.html',
  styleUrls: ['./story-reading.component.scss'],
  providers: [RequestService, HistoryManagement]
})
export class StoryReadingComponent implements OnInit {

  chuong: Chuong;
  binhLuans: BinhLuan[];
  truyen: Truyen;

  truyenID: number;
  chuongID: number;
  first: boolean;
  last: boolean;

  chuongCatagoryList: [];

  constructor(private route: ActivatedRoute, private _router: Router, private historyManagement: HistoryManagement, private truyenService: TruyenService, 
    private binhLuanService: BinhLuanService, private chuongService: ChuongService) {
    this.route.paramMap.subscribe((param) => {
      this.chuongID = parseInt(param.get('chuongID'));
      this.truyenID = parseInt(param.get('truyenID'));
    });
  }

  ngOnInit(): void {
    this.chuongService.getDetail(this.chuongID).subscribe(chuong => {
      this.chuong = chuong;
      //console.log(phulucs)
    });

    this.truyenService.getDetail(this.truyenID).subscribe(truyen => {
      this.truyen = truyen;
      //console.log(truyen);

      let index;

      for (let i = 0; i < truyen.chuongs.length; i++) {
        if (truyen.chuongs[i].chuongID == this.chuongID) {
          index = i;
          break;
        }
      }

      if (index == 0) {
        this.first = true;
        this.last = false;
      }
      if (index == truyen.chuongs.length - 1) {
        this.first = false;
        this.last = true;
      }
    })

    let binhLuansParams: RequestParam = {pageNumber: 1, pageSize: 10, sorting: true, chuongID: this.chuongID}
    this.binhLuanService.getListWithParams(binhLuansParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(truyens)
    });

    //this.scrollMenu();
  }

  redirectToAnotherChap(value) {
    let index;
    let resultID;

    if (this.truyen) {
      if (typeof value == 'boolean') {
        for (let i = 0; i < this.truyen.chuongs.length; i++) {
          if (this.truyen.chuongs[i].chuongID == this.chuongID) {
            index = i;
            break;
          }
        }

        index = value === true ? index + 1 : index - 1;
        if (index >= this.truyen.chuongs.length - 1) index = this.truyen.chuongs.length - 1;
        if (index <= 0) index = 0;

        for (let i = 0; i < this.truyen.chuongs.length; i++) {
          if (i == index) {
            resultID = this.truyen.chuongs[i].chuongID;
            break;
          }
        }
      }
      else index = value;
    }

    // this.historyManagement.addToHistory(
    //   this.truyen[index].truyenID, 
    //   this.truyen[index].tenTruyen, 
    //   resultID, 
    //   this.truyen[resultID].chuong.tenChuong, 
    //   this.truyen[index].hinhAnh);
    
    //console.log(index);
    if (resultID) window.location.href = `details/story-reading/${this.truyen.truyenID}/${resultID}`;
  }

  selectedChange(value) {
    window.location.href = `details/story-reading/${this.truyen.truyenID}/${value}`;
  }

  scrollMenu() {
    window.onscroll = function () { fixedOnScroll() };

    var nav_header = document.getElementById("nav__menu--header");
    var whereToActive = document.getElementById("image__list");
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
