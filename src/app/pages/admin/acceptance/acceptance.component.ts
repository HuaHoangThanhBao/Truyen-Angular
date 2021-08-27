import { Component, OnInit } from '@angular/core';
declare function setUpAdmin(): void;

@Component({
  selector: 'app-acceptance',
  templateUrl: './acceptance.component.html',
  styleUrls: ['./acceptance.component.scss']
})
export class AcceptanceComponent implements OnInit {

  constructor() {
   }

  ngOnInit(): void {
    setUpAdmin();
  }

}
