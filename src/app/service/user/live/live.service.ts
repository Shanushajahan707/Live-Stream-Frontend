import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChannelData,
  ChannelSubscriptionMembers,
  GetChannelInfo,
  GetRecommmendedLivesReponse,
  GetUpdateLiveInfoResponse,
  LiveHistoryResponse,
  LiveUpdateResponse,
} from '../../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  fetchAllLives(arg0: string) {
    throw new Error('Method not implemented.');
  }
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  onGetChannel(): Observable<GetChannelInfo> {
    return this._http.get<GetChannelInfo>(`${this.apiUrl}live/getchannel`);
  }

  onUpdateStartLiveInfo(roomId: number): Observable<GetUpdateLiveInfoResponse> {
    console.log('room id', roomId);
    return this._http.put<GetUpdateLiveInfoResponse>(
      `${this.apiUrl}live/updatestartliveinfo/${roomId}`,
      {}
    );
  }
  onUpdateStopLiveInfo(): Observable<GetUpdateLiveInfoResponse> {
    return this._http.put<GetUpdateLiveInfoResponse>(
      `${this.apiUrl}live/updatestopliveinfo`,
      {}
    );
  }
  onGetRecommendedLive(): Observable<GetRecommmendedLivesReponse> {
    return this._http.get<GetRecommmendedLivesReponse>(
      `${this.apiUrl}live/recommendedlives`
    );
  }
  getAllSubscribedMember(): Observable<ChannelSubscriptionMembers> {
    return this._http.get<ChannelSubscriptionMembers>(
      `${this.apiUrl}channel/getsubscribedmembers`
    );
  }
  updateLiveHistoryInfo(liveName: string, RoomId: number): Observable<LiveUpdateResponse> {
    const formdata = new FormData();
    formdata.append('liveName', liveName);
    console.log('livename from the formdata', formdata.get('liveName'));
    const payload = { RoomId, liveName };
    return this._http.post<LiveUpdateResponse>(`${this.apiUrl}live/updatelivehistory`, {
      payload,
    });
  }
  updateLiveHistoryUserInfo(RoomId: number, user: string): Observable<LiveUpdateResponse> {
    const formdata = new FormData();
    formdata.append('user', user);
    const payload = { RoomId, user };
    console.log(payload);
    return this._http.put<LiveUpdateResponse>(`${this.apiUrl}live/updatelivehistoryuser`, {
      payload,
    });
  }
  updateLiveHistoryEndInfo(RoomId: number): Observable<LiveUpdateResponse> {
    const payload = { RoomId };
    console.log(payload);
    return this._http.put<LiveUpdateResponse>(`${this.apiUrl}live/updatelivehistoryend`, {
      payload,
    });
  }
  fetchLiveHistory(channel: ChannelData): Observable<LiveHistoryResponse> {
    return this._http.get<LiveHistoryResponse>(
      `${this.apiUrl}live/fetchlivehistory/${channel._id}`
    );
  }
}
