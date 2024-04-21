import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {environment } from '../../enviorments/enviorment'

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

  login(formData:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}loginuser`,formData)
  }
  signup(formData:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}signup`,formData)
  }
  otp(formData:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}otpverify`,formData)
  }
  resendotp():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}resendotp`)
  }
  islogged(){
      return !!localStorage.getItem('userdata')
  }

}
