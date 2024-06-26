import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ChannelSubscriptionData,
  ChannelSubscriptionMembers,
  ChannelSubscriptionResponse,
  IsChannelSubscribedMemberResponse,
  MonthlySubscriptionChartResponse,
  WebsiteSubscriptionResponse,
  WebsiteTrailOverResponse,
} from '../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  onGetWebsiteSubscription(): Observable<WebsiteSubscriptionResponse> {
    return this._http.get<WebsiteSubscriptionResponse>(
      `${this.apiUrl}getallsubscription`
    );
  }

  onGetChannelSubscription(): Observable<ChannelSubscriptionResponse> {
    return this._http.get<ChannelSubscriptionResponse>(
      `${this.apiUrl}getallchannelsubscription`
    );
  }

  isChannelMember(
    channelId: string
  ): Observable<IsChannelSubscribedMemberResponse> {
    return this._http.get<IsChannelSubscribedMemberResponse>(
      `${this.apiUrl}channel/ismember/${channelId}`
    );
  }
  onSubscribe(
    channelId: string,
    planId: string,
    paymentId: string
  ): Observable<ChannelSubscriptionResponse> {
    const payload = { channelId, planId, paymentId };
    return this._http.post<ChannelSubscriptionResponse>(
      `${this.apiUrl}channel/channelsubscribe`,
      payload
    );
  }
  getAllSubscribedMember(
    page: number,
    limit: number
  ): Observable<ChannelSubscriptionMembers> {
    return this._http.get<ChannelSubscriptionMembers>(
      `${this.apiUrl}channel/getsubscribedmembers?page=${page}&limit=${limit}`
    );
  }

  onSubscribeWebsite(
    planId: string,
    paymentId: string
  ): Observable<WebsiteSubscriptionResponse> {
    const payload = { planId, paymentId };
    return this._http.post<WebsiteSubscriptionResponse>(
      `${this.apiUrl}websitesubscription`,
      payload
    );
  }

  isTrailOver(): Observable<WebsiteTrailOverResponse> {
    return this._http.get<WebsiteTrailOverResponse>(
      `${this.apiUrl}istrailover`
    );
  }

  getRevenueChart(): Observable<MonthlySubscriptionChartResponse> {
    return this._http.get<MonthlySubscriptionChartResponse>(
      `${this.apiUrl}channel/getrevenuechart`
    );
  }
}
