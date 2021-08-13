import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../../environments/environment';
import { HistoryManagement } from '../../../../shared/services/historyManagement.service';
import { TruyenService } from '../../../../services/truyenService.service';
import { BinhLuanService } from '../../../../services/binhLuanService.service';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { Truyen } from 'src/app/model/truyen/Truyen.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  providers: [HistoryManagement]
})
export class HistoryComponent implements OnInit {
  title="Lịch sử đọc truyện";

  truyens: Truyen[];
  truyensTopView: Truyen[];
  binhLuans: BinhLuan[];

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private historyManagement: HistoryManagement, private truyenService: TruyenService, private binhLuanService: BinhLuanService) {
  }

  ngOnInit(): void {
    this.truyens = this.historyManagement.getHistories();

    let truyenTopViewParams: RequestParam = {pageNumber: 1, pageSize: 5, topView: true}
    this.truyenService.getListWithParams(truyenTopViewParams).subscribe(truyens => {
      this.truyensTopView = truyens;
      //console.log(truyens)
    });

    let binhLuanUpdateParams: RequestParam = {pageNumber: 1, pageSize: 20, lastestUpdate: true}
    this.binhLuanService.getListWithParams(binhLuanUpdateParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(this.binhLuans)
    });
  }

  refreshHistories(){
    this.truyens = this.historyManagement.getHistories();
  }
}
