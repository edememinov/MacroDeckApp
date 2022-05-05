import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { head } from 'lodash';
import { of } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { MacroDeckOptions } from '../models/macrodeck-options';

@Injectable({
  providedIn: 'root'
})

export class MacrodeckFirmwareVersionService {


  constructor(private http:HttpClient) { }

  getVersionMacroDeck(url) {
    return this.http.get<string>(`http://${url}/version`, { responseType: 'text' as 'json'}).pipe();
  }
  
  getLatestVersionMacroDeck() {

    return this.http.get<string>(`https://raw.githubusercontent.com/edememinov/MacroDeck/main/SysVariables.h?${Math.random()}`, { responseType: 'text' as 'json'}).pipe(timeout(1000),
    catchError(e => {
      // do something on a timeout
      return of(null);
    }));
  }
  
  getLatestVersionMMS(){

    return this.http.get<any>(`https://raw.githubusercontent.com/edememinov/MacroDeckApp/dev/app/package.json?${Math.random()}`).pipe();
  }

  uploadToMacroDeck(url, body){

    const headers = new HttpHeaders({
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
  });

    let form =  new FormData();
    form.append('MD5', body.md5);
    form.append('firmware', new Blob([body.file], {type: 'application/x-binary'}), 'firmware');

    return this.http.post(`http://${url}/update`,form, { headers: headers, withCredentials: true, responseType: 'text'});
  }
}
