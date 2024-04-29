import { Injectable } from '@angular/core';
import {environment } from '../../enviorments/enviorment'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/auth';


@Injectable({
  providedIn: 'root'
})
export class UsermanageService {
  apiUrl=environment.apiUrl

  constructor(private http:HttpClient) { }


  getUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}getusers`);
  }
  blockuser(userid:string):Observable<any>{
    return this.http.put(`${this.apiUrl}blockuser/${userid}`, {});
  } 
}
