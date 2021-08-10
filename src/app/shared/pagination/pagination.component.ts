import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit } from '@angular/core';
/*Khai báo hàm từ file pagination.js*/
//declare function paginationInit(totalCount, currentPage, pageSize): void;

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  pagingHeaderData: any;
  numbers: number[] = [];
  currentPage: number = 1;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  passPagingData(data) {
    this.numbers = [];
    this.pagingHeaderData = data;
    //console.log("passing header from Story List Component: ", this.pagingHeaderData);
    for (let i = 1; i <= this.pagingHeaderData.TotalPages; i++) {
      this.numbers.push(i);
    }
  }

  refreshStoryList(value) {
    if(typeof value == 'number') this.currentPage = value;
    else this.currentPage = value === true ? this.currentPage + 1 : this.currentPage - 1;

    if(this.currentPage >= this.pagingHeaderData.TotalPages) this.currentPage = this.pagingHeaderData.TotalPages;
    if(this.currentPage <= 1) this.currentPage = 1;

    this.refresh.emit(this.currentPage);
  }
}
