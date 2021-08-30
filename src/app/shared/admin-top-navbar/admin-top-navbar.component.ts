import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-top-navbar',
  templateUrl: './admin-top-navbar.component.html',
  styleUrls: ['./admin-top-navbar.component.scss']
})
export class AdminTopNavbarComponent implements OnInit {
  userName: string;

  constructor() { }

  ngOnInit(): void {
    this.userName = sessionStorage.getItem('admin-username');
  }

}
