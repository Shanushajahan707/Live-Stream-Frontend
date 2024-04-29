import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../enviorments/enviorment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  res!: any;
  apiUrl=environment.apiUrl
  private loginSubscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private http: HttpClient,
    private service: AccountService,
    private toastr: ToastrService,
    private router: Router,
    private CookieService:CookieService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });


    const authResponseCookie = this.CookieService.get('authResponse');
    if (authResponseCookie) {
      const authResponse = JSON.parse(authResponseCookie);
      if(authResponse.user) {
        this.toastr.success(authResponse.message)
        console.log('authResponse:', authResponse);
        console.log('User:', authResponse.user);
        console.log('token:', JSON.stringify(authResponse.token));
        this.CookieService.delete('authResponse');
        localStorage.setItem('token', authResponse.token);
        this.service.islogged$.next(true);
        this.router.navigate(['/userhome']);
      }}
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('the form values are', this.loginForm.value);
      this.sendLoginData(this.loginForm.value);
    }
  }

  sendLoginData(data: any) {
    this.loginSubscription = this.service.login(data).subscribe({
      next: (res) => {
        if (res && res.message) {
          this.toastr.success(res.message);
          this.loginForm.reset();
          console.log(res.isAdmin.isAdmin);
          if (res.isAdmin.isAdmin) {
            localStorage.setItem('admindata', res.token);
            this.router.navigate(['/admin/dashboard']);
          } else {
            localStorage.setItem('token', res.token);
            this.service.islogged$.next(true);
            this.router.navigate(['/userhome']);
            this.loginForm.reset();
          }
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.toastr.error(err.error.message);
        }
      },
    });
  }
  googleclick(event:Event) {
    console.log('clicl');
    // window.location.href =  `${this.apiUrl}auth/google `;
    this.service.googleAuth().subscribe({
      next:(successResponse:any)=>{
        if(successResponse.message){
          console.log('rsponse',successResponse);
        }
      },error:(error:any)=>{

      }
    })
   }
   


  // Unsubscribe from the login subscription to prevent memory leaks
  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }
}
