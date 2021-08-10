import { Component, OnInit} from '@angular/core';
import { RequestService } from './shared/services/request.service';

declare function setUpDarkMode(): void;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [RequestService]
})
export class AppComponent implements OnInit {

  jsonTheLoaiArr: any;
  title = 'NgTruyen';

  constructor(private requestService: RequestService) {
  }

  ngOnInit(): void {
    console.log('app component on init');

    this.requestService.get('theloai')
    .toPromise()
    .then(theLoaiData => {
      this.jsonTheLoaiArr = theLoaiData;
      //console.log(this.jsonTheLoaiArr);
    })

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
