import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { DateService } from './service/user/data/date.service';
import { AccountService } from './service/user/account/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  currentTime$!: Observable<Date>;
  userLoggesIn: boolean = false;
  _isloggedSubscription!: Subscription;
  currentRoute: string = '';
  private routeCheckInterval!: NodeJS.Timeout;
  constructor(
    private primengConfig: PrimeNGConfig,
    private _dateService: DateService,
    private _accountService: AccountService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.startCheckingCurrentRoute();
    this.primengConfig.ripple = true;
    this.currentTime$ = this._dateService.getCurrentTime();
    this._dateService.startUpdatingTime();
    this._isloggedSubscription = this._accountService.islogged$.subscribe(
      (res) => {
        this.userLoggesIn = this._accountService.islogged();
      }
    );
  }
  // title = 'Live-Stream';

  private startCheckingCurrentRoute() {
    this.routeCheckInterval = setInterval(() => {
      this.currentRoute = this._router.url; // Update the current route
      console.log('Current route:', this.currentRoute); // Log the current route
    }, 1000); // Check every 1000 milliseconds (1 second)
  }

  ngOnDestroy(): void {
    this._dateService.stopUpdatingTime();
    clearInterval(this.routeCheckInterval);
    this._isloggedSubscription?.unsubscribe();
  }
}
