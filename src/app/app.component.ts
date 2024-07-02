import { Component, OnDestroy, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { PrimeNGConfig } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { DateService } from './service/user/data/date.service';
import { AccountService } from './service/user/account/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  currentTime$!: Observable<Date>;
  userLoggesIn: boolean = false;
  _isloggedSubscription!: Subscription;
  constructor(
    private primengConfig: PrimeNGConfig,
    private _dateService: DateService,
    private _accountService: AccountService
  ) {}

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
  }
  // title = 'Live-Stream';

  ngOnDestroy(): void {
    this._dateService.stopUpdatingTime();
    this._isloggedSubscription?.unsubscribe();
  }
}
