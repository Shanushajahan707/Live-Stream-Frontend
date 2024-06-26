import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  GetChangePasswordResponse,
  GetForgotPassOtpResponse,
  GetForgotPassResponse,
  GetIsBlockedResponse,
  GetRefreshTokenResponse,
  LoginResponse,
  OtpResponse,
  ResendResponse,
  SignupResponse,
  loginCredential,
  signupCredential,
} from '../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class AccountService implements OnInit {
  apiUrl = environment.apiUrl;
  GoogleUrl = environment.GOOGLE_URL;
  islogged$ = new BehaviorSubject<Boolean>(false);
  isAdmin$ = new BehaviorSubject<Boolean>(false);
  private isLoggedInSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

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
  forgotUrl(formData: FormData): Observable<GetForgotPassResponse> {
    return this._http.post<GetForgotPassResponse>(
      `${this.apiUrl}forgoturl`,
      formData
    );
  }

  googleAuth(): Observable<string> {
    return this._http.get<string>(`${this.GoogleUrl}auth/google`);
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
    return this._http.post<GetRefreshTokenResponse>(
      `${this.apiUrl}refreshtoken`,
      { refreshToken }
    );
  }

  forgotPasswordOtp(otpValue: number): Observable<GetForgotPassOtpResponse> {
    const email = localStorage.getItem('email');
    return this._http.post<GetForgotPassOtpResponse>(
      `${this.apiUrl}forgotpasswordotp`,
      {
        otpValue,
        email,
      }
    );
  }
  changePassword(
    changePasswordForm: FormData
  ): Observable<GetChangePasswordResponse> {
    const email = localStorage.getItem('email');
    return this._http.put<GetChangePasswordResponse>(
      `${this.apiUrl}changepassword`,
      {
        changePasswordForm,
        email,
      }
    );
  }
  userIsBlocked(): Observable<GetIsBlockedResponse> {
    return this._http.get<GetIsBlockedResponse>(`${this.apiUrl}userisblocked`);
  }

  islogged() {
    return !!localStorage.getItem('token');
  }
  isAdmin() {
    return !!localStorage.getItem('admindata');
  }
}
