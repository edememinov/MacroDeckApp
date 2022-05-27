import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ElectronService } from '../core/services';
import { ApiCallButton, MacroDeckButton, MqttButton } from '../shared/models/button.model'
import { SnackbarService } from '../services/snackbar.service';
import { Subject, Subscription } from 'rxjs';
import { ReloaderService } from '../services/reloader.service';
import { EditorPreferencesService } from '../services/editor-preferences.service';


@Component({
  selector: 'app-macro-deck-custom-buttons',
  templateUrl: './macro-deck-custom-buttons.component.html',
  styleUrls: ['./macro-deck-custom-buttons.component.scss']
})
export class MacroDeckCustomButtonsComponent implements OnInit, OnDestroy {

  constructor(private formBuilder: FormBuilder, private _electron:ElectronService, private snackBarService: SnackbarService, private editorPreferencesService: EditorPreferencesService) { 
    this.preferencesSubscription = this.editorPreferencesService.preferencesSubject.subscribe(
      (preferences: any) => {
        this.preferences = {
          language: preferences.language,
          theme: preferences.theme,
          fontFamily: preferences.fontFamily,
          fontSize: preferences.fontSize,
          tabSize: preferences.tabSize,
          lineNumbers: preferences.lineNumbers
        };
      }
    );
    this.editorPreferencesService.emitPreferencesSubject(); 
    this.editorPreferencesService.setTheme('vs-dark');
    this.editorPreferencesService.setLanguage('json');
    this.editorPreferencesService.setLineNumbers(true);
  }

  selected = new FormControl('');
  customButton: FormGroup;
  unsubscriber$ = new Subject();
  code: string;
  editorOptions = {theme: 'vs-dark', language: 'json'};
  public model: string;
  public filename: string;
  public preferences: any;
  public preferencesSubscription: Subscription;
  public languages: any[];
  public themes: any[];
  public fontFamilies: any[];
  public lineNumbers: Boolean;

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  ngOnInit(): void {
    //console.log(this._electron.remote.app.moveToApplicationsFolder());
    this.code = '{"nerd": "doubleNerds"}';
    this.customButton = this.formBuilder.group({
      url: new FormControl(''),
      description: new FormControl(''),
      command_id: new FormControl(''),
      topic: new FormControl(''),
      payload: new FormControl(''),
      fingerprint: new FormControl(''),
    });
  }


  submit(){
    let buttonFile = JSON.parse(this._electron.ipcRenderer.sendSync('readCustomMacrodeckData', ''));
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
    this._electron.ipcRenderer.sendSync('writeCustomMacrodeckData', JSON.stringify(buttonFile));
    this.snackBarService.showGenericSnackBar('Button has added', true)
    //this.reloaderService.reloadAppAfterThreeSeconds();
    this.customButton.reset();
  }
}
