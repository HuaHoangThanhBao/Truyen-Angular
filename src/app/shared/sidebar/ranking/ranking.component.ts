import { Component, Input, OnInit } from '@angular/core';
import { HistoryManagement } from '../../services/historyManagement.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  providers: [HistoryManagement]
})
export class RankingComponent implements OnInit {
  @Input() rankingJson: any;

  constructor(private historyManagement: HistoryManagement) { }

  ngOnInit(): void {
  }
}
