import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { DataPassingService } from '../../../service/data-passing.service';
import { ChannelData, User } from '../../../model/auth';
import { jwtDecode } from 'jwt-decode';
import { Store, select } from '@ngrx/store';
import { UserState } from '../../../store/userlogin/login-reducer';
import { selectUser } from '../../../store/userlogin/login-selector';
import { Observable, Subject, Subscription, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ChannelService } from '../../../service/channel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  userName$: Observable<String | null>;
  email$: Observable<String | null>;
  myid!: string;

  constructor(
    private _router: Router,
    private _service: AccountService,
    private _dataService: DataPassingService,
    private _channelService: ChannelService,
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
    this.myid = uuidv4();
  }

  islogged: boolean = false;
  isadmin: boolean = false;
  _visible: boolean = false;
  _jvisible: boolean = false;
  _Livename!: string;
  _RoomId!: number;
  _jLivename!: string;
  _jRoomId!: number;
  _userData!: User;
  _jwttoken!: string | null;
  _menuOpen = false;
  _dropdownOpen = false;
  _isMobileView = false;
  searchControl: FormControl = new FormControl('');
  serachResult!: ChannelData[];
  isFocused: boolean = false;
  visible: boolean = false;

  @HostListener('window:resize', ['$event'])
  ngOnInit(): void {
    this._service.islogged$.subscribe((res) => {
      this.islogged = this._service.islogged();
      this._jwttoken = localStorage.getItem('token');
      if (this._jwttoken) {
        const decode = jwtDecode(this._jwttoken);
        this._userData = decode as User;
        console.log('userdata from the header', this._userData);
      }
    });
    this._service.isAdmin$.subscribe((res) => {
      this.isadmin = this._service.isAdmin();
    });
    console.log('logged', this.islogged);

    this.checkWindowWidth();
    console.log('my uuid is', this.myid);

    this.searchControl.valueChanges.subscribe((value) => {
      this.performSearch(value);
    });
  }
  onlogin() {
    this._router.navigate(['/login']);
  }
  onsignup() {
    this._router.navigate(['/signup']);
  }
 
  test() {
    console.log('clicked');
    // this.service.test().subscribe((res) => {
    //   console.log('response', res);
    // });
  }
  showDialog(){
    this.visible = true;

  }
  livepage() {
    this._visible = true;
  }
  joinpage() {
    this._jvisible = true;
  }
  createRoom() {
    if (this._Livename && this._RoomId) {
      this._visible = false;
      const data = {
        Livename: this._Livename,
        RoomId: this._RoomId,
      };
      this._dataService.changeData(data);
      this._router.navigateByUrl('live');
    } else {
      console.error('Livename and RoomId are required.');
    }
  }

  joinRoom() {
    if (this._jLivename && this._jRoomId) {
      this._jvisible = false;
      const data = {
        Livename: this._jLivename,
        RoomId: this._jRoomId,
      };
      this._dataService.join(data);
      this._router.navigateByUrl('live');
    } else {
      console.error('Livename and RoomId are required.');
    }
  }

  checkWindowWidth() {
    this._isMobileView = window.innerWidth <= 768;
    if (!this._isMobileView) {
      this._menuOpen = true; // Ensure menu is open on larger screens
    }
  }
  toggleMenu() {
    this._menuOpen = !this._menuOpen;
  }

  toggleDropdown() {
    this._dropdownOpen = !this._dropdownOpen;
  }

  performSearch(query: string) {
    this._channelService.search(query).subscribe({
      next: (res) => {
        if (res && res.channels) {
          this.serachResult = res.channels;
          console.log('channelserach', this.serachResult);
        }
      },
    });
  }
  onFocus() {
    this.isFocused = true;
    this.showDialog()

  }
  onBlur() {
    this.isFocused = false;
  }
  navigatechannel(channelId: string){
    console.log('navigate to channelId: ', channelId);
  }

  stopBlur(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onlogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this._service.islogged$.next(false);
    this._router.navigate(['']);
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
