import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AdminWebsiteNembership, ChannelSubscriptionInsertionResponse, GetallChannelSubscriptionAdminResponse, GetallWebsiteSubscriptionAdminResponse, SubscriptionData, WebsiteSubscriptionDataAdminResponse, WebsiteSubscriptionInsertionResponse } from '../../model/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionmanageService {
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  getPlan(): Observable<WebsiteSubscriptionDataAdminResponse> {
    return this._http.get<WebsiteSubscriptionDataAdminResponse>(`${this.apiUrl}admin/getallplan`);
  }
  insertSusbcription(data: FormData): Observable<WebsiteSubscriptionInsertionResponse> {
    return this._http.post<WebsiteSubscriptionInsertionResponse>(`${this.apiUrl}admin/insertsubscription`, data);
  }

  onChannelAddSubscription(data: FormData): Observable<ChannelSubscriptionInsertionResponse> {
    return this._http.post<ChannelSubscriptionInsertionResponse>(`${this.apiUrl}admin/addsubscription`, data);
  }

  onGetChannelSubscription(): Observable<GetallChannelSubscriptionAdminResponse> {
    return this._http.get<GetallChannelSubscriptionAdminResponse>(`${this.apiUrl}admin/getallchannelsubscription`);
  }

  onFetchMmebership(): Observable<AdminWebsiteNembership> {
    return this._http.get<AdminWebsiteNembership>(`${this.apiUrl}admin/fetchmembership`);
  }
}
