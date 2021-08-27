import { Component, OnInit } from '@angular/core';
import { BinhLuan } from 'src/app/model/binhluan/BinhLuan.model';
import { BinhLuanService } from '../../../services/model-service/binhLuanService.service';
import { RequestParam } from '../../../model/param/RequestParam.model';
import { TheoDoiService } from '../../../services/model-service/theoDoiService.service';
import { TheoDoi } from '../../../model/theodoi/TheoDoi.model';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  binhLuans: BinhLuan[];
  theoDois: TheoDoi[];

  constructor(private binhLuanService: BinhLuanService, private theoDoiService: TheoDoiService) {
  }

  ngOnInit(): void {
    setUpAdmin();

    let binhLuanLatestParams: RequestParam = { pageNumber: 1, pageSize: 20, lastestUpdate: true }
    this.binhLuanService.getListWithParams(binhLuanLatestParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
    })

    let theDoiLatestParams: RequestParam = { pageNumber: 1, pageSize: 20, lastestUpdate: true }
    this.theoDoiService.getListWithParams(theDoiLatestParams).subscribe(theDois => {
      this.theoDois = theDois;
    })
  }
}
