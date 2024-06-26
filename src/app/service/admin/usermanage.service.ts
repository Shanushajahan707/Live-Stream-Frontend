import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlockUserResponse, GetUsersResponse, User } from '../../model/auth';

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

  blockuser(userid: string): Observable<BlockUserResponse> {
    return this._http.put<BlockUserResponse>(`${this.apiUrl}admin/blockuser/${userid}`, {});
  }
}
