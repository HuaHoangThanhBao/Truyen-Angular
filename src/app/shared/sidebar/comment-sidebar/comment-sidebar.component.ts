import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HistoryManagement } from '../../services/historyManagement.service';

@Component({
  selector: 'app-comment-sidebar',
  templateUrl: './comment-sidebar.component.html',
  styleUrls: ['./comment-sidebar.component.scss'],
  providers: [HistoryManagement]
})
export class CommentSidebarComponent implements OnInit {

  @Input() binhLuanJson: any;
  
  constructor(private historyManagement: HistoryManagement) { }

  ngOnInit(): void {
  }
}
