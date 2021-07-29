import { Component, OnInit, Input } from '@angular/core';
declare function carouselInit(): void;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() carouselJson: any;
  carouselInitStatus: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  callCarousel() {
    if (!this.carouselInitStatus) {
      this.carouselInitStatus = true;
      carouselInit();
    }
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

    window.location.href = `story-reading/${truyenID}/${chuongID}`;
  }
}
