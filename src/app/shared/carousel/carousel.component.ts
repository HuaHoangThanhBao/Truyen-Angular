import { Component, OnInit, Input } from '@angular/core';
import { HistoryManagement } from '../services/historyManagement.service';
declare function carouselInit(): void;

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  providers: [HistoryManagement]
})
export class CarouselComponent implements OnInit {
  @Input() carouselJson: any;
  carouselInitStatus: boolean;

  constructor(private historyManagement: HistoryManagement) { }

  ngOnInit(): void {
  }

  callCarousel() {
    if (!this.carouselInitStatus) {
      this.carouselInitStatus = true;
      carouselInit();
    }
  }
}
