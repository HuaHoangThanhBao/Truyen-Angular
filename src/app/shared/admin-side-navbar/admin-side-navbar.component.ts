import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-side-navbar',
  templateUrl: './admin-side-navbar.component.html',
  styleUrls: ['./admin-side-navbar.component.scss']
})
export class AdminSideNavbarComponent implements OnInit {

  @Input() currentTabName: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
