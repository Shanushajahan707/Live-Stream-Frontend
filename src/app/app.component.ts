import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PrimeNGConfig } from 'primeng/api';
import { filter, Observable, Subscription } from 'rxjs';
import { DateService } from './service/user/data/date.service';
import { AccountService } from './service/user/account/account.service';
import { NavigationEnd, Router, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentTime$!: Observable<Date>;
  userLoggesIn: boolean = false;
  _isloggedSubscription!: Subscription;
  showHeader: boolean = true;
  private routeCheckInterval!: any;

  constructor(
    private primengConfig: PrimeNGConfig,
    private _dateService: DateService,
    private _accountService: AccountService,
    private router: Router
  ) {
    // Subscribe to router events
    this.router.events
      .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateHeaderVisibility(event.url);
      });
  }

  ngOnInit(): void {  
    initFlowbite();
    this.primengConfig.ripple = true;
    this.currentTime$ = this._dateService.getCurrentTime();
    this._dateService.startUpdatingTime();
    this._isloggedSubscription = this._accountService.islogged$.subscribe(
      (res) => {
        this.userLoggesIn = this._accountService.islogged();
      }
    );

    // Set interval to check current route
    this.routeCheckInterval = setInterval(() => {
      const currentRoute = this.router.url;
      this.updateHeaderVisibility(currentRoute);
    }, 1000); // Check every second
  }

  private updateHeaderVisibility(currentRoute: string): void {
    this.showHeader = !(currentRoute === '/notfound'); 
  }

  ngOnDestroy(): void {
    this._dateService.stopUpdatingTime();
    this._isloggedSubscription?.unsubscribe();
    clearInterval(this.routeCheckInterval); // Clear the interval
  }
}
