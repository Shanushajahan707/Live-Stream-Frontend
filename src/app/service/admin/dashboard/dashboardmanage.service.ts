import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  DashboardChannelCount,
  DashboardUserCount,
  MonthlySubscription,
  MonthlySubscriptionAdminDash,
} from '../../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class DashboardmanageService {
  private _apiUrl = environment.apiUrl;
  constructor(private _http: HttpClient) {}

  getUsersCount(): Observable<DashboardUserCount> {
    return this._http.get<DashboardUserCount>(
      `${this._apiUrl}admin/getuserscount`
    );
  }
  getChannelCount(): Observable<DashboardChannelCount> {
    return this._http.get<DashboardChannelCount>(
      `${this._apiUrl}admin/getchannelscount`
    );
  }
  getDashboardData(): Observable<MonthlySubscriptionAdminDash> {
    return this._http.get<MonthlySubscriptionAdminDash>(
      `${this._apiUrl}admin/getdashboarddata`
    );
  }
}
