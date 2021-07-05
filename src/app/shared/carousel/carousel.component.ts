import { Component, OnInit, Input } from '@angular/core';
declare function carouselInit(): void;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  @Input() carouselJson: any;
  carouselInitStatus: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  callCarousel() {
    if (!this.carouselInitStatus) {
      this.carouselInitStatus = true;
      carouselInit();
    }
  }
}
