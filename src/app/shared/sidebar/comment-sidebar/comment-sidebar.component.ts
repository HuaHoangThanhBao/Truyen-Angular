import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-sidebar',
  templateUrl: './comment-sidebar.component.html',
  styleUrls: ['./comment-sidebar.component.scss']
})
export class CommentSidebarComponent implements OnInit {

  @Input() binhLuanJson: any;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
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

    this.router.navigate([`/story-reading/${truyenID}/${chuongID}`]);
  }
}
