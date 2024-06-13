import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviorments/enviorment';

@Injectable({
  providedIn: 'root'
})
export class DashboardmanageService {
  private _apiUrl=environment.apiUrl
  constructor(private _http:HttpClient) { }


  getUsersCount():Observable<any>{
    return this._http.get<any>(`${this._apiUrl}admin/getuserscount`)
  }
  getChannelCount():Observable<any>{
    return this._http.get<any>(`${this._apiUrl}admin/getchannelscount`)
  }
}
