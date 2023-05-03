import { Component, OnInit, Input } from '@angular/core';
// tslint:disable-next-line:no-unused-expression

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
})
export class ErrorsComponent implements OnInit {
  errorTestMessage: any;
  @Input() errorMessage: string;
  constructor() {
   }

  ngOnInit() {
  //  this.errorTestMessage = this.errorMessage;
  }

}
