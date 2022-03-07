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

  editFile(buttonFile){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://192.168.1.112/editfile`, buttonFile).pipe();
  }

  deleteFile(fileName){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://192.168.1.112/deletefile`, fileName).pipe();
  }
  
  createNewFile(fileName){

    const headers = new HttpHeaders()
    .append('Content-Type', 'application/json')
    .append('Access-Control-Allow-Headers', 'Content-Type')
    .append('Access-Control-Allow-Methods', 'POST')
    .append('Access-Control-Allow-Origin', '*');

    return this.http.post<any>(`http://192.168.1.112/createnewfile`, fileName).pipe();
  }

  getFile(fileName){
    return this.http.get<any>(`http://192.168.1.112${fileName}`).pipe();
  }
}
