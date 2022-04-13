import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MacroDeckOptions } from '../models/macrodeck-options';

@Injectable({
  providedIn: 'root'
})

export class MacrodeckButtonOptionsService {


  constructor(private http:HttpClient) { }

  getOptions(url) {
    return this.http.get<any>(`http://${url}/getbuttonoptions`).pipe();
  }

  setOptions(options, url){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://${url}/setbuttonoptions`, options).pipe();
  }
}
