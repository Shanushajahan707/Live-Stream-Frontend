import { Component, DoCheck, OnDestroy } from '@angular/core';
import { AccountService } from '../../../service/user/account/account.service';
import { Store, select } from '@ngrx/store';
import { UserState } from '../../../store/userlogin/login-reducer';
import { Observable, Subject, map } from 'rxjs';
import { selectUser } from '../../../store/userlogin/login-selector';
import { User } from '../../../model/auth';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-userhomme',
  templateUrl: './userhomme.component.html',
  styleUrl: './userhomme.component.scss',
})
export class UserhomeComponent implements DoCheck, OnDestroy {
  _user$: Observable<User | null>;
  _visible: boolean = false;
  _sidebarVisible1: boolean = false;
  _jwtToken: string | null = null;
  _userDetails!: User;
  private readonly _destroy$ = new Subject<void>();

  constructor(
    private _service: AccountService,
    private store: Store<UserState>,
    private _router: Router
  ) {
    this._user$ = this.store.pipe(select(selectUser));
    this._user$.pipe(takeUntil(this._destroy$)).subscribe((res) => {
      // console.log(res);
    });

    this._jwtToken = localStorage.getItem('token');
    if (this._jwtToken) {
      this._userDetails = jwtDecode(this._jwtToken);
      // console.log('decode',this.userDetails);
    }
  }

  Oninit() {
    console.log(
      'logged userhome',
      this._service.islogged$,
      this._user$.pipe(takeUntil(this._destroy$)).subscribe((res) => {
        // console.log(res);
      })
    );
  }
  ngDoCheck() {
    if (this._userDetails && this._userDetails.isblocked) {
      console.log('block');
      this._router.navigate(['/blocked-account']);
    }
  }
  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
