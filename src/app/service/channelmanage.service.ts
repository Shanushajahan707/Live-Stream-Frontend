import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviorments/enviorment';
import { ChannelData, GetChannelResponse, GetUserOne, GetUsersResponse } from '../model/auth';

@Injectable({
  providedIn: 'root'
})
export class ChannelmanageService {
  apiUrl=environment.apiUrl

  constructor(private _http:HttpClient) { }

  getChannels(page: number, limit: number):Observable<GetChannelResponse>{
    try {
      return this._http.get<GetChannelResponse>(`${this.apiUrl}getchannels?page=${page}&limit=${limit}`)
    } catch (error) {
      throw error
    }
  }
  blockChannel(channelId:string):Observable<GetChannelResponse>{
    try {
      return this._http.put<GetChannelResponse>(`${this.apiUrl}blockchannel/${channelId}`, {});
    } catch (error) {
      throw error
    }
  }

  getUserData(userid:string):Observable<GetUserOne>{
    try {
      return this._http.get<GetUserOne>(`${this.apiUrl}getUserProfileAdmin/${userid}`,{})
    } catch (error) {
      throw error
    }
  }


}
