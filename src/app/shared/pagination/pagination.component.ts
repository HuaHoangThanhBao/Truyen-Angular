import { Component, EventEmitter, Input, Output, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe((param) => {
      const reset = this.route.snapshot.queryParams['reset'];
      if(reset) this.currentPage = 1;
    });
   }

  ngOnInit(): void {
  }

  //Gọi ở story-list component
  passPagingData(data) {
    this.renderPagination(data, this.currentPage);
    return data;
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
    //console.log('numbers: ', this.numbers);
    return this.numbers;
  }

  scrollTo(id: string) {
    const target = document.getElementById(id);
    if (!target) return undefined;

    const offset = 100;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = target.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

    return id;
  }

  refreshStoryList(value) {
    if (!this.paginationHeader?.TotalPages) return;
    if (value == '...') return;

    if (typeof value == 'number') this.currentPage = value;
    else this.currentPage = value === true ? this.currentPage + 1 : this.currentPage - 1;

    if (this.currentPage >= this.paginationHeader.TotalPages) this.currentPage = this.paginationHeader.TotalPages;
    if (this.currentPage <= 1) this.currentPage = 1;

    this.refresh.emit(this.currentPage);
    this.renderPagination(this.paginationHeader, this.currentPage);
    this.scrollTo("list-area");
    
    return value;
  }
}
