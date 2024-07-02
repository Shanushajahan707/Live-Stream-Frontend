import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ChannelData,
  GetChannelResponse,
  GetUserOne,
  GetUsersResponse,
} from '../../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class ChannelmanageService {
  apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getChannels(page: number, limit: number): Observable<GetChannelResponse> {
    return this._http.get<GetChannelResponse>(
      `${this.apiUrl}admin/getchannels?page=${page}&limit=${limit}`
    );
  }
  blockChannel(channelId: string): Observable<GetChannelResponse> {
    return this._http.put<GetChannelResponse>(
      `${this.apiUrl}admin/blockchannel/${channelId}`,
      {}
    );
  }

  getUserData(userid: string): Observable<GetUserOne> {
    return this._http.get<GetUserOne>(
      `${this.apiUrl}admin/getUserProfileAdmin/${userid}`,
      {}
    );
  }
}
