import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { DataPassingService } from '../../../service/data-passing.service';
import { User } from '../../../model/auth';
import { jwtDecode } from 'jwt-decode';
import { Store, select } from '@ngrx/store';
import { UserState } from '../../../store/userlogin/login-reducer';
import { selectUser } from '../../../store/userlogin/login-selector';
import { Observable, Subscription, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private _isloggedSubscription!: Subscription;
  private _isAdminSubscription!: Subscription;
  userName$: Observable<String | null>;
  email$: Observable<String | null>;
  constructor(
    private _router: Router,
    private _service: AccountService,
    private _dataService: DataPassingService,
    private store: Store<UserState>
  ) {
    this.userName$ = this.store.pipe(
      select(selectUser),
      map((user) => (user ? user.username : 'user'))
    );
    this.email$ = this.store.pipe(
      select(selectUser),
      map((user) => (user ? user.email : 'email'))
    );
  }

  islogged: boolean = false;
  isadmin: boolean = false;
  visible: boolean = false;
  Livename!: string;
  RoomId!: number;
  userData!: User;
  jwttoken!: string | null;

  ngOnInit(): void {
    this._isloggedSubscription = this._service.islogged$.subscribe((res) => {
      this.islogged = this._service.islogged();
    });
    this._isAdminSubscription = this._service.isAdmin$.subscribe((res) => {
      this.isadmin = this._service.isAdmin();
    });
    console.log('logged', this.islogged);
    this.jwttoken = localStorage.getItem('token');
    if (this.jwttoken) {
      const decode = jwtDecode(this.jwttoken);
      this.userData = decode as User;
    }
  }
  onlogin() {
    this._router.navigate(['/login']);
  }
  onsignup() {
    this._router.navigate(['/signup']);
  }
  onlogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this._service.islogged$.next(false);
    this._router.navigate(['']);
  }
  test() {
    console.log('clicked');
    // this.service.test().subscribe((res) => {
    //   console.log('response', res);
    // });
  }
  livepage() {
    this.visible = true;
  }
  createRoom() {
    this.visible = false;
    const data = {
      Livename: this.Livename,
      RoomId: this.RoomId,
    };
    this._dataService.changeData(data);
    this._router.navigateByUrl('live');
  }

  ngOnDestroy(): void {
    this._isloggedSubscription?.unsubscribe();
    this._isAdminSubscription?.unsubscribe();
  }
}
