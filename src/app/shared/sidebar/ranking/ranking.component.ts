import { Component, Input, OnInit } from '@angular/core';
import { HistoryManagement } from '../../../services/others/historyManagement.service';
import { Truyen } from '../../../model/truyen/Truyen.model';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  providers: [HistoryManagement]
})
export class RankingComponent implements OnInit {
  @Input() truyenRanks: Truyen[];

  constructor(private historyManagement: HistoryManagement) { }

  ngOnInit(): void {
  }
}
