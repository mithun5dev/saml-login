import { Directive, OnInit, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appNgInit]'
})
export class NgInitDirective implements OnInit{

  @Output()
    ngInit: EventEmitter<any> = new EventEmitter();

    ngOnInit() {
        this.ngInit.emit();
    }

}
