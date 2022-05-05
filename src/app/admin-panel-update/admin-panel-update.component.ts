import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subject, timer } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ElectronService } from '../core/services';
import { MacrodeckFirmwareVersionService } from '../services/macrodeck-firmware-version.service';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-admin-panel-update',
  templateUrl: './admin-panel-update.component.html',
  styleUrls: ['./admin-panel-update.component.scss']
})
export class AdminPanelUpdateComponent implements OnInit, OnDestroy {

  constructor(private _electron:ElectronService, private firmwareService: MacrodeckFirmwareVersionService, private snackBarService: SnackbarService) { }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
  data: string;
  firmwareVersion: string;
  latestFirmwareAvailable: string;
  unsubscriber = new Subject();
  progressBarValue = 0;
  progressBar = false;

  ngOnInit(): void {
    this.firmwareService.getVersionMacroDeck(this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber)).subscribe(data => {
      this.firmwareVersion = data;
    })
    this.firmwareService.getLatestVersionMacroDeck().pipe(takeUntil(this.unsubscriber)).subscribe(data => {
      const lines = data.split("\n");
      for(let x = 0; x < lines.length; x++){
        if(lines[x].includes('FirmwareVersion')){
          this.latestFirmwareAvailable = lines[x].split("\"")[1];
        }
      }
    })
    this.data = `http://${this._electron.ipcRenderer.sendSync('readUrl', '')}/update`;
  }

  uploadToMacroDeck(){
    this.snackBarService.showGenericSnackBar('Starting upload, please wait', true)
    this.progressBar = true;
    this.startTimer();
    const body = this._electron.ipcRenderer.sendSync('downloadFirmware',{url: 'https://github.com/edememinov/MacroDeck/releases/latest/download/ActionHandler.h.d1.bin', 
    macroDeckUrl: `http://${this._electron.ipcRenderer.sendSync('readUrl', '')}/update`})

    this.firmwareService.uploadToMacroDeck(this._electron.ipcRenderer.sendSync('readUrl', ''), body).pipe().subscribe(data => {
    }, error => {
      if(error.message.toLowerCase().includes('unknown')){
        const pollTimer = timer(10000);
        pollTimer.pipe(first()).subscribe(() => {
          this.snackBarService.showGenericSnackBar('Upload complete, please wait for the restart of the MacroDeck', true)
          const pollTimer2 = timer(10000);
          pollTimer2.pipe(first()).subscribe(() => {
            this.snackBarService.showGenericSnackBar('Done', true)
            this.progressBar = false;
          });
        });
      }
      
      console.log(error)
    });

  }

  startTimer() {
    let interval = setInterval(() => {
      this.progressBarValue++;
    },350)
  }

}
