import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  @Input() headingTitle: string = "";
  @Input() truyenJson: any;
  @Input() isHistory: boolean = false;
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @ViewChild(PaginationComponent) paginationComponent: PaginationComponent;

  pagingData: any;

  constructor() { }

  ngOnInit(): void {
  }

  async fetchCorsPagination(currentPage) {
    const response = await fetch(environment.apiURL + `/truyen?pageNumber=${currentPage}&pageSize=20&apiKey=${environment.apiKey}&getall=true`);
    const headers = JSON.parse(response.headers.get('X-Pagination'));
    return headers;
  }

  passPagingData(data) {
    this.pagingData = data;
    console.log("passing header from Index Component: ", this.pagingData);
    this.paginationComponent.passPagingData(data);
  }

  callReloadList(value) {
    this.reload.emit(value);
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

    window.location.href = "/story-reading/" + truyenID + "/" + chuongID;
  }

  delelteHistoryItem(truyenID: number) {
    let hist_arr;
    const localHist = JSON.parse(localStorage.getItem("tr_hist"));

    if (localHist != null) {
      hist_arr = [...localHist];

      const index = findIndex();
      hist_arr.splice(index, 1);

      function findIndex() {
        for (let i = 0; i < hist_arr.length; i++) {
          if (hist_arr[i]["truyenID"] === truyenID) {
            return i;
          }
        }
      }

      localStorage.setItem("tr_hist", JSON.stringify(hist_arr));

      window.location.href = "/history";
    }
  }
}
