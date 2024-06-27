import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ChannelData,
  ChannelSubscriptionMembers,
  GetChannelInfo,
  GetRecommmendedLivesReponse,
  GetUpdateLiveInfoResponse,
} from '../../model/auth';

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
  updateLiveHistoryInfo(liveName: string,RoomId:number): Observable<any> {
    const formdata = new FormData();
    formdata.append('liveName', liveName);
    console.log('livename from the formdata', formdata.get('liveName'));
    const payload = { RoomId, liveName };
    return this._http.post<any>(`${this.apiUrl}live/updatelivehistory`, {
      payload,
    });
  }
  updateLiveHistoryUserInfo(
    RoomId: number,
    user: string
  ): Observable<any> {
    const formdata = new FormData();
    formdata.append('user', user);
    const payload = { RoomId, user };
    console.log(payload);
    return this._http.put<any>(`${this.apiUrl}live/updatelivehistoryuser`, {
      payload,
    });
  }
  updateLiveHistoryEndInfo(
    RoomId: number,
  ): Observable<any> {
    const payload = { RoomId};
    console.log(payload);
    return this._http.put<any>(`${this.apiUrl}live/updatelivehistoryend`, {
      payload,
    });
  }
  fetchLiveHistory(channel:ChannelData):Observable<any>{
    return this._http.get<any>(
      `${this.apiUrl}live/fetchlivehistory/${channel._id}`
    );
  }
}
