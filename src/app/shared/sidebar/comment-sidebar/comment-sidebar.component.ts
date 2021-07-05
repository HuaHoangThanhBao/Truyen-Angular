import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-comment-sidebar',
  templateUrl: './comment-sidebar.component.html',
  styleUrls: ['./comment-sidebar.component.scss']
})
export class CommentSidebarComponent implements OnInit {

  @Input() binhLuanJson: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
