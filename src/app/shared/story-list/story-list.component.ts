import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { environment } from '../../../environments/environment';
import { HistoryManagement } from '../../services/others/historyManagement.service';
import { Truyen } from '../../model/truyen/Truyen.model';

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

  pagingData: any;

  testData: Truyen[];

  constructor(private historyManagement: HistoryManagement) { }

  ngOnInit(): void {
  }

  passPagingHeaders(data) {
    this.pagingData = data;
    //console.log("passing header from Index Component: ", this.pagingData);
    this.paginationComponent.passPagingData(data);
  }

  callReloadList(value) {
    this.reload.emit(value);
  }

  callDeleteFollowingItem(truyenID) {
    this.deleteFollowingItemEvent.emit(truyenID);
  }

  callRefreshHistories(truyenID) {
    this.historyManagement.delelteHistoryItem(truyenID);
    this.refreshHistories.emit(truyenID);
  }
}
