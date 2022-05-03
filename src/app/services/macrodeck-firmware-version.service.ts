import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    return this.http.get<string>(`https://raw.githubusercontent.com/edememinov/MacroDeck/main/SysVariables.h`, { responseType: 'text' as 'json'}).pipe();
  }
  
  getLatestVersionMMS(){
    return this.http.get<any>(`https://raw.githubusercontent.com/edememinov/MacroDeckApp/dev/app/package.json`).pipe();
  }
}
