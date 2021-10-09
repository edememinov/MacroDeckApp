import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MacroDeckOptions } from '../models/macrodeck-options';

@Injectable({
  providedIn: 'root'
})

export class MacrodeckOptionsService {


  constructor(private http:HttpClient) { }



  getOptions() {
    return this.http.get<MacroDeckOptions>('http://192.168.1.113/getoptions').pipe();
  }

  setOptions(options){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    this.http.post<any>('http://192.168.1.113/setoptions', options).subscribe({
        next: data => {
        },
        error: error => {
            console.error('There was an error!', error);
        }
    })
  }
}
