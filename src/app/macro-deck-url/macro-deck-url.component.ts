import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MacroDeckUrl } from '../models/macrodeck-url';
import { ElectronService } from '../core/services/electron/electron.service';
import { SnackbarService } from '../services/snackbar.service';
import { ReloaderService } from '../services/reloader.service';

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
  progressBarValue = 0;
  progressBar = false;
  
  constructor(private formBuilder: FormBuilder, private _electron:ElectronService, private snackBarService: SnackbarService, private reloaderService: ReloaderService) { }

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
      //this.reloaderService.reloadAppAfterThreeSeconds();
    });

  }

  submit(){
    this._electron.ipcRenderer.send('writeUrl', this.urlOptions.controls.url.value);
    this.snackBarService.showGenericSnackBar('Url saved', true)
  }


  saveMacroBoardData(){
    this.progressBar = true;
    this.snackBarService.showGenericSnackBar('Starting', true)
    this._electron.ipcRenderer.send('saveDeckboardData', '');
    this.startTimer();
    if(this.progressBarValue === 100){
      this.snackBarService.showGenericSnackBar('Completed', true)
    }

  }

  startTimer() {
    let interval = setInterval(() => {
      this.progressBarValue++;
    },600)
  }

}
