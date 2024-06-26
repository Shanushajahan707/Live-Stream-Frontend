import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  ChannelData,
  EditChannelInterface,
  GetChannelInfo,
  GetFollowResponse,
  GetFullFollowedChannel,
  GetRecommededChannel,
  GetSearchChannelResponse,
  GetUpdateViewsResponse,
  GetUploadResponse,
} from '../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  constructor(private _http: HttpClient) {}
  apiUrl = environment.apiUrl;

  onLoadChannelInfo(): Observable<GetChannelInfo> {
    return this._http.get<GetChannelInfo>(`${this.apiUrl}channel/getchannel`);
  }

  onUpdateChannel(channelDate: FormData): Observable<EditChannelInterface> {
    console.log('formdata is ', channelDate);
    console.log('fordata form the service', channelDate);
    return this._http.post<EditChannelInterface>(
      `${this.apiUrl}channel/updatechannel`,
      channelDate
    );
  }
  onRecommededChannel(): Observable<GetRecommededChannel> {
    return this._http.get<GetRecommededChannel>(
      `${this.apiUrl}channel/recommendedchannels`
    );
  }
  onFollowChannel(followChannel: ChannelData): Observable<GetFollowResponse> {
    return this._http.post<GetFollowResponse>(
      `${this.apiUrl}channel/followchannel`,
      followChannel
    );
  }
  onUnFollowChannel(
    unFollowChannel: ChannelData
  ): Observable<GetFollowResponse> {
    return this._http.post<GetFollowResponse>(
      `${this.apiUrl}channel/unfollowchannel`,
      unFollowChannel
    );
  }
  // isFollow():Observable<any>{
  //   try {
  //     return this._http.get<any>(`${this.apiUrl}isfollow`)
  //   } catch (error) {
  //     throw error
  //   }
  // }
  onGetFullFollowedchannels(): Observable<GetFullFollowedChannel> {
    return this._http.get<GetFullFollowedChannel>(
      `${this.apiUrl}channel/getfullfollowchannel`
    );
  }
  onGetFollowChannel(chanenlId: string): Observable<GetFollowResponse> {
    return this._http.get<GetFollowResponse>(
      `${this.apiUrl}channel/getfollowchannel/${chanenlId}`,
      {}
    );
  }
  onUploadShorts(
    videoFile: FormData,
    channelId: string
  ): Observable<GetUploadResponse> {
    console.log('videolfile form the service', videoFile.get('videoFile'));
    return this._http.post<GetUploadResponse>(
      `${this.apiUrl}channel/uploadshorts/${channelId}`,
      videoFile
    );
  }
  onUpdateViews(
    videoUrl: FormData,
    channelId: string
  ): Observable<GetUpdateViewsResponse> {
    return this._http.put<GetUpdateViewsResponse>(
      `${this.apiUrl}channel/updateviews/${channelId}`,
      videoUrl
    );
  }
  search(query: string): Observable<GetSearchChannelResponse> {
    console.log('input', query);
    return this._http.post<GetSearchChannelResponse>(
      `${this.apiUrl}channel/searchchannel`,
      { query }
    );
  }
}
