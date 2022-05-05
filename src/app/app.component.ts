import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { MatSidenav } from '@angular/material/sidenav';
import { MacrodeckFirmwareVersionService } from './services/macrodeck-firmware-version.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackbarService } from './services/snackbar.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  menuOpen: boolean
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  showAdminOptions: boolean = false;
  showButtons: boolean = false;
  showButtonOptions: boolean = false;
  isShowing = false;
  showSubmenu: boolean = false;
  updateAvailableMacroDeck: boolean = false;

  firmwareVersion: string;
  latestFirmwareAvailable: string;
  latestMMSVersion: string;
  updateUrl: string;

  hiddenAdmin: boolean = false;
  hiddenFirmware: boolean = false;

  deviceNotAvailable: boolean = false;

  updateAvailableMMS: boolean = false;

  intervalPollerOne: NodeJS.Timer;
  intervalPollerTwo: NodeJS.Timer;

  unsubscriber = new Subject();

  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private firmwareService: MacrodeckFirmwareVersionService,
    private snackBarService: SnackbarService
  ) {
    this.translate.setDefaultLang('en');
    console.log('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }
  ngOnInit(): void {
    this.checkAvailableUpdateMacroDeck();
    this.checkUpdateAvailableMMS();
    this.intervalPollerOne = setInterval(() => {
      this.checkAvailableUpdateMacroDeck();
      this.checkUpdateAvailableMMS();
    }, 150000);
  }

  checkAvailableUpdateMacroDeck(){
    this.firmwareService.getVersionMacroDeck(this.electronService.ipcRenderer.sendSync('readUrl', '')).pipe(takeUntil(this.unsubscriber)).subscribe(data => {
      this.firmwareVersion = data;
      if(this.deviceNotAvailable){
        this.snackBarService.hideAllSnackbars();
        this.deviceNotAvailable = false;
        clearInterval(this.intervalPollerTwo);
      }
      this.firmwareService.getLatestVersionMacroDeck().pipe(takeUntil(this.unsubscriber)).subscribe(file => {
        const lines = file.split("\n");
        for(let x = 0; x < lines.length; x++){
          if(lines[x].includes('FirmwareVersion')){
            this.latestFirmwareAvailable = lines[x].split("\"")[1];
          }
        }
        if(this.firmwareVersion){
          console.log(this.firmwareVersion, this.latestFirmwareAvailable)
          if(this.firmwareVersion === this.latestFirmwareAvailable){
            this.updateAvailableMacroDeck = false;
          }
          else{
            this.updateAvailableMacroDeck = true;
          }
        }
      }, error => {
        
      });
      
  
      console.log(this.firmwareVersion, this.updateAvailableMacroDeck)
    }, error => {
      if(!this.deviceNotAvailable){
        this.snackBarService.showGenericSnackBar('Macrodeck device is not available, please turn on the macrodeck, or connect it to the same network as this device', false, false)
        this.deviceNotAvailable = true;
        this.intervalPollerTwo = setInterval(() => {
          this.checkAvailableUpdateMacroDeck();
        }, 1000);
      }
      
    })
    
    
  }

  isNewerVersion (oldVer, newVer) {
    const oldParts = oldVer.split('.')
    const newParts = newVer.split('.')
    for (var i = 0; i < newParts.length; i++) {
      const a = ~~newParts[i] // parse int
      const b = ~~oldParts[i] // parse int
      if (a > b) return true
      if (a < b) return false
    }
    return false
  }

  checkUpdateAvailableMMS(){
    this.firmwareService.getLatestVersionMMS().pipe(takeUntil(this.unsubscriber)).subscribe(data =>{
      let latestVersionAvailable = data.version;
      let currentVersion = process.env.npm_package_version;

      if(this.isNewerVersion(currentVersion, latestVersionAvailable)){
        this.updateAvailableMMS = true;
        this.latestMMSVersion = latestVersionAvailable;
        this.updateUrl = `https://github.com/edememinov/MacroDeckApp/releases/latest/download/macrodeck_management_software.Setup.${latestVersionAvailable}.exe`;
      }
    })
  }

  updateMMS(){
    if(this.updateUrl){
      this.electronService.ipcRenderer.sendSync('downloadMMS', this.updateUrl)
      this.snackBarService.showGenericSnackBar('The newest version is being installed',true)
    }
    
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }

  checkHiddenOptions(): boolean {
    if(this.deviceNotAvailable){
      return true;
    }
    else if((this.isShowing || this.isExpanded) && this.showSubmenu){
      return true;
    }
    else{
      if(this.updateAvailableMacroDeck && this.firmwareVersion){
        return false;
      }
      return true;
    }
  }

  checkHiddenAdmin(): boolean {
    if(this.deviceNotAvailable){
      return true;
    }
    else if((this.isShowing || this.isExpanded) && this.showAdminOptions){
      return true;
    }
    else{
      if(this.updateAvailableMacroDeck && this.firmwareVersion){
        return false;
      }
      return true;
    }
  }

  checkHiddenFirmware(): boolean {
    if(this.deviceNotAvailable){
      return true;
    }
    else if(!this.updateAvailableMacroDeck){
      return true;
    }
    else if(this.updateAvailableMacroDeck && this.firmwareVersion){
      return false;
    }
    return true;
  }

}
