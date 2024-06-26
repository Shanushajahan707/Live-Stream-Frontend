import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminWalletSummary } from '../../../model/auth';
import { SubscriptionmanageService } from '../../../service/admin/subscriptionmanage.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-membership',
  templateUrl: './admin-membership.component.html',
  styleUrl: './admin-membership.component.scss',
})
export class AdminMembershipComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  MemberShips: AdminWalletSummary[] = [];
  walletAmount!: number;
  constructor(
    private _subscriptionService: SubscriptionmanageService,
    private _toaster: ToastrService
  ) {}
  ngOnInit(): void {
    this._subscriptionService
      .onFetchMmebership()
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          if ((res && res.members) || res.message) {
            this._toaster.success(res.message);
            this.MemberShips = res.members;
            this.walletAmount = res.wallet;
          }
        },
        error: (err) => {
          if (err && err.error.message) {
            this._toaster.error(err.error.message);
          }
        },
      });
  }
  ngOnDestroy(): void {
   this._destroy$.next()
   this._destroy$.complete()
  }
}
