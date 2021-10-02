import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-seleton-loader',
  template: `
    <div [ngStyle]="getMyStyles()" class="skelt-load loader"></div>
  `,
  styleUrls: ['./seleton-loader.component.scss']
})
export class SeletonLoaderComponent implements OnInit {

  @Input() Cwidth: string = '';
  @Input() Cheight: string = '';
  @Input() Cmargin: string = '';
  @Input() circle: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  getMyStyles(){
    const myStyles = {
      'width.px': this.Cwidth ? this.Cwidth : '',
      'height.px': this.Cheight ? this.Cheight : '',
      'border-radius': this.circle,
      'margin': this.Cmargin ? this.Cmargin : '5px 0px 5px 0px'
    }
    return myStyles;
  }
}
