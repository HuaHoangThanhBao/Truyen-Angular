import { Component, OnInit} from '@angular/core';
import { RequestService } from './shared/services/request.service';
import { TheLoaiService } from './services/theLoaiService.service';
import { TheLoai } from './model/theloai/TheLoai.model';

declare function setUpDarkMode(): void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [RequestService]
})
export class AppComponent implements OnInit {
  title = 'RanhDocTruyen';
  theLoais: TheLoai[];

  constructor(private theLoaiService: TheLoaiService) {
  }

  ngOnInit(): void {
    console.log('app component on init');

    this.theLoaiService.getList().subscribe(theloais => {
      this.theLoais = theloais
    });

    setUpDarkMode();
    this.categoryDropdownInit();
  }

  categoryDropdownInit() {
    const catBut = document.getElementById('catagory-dropdown');
    catBut.addEventListener('click', function () {
      showMenuOnTablet();
    });

    function showMenuOnTablet() {
      var x = document.getElementById("top__nav");
      if (x.className === "nav__list") {
        x.className += " responsive";
      } else {
        x.className = "nav__list";
      }
    }
  }
}
