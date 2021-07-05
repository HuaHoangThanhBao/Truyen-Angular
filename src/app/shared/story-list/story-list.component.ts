import { Component, Input, Output, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { PaginationComponent } from '../pagination/pagination.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  @Input() truyenJson: any;
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
}
