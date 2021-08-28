import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { TruyenService } from '../../../services/model-service/truyenService.service';
import { Truyen } from '../../../model/truyen/Truyen.model';
import { RequestParam } from '../../../model/param/RequestParam.model';
import { BinhLuanService } from '../../../services/model-service/binhLuanService.service';
import { BinhLuan } from '../../../model/binhluan/BinhLuan.model';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  title = "Truyện mới cập nhật";
  truyens: Truyen[];
  truyensTopView: Truyen[];

  binhLuans: BinhLuan[];

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private truyenService: TruyenService, private binhLuanService: BinhLuanService) {
  }

  ngOnInit(): void {
    let truyenHeaderPagParams: RequestParam = { pageNumber: 1, pageSize: 20, getAll: true }
    this.truyenService.getPaginationHeaders(truyenHeaderPagParams).then(headers => {
      this.storyListComponent.passPagingHeaders(headers);
    });

    let truyenTopViewParams: RequestParam = {pageNumber: 1, pageSize: 5, topView: true}
    this.truyenService.getListWithParams(truyenTopViewParams).subscribe(truyens => {
      this.truyensTopView = truyens;
      //console.log(truyens)
    });


    let truyenLatestUpdateParams: RequestParam = {pageNumber: 1, pageSize: 20, getAll: true}
    this.truyenService.getListWithParams(truyenLatestUpdateParams).subscribe(truyens => {
      this.truyens = truyens;
      //console.log(truyens)
    });

    let binhLuanUpdateParams: RequestParam = {pageNumber: 1, pageSize: 20, lastestUpdate: true}
    this.binhLuanService.getListWithParams(binhLuanUpdateParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(this.binhLuans)
    });
  }

  reloadTruyenOnPag(number) {
    //console.log(value)

    let truyenHeaderPagParams: RequestParam = { pageNumber: number, pageSize: 20, getAll: true }
    this.truyenService.getPaginationHeaders(truyenHeaderPagParams).then(headers => {
      this.storyListComponent.passPagingHeaders(headers);
    });
    
    let truyenOnReloadParams: RequestParam = {pageNumber: number, pageSize: 20, getAll: true}
    this.truyenService.getListWithParams(truyenOnReloadParams).subscribe(truyens => {
      this.truyens = truyens;
      //console.log(truyens)
    });
  }
}
