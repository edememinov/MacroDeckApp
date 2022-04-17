import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services';
import { ButtonTypes } from '../shared/models/enums';
import { ApiCallButton, MacroDeckButton, MqttButton } from '../shared/models/button.model'

@Component({
  selector: 'app-macro-deck-custom-buttons',
  templateUrl: './macro-deck-custom-buttons.component.html',
  styleUrls: ['./macro-deck-custom-buttons.component.scss']
})
export class MacroDeckCustomButtonsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private _electron:ElectronService) { }
  selected = new FormControl('');
  customButton: FormGroup;

  

  ngOnInit(): void {
    this.customButton = this.formBuilder.group({
      url: new FormControl(''),
      description: new FormControl(''),
      command_id: new FormControl(''),
      topic: new FormControl(''),
      payload: new FormControl(''),
      fingerprint: new FormControl(''),
    });
  }

  beautify(){
    this.customButton.controls.payload.patchValue(JSON.stringify(JSON.parse(this.customButton.controls.payload.value), null, 2));
  }

  submit(){
    let buttonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readMacrodeckData', ''));
    switch(this.selected.value){
      case 'apiCall':
       let buttonApi = new ApiCallButton()
       buttonApi.description = this.customButton.controls.description.value;
       buttonApi.fingerprint = this.customButton.controls.fingerprint.value;
       buttonApi.type = 'apiCall';
       buttonApi.url = this.customButton.controls.url.value;
       buttonFile.buttons?.push(buttonApi)
       break;
      case 'mqtt':
        let buttonMqtt = new MqttButton()
        buttonMqtt.description = this.customButton.controls.description.value;
        buttonMqtt.payload = this.customButton.controls.payload.value;
        buttonMqtt.type = 'mqtt';
        buttonMqtt.topic = this.customButton.controls.topic.value;
        buttonFile.buttons?.push(buttonMqtt)
        break;
      case 'socket':
        let macroDeckButton = new MacroDeckButton()
        macroDeckButton.command_id = this.customButton.controls.command_id.value;
        macroDeckButton.description = this.customButton.controls.description.value;
        macroDeckButton.type = 'socket';
        buttonFile.buttons?.push(macroDeckButton)
        break;
    }

    this._electron.ipcRenderer.sendSync('writeMacrodeckData', JSON.stringify(buttonFile));
    
  }

}
