import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoryListComponent } from 'src/app/shared/story-list/story-list.component';
import { environment } from '../../../../../environments/environment';
import { RequestService } from '../../../../shared/services/request.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  providers: [RequestService]
})
export class CategoryComponent implements OnInit {
  title: string;

  jsonBinhLuanArr: any;
  jsonTheLoaiArr: any;
  
  truyenTheoDanhMucArr: any;
  mostViews: any;
  truyenPaginationData: any;
  theLoaiId: number;

  @ViewChild(StoryListComponent) storyListComponent: StoryListComponent;

  constructor(private route: ActivatedRoute, private requestService: RequestService) { 
    
    this.route.paramMap.subscribe((param) => {
      this.theLoaiId = parseInt(param.get('id'));
      
      this.fetchCorsPagination(1).then(headers => {
        this.truyenPaginationData = headers;
        console.log('header:', this.truyenPaginationData);
        this.storyListComponent.passPagingData(this.truyenPaginationData);
      });
    });
  }

  ngOnInit(): void {

    this.requestService.get(`theloai/${this.theLoaiId}`)
    .toPromise()
    .then(theLoai => {
      this.title = `Danh mục: ${theLoai["tenTheLoai"]}`
    })
    

  this.requestService.get(`truyen/pagination?pageNumber=1&pageSize=20&sorting=true&theloaiID=${this.theLoaiId}`)
    .toPromise()
    .then(danhMuc => {
      this.truyenTheoDanhMucArr = danhMuc;
      //console.log(this.truyenTheoDanhMucArr);
    })

  this.requestService.get(`truyen/pagination?pageNumber=1&pageSize=5&topview=true`)
    .toPromise()
    .then(mostViewData => {
      this.mostViews = mostViewData;
      //console.log(this.mostViews);
    })

  this.requestService.get(`binhluan/pagination?pageNumber=1&pageSize=20&lastestUpdate=true`)
    .toPromise()
    .then(binhLuanData => {
      this.jsonBinhLuanArr = binhLuanData;
      //console.log(this.jsonBinhLuanArr);
    })
  }

  async fetchCorsPagination(number) {
    const response = await fetch(environment.apiURL + `/truyen/pagination?pageNumber=${number}&pageSize=20&sorting=true&theloaiID=` + this.theLoaiId, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Api-Key": environment.apiKey
      }
    });
    const headers = JSON.parse(response.headers.get('X-Pagination'));
    return headers;
  }

  refreshFetchList(value) {
    //console.log(value)

    this.fetchCorsPagination(value).then(headers => {
      this.truyenPaginationData = headers;
      //console.log('header:', this.truyenPaginationData);
      this.storyListComponent.passPagingData(this.truyenPaginationData);
    });

    this.requestService.get(`truyen/pagination?pageNumber=${value}&pageSize=20&sorting=true&theloaiID=${this.theLoaiId}`)
      .toPromise()
      .then(truyenData => {
        this.truyenTheoDanhMucArr = truyenData;
        //console.log("refresh list: ", this.truyenTheoDanhMucArr);
      })
  }
}
