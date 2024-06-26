import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  GetChannelInfo,
  GetRecommmendedLivesReponse,
  GetUpdateLiveInfoResponse,
} from '../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
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
}
