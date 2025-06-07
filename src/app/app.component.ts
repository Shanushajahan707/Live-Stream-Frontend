import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, Subject, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DateService } from './service/user/data/date.service';
import { AccountService } from './service/user/account/account.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentTime$!: Observable<Date>;
  userLoggedIn = false;
  currentRoute = '';
  currentYear!: number;
  private destroy$ = new Subject<void>();

  constructor(
    private primengConfig: PrimeNGConfig,
    private _dateService: DateService,
    private _accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.currentTime$ = this._dateService.getCurrentTime();
    this._dateService.startUpdatingTime();

    this._accountService.islogged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoggedIn) => {
        this.userLoggedIn = Boolean(isLoggedIn);
      });

    this.currentYear = new Date().getFullYear();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  ngOnDestroy(): void {
    this._dateService.stopUpdatingTime();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
