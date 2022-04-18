import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MacrodeckOptionsService } from '../services/macrodeck-options.service';
import { MacroDeckOptions } from '../models/macrodeck-options'
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ElectronService } from '../core/services';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-macro-deck-options',
  templateUrl: './macro-deck-options.component.html',
  styleUrls: ['./macro-deck-options.component.scss'],
  providers : [MacrodeckOptionsService]
})
export class MacroDeckOptionsComponent implements OnInit, OnDestroy {

  macrodeckOptions: FormGroup;
  options: Observable<MacroDeckOptions>;
  unsubscriber = new Subject()

  constructor(private formBuilder: FormBuilder, private optionsService: MacrodeckOptionsService, private _electron:ElectronService, private snackBarService: SnackbarService) { }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  ngOnInit(): void {
    this.macrodeckOptions = this.formBuilder.group({
      fingerprint: new FormControl(''),
      socketHost: new FormControl(''),
      socketPort: new FormControl(''),
      development: new FormControl(''),
      calibrationMode: new FormControl(''),
      buttonCount: new FormControl(''),
      maxButtonAmp: new FormControl(''),
      webserverOnly: new FormControl(''),
      server: new FormControl(''),
      
      mqttClientID: new FormControl(''),
      mqttPassword: new FormControl(''),
      mqttUsername: new FormControl(''),
      mqttBroker: new FormControl(''),
      mqttPort: new FormControl(1883), 
    });

    this.options = this.optionsService.getOptions(this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(
      tap(options => this.macrodeckOptions.patchValue(options), takeUntil(this.unsubscriber))
    );

  }

  submit() {
    if (!this.macrodeckOptions.valid) {
      return;
    }
    this.optionsService.setOptions(this.macrodeckOptions.value, 
      this._electron.ipcRenderer.sendSync('readUrl', '')).pipe().subscribe(value => {
        this.snackBarService.showGenericSnackBar('Options saved', true)

    }, error => {
      console.log(error);
    });
    console.log(this.macrodeckOptions.value);
  }

}


