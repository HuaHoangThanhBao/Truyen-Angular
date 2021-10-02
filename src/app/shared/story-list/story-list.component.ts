import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { environment } from '../../../environments/environment';
import { HistoryManagement } from '../../services/others/historyManagement.service';
import { Truyen } from '../../model/truyen/Truyen.model';
import { ConfirmationDialogService } from '../confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
  providers: [HistoryManagement]
})
export class StoryListComponent implements OnInit {
  @Input() headingTitle: string = "";
  @Input() truyens: Truyen[];
  @Input() isHistory: boolean = false;
  @Input() isFollowing: boolean = false;
  @Output() reload: EventEmitter<any> = new EventEmitter();
  @Output() deleteFollowingItemEvent: EventEmitter<any> = new EventEmitter();
  @Output() refreshHistories: EventEmitter<any> = new EventEmitter();
  @ViewChild(PaginationComponent) paginationComponent: PaginationComponent;
  _confirmationDialogService: ConfirmationDialogService;

  pagingData: any;

  constructor(private historyManagement: HistoryManagement, private confirmationDialogService: ConfirmationDialogService) { 
    this._confirmationDialogService = confirmationDialogService;
  }

  ngOnInit(): void {
  }

  passPagingHeaders(data) {
    this.pagingData = data;
    //console.log("passing header from Index Component: ", this.pagingData);
    this.paginationComponent.passPagingData(data);
  }

  callReloadList(value) {
    this.reload.emit(value);
    return value;
  }

  callReloadHistories(truyenID){
    this.refreshHistories.emit(truyenID);
    return truyenID;
  }

  callDeleteFollowingItem(truyenID) {
    this.openConfirmationDialogForFollowing(truyenID);
    return truyenID;
  }

  callRefreshHistories(truyenID) {
    this.openConfirmationDialogForHistory(truyenID);
    return truyenID;
  }
  
  public openConfirmationDialogForFollowing(truyenID) {
    this._confirmationDialogService.confirm('Vui lòng xác nhận', 'Bạn có muốn xóa truyện này khỏi danh sách theo dõi không?')
      .then((confirmed) => {
        //console.log('User confirmed:', confirmed);
        if (confirmed == true) {
          this.deleteFollowingItemEvent.emit(truyenID);
        }
      })
    .catch(() => {});
  }

  public openConfirmationDialogForHistory(truyenID) {
    this._confirmationDialogService.confirm('Vui lòng xác nhận', 'Bạn có muốn xóa truyện này khỏi lịch sử đọc không?')
      .then((confirmed) => {
        //console.log('User confirmed:', confirmed);
        if (confirmed == true) {
          this.historyManagement.delelteHistoryItem(truyenID);
          this.callReloadHistories(truyenID);
        }
      })
    .catch(() => {});
  }
}
