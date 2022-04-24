import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackbarService } from '../services/snackbar.service';
import { ApiCallButton, MacroDeckButton, MqttButton } from '../shared/models/button.model';

@Component({
  selector: 'app-macro-deck-edit-buttons',
  templateUrl: './macro-deck-edit-buttons.component.html',
  styleUrls: ['./macro-deck-edit-buttons.component.scss']
})
export class MacroDeckEditButtonsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private snackBarService: SnackbarService) { }
  customButton: FormGroup;

  @Input() public button: MqttButton | MacroDeckButton | ApiCallButton;

  @Output() newItemEvent = new EventEmitter<any>();
  @Output() deleteItemEvent = new EventEmitter<any>();

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

  deleteButtonConfirmation($event){
    if($event){
      this.deleteButton();
    }
  }

  deleteButton(){
    switch(this.customButton.controls.type.value){
      case 'apiCall':
       let buttonApi = new ApiCallButton()
       buttonApi.description = this.customButton.controls.description.value;
       buttonApi.fingerprint = this.customButton.controls.fingerprint.value;
       buttonApi.type = 'apiCall';
       buttonApi.url = this.customButton.controls.url.value;
       this.deleteItemEvent.emit({button: buttonApi});
       break;
      case 'mqtt':
        let buttonMqtt = new MqttButton()
        buttonMqtt.description = this.customButton.controls.description.value;
        buttonMqtt.payload = this.customButton.controls.payload.value;
        buttonMqtt.type = 'mqtt';
        buttonMqtt.topic = this.customButton.controls.topic.value;
        this.deleteItemEvent.emit({button: buttonMqtt});
        break;
      case 'socket':
        let macroDeckButton = new MacroDeckButton()
        macroDeckButton.command_id = this.customButton.controls.command_id.value;
        macroDeckButton.description = this.customButton.controls.description.value;
        macroDeckButton.type = 'socket';
        this.deleteItemEvent.emit({button: macroDeckButton});
        break;
    }
  }

  beautify(){
    this.customButton.controls.payload.patchValue(JSON.stringify(JSON.parse(this.customButton.controls.payload.value), null, 2));
  }

  submit(){
    this.snackBarService.showGenericSnackBar('Button saved', true)
    switch(this.customButton.controls.type.value){
      case 'apiCall':
       let buttonApi = new ApiCallButton()
       buttonApi.description = this.customButton.controls.description.value;
       buttonApi.fingerprint = this.customButton.controls.fingerprint.value;
       buttonApi.type = 'apiCall';
       buttonApi.url = this.customButton.controls.url.value;
       this.newItemEvent.emit({button: buttonApi, oldItem: this.button});
       break;
      case 'mqtt':
        let buttonMqtt = new MqttButton()
        buttonMqtt.description = this.customButton.controls.description.value;
        buttonMqtt.payload = this.customButton.controls.payload.value;
        buttonMqtt.type = 'mqtt';
        buttonMqtt.topic = this.customButton.controls.topic.value;
        this.newItemEvent.emit({button: buttonMqtt, oldItem: this.button});
        break;
      case 'socket':
        let macroDeckButton = new MacroDeckButton()
        macroDeckButton.command_id = this.customButton.controls.command_id.value;
        macroDeckButton.description = this.customButton.controls.description.value;
        macroDeckButton.type = 'socket';
        this.newItemEvent.emit({button: macroDeckButton, oldItem: this.button});
        break;
    }
  }

}
