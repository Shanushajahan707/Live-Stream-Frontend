import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AccountService } from '../../../service/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { loginCredential } from '../../../model/auth';
import { Userstate } from '../../../store/userlogin/login-state';
import { userLogin } from '../../../store/userlogin/login-action';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  _loginForm!: FormGroup;
  _value: string = '';
  _visible: boolean = false;
  _position!: string  
  _registeredEmail!: FormGroup;
  // private loginSubscription: Subscription | undefined;

  constructor(
    private _fb: FormBuilder,
    private _service: AccountService,
    private _toastr: ToastrService,
    private _router: Router,
    private _cookieService: CookieService,
    private _store: Store<Userstate>
  ) {}

  ngOnInit(): void {
    this._loginForm = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this._registeredEmail = this._fb.group({
      registeredemail: [''],
    });

    const authResponseCookie = this._cookieService.get('authResponse');
    if (authResponseCookie) {
      const authResponse = JSON.parse(authResponseCookie);
      if (authResponse.user) {
        this._toastr.success(authResponse.message);
        localStorage.setItem('token', authResponse.token);
        console.log('authResponse:', authResponse);
        console.log('User:', authResponse.user);
        console.log('token:', JSON.stringify(authResponse.token));
        this._service.islogged$.next(true);
        this._cookieService.delete('authResponse');
        this._router.navigate(['/userhome']);
      }
    }
  }

  onSubmit() {
    if (this._loginForm.valid) {
      console.log('the form values are', this._loginForm.value);
      this.sendLoginData(this._loginForm.value);
    }
  }

  sendLoginData(data: loginCredential) {
    if (data) {
      console.log('data', data);
      this._store.dispatch(userLogin({ userData: data }));
    }
  }

  // sendLoginData(data: loginCredential) {
  //   this.loginSubscription = this._service.login(data).subscribe({
  //     next: (res) => {
  //       if (res && res.message) {
  //         this._toastr.success(res.message);
  //         this._loginForm.reset();
  //         if (res.isAdmin?.isAdmin) {
  //           localStorage.setItem('admindata', res.token);
  //           this._router.navigate(['/admin/dashboard']);
  //         } else {
  //           localStorage.setItem('token', res.token);
  //           localStorage.setItem('refreshToken', res.refreshToken);
  //           this._service.islogged$.next(true);
  //           this._router.navigate(['/userhome']);
  //           this._loginForm.reset();
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
    console.log('click');
    this._service
      .googleAuth()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (successResponse: any) => {
          if (successResponse.message) {
            console.log('response', successResponse);
          }
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  // Unsubscribe from the login subscription to prevent memory leaks
  // ngOnDestroy(): void {
  //   if (this.loginSubscription) {
  //     this.loginSubscription.unsubscribe();
  //   }
  // }

  showDialog(position: string) {
    this._position = position;
    this._visible = true;
  }
  forgotpass() {
    this._visible = false;
    this._service
      .forgotUrl(this._registeredEmail.value)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toastr.success(res.message);
          }
          localStorage.setItem('email',res.email)
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toastr.error(err.error.message);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
