import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HistoryManagement } from '../../../../shared/services/historyManagement.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [HistoryManagement]
})
export class HistoryComponent implements OnInit {
  title="Lịch sử đọc truyện";

  jsonTruyenArr: any;
  jsonBinhLuanArr: any;
  mostViews: any;

  constructor(private http: HttpClient, private historyManagement: HistoryManagement) {
  }

  ngOnInit(): void {
    this.jsonTruyenArr = this.historyManagement.getHistories();

    this.http.get(environment.apiURL + `/binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`, {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      })
    })
      .toPromise()
      .then(binhLuanData => {
        this.jsonBinhLuanArr = binhLuanData;
        //console.log(this.jsonBinhLuanArr);
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
        //console.log(this.mostViews);
      })
  }

  refreshHistories(){
    this.jsonTruyenArr = this.historyManagement.getHistories();
  }
}
