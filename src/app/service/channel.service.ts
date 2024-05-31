import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviorments/enviorment';
import { Observable } from 'rxjs';
import { ChannelData, EditChannelInterface, GetChannelInfo, GetFollowResponse, GetFullFollowedChannel, GetRecommededChannel, GetUploadResponse } from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private _http: HttpClient) {}
  apiUrl = environment.apiUrl;

  onLoadChannelInfo(): Observable<GetChannelInfo> {
    try {
      return this._http.get<GetChannelInfo>(`${this.apiUrl}getchannel`);
    } catch (error) {
      throw error;
    }
  }

  onUpdateChannel(channelDate: FormData): Observable<EditChannelInterface> {
    try {
      console.log('formdata is ',channelDate);
      console.log('fordata form the service', channelDate);
      return this._http.post<EditChannelInterface>(
        `${this.apiUrl}updatechannel`,
        channelDate
      );
    } catch (error) {
      throw error;
    }
  }
  onRecommededChannel(): Observable<GetRecommededChannel> {
    try {
      return this._http.get<GetRecommededChannel>(`${this.apiUrl}recommendedchannels`);
    } catch (error) {
      throw error;
    }
  }
  onFollowChannel(followChannel:ChannelData):Observable<GetFollowResponse>{
    try {
      return this._http.post<GetFollowResponse>(`${this.apiUrl}followchannel`,followChannel)
    } catch (error) {
      throw error
    }
  }
  onUnFollowChannel(unFollowChannel:ChannelData):Observable<GetFollowResponse>{
    try {
      return this._http.post<GetFollowResponse>(`${this.apiUrl}unfollowchannel`,unFollowChannel)
    } catch (error) {
      throw error
    }
  }
  // isFollow():Observable<any>{
  //   try {
  //     return this._http.get<any>(`${this.apiUrl}isfollow`)
  //   } catch (error) {
  //     throw error
  //   }
  // }
  onGetFullFollowedchannels():Observable<GetFullFollowedChannel>{
    try {
      return this._http.get<GetFullFollowedChannel>(`${this.apiUrl}getfullfollowchannel`)
    } catch (error) {
      throw error
    }
  }
  onGetFollowChannel(chanenlId:string):Observable<GetFollowResponse>{
    try {
      return this._http.get<GetFollowResponse>(`${this.apiUrl}getfollowchannel/${chanenlId}`,{})
    } catch (error) {
      throw error
    }
  }
  onUploadShorts(videoFile:FormData,channelId:string):Observable<GetUploadResponse>{
    try {
      console.log('videolfile form the service',videoFile.get('videoFile'));
      return this._http.post<GetUploadResponse>(`${this.apiUrl}uploadshorts/${channelId}`, videoFile)
    } catch (error) {
      throw error
    }
  }
}
