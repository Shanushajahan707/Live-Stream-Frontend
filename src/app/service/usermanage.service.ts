import { Injectable } from '@angular/core';
import { environment } from '../../enviorments/enviorment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetUsersResponse, User } from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class UsermanageService {
  apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) {}

  getUsers(page: number, limit: number): Observable<GetUsersResponse> {
    return this._http.get<GetUsersResponse>(
      `${this.apiUrl}admin/getusers?page=${page}&limit=${limit}`
    );
  }

  blockuser(userid: string): Observable<any> {
    return this._http.put(`${this.apiUrl}admin/blockuser/${userid}`, {});
  }
}
