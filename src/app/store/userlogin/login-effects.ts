import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { catchError, of, exhaustMap, map, tap } from 'rxjs';
import * as AuthActions from '../userlogin/login-action';
import { AccountService } from '../../service/user/account/account.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private service: AccountService,
    private router: Router,
    private _toastService: ToastrService
  ) {}

  signupRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.userLogin),
      exhaustMap((action) =>
        this.service.login(action.userData).pipe(
          map((res) => {
            if (res && res.message) {
              this._toastService.success(res.message);
              //   this.loginForm.reset();
              if (res.isAdmin?.isAdmin) {
                localStorage.setItem('admindata', res.token);
                this.router.navigate(['/admin/dashboard']);
              } else {
                localStorage.setItem('token', res.token);
                localStorage.setItem('refreshToken', res.refreshToken);
                this.service.islogged$.next(true);
                this.router.navigateByUrl('/userhome');
                // this.loginForm.reset();
              }
            }
            return AuthActions.submitSuccess({ successResponse: res.userdata });

            // if (successResponse.message) {
            //     const userDataString = JSON.stringify(action.userData);
            //     localStorage.setItem('token', userDataString);
            //     console.log('login effect working')
            //     this.toastService.success(successResponse.message)
            //     this.router.navigate(['userhome'])
            // }
            // return AuthActions.submitSuccess({ successResponse })
          }),
          catchError((error) => {
            if (error.error.message) {
              this._toastService.error(error.error.message);
            }
            return of(
              AuthActions.submitFail({
                error: error.error.error || 'An error occurred',
              })
            );
          })
        )
      )
    )
  );

  //     loginRequest$ = createEffect(() =>
  //         this.actions$.pipe(
  //             ofType(AuthActions.studentLogin),
  //             exhaustMap((action) =>
  //                 this.service.userLogin(action.userData).pipe(
  //                     map((successResponse) => {
  //                         if (successResponse.message) {
  //                             sessionStorage.setItem('token', successResponse.token)
  //                             localStorage.setItem('token', successResponse.token);
  //                             const user = successResponse.student
  //                             localStorage.setItem('user', JSON.stringify(successResponse.student));
  //                             this.customToastService.setToastAndNavigate('success', successResponse.message, ['home']);
  //                             // this.router.navigate(['home']);
  //                             // this.toastService.set('success', 'Login successful');
  //                         }
  //                         return AuthActions.submitSuccess({ successResponse })
  //                     }),
  //                     catchError((error) => {
  //                         this.customToastService.setToast('error', error.error.message)
  //                         return of(AuthActions.submitFail({ error: error.error.message || 'An error occurred' }));
  //                     })
  //                 )
  //             )
  //         )
  //     )

  //     registrationFailure$ = this.actions$.pipe(
  //         ofType(AuthActions.submitFail),
  //         tap((action) => {
  //             alert('sumbission failed')

  //             console.log('submission failed')
  //             console.log(action)
  //         })
  //     );
}
