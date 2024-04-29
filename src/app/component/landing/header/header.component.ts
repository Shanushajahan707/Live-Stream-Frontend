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
    private router: Router,
    private service: AccountService,
    private breakpointObserver: BreakpointObserver
  ) {}
  islogged: Boolean = false;
  isadmin: Boolean = false;

  ngOnInit(): void {
    console.log(localStorage.getItem('token'));
    this.service.islogged$.subscribe((res) => {
      this.islogged = this.service.islogged();
    });
    this.service.isAdmin$.subscribe((res) => {
      this.isadmin = this.service.isAdmin();
    });
  }
  onlogin() {
    this.router.navigate(['/login']);
  }
  onsignup() {
    this.router.navigate(['/signup']);
  }
  onlogout() {
    localStorage.removeItem('token');
    this.service.islogged$.next(false);
    this.router.navigate(['']);
  }
  test() {
    // this.service.test().subscribe((res) => {
    //   console.log('response', res);
    // });
  }
}
