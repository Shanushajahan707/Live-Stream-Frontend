import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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
} from '../../../model/auth';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = environment.apiUrl;
  private googleUrl = environment.GOOGLE_URL;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  islogged$ = this.isLoggedInSubject.asObservable();
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private _http: HttpClient) {
    this.updateLoggedInStatus();
    this.updateAdminStatus();
  }

  // Public method to update logged-in status
  updateLoggedInStatus(): void {
    const isLoggedIn = !!localStorage.getItem('token');
    this.isLoggedInSubject.next(isLoggedIn);
    console.log('Updated islogged$:', isLoggedIn, 'Type:', typeof isLoggedIn);
  }

  // Public method to update admin status
  updateAdminStatus(): void {
    const isAdmin = !!localStorage.getItem('admindata');
    this.isAdminSubject.next(isAdmin);
    console.log('Updated isAdmin$:', isAdmin, 'Type:', typeof isAdmin);
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedInSubject.next(value);
  }

  ack(): Observable<{ ack: boolean }> {
    return this._http.get<{ ack: boolean }>(`${this.apiUrl}ack`);
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
    return this._http.get<string>(`${this.googleUrl}auth/google`);
  }

  signup(formData: signupCredential): Observable<SignupResponse> {
    return this._http.post<SignupResponse>(`${this.apiUrl}signup`, formData);
  }

  otp(otp: number): Observable<OtpResponse> {
    return this._http.post<OtpResponse>(`${this.apiUrl}otpverify`, otp);
  }

  resendotp(formData: signupCredential): Observable<ResendResponse> {
    const reqBody = { form: formData };
    return this._http.post<ResendResponse>(`${this.apiUrl}resendotp`, reqBody);
  }

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

  islogged(): boolean {
    return this.isLoggedInSubject.value;
  }

  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}
