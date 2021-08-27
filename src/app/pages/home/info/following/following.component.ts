import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastAlertService } from 'src/app/services/others/toast-alert-service.service';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../../../services/others/request.service';
import { TruyenService } from '../../../../services/model-service/truyenService.service';
import { BinhLuanService } from '../../../../services/model-service/binhLuanService.service';
import { Truyen } from '../../../../model/truyen/Truyen.model';
import { BinhLuan } from '../../../../model/binhluan/BinhLuan.model';
import { RequestParam } from '../../../../model/param/RequestParam.model';
import { TheoDoiService } from '../../../../services/model-service/theoDoiService.service';
import { TheoDoi } from '../../../../model/theodoi/TheoDoi.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.scss'],
  providers: [RequestService]
})
export class FollowingComponent implements OnInit {
  title = "Truyện đang theo dõi"

  truyensByTheoDoi: TheoDoi[];
  truyensTopView: Truyen[];
  binhLuans: BinhLuan[];

  //jsonBinhLuanArr: any;
  //mostViews: any;
  //truyenPaginationData: any;

  private userLoginID: string;
  loggedIn: boolean = false;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private jwtHelper: JwtHelperService, private _router: Router, private toast: ToastAlertService, private requestService: RequestService, private truyenService: TruyenService,
    private binhLuanService: BinhLuanService, private theoDoiService: TheoDoiService) {
  }


  ngOnInit(): void {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      var decode = this.jwtHelper.decodeToken(token);
      this.userLoginID = decode['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid'];
      this.loggedIn = true;
      this.reloadTruyenOnPag(1);
    }

    let binhLuanUpdateParams: RequestParam = { pageNumber: 1, pageSize: 20, lastestUpdate: true }
    this.binhLuanService.getListWithParams(binhLuanUpdateParams).subscribe(binhLuans => {
      this.binhLuans = binhLuans;
      //console.log(this.binhLuans)
    });

    let truyenTopViewParams: RequestParam = { pageNumber: 1, pageSize: 5, topView: true }
    this.truyenService.getListWithParams(truyenTopViewParams).subscribe(truyens => {
      this.truyensTopView = truyens;
      //console.log(truyens)
    });

  }

  reloadTruyenOnPag(number) {
    //console.log(value)

    let truyenHeaderPagParams: RequestParam = { pageNumber: number, pageSize: 20, getAll: true, userID: this.userLoginID }
    this.theoDoiService.getPaginationHeaders(truyenHeaderPagParams).then(headers => {
      this.storyListComponent.passPagingHeaders(headers);
    });

    let truyenOnReloadParams: RequestParam = { pageNumber: number, pageSize: 20, getAll: true, userID: this.userLoginID }
    this.theoDoiService.getListWithParams(truyenOnReloadParams).subscribe(truyens => {
      this.truyensByTheoDoi = truyens;
      //console.log(truyens)
    });
  }

  deleteFollowingItem(truyenID) {
    let truyenOnDeleteParams: RequestParam = { userID: this.userLoginID, truyenID: truyenID }
    this.theoDoiService.deleteWithParams("deleteforuser", truyenOnDeleteParams).subscribe(_ => {
      this.toast.showToast("Thành công", "Bỏ theo dõi truyện thành công!", "success");
      this.reloadTruyenOnPag(1);
    });
  }
}
