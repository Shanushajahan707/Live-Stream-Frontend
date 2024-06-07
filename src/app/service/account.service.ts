import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../enviorments/enviorment';
import {
  GetIsBlockedResponse,
  GetRefreshTokenResponse,
  LoginResponse,
  OtpResponse,
  ResendResponse,
  SignupResponse,
  loginCredential,
  signupCredential,
} from '../model/auth';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit {
  onLoadChannelInfo() {
    throw new Error('Method not implemented.');
  }

  apiUrl = environment.apiUrl;
  islogged$ = new BehaviorSubject<Boolean>(false);
  isAdmin$ = new BehaviorSubject<Boolean>(false);
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth?';
  constructor(private _http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }
  ngOnInit(): void {
    this.islogged();
    this.isAdmin();
  }
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  setLoggedIn(value: boolean) {
    this.isLoggedInSubject.next(value);
  }

  login(formData: loginCredential): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(`${this.apiUrl}loginuser`, formData);
  }
  forgotUrl(formData: any): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}forgoturl`, formData);
  }

  googleAuth(): Observable<any> {
    return this._http.get<any>(`${this.GOOGLE_URL}auth/google`);
  }
  signup(formData: signupCredential): Observable<SignupResponse> {
    return this._http.post<SignupResponse>(`${this.apiUrl}signup`, formData);
  }
  otp(otp: number): Observable<OtpResponse> {
    return this._http.post<OtpResponse>(`${this.apiUrl}otpverify`, otp);
  }
  resendotp(fomData: signupCredential): Observable<ResendResponse> {
    const reqBody = { form: fomData };
    return this._http.post<ResendResponse>(`${this.apiUrl}resendotp`, reqBody);
  }
  // test():Observable<any>{
  //   return this._http.get<any>(`${this.apiUrl}test`)
  // }
  refreshToken(): Observable<GetRefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this._http.post<GetRefreshTokenResponse>(`${this.apiUrl}refreshtoken`, { refreshToken });
  }

  forgotPasswordOtp(otpValue: number): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}forgotpasswordotp`, {
      otpValue,
    });
  }
  userIsBlocked(): Observable<GetIsBlockedResponse> {
    return this._http.get<GetIsBlockedResponse>(`${this.apiUrl}userisblocked`);
  }

  islogged() {
    return !!localStorage.getItem('token');
  }
  isAdmin() {
    return false;
  }
}
