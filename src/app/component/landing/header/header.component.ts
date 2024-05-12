import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../service/account.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(
    private _router: Router,
    private _service: AccountService,
    private breakpointObserver: BreakpointObserver
  ) {}
  islogged: Boolean = false;
  isadmin: Boolean = false;

  ngOnInit(): void {
    this._service.islogged$.subscribe((res) => {
      this.islogged = this._service.islogged();
    });
    this._service.isAdmin$.subscribe((res) => {
      this.isadmin = this._service.isAdmin();
    });
    console.log('logged',this.islogged);
  }
  onlogin() {
    this._router.navigate(['/login']);
  }
  onsignup() {
    this._router.navigate(['/signup']);
  }
  onlogout() {
    localStorage.removeItem('token');
    this._service.islogged$.next(false);
    this._router.navigate(['']);
  }
  test() {
    console.log('clicked')
    // this.service.test().subscribe((res) => {
    //   console.log('response', res);
    // });
  }
}
