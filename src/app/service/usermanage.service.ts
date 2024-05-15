import { Injectable } from '@angular/core';
import {environment } from '../../enviorments/enviorment'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetUsersResponse, User } from '../model/auth';


@Injectable({
  providedIn: 'root'
})
export class UsermanageService {
  apiUrl=environment.apiUrl

  constructor(private _http:HttpClient) { }


  getUsers(page: number, limit: number): Observable<GetUsersResponse> {
    try {
      
      return this._http.get<GetUsersResponse>(`${this.apiUrl}getusers?page=${page}&limit=${limit}`);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  

  blockuser(userid:string):Observable<any>{
    try {
      return this._http.put(`${this.apiUrl}blockuser/${userid}`, {});
    } catch (error) {
      console.log('error',error);
      throw error
    }
  } 
}
