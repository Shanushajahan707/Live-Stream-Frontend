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

  loginRequest$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.userLogin),
      exhaustMap((action) =>
        this.service.login(action.userData).pipe(
          map((res) => {
            if (res && res.message) {
              this._toastService.success(res.message);
              if (res.isAdmin?.isAdmin) {
                localStorage.setItem('admindata', res.token);
                this.service.updateAdminStatus(); // Update isAdmin$ state
                this.router.navigate(['/admin/dashboard']);
              } else {
                localStorage.setItem('token', res.token);
                localStorage.setItem('refreshToken', res.refreshToken);
                this.service.updateLoggedInStatus(); // Update islogged$ state
                this.router.navigateByUrl('/userhome');
              }
            }
            return AuthActions.submitSuccess({ successResponse: res.userdata });
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
}