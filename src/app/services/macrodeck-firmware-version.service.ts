import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MacroDeckOptions } from '../models/macrodeck-options';

@Injectable({
  providedIn: 'root'
})

export class MacrodeckFirmwareVersionService {


  constructor(private http:HttpClient) { }

  getVersion(url) {
    return this.http.get<string>(`http://${url}/version`, { responseType: 'text' as 'json'}).pipe();
  }
  
  getLatestVersion() {
    return this.http.get<string>(`https://raw.githubusercontent.com/edememinov/MacroDeck/main/SysVariables.h`, { responseType: 'text' as 'json'}).pipe();
  }
}
