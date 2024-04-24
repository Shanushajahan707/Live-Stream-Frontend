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
  constructor(private http:HttpClient) { }
  ngOnInit(): void {
   this.islogged()
  }

  login(formData:loginCredential):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}loginuser`,formData)
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
  islogged(){
      return !!localStorage.getItem('userdata')
  }
}
