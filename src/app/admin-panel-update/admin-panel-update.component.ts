import { Component, OnDestroy, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElectronService } from '../core/services';
import { MacrodeckFirmwareVersionService } from '../services/macrodeck-firmware-version.service';

@Component({
  selector: 'app-admin-panel-update',
  templateUrl: './admin-panel-update.component.html',
  styleUrls: ['./admin-panel-update.component.scss']
})
export class AdminPanelUpdateComponent implements OnInit, OnDestroy {

  constructor(private _electron:ElectronService, private firmwareService: MacrodeckFirmwareVersionService) { }
  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
  data: string;
  firmwareVersion: string;
  latestFirmwareAvailable: string;
  unsubscriber = new Subject();

  ngOnInit(): void {
    this.firmwareService.getVersion(this._electron.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber)).subscribe(data => {
      this.firmwareVersion = data;
    })
    this.firmwareService.getLatestVersion().pipe(takeUntil(this.unsubscriber)).subscribe(data => {
      const lines = data.split("\n");
      for(let x = 0; x < lines.length; x++){
        if(lines[x].includes('FirmwareVersion')){
          this.latestFirmwareAvailable = lines[x].split("\"")[1];
        }
      }
    })
    this.data = `http://${this._electron.ipcRenderer.sendSync('readUrl', '')}/update`;
  }

}
