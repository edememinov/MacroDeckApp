import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MacroDeckUrl } from '../models/macrodeck-url';
import { ElectronService } from '../core/services/electron/electron.service';

@Component({
  selector: 'app-macro-deck-url',
  templateUrl: './macro-deck-url.component.html',
  styleUrls: ['./macro-deck-url.component.scss']
})
export class MacroDeckUrlComponent implements OnInit, OnDestroy {

  urlOptions: FormGroup;
  url: Observable<MacroDeckUrl>;
  buttonsRead = new BehaviorSubject(false);
  unsubscriber = new Subject()
  
  constructor(private formBuilder: FormBuilder, private _electron:ElectronService) { }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.urlOptions = this.formBuilder.group({
      url: new FormControl(''),
    });

    this.urlOptions.controls.url.patchValue(this._electron.ipcRenderer.sendSync('readUrl', ''));

    this._electron.ipcRenderer.on("deckBoardDataDone", (event, args) => {
      window.location.reload();
    });

  }

  submit(){
    this._electron.ipcRenderer.send('writeUrl', this.urlOptions.controls.url.value);
  }


  saveMacroBoardData(){
    this.buttonsRead.next(true);
    this._electron.ipcRenderer.send('saveDeckboardData', '');
  }

}
