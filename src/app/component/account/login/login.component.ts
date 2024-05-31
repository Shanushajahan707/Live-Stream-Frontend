import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subscription, flatMap } from 'rxjs';
import { environment } from '../../../../enviorments/enviorment';
import { CookieService } from 'ngx-cookie-service';
import { loginCredential } from '../../../model/auth';
import { Userstate } from '../../../store/userlogin/login-state';
import { userLogin } from '../../../store/userlogin/login-action';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private _googleAuthSubscription!: Subscription;
  private _forgotUrlSubscription!: Subscription;
  loginForm!: FormGroup;
  res!: any;
  apiUrl = environment.apiUrl;
  value: string = '';
  visible: boolean = false;
  position: string | any = 'center';
  registeredEmail!: FormGroup;
  // private loginSubscription: Subscription | undefined;

  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService,
    private _router: Router,
    private CookieService: CookieService,
    private store: Store<Userstate>
  ) {}

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.registeredEmail = this._fb.group({
      registeredemail: [''],
    });

    const authResponseCookie = this.CookieService.get('authResponse');
    if (authResponseCookie) {
      const authResponse = JSON.parse(authResponseCookie);
      if (authResponse.user) {
        this._toastr.success(authResponse.message);
        localStorage.setItem('token', authResponse.token);
        console.log('authResponse:', authResponse);
        console.log('User:', authResponse.user);
        console.log('token:', JSON.stringify(authResponse.token));
        this._service.islogged$.next(true);
        this.CookieService.delete('authResponse');
        this._router.navigate(['/userhome']);
      }
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('the form values are', this.loginForm.value);
      this.sendLoginData(this.loginForm.value);
    }
  }

  sendLoginData(data: loginCredential) {
    if (data) {
      this.store.dispatch(userLogin({ userData: data }));
    }
  }

  // sendLoginData(data: loginCredential) {
  //   this.loginSubscription = this._service.login(data).subscribe({
  //     next: (res) => {
  //       if (res && res.message) {
  //         this._toastr.success(res.message);
  //         this.loginForm.reset();
  //         if (res.isAdmin?.isAdmin) {
  //           localStorage.setItem('admindata', res.token);
  //           this._router.navigate(['/admin/dashboard']);
  //         } else {
  //           localStorage.setItem('token', res.token);
  //           localStorage.setItem('refreshToken', res.refreshToken);
  //           this._service.islogged$.next(true);
  //           this._router.navigate(['/userhome']);
  //           this.loginForm.reset();
  //         }
  //       }
  //     },
  //     error: (err) => {
  //       if (err.error && err.error.message) {
  //         this._toastr.error(err.error.message);
  //       }
  //     },
  //   });
  // }
  googleclick(event: Event) {
    console.log('clicl');
    // window.location.href =  `${this.apiUrl}auth/google `;
    this._googleAuthSubscription = this._service.googleAuth().subscribe({
      next: (successResponse: any) => {
        if (successResponse.message) {
          console.log('rsponse', successResponse);
        }
      },
      error: (error: any) => {},
    });
  }

  // Unsubscribe from the login subscription to prevent memory leaks
  // ngOnDestroy(): void {
  //   if (this.loginSubscription) {
  //     this.loginSubscription.unsubscribe();
  //   }
  // }

  showDialog(position: string) {
    this.position = position;
    this.visible = true;
  }
  forgotpass() {
    this.visible = false;
    this._forgotUrlSubscription = this._service
      .forgotUrl(this.registeredEmail.value)
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toastr.success(res.message);
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toastr.error(err.error.message);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._googleAuthSubscription?.unsubscribe();
    this._forgotUrlSubscription?.unsubscribe();
  }
}
