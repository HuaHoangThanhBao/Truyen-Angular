import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../../environments/environment';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { TheLoaiService } from 'src/app/services/model-service/theLoaiService.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  title: string;

  truyensByCategory: Truyen[];
  truyensTopView: Truyen[];
  binhLuans: BinhLuan[];

  theLoaiId: number;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private route: ActivatedRoute, private truyenService: TruyenService, private binhLuanService: BinhLuanService, private theLoaiService: TheLoaiService) {

    this.route.paramMap.subscribe((param) => {
      this.theLoaiId = parseInt(param.get('id'));

      let truyenHeaderPagParams: RequestParam = { pageNumber: 1, pageSize: 20, sorting: true, theLoaiID: this.theLoaiId }
      this.truyenService.getPaginationHeaders(truyenHeaderPagParams).then(headers => {
        this.storyListComponent.passPagingHeaders(headers);
      });
    });
  }

  ngOnInit(): void {
    this.theLoaiService.get(this.theLoaiId).subscribe(theLoai => {
      this.title = `Danh mục: ${theLoai["tenTheLoai"]}`
      //console.log(truyens)
    });

    let truyenLatestUpdateParams: RequestParam = { pageNumber: 1, pageSize: 20, sorting: true, theLoaiID: this.theLoaiId }
    this.truyenService.getListWithParams(truyenLatestUpdateParams).subscribe(truyens => {
      this.truyensByCategory = truyens;
      //console.log(truyens)
    });

    let truyenTopViewParams: RequestParam = { pageNumber: 1, pageSize: 5, topView: true }
    this.truyenService.getListWithParams(truyenTopViewParams).subscribe(truyens => {
      this.truyensTopView = truyens;
      //console.log(truyens)
    });

    let binhLuanUpdateParams: RequestParam = { pageNumber: 1, pageSize: 20, lastestUpdate: true }
    this.binhLuanService.getListWithParams(binhLuanUpdateParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(this.binhLuans)
    });
  }

  reloadTruyenOnPag(number) {
    //console.log(value)

    let truyenHeaderPagParams: RequestParam = { pageNumber: number, pageSize: 20, sorting: true, theLoaiID: this.theLoaiId }
    this.truyenService.getPaginationHeaders(truyenHeaderPagParams).then(headers => {
      this.storyListComponent.passPagingHeaders(headers);
    });

    let truyenOnReloadParams: RequestParam = { pageNumber: number, pageSize: 20, sorting: true, theLoaiID: this.theLoaiId }
    this.truyenService.getListWithParams(truyenOnReloadParams).subscribe(truyens => {
      this.truyensByCategory = truyens;
      //console.log(truyens)
    });
  }
}
