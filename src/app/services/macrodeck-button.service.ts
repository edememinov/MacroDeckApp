import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MacroDeckOptions } from '../models/macrodeck-options';

@Injectable({
  providedIn: 'root'
})

export class MacrodeckButtonService {


  constructor(private http:HttpClient) { }



  getAllFiles(): Observable<string[]> {
    return this.http.get<string[]>('http://192.168.1.112/getfiles').pipe();
  }

  editFile(buttonFile, url){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://${url}/editfile`, buttonFile).pipe();
  }

  deleteFile(fileName, url){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://${url}/deletefile`, fileName).pipe();
  }
  
  createNewFile(fileName, url){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://${url}/createnewfile`, fileName).pipe();
  }

  getFile(fileName, url){

    const headers = new HttpHeaders()
    .append('Content-Type', 'text/plain')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'GET')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(`http://${url}${fileName}`).pipe();
  }
}
