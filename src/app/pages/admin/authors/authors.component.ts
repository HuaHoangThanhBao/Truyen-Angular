import { Component, OnInit } from '@angular/core';
import { TacGiaService } from '../../../services/model-service/tacGiaService.service';
import { TacGia } from '../../../model/tacGia/TacGia.model';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {

  tacGias: TacGia[];

  constructor(private tacGiaService: TacGiaService) {
   }

  ngOnInit(): void {
    setUpAdmin();

    this.tacGiaService.getList().subscribe(tacGias => {
      this.tacGias = tacGias
    })
  }

}
