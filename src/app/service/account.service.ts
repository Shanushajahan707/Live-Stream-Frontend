import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment } from '../../enviorments/enviorment'
import { LoginResponse, OtpResponse, ResendResponse, SignupResponse, loginCredential, signupCredential } from '../model/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit {
  onLoadChannelInfo() {
    throw new Error('Method not implemented.');
  }

  apiUrl=environment.apiUrl
  islogged$=new BehaviorSubject<Boolean>(false)
  isAdmin$=new BehaviorSubject<Boolean>(false)
  private GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth?'; 
  constructor(private _http:HttpClient) { }
  ngOnInit(): void {
   this.islogged()
   this.isAdmin()
  }

  login(formData:loginCredential):Observable<LoginResponse>{
    try {
      return this._http.post<LoginResponse>(`${this.apiUrl}loginuser`,formData)
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }
  googleAuth():Observable<any>{
    try {
      return this._http.get<any>(`${this.GOOGLE_URL}auth/google`)
      
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }
  signup(formData:signupCredential):Observable<SignupResponse>{
    try {
      
      return this._http.post<SignupResponse>(`${this.apiUrl}signup`,formData)
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }
  otp(otp:number):Observable<OtpResponse>{
    try {
      return this._http.post<OtpResponse>(`${this.apiUrl}otpverify`,otp)
      
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }
  resendotp(fomData:signupCredential):Observable<ResendResponse>{
    try {
      console.log('formdt form the serveice',fomData);
      const reqBody = { form: fomData}
      return this._http.post<ResendResponse>(`${this.apiUrl}resendotp`,reqBody)
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }
  // test():Observable<any>{
  //   return this._http.get<any>(`${this.apiUrl}test`)
  // }
  islogged(){
    try {
      return !!localStorage.getItem('token')
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }
  isAdmin(){
    try {
      return false
    } catch (error) {
      console.log('error',error);
      throw error
    }
  }

}
