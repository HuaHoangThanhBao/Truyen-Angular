import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit } from '@angular/core';
/*Khai báo hàm từ file pagination.js*/
//declare function paginationInit(totalCount, currentPage, pageSize): void;

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  paginationHeader: any;
  numbers: any[] = [1];
  currentPage: number = 1;

  @Output() refresh: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  //Gọi ở story-list component
  passPagingData(data) {
    //console.log(data);
    this.renderPagination(data, this.currentPage);
  }

  renderPagination(data, index) {
    this.numbers = [];
    this.paginationHeader = data;

    //console.log(this.paginationHeader)
    //console.log(this.paginationHeader.TotalPages)

    if (!this.paginationHeader?.TotalPages) return;
    if (this.paginationHeader.TotalPages == 0) return;

    if (this.paginationHeader.TotalPages == 1) this.numbers = [1];
    else if (this.paginationHeader.TotalPages == 2) this.numbers = [1, '...', this.paginationHeader.TotalPages];
    else if (this.paginationHeader.TotalPages == 3) this.numbers = [1, 2, '...', this.paginationHeader.TotalPages];
    else {
      this.numbers = [1, 2, '...', this.paginationHeader.TotalPages - 1, this.paginationHeader.TotalPages];
    }

    //console.log("current page:", index);

    if (index > 1) {
      this.numbers[0] = this.currentPage;
      this.numbers[1] = this.currentPage + 1;

      if (index >= this.paginationHeader.TotalPages - 2 && index != this.paginationHeader.TotalPages) {
        this.numbers.length = 3;
      }
      if (index == this.paginationHeader.TotalPages) this.numbers.length = 1;
    }

    if (this.currentPage == this.numbers[0] && this.currentPage > 1) {
      this.numbers.splice(0, 0, 1);
      if (this.currentPage > 2) {
        this.numbers.splice(1, 0, this.currentPage - 1)
      }
    }

    //console.log(this.numbers);
  }

  scrollTo(id: string): void {
    const target = document.getElementById(id);
    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    if (!target)
      return

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }

  refreshStoryList(value) {
    if (!this.paginationHeader?.TotalPages) return;
    if (value == '...') return;

    if (typeof value == 'number') this.currentPage = value;
    else this.currentPage = value === true ? this.currentPage + 1 : this.currentPage - 1;

    if (this.currentPage >= this.paginationHeader.TotalPages) this.currentPage = this.paginationHeader.TotalPages;
    if (this.currentPage <= 1) this.currentPage = 1;

    this.renderPagination(this.paginationHeader, this.currentPage);
    this.scrollTo("list-area")

    this.refresh.emit(this.currentPage);
  }
}
