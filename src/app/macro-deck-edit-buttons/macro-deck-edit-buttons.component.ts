import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiCallButton, MacroDeckButton, MqttButton } from '../shared/models/button.model';

@Component({
  selector: 'app-macro-deck-edit-buttons',
  templateUrl: './macro-deck-edit-buttons.component.html',
  styleUrls: ['./macro-deck-edit-buttons.component.scss']
})
export class MacroDeckEditButtonsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  customButton: FormGroup;

  @Input() public button: MqttButton | MacroDeckButton | ApiCallButton;

  @Output() newItemEvent = new EventEmitter<MqttButton | MacroDeckButton | ApiCallButton>();

  ngOnInit(): void {
    this.customButton = this.formBuilder.group({
      url: new FormControl(''),
      description: new FormControl(''),
      command_id: new FormControl(''),
      topic: new FormControl(''),
      payload: new FormControl(''),
      fingerprint: new FormControl(''),
      type: new FormControl()
    });

    this.customButton.patchValue(this.button);
  }

  submit(){
    this.newItemEvent.emit(this.customButton.value);
  }

}
