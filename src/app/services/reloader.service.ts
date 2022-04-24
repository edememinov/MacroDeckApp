import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElectronService } from '../core/services';

@Injectable({
  providedIn: 'root'
})
export class ReloaderService {

  constructor(private _electron:ElectronService) { }

  reloadAppAfterThreeSeconds(unsubscriber){
    const pollTimer = timer(3000);
    pollTimer.pipe(takeUntil(unsubscriber)).subscribe(() => {
      this._electron.ipcRenderer.send('WILL_RELOAD');
      window.location.reload();
    });
  }
}
