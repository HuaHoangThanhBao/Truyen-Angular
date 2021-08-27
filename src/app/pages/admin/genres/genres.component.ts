import { Component, OnInit } from '@angular/core';
import { TheLoaiService } from '../../../services/model-service/theLoaiService.service';
import { TheLoai } from '../../../model/theloai/TheLoai.model';

declare function setUpAdmin(): void;

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {

  theLoais: TheLoai[];

  constructor(private theLoaiService: TheLoaiService) {
   }

  ngOnInit(): void {
    setUpAdmin();

    this.theLoaiService.getList().subscribe(theLoais => {
      this.theLoais = theLoais;
    })
  }
}
