import { Component, OnInit } from '@angular/core';
import { TruyenService } from '../../../services/model-service/truyenService.service';
import { Truyen } from '../../../model/truyen/Truyen.model';
declare function setUpAdmin(): void;

@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss']
})
export class StoriesComponent implements OnInit {

  truyens: Truyen[];

  constructor(private truyenService: TruyenService) {
   }

  ngOnInit(): void {
    setUpAdmin();

    this.truyenService.getList().subscribe(truyens => {
      this.truyens = truyens;
    })
  }

}
