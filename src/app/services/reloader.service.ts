import { Injectable } from '@angular/core';
import { timer } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ElectronService } from '../core/services';

@Injectable({
  providedIn: 'root'
})
export class ReloaderService {

  constructor() { }

  reloadAppAfterThreeSeconds(){
    const pollTimer = timer(3000);
    pollTimer.pipe(first()).subscribe(() => {
      window.location.reload();
    });
  }
}
