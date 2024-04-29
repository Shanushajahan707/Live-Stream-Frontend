import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment } from '../../enviorments/enviorment'
import { loginCredential, signupCredential } from '../model/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit {

  apiUrl=environment.apiUrl
  islogged$=new BehaviorSubject<Boolean>(false)
  isAdmin$=new BehaviorSubject<Boolean>(false)
  private GOOGLE_URL = 'https://accounts.google.com/o/oauth2/v2/auth?'; 
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
   this.islogged()
   this.isAdmin()
  }

  login(formData:loginCredential):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}loginuser`,formData)
  }
  // google():Observable<any>{
  //   return this.http.get<any>(`${this.apiUrl}auth/google/redirect`)
  // }
  googleAuth():Observable<any>{
    return this.http.get<any>(`${this.GOOGLE_URL}auth/google`)
  }
  signup(formData:signupCredential):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}signup`,formData)
  }
  otp(otp:number):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}otpverify`,otp)
  }
  resendotp(fomData:signupCredential):Observable<any>{
    console.log('formdt form the serveice',fomData);
    const reqBody = { form: fomData}
    return this.http.post<any>(`${this.apiUrl}resendotp`,reqBody)
  }
  test():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}test`)
  }
  islogged(){
      return !!localStorage.getItem('token')
  }
  isAdmin(){
    return false
  }

}
