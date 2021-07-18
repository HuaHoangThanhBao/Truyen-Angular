import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  title="Lịch sử đọc truyện";

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;

  constructor(private http: HttpClient) {
    const localHist = JSON.parse(localStorage.getItem("tr_hist"));
    if (localHist != null) {
      let hist_arr = [...localHist];
      this.jsonTruyenArr = hist_arr;
    }
    else this.jsonTruyenArr = [];


    this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        console.log(this.jsonBinhLuanArr);
      })

    this.http.get(environment.apiURL + `/truyen/pagination?pageNumber=1&pageSize=5&topview=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(mostViewData => {
        this.mostViews = mostViewData;
        console.log(this.mostViews);
      })
  }

  ngOnInit(): void {
  }
}
