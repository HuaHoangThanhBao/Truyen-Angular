import { Component, OnInit } from '@angular/core';
declare function setUpAdmin(): void;

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setUpAdmin();
  }

}
