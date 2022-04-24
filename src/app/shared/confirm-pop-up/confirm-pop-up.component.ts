import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-pop-up',
  templateUrl: './confirm-pop-up.component.html',
  styleUrls: ['./confirm-pop-up.component.scss']
})
export class ConfirmPopUpComponent implements OnInit {

  constructor() { }

  @Input() message: string;
  @Output() confirmEvent = new EventEmitter<any>();

  ngOnInit(): void {
  }

  confirm(confirmed: boolean){
    this.confirmEvent.emit(confirmed);
  }

}
